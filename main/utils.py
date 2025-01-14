import io
import os
import base64
import random
import re
import unicodedata
import importlib
import zipfile
import pyproj
import math
import json
import psycopg2
import socket
import shutil
import uuid
import time

from collections import namedtuple
from datetime import timedelta, datetime
from geojson import Feature
from PIL import Image, ImageDraw, ImageFont

from django.apps import apps
from django.contrib.gis.db.models.functions import Transform
from django.contrib.gis import geos
from django.contrib.gis.geos import GEOSGeometry, Point
from django.contrib.gis.geos import MultiPolygon, MultiPoint, MultiLineString
from django.contrib.gis.measure import D
from django.conf import settings
from django.db import connections
from django.utils import timezone
from django.core.mail import send_mail, get_connection
from django.core.cache import cache
from django.shortcuts import get_object_or_404

from main.inspire import InspireProperty
from main.inspire import InspireCodeList
from main.inspire import InspireDataType
from main.inspire import InspireFeature
from main.inspire import GEoIdGenerator

from backend.config.models import Config
from backend.token.utils import TokenGeneratorUserValidationEmail
from backend.dedsanbutets.models import ViewProperties
from backend.dedsanbutets.models import ViewNames
from backend.inspire.models import LProperties, MGeoDatas

from backend.another_database.models import AnotherDatabase
import main.geoserver as geoserver


LAYERPREFIX = 'gp_layer_'
RE_REGISTER = r'[АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ]{2}[0-9]{8}'


def resize_b64_to_sizes(src_b64, sizes):

    src_bytes = base64.b64decode(src_b64)
    src_io = io.BytesIO(src_bytes)

    def _resize(image, size):
        dst = io.BytesIO()
        image.thumbnail(size)
        image.save(dst, format='PNG')
        return dst

    image = Image.open(src_io)

    return map(lambda size: _resize(image, size).getvalue(), sizes)


def named_tuple_fetchall(cursor):
    """ Return all rows from a cursor as a namedtuple """
    desc = cursor.description
    nt_result = namedtuple('Result', [col[0] for col in desc])
    for row in cursor.fetchall():
        yield nt_result(*row)


def dict_fetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    for row in cursor.fetchall():
        yield dict(zip(columns, row))


GIS_CONNECTION = 'postgis_db'


def gis_table_by_oid(oid):

    cursor = connections[GIS_CONNECTION].cursor()

    sql = """
        SELECT
            n.nspname as "schema",
            c.relname as "name"
        FROM
            pg_catalog.pg_class c
        LEFT JOIN
            pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.oid = %s
    """

    cursor.execute(sql, [oid])
    schema, table = cursor.fetchone()

    return '"{}"."{}"'.format(schema, table)


def gis_tables_by_oids(oids):

    sql = """
        SELECT
            c.oid as "oid",
            n.nspname as "schema",
            c.relname as "table"
        FROM
            pg_catalog.pg_class c
        LEFT JOIN
            pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.oid IN ({oids})
    """.format(
        oids=('%s, ' * len(oids))[:-2],
    )

    query_args = oids

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)
        tables = list(dict_fetchall(cursor))
    return tables


def gis_fields_by_oid(oid, exclude=[]):

    with connections[GIS_CONNECTION].cursor() as cursor:

        sql = """
            SELECT
                attname,
                atttypid::regtype AS atttypid
            FROM
                pg_catalog.pg_attribute
            WHERE
                attrelid = %s::regclass
                AND NOT attisdropped
                AND attnum > 0
            ORDER BY
                attnum ASC
        """.format(
            gis_table_by_oid(oid)
        )
        table = gis_table_by_oid(oid)
        cursor.execute(sql, [table])
        fields = list(named_tuple_fetchall(cursor))

    fields_final = [
        field
        for field in fields
        if field.attname not in exclude
    ]

    return fields_final


def gis_insert(oid, fields, values, value_default=''):

    table = gis_table_by_oid(oid)

    sql = """
        INSERT INTO
            {table}
            ({fields})
        VALUES
            ({values})
    """.format(
        table=table,
        fields=', '.join(['"{}"'.format(f.attname) for f in fields]),
        values=('%s, ' * len(fields))[:-2]
    )

    query_args = [
        values.get(f.attname, value_default)
        for f in fields
    ]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)


def gis_delete(oid, pk):

    sql = """
        DELETE FROM
            {table}
        WHERE
            id = %s
    """.format(
        table=gis_table_by_oid(oid)
    )

    query_args = [pk]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)


def gis_fetch_one(oid, pk):

    table = gis_table_by_oid(oid)
    fields = gis_fields_by_oid(oid)

    columns_to_select = [
        'ST_AsGeoJSON(ST_Transform("%s", 4326)) AS "%s"' % (f.attname, f.attname)
        if f.atttypid == 'geometry' else '"%s"' % f.attname
        for f in fields
    ]

    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            {columns}
        FROM
            {table}
        WHERE
            id = %s
        LIMIT 1
    """.format(
        table=table,
        columns=', '.join(columns_to_select),
    )
    query_args = [pk]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)
        rows = list(dict_fetchall(cursor))

    return len(rows) and rows[0] or None


def slugifyWord(word):
    word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('ascii')
    word = re.sub(r'[^\w\s_]', '', word.lower())
    word = re.sub(r'[_\s]+', '_', word).strip('-_')
    return word


def refreshMaterializedView(fid):

    LFeatures = apps.get_model('backend_inspire', 'LFeatures')
    feature = LFeatures.objects.filter(feature_id=fid).first()
    view_name = make_view_name(feature)
    if view_name:
        sql = """ REFRESH MATERIALIZED VIEW CONCURRENTLY public.{table_name} """.format(table_name=view_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
            return True
    else:
        return True


def str2bool(v):
    return v.lower() in ("yes", "true", "t", "1", "True")


def _make_connection(from_email):
    connection = get_connection(
        username=from_email,
        password=get_config('EMAIL_HOST_PASSWORD'),
        port=get_config('EMAIL_PORT'),
        host=get_config('EMAIL_HOST'),
        use_tls=str2bool(get_config('EMAIL_USE_TLS')),
        use_ssl=False,
        fail_silently=False,
    )
    return connection


def get_protocol(host_name):

    protocol = 'https'
    not_secure_ips = ['192.168.10.92']
    if settings.DEBUG or host_name in not_secure_ips:
        protocol = 'http'

    return protocol


def _make_html(text, host_name, href):

    protocol = get_protocol(host_name)
    host = "{protocol}://{host_name}".format(protocol=protocol, host_name=host_name)
    href = host + href

    html = """
            <!DOCTYPE html>
            <html>
                <head></head>
                <body>
                    <p>{text}</p>
                    <a className="text-primary" href="{href}">Энд дарна уу</a>
                </body>
            </html>
        """.format(text=text, href=href)

    return html


def send_approve_email(user, subject=None, text=None, href=None):

    if not user.email:
        return False

    host_name = get_config('EMAIL_HOST_NAME')
    if not subject:
        subject = 'Геопортал хэрэглэгч баталгаажуулах'
    if not text:
        text = 'Дараах холбоос дээр дарж баталгаажуулна уу!'
    if not href:
        token = TokenGeneratorUserValidationEmail().get()

        UserValidationEmail = apps.get_model('geoportal_app', 'UserValidationEmail')
        UserValidationEmail.objects.create(
            user=user,
            token=token,
            valid_before=timezone.now() + timedelta(days=90)
        )
        href = '/gov/secure/approve/{token}/'.format(token=token)

    html_message = _make_html(text, host_name, href)
    from_email = get_config('EMAIL_HOST_USER')
    to_email = [user.email]
    send_mail(subject, text, from_email, to_email, connection=_make_connection(from_email), html_message=html_message)

    return True


def send_email(subject, msg, to_email, attach=None):
    from_email = get_config('EMAIL_HOST_USER')
    send_mail(subject, msg, from_email, to_email, connection=_make_connection(from_email), html_message=attach)


def get_administrative_levels():

    """
    Returns a nested structure:
    ```
        [
            {
                'geo_id': '62',
                'name': 'Өвөрхангай',
                'children': [
                    {
                        'geo_id': '6255',
                        'name': 'Хужирт',
                        'children': [
                            {'geo_id': '625551', 'name': '1-р баг'},
                            {'geo_id': '625553', 'name': '2-р баг'}
                        ]
                    },
                    {
                        'geo_id': '6234',
                        'name': 'Өлзийт',
                        'children': [
                            {'geo_id': '623451', 'name': '1-р баг'},
                            {'geo_id': '623453', 'name': '2-р баг'},
                            {'geo_id': '623455', 'name': '3-р баг'},
                            {'geo_id': '623457', 'name': '4-р баг'}
                        ]
                    }
                ]
            },
            {
                'geo_id': '46',
                'name': 'Өмнөговь',
                'children': [
                    {
                        'geo_id': '4607',
                        'name': 'Баян-Овоо',
                        'children': [
                            {'geo_id': '460751', 'name': '1-р баг'},
                            {'geo_id': '460753', 'name': '2-р баг'},
                            {'geo_id': '460755', 'name': '3-р баг'}
                        ]
                    },
                    {
                       'geo_id': '4604',
                        'name': 'Баяндалай',
                        'children': [
                            {'geo_id': '460451', 'name': '1-р баг'},
                            {'geo_id': '460453', 'name': '2-р баг'},
                            {'geo_id': '460455', 'name': '3-р баг'}
                        ]
                    }
                ],
            }
        ]
        *updated 2021-03-20 odko
    ```
    """

    i_code_list_2nd_order = InspireCodeList('2ndOrder')
    i_code_list_3rd_order = InspireCodeList('3rdOrder')
    i_code_list_4th_order = InspireCodeList('4thOrder')

    def _get_code_names(geo_id):

        table_au_au_ab = InspireFeature('bnd-au-au')

        i_data_type_administrative_boundary = InspireDataType('GeographicalName')
        i_property_name = InspireProperty('text')

        table_au_au_ab.filter({'geo_id': geo_id})
        table_au_au_ab.select({
            'geo_id': True,
            i_data_type_administrative_boundary: [i_property_name],
        })

        for item in table_au_au_ab.fetch():
            code = item['geo_id']
            name = item[i_data_type_administrative_boundary][i_property_name]
            yield code, name

    def _get_au_items():
        table_au_au_au = InspireFeature('bnd-au-au')

        table_au_au_au.filter(
            {
                InspireDataType('AdministrativeUnit'): {
                    InspireProperty('NationalLevel'): [
                        i_code_list_2nd_order,
                        i_code_list_3rd_order,
                        i_code_list_4th_order,
                    ],
                }
            }
        )

        table_au_au_au.select(
            {
                'geo_id': True,
                InspireDataType('AdministrativeUnit'): [
                    InspireProperty('NationalLevel'),
                ],
            },
        )

        for row in table_au_au_au.fetch():
            geo_id = row['geo_id']
            level = row[InspireDataType('AdministrativeUnit')][InspireProperty('NationalLevel')]
            yield geo_id, level

    # build flat data
    items = {
        '#root': {
            'children': list()
        }
    }

    for geo_id, level in _get_au_items():
        items[geo_id] = {
            'geo_id': geo_id,
            'level': level,
            'name': '',
            'children': list(),
        }

    codes = list(items.keys())

    for code, name in _get_code_names(codes):
        items[code]['name'] = name

    # makes nested structure to items['#root']['children']

    def _get_parent_code(level, code):
        if level == i_code_list_4th_order.code_list_id:
            return code[:4]
        if level == i_code_list_3rd_order.code_list_id:
            return code[:2]
        if level == i_code_list_2nd_order.code_list_id:
            return '#root'
        raise Exception

    warning_message = ''

    for code, item in items.items():

        if code == '#root':
            continue

        code_parent = _get_parent_code(item['level'], code)

        if code_parent not in items:
            warning_message += '[WARNING] Missing {} for {} - {}\n'.format(code_parent, code, item['name'])
            continue

        children = items[code_parent]['children']
        children.append(item)

    if warning_message:
        Error500 = apps.get_model('backend_config', 'Error500')
        Error500.objects.create(
            request_scheme='system',
            request_url='main.utils.get_administrative_levels',
            request_method='system',
            request_headers='{}',
            request_data='{}',
            description=warning_message,
        )

    # cleanup temporary keys: level, code. children for leaf nodes

    def _is_leaf_node(level):
        return level == i_code_list_4th_order.code_list_id

    for code, item in items.items():
        if code != '#root':
            if _is_leaf_node(item['level']):
                del item['children']
            del item['level']

    # sort children

    def _sort_children_recursively(items):
        for item in items:
            children = item.get('children')
            if children:
                item['children'] = _sort_children_recursively(children)
        return sorted(items, key=lambda v: v['name'])

    root = _sort_children_recursively(items['#root']['children'])

    return root


def get_geom(geo_id, geom_type=None, srid=4326):

    if not geo_id:
        return None

    MGeoDatas = apps.get_model('backend_inspire', 'MGeoDatas')

    qs = MGeoDatas.objects
    qs = qs.annotate(geo_data_transformed=Transform('geo_data', srid))
    qs = qs.filter(geo_id=geo_id)
    geom_info = qs.first()
    if not geom_info:
        return None

    geom = geom_info.geo_data_transformed

    if not isinstance(geom, GEOSGeometry):
        msg = (
            'MGeoDatas.geo_data<{geo_id}> нь геометр төрлийн утга байх ёстой.'
        ).format(
            geo_id=geo_id,
        )
        raise Exception(msg)

    if geom_type and geom.geom_type != geom_type:
        msg = (
            'MGeoDatas.geo_data<{}> нь {} төрлийн '
            'утга байх ёстой боловч {} байна.'
        ).format(geo_id, geom_type, geom.geom_type)
        raise Exception(msg)

    return geom


def is_register(register):
    re_register = RE_REGISTER
    return re.search(re_register, register.upper()) is not None


def is_email(email):
    re_email = r'\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b'
    return re.search(re_email, email) is not None


def _is_domain(domain):
    pattern = re.compile(
        r'^((http|https):\/\/)?([a-zA-Z0-9]+\.)?([a-zA-Z0-9][a-zA-Z0-9-]*)?((\:[a-zA-Z0-9]{2,6})|(\.[a-zA-Z0-9]{2,6}))$'
    )
    return re.search(pattern, domain) is not None


# Зөвхөн нэг config мэдээллийг буцаана
# оролт config one name
def get_config(config_name, Model=Config):

    default_values = {config_name: ''}
    configs = Model.objects.filter(name__in=default_values.keys()).first()

    return configs.value if configs else ''


# оролт config name array
# Олон config мэдээллийг буцаана obj буцаана
def get_configs(config_names):

    default_values = {conf: '' for conf in config_names}
    configs = Config.objects.filter(name__in=default_values.keys())
    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return rsp


def _is_geom_included(geo_json, org_geo_id):
    cursor = connections['default'].cursor()
    sql = """
        select ST_Contains(
            ((
                SELECT (ST_Transform(geo_data,4326))
                FROM m_geo_datas
                WHERE geo_id = %s
            )),
            ((
                select ST_GeomFromGeoJSON(%s)
            ))
        )
    """
    cursor.execute(sql, [org_geo_id, str(geo_json)])
    is_included = cursor.fetchone()[0]
    return is_included


def get_perm_kind_name(idx):
    perms = {1: 'ХАРАХ', 2: 'НЭМЭХ', 3: 'ХАСАХ', 4: 'ЗАСАХ', 5: 'БАТЛАХ', 6: 'ЦУЦЛАХ'}
    return perms[idx]


# Тухайн geom ни feature доторх geom той давхцаж байгаа эсэхийг шалгана
# Давхцаж байгаа geom болон feature_id array хэлбэрээр буцаана
# geo_json = нэг geojson авна
# feature_ids = feature id list авна
def _geom_contains_feature_geoms(geo_json, feature_ids, perm_kind=None):
    is_included = list()
    if perm_kind and get_perm_kind_name(perm_kind) == 'ХАСАХ':
        return is_included
    with connections['default'].cursor() as cursor:
        sql = """
            SELECT geo_id, feature_id
            FROM m_geo_datas
            WHERE (
                    st_overlaps(geo_data, ST_GeomFromGeoJSON(%s))
                    OR
                    ST_Contains(geo_data, ST_GeomFromGeoJSON(%s))
                    OR
                    ST_Contains(ST_GeomFromGeoJSON(%s), geo_data)
            )
            AND feature_id in ({feature_ids})
        """.format(feature_ids=', '.join(['{}'.format(f) for f in feature_ids]))
        cursor.execute(sql, [str(geo_json), str(geo_json), str(geo_json)])
        is_included = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]

    return is_included


def has_employee_perm(employee, fid, geom, perm_kind, geo_json=None):
    success = True
    info = ''
    EmpPermInspire = apps.get_model('backend_inspire', 'EmpPermInspire')
    FeatureOverlaps = apps.get_model('dedsanbutets', 'FeatureOverlaps')
    qs = EmpPermInspire.objects
    qs = qs.filter(emp_perm__employee=employee)
    qs = qs.filter(feature_id=fid)
    qs = qs.filter(geom=geom)
    qs = qs.filter(perm_kind=perm_kind)

    if not qs:
        success = False
        info = "Албан хаагчийн эрх олгогдоогүй байна. Системийн админд хандана уу !!!."
    if geo_json:
        is_included = _is_geom_included(geo_json, employee.org.geo_id)
        if not is_included:
            success = False
            info = "Байгууллагын эрх олгогдоогүй байна. Системийн админд хандана уу !!!."
        overlap_feature_id = FeatureOverlaps.objects.filter(feature_id=fid).values_list('overlap_feature_id', flat=True)
        overlap_feature_id = [i for i in overlap_feature_id]
        overlap_feature_id.append(fid)
        is_contains = _geom_contains_feature_geoms(geo_json, overlap_feature_id, perm_kind)
        if is_contains:
            success = True
            info = '''{feature_ids} дугааруудтай geom-той давхцаж байна.'''.format(feature_ids=', '.join(['{}'.format(f['geo_id']) for f in is_contains]))

    return success, info


def get_emp_property_roles(employee, fid):
    property_ids = []
    property_details = []
    EmpPerm = apps.get_model('backend_inspire', 'EmpPerm')
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    EmpPermInspire = apps.get_model('backend_inspire', 'EmpPermInspire')
    property_perms = EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=fid).distinct('property_id', 'perm_kind').exclude(property_id__isnull=True).values('property_id', 'perm_kind')

    if property_perms:
        for prop in property_perms:
            if prop.get('property_id') not in property_ids:
                property_ids.append(prop.get('property_id'))
        for property_id in property_ids:
            property_roles = {'PERM_VIEW': True, 'PERM_CREATE': True, 'PERM_REMOVE': True, 'PERM_UPDATE': True, 'PERM_APPROVE': True, 'PERM_REVOKE': True}
            for prop in property_perms:
                if property_id == prop['property_id']:
                    if prop.get('perm_kind') == EmpPermInspire.PERM_VIEW:
                        property_roles['PERM_VIEW'] = False
                    if prop.get('perm_kind') == EmpPermInspire.PERM_CREATE:
                        property_roles['PERM_CREATE'] = False
                    if prop.get('perm_kind') == EmpPermInspire.PERM_REMOVE:
                        property_roles['PERM_REMOVE'] = False
                    if prop.get('perm_kind') == EmpPermInspire.PERM_UPDATE:
                        property_roles['PERM_UPDATE'] = False
                    if prop.get('perm_kind') == EmpPermInspire.PERM_APPROVE:
                        property_roles['PERM_APPROVE'] = False
                    if prop.get('perm_kind') == EmpPermInspire.PERM_REVOKE:
                        property_roles['PERM_REVOKE'] = False

            property_details.append({
                'property_id': property_id,
                'roles': property_roles
            })
    return property_ids, property_details


def check_form_json(fid, form_json, employee):

    request_json = []
    property_ids, roles = get_emp_property_roles(employee, fid)
    if form_json and roles:
        for role in roles:
            for propert in form_json['form_values']:
                if role.get('property_id') == propert.get('property_id'):
                    request_json.append({
                        'pk': propert.get('pk') or '',
                        'property_name': propert.get('property_name') or '',
                        'property_id': propert.get('property_id'),
                        'property_code': propert.get('property_code') or '',
                        'property_definition': propert.get('property_definition') or '',
                        'value_type_id': propert.get('value_type_id') or '',
                        'value_type': propert.get('value_type') or '',
                        'data': propert.get('data') or '',
                        'data_list': propert.get('data_list') or '',
                        'roles': propert.get('roles') or ''
                    })

    return json.dumps(request_json, ensure_ascii=False) if request_json else ''


def get_1stOrder_geo_id():
    MDatas = apps.get_model('backend_inspire', 'MDatas')
    LFeatures = apps.get_model('backend_inspire', 'LFeatures')
    LProperties = apps.get_model('backend_inspire', 'LProperties')
    LCodeLists = apps.get_model('backend_inspire', 'LCodeLists')
    LFeatureConfigs = apps.get_model('backend_inspire', 'LFeatureConfigs')

    feature_id = LFeatures.objects.filter(feature_code='bnd-au-au').first().feature_id
    property_id = LProperties.objects.filter(property_code='NationalLevel').first().property_id
    code_list_id = LCodeLists.objects.filter(code_list_code='1stOrder').first().code_list_id
    feature_config_ids = LFeatureConfigs.objects.filter(feature_id=feature_id)

    qs = MDatas.objects.filter(property_id=property_id)
    qs = qs.filter(code_list_id=code_list_id)

    return qs.filter(feature_config_id__in=feature_config_ids).first().geo_id


def get_geoJson(data):
    data = json.loads(data)
    geom_type = data['type']
    coordinates = data['coordinates']
    if geom_type == 'Point':
        from geojson import Point
        point = Point(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'LineString':
        from geojson import LineString
        point = LineString(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'Polygon':
        from geojson import Polygon
        point = Polygon(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'MultiPoint':
        from geojson import MultiPoint
        point = MultiPoint(coordinates)
        return Feature(geometry=point)

    elif geom_type == 'MultiLineString':
        from geojson import MultiLineString
        point = MultiLineString(coordinates)
        return Feature(geometry=point)

    else:
        from geojson import MultiPolygon
        point = MultiPolygon(coordinates)
        return Feature(geometry=point)


def datetime_to_string(date):
    if date:
        if isinstance(date, datetime):
            date = date.strftime('%Y-%m-%d')
        else:
            date = date
    else:
        date = ''
    return date


def date_fix_format(input_date):
    if not isinstance(input_date, datetime):
        if '/' in input_date:
            input_date = input_date.replace('/', '-')
    return input_date


def date_to_timezone(input_date):
    input_date = date_fix_format(input_date)
    naive_time = datetime.strptime(input_date, '%Y-%m-%d').replace(tzinfo=timezone.utc)
    return naive_time


def year_to_timezone(input_date):
    naive_time = datetime.strptime(input_date, '%Y').replace(tzinfo=timezone.utc)
    return naive_time


def get_display_items(items, fields, хувьсах_талбарууд=[], нэмэлт_талбарууд=[]):
    display = list()
    for item in items.values():
        obj = dict()
        for field in fields:
            if isinstance(item[field], datetime):
                obj[field] = datetime_to_string(item[field])
            else:
                obj[field] = item[field]
            for хувьсах_талбар in хувьсах_талбарууд:
                if хувьсах_талбар['field'] == field:
                    action = хувьсах_талбар['action']
                    obj[хувьсах_талбар['new_field']] = action(item[field], item)

        for нэмэлт_талбар in нэмэлт_талбарууд:
            action = нэмэлт_талбар['action']
            result_data = action(item)
            obj[нэмэлт_талбар['field']] = result_data or None

        display.append(obj)

    return display


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:
        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom = ''.join(geom)
        geom = GEOSGeometry(geom).hex
        geom = geom.decode("utf-8")
    return geom


def geojson_to_geom(geo_json):
    geom = []
    geo_json = str(geo_json).replace("\'", "\"")
    geo_data = geoJsonConvertGeom(geo_json)
    geom = ''.join(geo_data)
    geom_type = GEOSGeometry(geom).geom_type
    if geom_type == 'Point':
        geom = MultiPoint(geom, srid=4326)
    if geom_type == 'LineString':
        geom = MultiLineString(geom, srid=4326)
    if geom_type == 'Polygon':
        geom = MultiPolygon(geom, srid=4326)
    return geom


def get_fields(Model):
    fields = []
    for field in Model._meta.get_fields():
        name = field.name
        if field.get_internal_type() == 'ForeignKey':
            name = name + '_id'
        fields.append(name)

    return fields


def get_key_and_compare(dict, item):
    value = ''
    for key in dict.keys():
        if key == item:
            value = key
    return value


def lat_long_to_utm(y, x, insys=4326):

    def _calc_outsys():
        if 114 < y < 120:
            outsys = 50
        elif 108 < y < 114:
            outsys = 49
        elif 102 < y < 108:
            outsys = 48
        elif 96 < y < 102:
            outsys = 47
        elif 90 < y < 96:
            outsys = 46
        elif 84 < y < 90:
            outsys = 45
        return outsys

    inproj = pyproj.CRS('EPSG:' + str(insys))
    outproj = pyproj.CRS('EPSG:326' + str(_calc_outsys()))
    value = pyproj.transform(inproj, outproj, x, y)

    return value


def get_nearest_geom(coordinate, feature_id, srid=4326, km=1):
    point = Point(coordinate, srid=srid)
    MGeoDatas = apps.get_model('backend_inspire', 'MGeoDatas')
    mgeo_qs = MGeoDatas.objects
    mgeo_qs = mgeo_qs.filter(feature_id=feature_id)
    mgeo_qs = mgeo_qs.filter(geo_data__distance_lte=(point, D(km=km)))
    mgeo_qs = mgeo_qs.order_by('geo_data')
    nearest_points = mgeo_qs
    return nearest_points


def get_feature_from_geojson(geo_json, get_feature=True, properties=[], srid=4326):
    feature = []
    if geo_json:
        if isinstance(geo_json, str):
            geo_json = json.loads(geo_json)

        geom_type = geo_json['type']
        coordinates = geo_json['coordinates']

        module = importlib.import_module('geojson')
        class_ = getattr(module, geom_type)

        geometry = class_(coordinates, srid=srid)

        if get_feature:
            feature = Feature(geometry=geometry, properties=properties)
        else:
            feature = geometry

    return feature


def get_geom_for_filter_from_coordinate(coordinate, geom_type, srid=4326):
    module = importlib.import_module('django.contrib.gis.geos')
    class_ = getattr(module, geom_type)
    geom = class_([float(coord) for coord in coordinate], srid=srid)
    return geom


def get_geom_for_filter_from_geometry(geometry, change_to_multi=False):
    if isinstance(geometry, str):
        geometry = json.loads(geometry)

    polygonlist = GEOSGeometry(json.dumps(geometry))
    module = importlib.import_module('django.contrib.gis.geos')

    geom_type = geometry['type']
    if change_to_multi:
        if 'Multi' not in geometry['type']:
            geom_type = 'Multi' + geometry['type']

            class_ = getattr(module, geom_type)
            geom = class_(polygonlist)
        else:
            geom = polygonlist

    return geom


def check_view_name(view_name):
    view_name = remove_text_from_str(view_name, LAYERPREFIX)
    has_view_name = False
    with connections['default'].cursor() as cursor:
        sql = """
            SELECT matviewname as view_name
            FROM pg_matviews
            ORDER BY view_name
        """
        cursor.execute(sql)
        for item in cursor.fetchall():
            if item[0] == view_name:
                has_view_name = True
        return has_view_name


def get_inside_geoms_from_view(geo_json, view_name, properties=list()):
    datas = list()

    if properties:
        properties = ",".join([prop_code for prop_code in properties])
        properties = properties + ","
    else:
        properties = ''

    has_view_name = check_view_name(view_name)
    if has_view_name:
        with connections['default'].cursor() as cursor:
            sql = """
                SELECT {properties} ST_AsGeoJSON(geo_data)
                FROM {view_name}
                WHERE (
                        ST_Within(geo_data, ST_GeomFromGeoJSON(%s))
                )
            """.format(view_name=view_name, properties=properties)
            cursor.execute(sql, [str(geo_json)])
            datas = [item[0] for item in cursor.fetchall()]

    return datas


def remove_text_from_str(main_text, remove_text=LAYERPREFIX):
    replaced_text = main_text
    if remove_text in main_text:
        replaced_text = main_text.replace(remove_text, '')
    return replaced_text


def get_geoms_with_point_buffer_from_view(point_coordinates, view_name, radius):
    with connections['default'].cursor() as cursor:
        sql = """
            SELECT ST_AsGeoJSON(geo_data)
            FROM {view_name}
            WHERE (
                    ST_Dwithin(
                        geo_data,
                        ST_SetSRID(
                            ST_MakePoint({x}, {y})
                        ,4326)
                        ,{radius}
                    )
            )
        """.format(
            view_name=view_name,
            radius=radius,
            x=point_coordinates[0],
            y=point_coordinates[1],
        )
        cursor.execute(sql)

        return [item[0] for item in cursor.fetchall()]


def save_img_to_folder(image, folder_name, file_name, ext):
    uniq = uuid.uuid4().hex[:8]
    file_full_name = file_name + '_' + uniq + ext
    bytes = bytearray(image)
    image = Image.open(io.BytesIO(bytes))
    image = image.resize((720, 720), Image.ANTIALIAS)
    image = image.save(os.path.join(settings.MEDIA_ROOT, folder_name, file_full_name))
    return folder_name + '/' + file_full_name


def save_file_to_storage(file, folder_name, file_full_name, storage_path=settings.MEDIA_ROOT):
    from django.core.files.storage import FileSystemStorage
    path = os.path.join(storage_path, folder_name)
    fs = FileSystemStorage(
        location=path
    )
    file = fs.save(file_full_name, file)
    fs.url(file)
    return path


def create_index(model_name, field):
    with connections['default'].cursor() as cursor:
        sql = """
            CREATE INDEX {model_name}_index_{field}
            ON public.{model_name} USING btree
                ({field} ASC NULLS LAST)
            TABLESPACE pg_default;
        """.format(field=field, model_name=model_name)
        cursor.execute(sql)
        return True
    return False


def unzip(path_zip_file, extract_path):
    is_unzipped = False

    with zipfile.ZipFile(path_zip_file, 'r') as zip_ref:
        is_unzipped = True
        zip_ref.extractall(extract_path)

    return is_unzipped


def image_to_byte_array(image_path):
    image = Image.open(image_path)
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format=image.format)
    img_byte_arr = img_byte_arr.getvalue()
    return img_byte_arr


# feature code oor feature iin qs awah
def get_feature_from_code(feature_code):
    Lfeature = apps.get_model('backend_inspire', 'LFeatures')
    l_feature_qs = Lfeature.objects
    l_feature_qs = l_feature_qs.filter(feature_code=feature_code)
    if l_feature_qs:
        return l_feature_qs.first()
    else:
        raise Exception('Бүртгэлгүй feature ийн мэдээлэл байна: {}'.format(feature_code))


def save_geom_to_mgeo_data(geo_data, feature_id, feature_code):
    MGeoDatas = apps.get_model('backend_inspire', 'MGeoDatas')
    new_geo_id = GEoIdGenerator(feature_id, feature_code).get()
    mgeo_qs = MGeoDatas.objects
    mgeo_qs = mgeo_qs.create(
        geo_id=new_geo_id,
        feature_id=feature_id,
        geo_data=geo_data,
    )
    return mgeo_qs, new_geo_id


def get_properties(feature_id, get_all=False):
    LProperties = apps.get_model('backend_inspire', 'LProperties')
    LFeatureConfigs = apps.get_model('backend_inspire', 'LFeatureConfigs')
    DataTypeConfigs = apps.get_model('backend_inspire', 'LDataTypeConfigs')

    l_feature_c_qs = LFeatureConfigs.objects
    l_feature_c_qs = l_feature_c_qs.filter(feature_id=feature_id)
    data_type_ids = list(l_feature_c_qs.values_list('data_type_id', flat=True))

    data_type_c_qs = DataTypeConfigs.objects
    data_type_c_qs = data_type_c_qs.filter(data_type_id__in=data_type_ids)
    property_ids = list(data_type_c_qs.values_list('property_id', flat=True))

    property_qs = LProperties.objects
    property_qs = property_qs.filter(property_id__in=property_ids)

    if get_all:
        feature_config_ids = list(l_feature_c_qs.values_list('feature_config_id', flat=True))
        return feature_config_ids, data_type_ids, property_ids
    else:
        return property_qs, l_feature_c_qs, data_type_c_qs


def value_types():
    return [
        {'value_type': 'value_number', 'value_names': ['double', 'number']},
        {'value_type': 'value_text', 'value_names': ['boolean', 'multi-text', 'link', 'text']},
        {'value_type': 'value_date', 'value_names': ['date']},
        {'value_type': 'code_list_id', 'value_names': ['single-select', 'multi-select']},
    ]


def json_load(data):
    if isinstance(data, str):
        data = json.loads(data)
    return data


def json_dumps(data):
    if isinstance(data, dict) or isinstance(data, list):
        data = json.dumps(data, ensure_ascii=False)
    return data


def make_value_dict(value, properties_qs, is_display=False):
    value = json_load(value)
    for types in value_types():
        for prop in properties_qs.values():
            for key, val in value.items():
                if prop['value_type_id'] in types['value_names'] and key == prop['property_code']:
                    data = dict()
                    if not is_display:
                        if 'date' in types['value_type']:
                            val = date_to_timezone(val)
                        data[types['value_type']] = val
                        data['property_id'] = prop['property_id']
                    if is_display:
                        data[prop['property_code']] = val

                    yield data


def save_value_to_mdatas(value, feature_code, coordinate=None, geom_type='Point', geo_id=''):
    l_feature_qs = get_feature_from_code(feature_code)

    feature_id = l_feature_qs.feature_id

    point = get_geom_for_filter_from_coordinate(coordinate, geom_type)
    point = get_geom_for_filter_from_geometry(point.json, True)
    mgeo_qs, new_geo_id = save_geom_to_mgeo_data(point, feature_id, feature_code)

    properties_qs, l_feature_c_qs, data_type_c_qs = get_properties(feature_id)
    datas = make_value_dict(value, properties_qs, False)
    for data in datas:
        for data_type_c in data_type_c_qs:
            if data_type_c.property_id == data['property_id']:
                for l_feature_c in l_feature_c_qs:
                    if data_type_c.data_type_id == l_feature_c.data_type_id:
                        data['feature_config_id'] = l_feature_c.feature_config_id
                        data['data_type_id'] = l_feature_c.data_type_id

        MDatas = apps.get_model('backend_inspire', 'MDatas')
        mdata_qs = MDatas.objects
        if not geo_id:
            data['geo_id'] = mgeo_qs.geo_id
            mdata_qs = mdata_qs.create(**data)
        else:
            mdata_qs = mdata_qs.filter(geo_id=geo_id)
            mdata_qs = mdata_qs.filter(feature_config_id=data['feature_config_id'])
            mdata_qs = mdata_qs.filter(data_type_id=data['data_type_id'])
            mdata_qs = mdata_qs.filter(property_id=data['property_id'])
            if mdata_qs:
                mdata_qs = mdata_qs.update(**data)
            else:
                mdata_qs = mdata_qs.create(geo_id=geo_id, **data)

    return new_geo_id


def get_code_list_from_property_id(property_id):
    LCodeListConfigs = apps.get_model('backend_inspire', 'LCodeListConfigs')
    LCodeLists = apps.get_model('backend_inspire', 'LCodeLists')
    code_list_values = []
    code_list_configs = LCodeListConfigs.objects.filter(property_id=property_id)
    for code_list_config in code_list_configs:
        property_id = code_list_config.property_id
        to_property_id = code_list_config.to_property_id
        if property_id == to_property_id:
            to_property_id += 1
        x_range = range(property_id, to_property_id)
        for property_id_up in x_range:
            code_lists = LCodeLists.objects.filter(property_id=property_id_up).order_by('order_no')
            for code_list in code_lists:
                value = dict()
                if code_list.top_code_list_id:
                    value['top_code_list_id'] = code_list.top_code_list_id

                value['code_list_id'] = code_list.code_list_id
                value['property_id'] = code_list.property_id
                value['code_list_code'] = code_list.code_list_code
                value['code_list_name'] = code_list.code_list_name
                value['code_list_definition'] = code_list.code_list_definition
                code_list_values.append(value)

    return code_list_values


def get_filter_field_with_value(properties_qs, l_feature_c_qs, data_type_c_qs, property_code='Pointid'):
    data = dict()
    for prop in properties_qs:
        if prop.property_code == property_code:
            data = _get_filter_dict(prop, l_feature_c_qs, data_type_c_qs)
    return data


def _get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs, property_codes=[]):
    datas = list()
    for prop in properties_qs:
        data = dict()
        if property_codes:
            if prop.property_code in property_codes:
                data = _get_filter_dict(prop, l_feature_c_qs, data_type_c_qs)
                datas.append(data)
        else:
            data = _get_filter_dict(prop, l_feature_c_qs, data_type_c_qs)
            datas.append(data)
    return datas


def _mdata_values_field():
    return [
        'value_text', 'value_number', 'value_date', 'code_list_id'
    ]


def _get_filter_dict(prop, l_feature_c_qs, data_type_c_qs):
    data = dict()
    property_id = prop.property_id
    data['property_id'] = property_id
    for data_type_c in data_type_c_qs:
        if property_id == data_type_c.property_id:
            data_type_id = data_type_c.data_type_id
            data['data_type_id'] = data_type_id
            for l_feature_c in l_feature_c_qs:
                if l_feature_c.data_type_id == data_type_id:
                    l_feature_c_id = l_feature_c.feature_config_id
                    data['feature_config_id'] = l_feature_c_id
    return data


def _get_all_geos(feature_id):
    MGeoDatas = apps.get_model('backend_inspire', 'MGeoDatas')
    qs = MGeoDatas.objects
    qs = qs.filter(feature_id=feature_id)
    geo_ids = qs.values_list('geo_id', flat=True)
    return geo_ids


def get_mdata_values(feature_code, query):
    rows = []

    l_feature_qs = get_feature_from_code(feature_code)
    feature_id = l_feature_qs.feature_id

    LProperties = apps.get_model('backend_inspire', 'LProperties')

    names_qs = ViewNames.objects
    view = names_qs.filter(feature_id=feature_id)

    if view:
        view = view.first()
        view_name = view.view_name

        view_prop_qs = ViewProperties.objects
        view_prop_qs = view_prop_qs.filter(view=view)
        property_ids = list(view_prop_qs.values_list("property_id", flat=True))

        lp_qs = LProperties.objects
        lp_qs = lp_qs.filter(property_id__in=property_ids)
        properties = lp_qs.values_list("property_code", flat=True)

        if properties:
            properties = ",".join([prop_code for prop_code in properties])
            properties = properties.lower() + ",geo_id"
        else:
            properties = ''

        where = "pointnumber like '%{query}%'".format(query=query)

        cursor = connections['default'].cursor()
        sql = """
            select {properties} from {view_name} where {where}
        """.format(view_name=view_name, properties=properties, where=where)
        cursor.execute(sql)
        rows = dict_fetchall(cursor)
        rows = list(rows)

    return rows


def mdatas_for_paginator(initial_qs, searchs):

    send_values = list()
    for search in searchs:
        value = dict()
        mdata_qs = initial_qs.filter(**search)
        for mdata in mdata_qs.values():
            for field in _mdata_values_field():
                if mdata[field]:
                    if field == 'value_date':
                        mdata[field] = datetime_to_string(mdata[field])
                    value[mdata['property_id']] = mdata[field]
                    send_values.append(value)

    return send_values


def get_mdata_value(feature_code, geo_id, is_display=False):
    MDatas = apps.get_model('backend_inspire', 'MDatas')
    l_feature = get_feature_from_code(feature_code)

    feature_id = l_feature.feature_id
    send_value = dict()

    properties_qs, l_feature_c_qs, data_type_c_qs = get_properties(feature_id)
    datas = _get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs)

    mdatas_qs = MDatas.objects
    mdatas_qs = mdatas_qs.filter(geo_id=geo_id)
    for data in datas:
        mdatas = mdatas_qs.filter(**data)
        if mdatas:
            for mdata in mdatas.values():
                value = dict()
                values = mdata
                for prop in properties_qs:
                    if prop.property_id == mdata['property_id']:
                        for field in _mdata_values_field():
                            if values[field]:
                                value[prop.property_code] = values[field]
                datas = make_value_dict(value, properties_qs, is_display)
                for data in datas:
                    for key, value in data.items():
                        send_value[key] = value

    send_value['geo_id'] = geo_id

    return send_value


def get_2d_data(geo_id, srid=4326):
    geo_data = get_geom(geo_id, srid=srid)
    hex = geo_data.wkt
    hex = hex.replace(' Z', '')
    hex = hex.replace(' 0', '')
    data = hex
    return data


def get_2d_data_using_pg(geo_id):
    cursor = connections['default'].cursor()
    sql = """
        SELECT
            ST_AsText(ST_Transform(st_force2d(geo_data), 4326)) as geom
        FROM
            m_geo_datas
        WHERE
            geo_id='{geo_id}'
    """.format(
        geo_id=geo_id
    )

    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    data = rows[0]['geom']
    return data


def search_dict_from_object(objs, key='name', value='value'):
    data = dict()
    for obj in objs:
        data_key = obj[key]
        data_value = obj[value]
        data[data_key] = data_value
    return data


def get_center_of_geo_data(geo_id):
    center = []
    geo = MGeoDatas.objects.filter(geo_id=geo_id).first()
    center = geo.geo_data.centroid
    return list(center)


def check_saved_data(point_name, point_id):
    has_name, has_ids = False, False
    return has_name, has_ids


def get_code_list_id_from_name(code_list_name, property_code):
    LProperties = apps.get_model('backend_inspire', 'LProperties')

    code_list_id = None
    properties_qs = LProperties.objects
    properties_qs = properties_qs.filter(property_code=property_code)
    if properties_qs:
        prop = properties_qs.first()
        property_id = prop.property_id
        code_lists = get_code_list_from_property_id(property_id)
        for code_list in code_lists:
            if code_list_name == code_list['code_list_name']:
                code_list_id = code_list['code_list_id']
                break

    return code_list_id


# cache set end get
def geo_cache(key_name, key, qs, time):
    chache_data = cache.get('{}_{}'.format(key_name, key))
    if not chache_data:
        cache.set('{}_{}'.format(key_name, key), qs, time)
    return qs


# property ний value_type_id аас mdata ний value төрөлийг авах
def get_prop_value_type(value_type_id):
    filter_value_type = 'value_text'
    for type in value_types():
        if value_type_id in type['value_names']:
            filter_value_type = type['value_type']
            break
    return filter_value_type


# тухайн property г мдатагаас хайхад бэлэн маягаар гаргаж авах
def get_filter_dicts(property_code='pointnumber', feature_code='gnp-gp-gp'):
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_code__iexact=property_code)
    prop = prop_qs.first()

    feature = get_feature_from_code(feature_code)
    property_qs, l_feature_c_qs, data_type_c_qs = get_properties(feature.feature_id)
    data = get_filter_field_with_value(property_qs, l_feature_c_qs, data_type_c_qs, prop.property_code)

    filter_value_type = get_prop_value_type(prop.value_type_id)

    return data, filter_value_type


def _get_code_name_with_top(values, code, is_display=True):
    LCodeLists = apps.get_model('backend_inspire', 'LCodeLists')
    top_code = ''
    child_code = ''
    name_or_id = 'code_list_name'
    if not is_display:
        name_or_id = 'code_list_id'

    if code in values:
        code_list_id = values[code]
        code_qs = LCodeLists.objects
        codes_qs = code_qs.filter(code_list_id=code_list_id)
        if codes_qs:
            code = codes_qs.values()
            if code[0]['top_code_list_id']:
                code_qs = code_qs.filter(code_list_id=code[0]['top_code_list_id']).values()
                child_code = code[0][name_or_id]
                top_code = code_qs[0][name_or_id]
            else:
                top_code = code[name_or_id]

    return top_code, child_code


# inspire аас тухайн дарагдсан цэг ямар газар дарагдсан гэдгийг мэдэх
def get_aimag_sum_from_point(x, y, is_display=True):
    MDatas = apps.get_model('backend_inspire', 'MDatas')
    point = Point([x, y], srid=4326)
    feature_code = 'bnd-au-au'
    feature = get_feature_from_code(feature_code)
    mgeo_qs = MGeoDatas.objects
    mgeo_qs = mgeo_qs.filter(feature_id=feature.feature_id)
    mgeo_qs = mgeo_qs.filter(geo_data__contains=point)

    property_code = 'AdministrativeUnitSubClass'

    feature_id = feature.feature_id

    properties_qs, l_feature_c_qs, data_type_c_qs = get_properties(feature_id)
    datas = _get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs, property_codes=[property_code])

    aimag, sum = '', ''

    for mgeo in mgeo_qs:
        # level2 = 2
        level3 = 4
        geo_id = mgeo.geo_id
        if len(geo_id) == level3:
            mdatas_qs = MDatas.objects
            mdatas_qs = mdatas_qs.filter(geo_id=geo_id)
            for data in datas:
                mdatas_qs = mdatas_qs.filter(**data)
                if mdatas_qs:
                    mdatas = mdatas_qs.first()
                    values = dict()
                    values[property_code] = mdatas.code_list_id
                    aimag, sum = _get_code_name_with_top(values, property_code, is_display)
                    break

    return aimag, sum


# zurag
def image_to_64_byte(image_path):
    with open(image_path, "rb") as image_file:
        data = base64.b64encode(image_file.read())
    return data


def password_generate(length=12):
    chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456789'

    for p in range(1):
        password = ''
        for c in range(length):
            pwd = random.choice(chars)
            if password != pwd:
                password += pwd
    return password


def creat_empty_image(n=200, m=200, bg_color=[228, 150, 150]):
    image = Image.new('RGB', (n, m), tuple(bg_color))
    return image


def set_text_to_image(texts, image):
    """
    texts = [
        {
            'text': password_generate(7),
            'xy': [10, 5],
            'rgb': [255, 200, 255],
            'size': 20,
        }
    ]
    """
    draw = ImageDraw.Draw(image)
    for text in texts:
        font = ImageFont.truetype(settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', size=text['size'])
        draw.text(tuple(text['xy']), text['text'], tuple(text['rgb']), font)

    return image


def remove_file(file_path):
    os.remove(file_path)


def remove_folder(folder_path):
    if has_file(folder_path):
        shutil.rmtree(folder_path)


def copy_image(img, plus):

    # get legends
    # duudah hayg
    # http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&transparent=true&WIDTH=20&HEIGHT=20&LAYER=gp_tn:gp_layer_road_link_view

    x, y = img.size

    new_x = x + plus
    new_y = y + plus

    new_img = Image.new('RGBA', (new_x, new_y), 'red')
    top = math.floor((new_x - x) / 2)
    left = math.floor((new_y - y) / 2)
    tup = (top, left)
    new_img.paste(img, tup)

    return new_img


def get_colName_type(view_name, data):
    cursor = connections['default'].cursor()
    query_index = '''
        select
            ST_GeometryType(geo_data),
            Find_SRID('public', '{view_name}', '{data}'),
            ST_Extent(geo_data)
        from
            {view_name} group by geo_data limit 1
    '''.format(
        view_name=view_name.lower(),
        data=data
    )

    sql = '''
        SELECT
        attname AS column_name, format_type(atttypid, atttypmod) AS data_type
        FROM
        pg_attribute
        WHERE
        attrelid = 'public.{view_name}'::regclass AND    attnum > 0
        ORDER  BY attnum
        '''.format(view_name=view_name)

    cursor.execute(sql)
    geom_att = dict_fetchall(cursor)
    geom_att = list(geom_att)
    cursor.execute(query_index)
    some_attributes = dict_fetchall(cursor)
    some_attributes = list(some_attributes)

    return geom_att, some_attributes


def make_layer_name(view_name):
    return LAYERPREFIX + view_name


def check_gp_design():
    ws_name = 'gp_design'
    ds_name = ws_name
    table_name = 'geoserver_design_view'
    design_space = geoserver.getWorkspace(ws_name)

    def _create_design_view():
        sql = '''
                CREATE MATERIALIZED VIEW IF not EXISTS geoserver_design_view  as
                SELECT
                    ST_GeometryType(get_datas_of_m_geo_datas(feature_id)) as field_type,
                    get_datas_of_m_geo_datas(feature_id)  as geo_data, feature_id
                FROM
                    m_geo_datas
                group by feature_id
                '''
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
        return True

    _create_design_view()
    if design_space.status_code == 404:
        geoserver.create_space(ws_name)

    check_ds_name = geoserver.getDataStore(ws_name, ds_name)
    if check_ds_name.status_code == 404:
        geoserver.create_store(
            ws_name,
            ds_name,
            ds_name,
        )

    layer_name = make_layer_name(table_name)
    check_layer = geoserver.getDataStoreLayer(
        ws_name,
        ds_name,
        layer_name
    )
    layer_title = layer_name
    geom_att, extends = get_colName_type(table_name, 'geo_data')
    if extends:
        srs = extends[0]['find_srid']
        if srs and srs > 0:
            srs = srs
        else:
            srs = 4326

    else:
        srs = 4326
    if check_layer.status_code == 404:
        geoserver.create_layer(
            ws_name,
            ds_name,
            layer_name,
            layer_title,
            table_name,
            srs,
            geom_att,
            extends,
            False
        )


# Тухай Folder -т байгаа файлуудыг буцаадаг
def get_all_file_paths(directory):

    file_paths = []

    for root, directories, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)

    return file_paths


def check_pg_connection(host, db, port, user, password, schema):
    try:
        schema = schema or 'public'
        connection = psycopg2.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database=db,
            options="-c search_path=dbo,{schema}".format(schema=schema)
        )

        cursor = connection.cursor()
        connection.autocommit = True
        return cursor
    except Exception:
        return []


def get_pg_cursor(conn_details):
    host = conn_details.get('pg_host')
    port = conn_details.get('pg_port')
    user = conn_details.get('pg_username')
    password = conn_details.get('pg_password')
    db = conn_details.get('pg_database')
    schema = conn_details.get('pg_schema')
    try:
        cursor = check_pg_connection(host, db, port, user, password, schema)
    except Exception:
        cursor = []
    return cursor


def get_pg_conf(conn_id):
    another_db = get_object_or_404(AnotherDatabase, pk=conn_id) # TODO get object 404 hereglku
    connection = json_load(another_db.connection)
    form_datas = {
        'id': conn_id,
        'name': another_db.name,
        'definition': another_db.definition,
        'pg_host': connection.get('server'),
        'pg_port': connection.get('port'),
        'pg_username': connection.get('username'),
        'pg_password': connection.get('password'),
        'pg_database': connection.get('database'),
        'pg_schema': connection.get('schema')
    }
    return form_datas


def get_cursor_pg(conn_id):
    form_datas = get_pg_conf(conn_id)
    cursor_pg = get_pg_cursor(form_datas)
    return cursor_pg


def get_sql_execute(sql, cursor, fetch_type):
    cursor.execute(sql)
    if fetch_type == 'one':
        values = list(cursor.fetchone())
    else:
        values = list(dict_fetchall(cursor))
    return values


def convert_3d_with_srid(geo_data):
    cursor = connections['default'].cursor()

    sql_set_srid = '''
        SELECT st_force3d(ST_SetSRID(GeomFromEWKT('{geo_data}'),4326)) as wkt
    '''.format(geo_data=geo_data)
    cursor.execute(sql_set_srid)

    geo_data = get_sql_execute(sql_set_srid, cursor, 'all')
    geo_data = geo_data[0]['wkt']
    return geo_data


def check_table_name(cursor, table_name):
    sql = '''
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE
                table_schema = 'public'
                AND
                table_name   = '{table_name}'
        );
    '''.format(table_name=table_name)
    result = get_sql_execute(sql, cursor, 'one')
    return result


def create_table_to_cursor(cursor, table_name, fields, schema):
    sql = '''
        CREATE TABLE IF NOT EXISTS {schema}.{table_name}
        (
            {fields}
        )
    '''.format(
        table_name=table_name,
        fields=','.join(fields),
        schema=schema
    )
    cursor.execute(sql)


def check_nsdi_address(request):
    nsdi_check = False
    host_name = socket.gethostname()
    host_addr = socket.gethostbyname(host_name + ".local")
    host = request.META.get('HTTP_HOST')
    if host_addr == '192.168.10.15' and host == 'nsdi.gov.mn':
        nsdi_check = True
    return nsdi_check


def drop_table(table_name, cursor, schema='public'):
    detete_query = '''
        DROP TABLE IF EXISTS {schema}.{table_name}
    '''.format(
        table_name=table_name,
        schema=schema
    )
    cursor.execute(detete_query)


def get_file_name(file_name):
    return file_name.split('.')[0] if file_name.split('.') else file_name


def has_materialized_view(view_name):
    sql = '''
        SELECT
            *
        FROM pg_matviews
        WHERE
            matviewname = '{view_name}';
    '''.format(view_name=view_name)
    with connections['default'].cursor() as cursor:
        cursor.execute(sql)
        if cursor.fetchone():
            return True
        return False


def get_feature(shape_geometries):
    features = []
    geom_type = ''
    for shape_geometry in shape_geometries:

        single_geom = json_load(shape_geometry.geom_json)
        geom_type = single_geom.get('type')
        feature = {
            "type": "Feature",
            'geometry': single_geom,
            'id': shape_geometry.id,
            'properties': json_load(shape_geometry.form_json)
        }
        features.append(feature)
    return features, geom_type


def make_view_name(feature):
    view_name = ''
    if feature and feature.feature_code:
        feature_code = feature.feature_code
        feature_code = feature_code.split("-")
        view_name = slugifyWord(feature.feature_name_eng) + "_" + feature_code[len(feature_code) - 1] + '_view'
    return view_name.lower()


def get_feature_from_layer_code(layer_code):
    LFeatures = apps.get_model('backend_inspire', 'LFeatures')
    layer_code = layer_code.split('_view')[0]
    splited = layer_code.split('_')
    code = splited.pop()
    eng_name = "_".join(splited)
    feature_qs = LFeatures.objects
    feature_qs = feature_qs.filter(feature_name_eng__iexact=eng_name, feature_code__endswith=code)
    feature = feature_qs.first()
    return feature


def get_org_from_user(user, is_admin=True):
    Employee = apps.get_model("backend_org", "Employee")
    emp_qs = Employee.objects
    emp_qs = emp_qs.filter(user=user)
    if is_admin:
        emp_qs = emp_qs.filter(is_admin=is_admin)
    if not emp_qs:
        return False
    return emp_qs.first().org


def get_today_datetime(is_string=False):
    now = datetime.now()
    if is_string:
        return datetime_to_string(now)
    return now


def get_type(value_type_id):
    number_types = ['number', 'double']
    text_types = ['text', 'multi_text', 'link', 'boolean']

    if value_type_id in number_types:
        value_type = 'number'
    elif value_type_id in text_types:
        value_type = 'text'
    elif value_type_id == 'date':
        value_type = 'date'
    else:
        value_type = 'option'

    return value_type


def get_value_from_types(choices, value):
    choices = list(choices)
    for option in choices:
        option = list(option)
        if value == option[0]:
            return option[1]
    return ''


# dict ийг зөв форматаар хэвлэж хармаар санагдвал хэрэглэх
def test_json_dumps(dct):
    return json.dumps(dct, skipkeys=True, allow_nan=True, indent=4, ensure_ascii=False)


# datatable хэрэглээгүй тохиолдолд хүснэгтийн эхлэлийн тоог өгнө
def get_start_index(per_page, page):
    return (per_page * (page - 1)) + 1


# dict-ээс өөрт хэрэггүй field-үүдээ устгана
def key_remove_of_dict(values, keys):
    new_values = dict(values)
    for key in keys:
        if key in values:
            del new_values[key]

    return new_values


# TODO хэрэглэгч байгааг шалгаж болно
def has_user(id=None, username=None, email=None):
    User = apps.get_model('geoportal_app', 'User')
    is_valid = False

    if username:
        user = User.objects.filter(username=username).first()
        if user:
            is_valid = True
    elif id:
        user = User.objects.filter(id=id).first()
        if user:
            is_valid = True
    elif email:
        user = User.objects.filter(email=email).first()
        if user:
            is_valid = True

    return is_valid


# theme code ийг өгөөд тухайн theme ийн бүх feature_id ийг буцаана
def get_feature_ids_of_theme(theme_code):

    LThemes = apps.get_model('backend_inspire', 'LThemes')

    feature_ids = list()

    theme_qs = LThemes.objects
    theme_qs = theme_qs.filter(theme_code=theme_code)
    theme_qs = theme_qs.prefetch_related('lpackages_set__lfeatures_set')
    theme = theme_qs.first()

    if theme:
        pack_qs = theme.lpackages_set.all()
        for pack in pack_qs:
            feature_qs = pack.lfeatures_set.all()
            for feature in feature_qs:
                feature_ids.append(feature.feature_id)

    return feature_ids


# file ruu text bichih
def write_to_file(text, file_name='test.txt'):
    with open(file_name, 'a') as f:
        f.write("\n" + text)


# зөвхөн тест үед л хэрэг болно эхлэл хугацааг тавина
def start_time():
    return time.time()


# эхлэл хугацаанаас төгсөл хугацааг гаргана
def end_time(start_time, text=""):
    print(text, time.time() - start_time)


# файлын зам өгөөд байгаа эсэхийг шалгана return bool
def has_file(path):
    return os.path.exists(path)


# bbox оос polygon үүсгэх
def bboxToPolygon(bbox=list(), get_wkt=True):
    geom = geos.Polygon.from_bbox(bbox)
    return geom.wkt if get_wkt else geom


# текстнээс илүү хоосон зайнуудыг арилгана
def remove_empty_spaces(text):
    text_list = [
        per_name
        for per_name in text.split(" ")
        if per_name
    ]
    clean_text = " ".join(text_list)
    return clean_text


# try catch ashiglaad catch hiisen exception ee error500 ruu hadgalah ni
def save_to_error500(request, exception):
    Error500 = apps.get_model('backend_config', 'Error500')

    request_scheme = request.scheme
    request_url = request.path
    request_method = request.method
    request_data = json.dumps(request.POST, indent=4, ensure_ascii=False)
    request_headers = json.dumps(dict(request.headers), indent=4, ensure_ascii=False)

    Error500.objects.create(
        request_scheme=request_scheme,
        request_url=request_url,
        request_method=request_method,
        request_data=request_data,
        request_headers=request_headers,
        description=exception,
    )
