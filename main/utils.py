from PIL import Image
from collections import namedtuple
from io import BytesIO
import base64
import functools
import re
import unicodedata
import uuid

from django.apps import apps
from django.contrib.gis.db.models.functions import Transform
from django.contrib.gis.geos import GEOSGeometry
from django.db import connections
from backend.dedsanbutets.models import ViewNames
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail

from main.inspire import InspireProperty
from main.inspire import InspireCodeList
from main.inspire import InspireDataType
from main.inspire import InspireFeature
from backend.config.models import Config


def resize_b64_to_sizes(src_b64, sizes):

    src_bytes = base64.b64decode(src_b64)
    src_io = BytesIO(src_bytes)

    def _resize(image, size):
        dst = BytesIO()
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

    view_data = ViewNames.objects.filter(feature_id=fid).first()
    if view_data:
        sql = """ REFRESH MATERIALIZED VIEW CONCURRENTLY public.{table_name} """.format(table_name=view_data.view_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
            return True

        return False
    else:
        return True


def _generate_user_token():
    token = uuid.uuid4().hex[:32]
    UserValidationEmail = apps.get_model('geoportal_app', 'UserValidationEmail')
    if UserValidationEmail.objects.filter(token=token).first():
        _generate_user_token()
    return token


def send_approve_email(user):

    if not user.email:
        return False

    token = _generate_user_token()

    UserValidationEmail = apps.get_model('geoportal_app', 'UserValidationEmail')
    UserValidationEmail .objects.create(
        user=user,
        token=token,
        valid_before=timezone.now() + timedelta(days=90)
    )

    subject = 'Геопортал хэрэглэгч баталгаажуулах'
    msg = 'Дараах холбоос дээр дарж баталгаажуулна уу! http://{host_name}/gov/secure/approve/{token}/'.format(token=token, host_name=settings.EMAIL_HOST_NAME)
    from_email = settings.EMAIL_HOST_USER
    to_email = [user.email]

    send_mail(subject, msg, from_email, to_email, fail_silently=False)

    return True


def get_administrative_levels():

    """
    Returns a nested structure:
    ```
        [
            {
                'geo_id': 'au_62',
                'name': 'Өвөрхангай',
                'children': [
                    {
                        'geo_id': 'au_6255',
                        'name': 'Хужирт',
                        'children': [
                            {'geo_id': 'au_625551', 'name': '1-р баг'},
                            {'geo_id': 'au_625553', 'name': '2-р баг'}
                        ]
                    },
                    {
                        'geo_id': 'au_6234',
                        'name': 'Өлзийт',
                        'children': [
                            {'geo_id': 'au_623451', 'name': '1-р баг'},
                            {'geo_id': 'au_623453', 'name': '2-р баг'},
                            {'geo_id': 'au_623455', 'name': '3-р баг'},
                            {'geo_id': 'au_623457', 'name': '4-р баг'}
                        ]
                    }
                ]
            },
            {
                'geo_id': 'au_46',
                'name': 'Өмнөговь',
                'children': [
                    {
                        'geo_id': 'au_4607',
                        'name': 'Баян-Овоо',
                        'children': [
                            {'geo_id': 'au_460751', 'name': '1-р баг'},
                            {'geo_id': 'au_460753', 'name': '2-р баг'},
                            {'geo_id': 'au_460755', 'name': '3-р баг'}
                        ]
                    },
                    {
                       'geo_id': 'au_4604',
                        'name': 'Баяндалай',
                        'children': [
                            {'geo_id': 'au_460451', 'name': '1-р баг'},
                            {'geo_id': 'au_460453', 'name': '2-р баг'},
                            {'geo_id': 'au_460455', 'name': '3-р баг'}
                        ]
                    }
                ],
            }
        ]
    ```
    """

    i_code_list_2nd_order = InspireCodeList('2ndOrder\n')
    i_code_list_3rd_order = InspireCodeList('3rdOrder\n')
    i_code_list_4th_order = InspireCodeList('4thOrder\n')

    def _get_code_names(national_codes):

        table_au_au_ab = InspireFeature('au-au-ab')

        i_data_type_administrative_boundary = InspireDataType('AdministrativeBoundary')
        i_property_name = InspireProperty('name')

        table_au_au_ab.filter({'geo_id': national_codes})
        table_au_au_ab.select({
            'geo_id': True,
            i_data_type_administrative_boundary: {i_property_name},
        })

        for item in table_au_au_ab.fetch():
            code = item['geo_id']
            name = item[i_data_type_administrative_boundary][i_property_name]
            yield code, name

    def _get_au_items():
        table_au_au_au = InspireFeature('au-au-au')

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
                    InspireProperty('nationalCode'),
                ],
            },
        )

        for row in table_au_au_au.fetch():
            geo_id = row['geo_id']
            level = row[InspireDataType('AdministrativeUnit')][InspireProperty('NationalLevel')]
            code = row[InspireDataType('AdministrativeUnit')][InspireProperty('nationalCode')]
            yield geo_id, level, code

    # build flat data

    items = {
        '#root': {
            'children': list()
        }
    }

    for geo_id, level, code in _get_au_items():
        items[code] = {
            'geo_id': geo_id,
            'level': level,
            'code': code,
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
            del item['code']

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
    re_register = r'[АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ]{2}[0-9]{8}'
    return re.search(re_register, register.upper()) is not None


def is_email(email):
    re_email = r'\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b'
    return re.search(re_email, email) is not None

# Зөвхөн нэг config мэдээллийг буцаана
# оролт config one name
def get_config(config_name):

    default_values = {config_name: ''}
    configs = Config.objects.filter(name__in=default_values.keys()).first()

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
