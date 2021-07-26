import os
import json
import datetime
import uuid
import glob
from geojson import Feature, FeatureCollection
from .forms import OrderForm

from django.conf import settings
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.gdal import DataSource
from django.contrib.auth.decorators import login_required
from django.db import connections, transaction
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.core.files.storage import FileSystemStorage
from django.contrib.gis.geos import MultiLineString
from django.contrib.gis.geos import MultiPoint
from django.contrib.gis.geos import MultiPolygon
from django.db.models import Q

from backend.dedsanbutets.models import ViewNames
from backend.dedsanbutets.models import ViewProperties
from backend.inspire.models import EmpPerm, LThemes
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import LCodeListConfigs
from backend.inspire.models import LCodeLists
from backend.inspire.models import LProperties
from backend.inspire.models import LDataTypes
from backend.inspire.models import LFeatures
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.inspire.models import LDataTypeConfigs
from backend.inspire.models import LFeatureConfigs
from backend.org.models import Employee, Org
from govorg.backend.org_request.models import ChangeRequest
from govorg.backend.org_request.views import _get_geom

from main.utils import get_geoJson
from main.decorators import ajax_required, gov_required
from main.utils import check_form_json
from main.utils import dict_fetchall
from main.utils import get_config
from main.utils import gis_fields_by_oid
from main.utils import gis_insert
from main.utils import gis_tables_by_oids
from main.utils import has_employee_perm
from main.utils import refreshMaterializedView
from main.utils import get_emp_property_roles
from main.utils import get_feature_from_geojson
from main import utils
from main.inspire import GEoIdGenerator
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer
from main.components import Datatable
from geoportal_app.models import User



def _get_changeset_display(ob):

    geom = ob.geom.replace("\'", "\"")
    geom1 = geom[:9]
    geom2 = geom[10:-2]
    geom3 = geom[-1]
    geom4 = geom1 + geom2 + geom3
    values_list = json.loads(geom4)
    coordinates = values_list['geom']['coordinates']
    geom_type = values_list['geom']['type']

    return {
        'coordinate': coordinates,
        'geom_type': geom_type,
        'changeset_id': ob.id,
        'changeset_attributes': ob.features,
        'projection': ob.projection
    }


def _get_feature_coll(ob, changeset_list):
    geom_type = changeset_list[ob]['geom_type']
    if geom_type == 'Point':
        from geojson import Point
        point = Point((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)
    elif geom_type == 'LineString':
        from geojson import LineString
        point = LineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'Polygon':
        from geojson import Polygon
        point = Polygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'MultiPoint':
        from geojson import MultiPoint
        point = MultiPoint((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'MultiLineString':
        from geojson import MultiLineString
        point = MultiLineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    else:
        from geojson import MultiPolygon
        point = MultiPolygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def getRoles(request, tid, fid):
    file_detail = dict()
    main_folder = "feature-template"
    inspire_roles = {'PERM_VIEW': False, 'PERM_CREATE':False, 'PERM_REMOVE':False, 'PERM_UPDATE':False, 'PERM_APPROVE':False, 'PERM_REVOKE':False}

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    theme = LThemes.objects.filter(theme_id=tid).first()
    feature = LFeatures.objects.filter(feature_id=fid).first()
    perm_kinds = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=fid, geom=True).distinct('perm_kind').values_list('perm_kind', flat=True))

    for perm_kind in perm_kinds:
        if perm_kind == EmpPermInspire.PERM_VIEW:
            inspire_roles['PERM_VIEW'] = True
        elif perm_kind == EmpPermInspire.PERM_CREATE:
            inspire_roles['PERM_CREATE'] = True
        elif perm_kind == EmpPermInspire.PERM_REMOVE:
            inspire_roles['PERM_REMOVE'] = True
        elif perm_kind == EmpPermInspire.PERM_UPDATE:
            inspire_roles['PERM_UPDATE'] = True
        elif perm_kind == EmpPermInspire.PERM_APPROVE:
            inspire_roles['PERM_APPROVE'] = True
        elif perm_kind == EmpPermInspire.PERM_REVOKE:
            inspire_roles['PERM_REVOKE'] = True

    theme_folder = theme.theme_name_eng
    feature_folder = feature.feature_name_eng
    path = os.path.join(settings.MEDIA_ROOT, main_folder, theme_folder, feature_folder)
    if os.path.exists(path):
        files = os.listdir(path)
        if files:
            file_name = files[0]
            file_url = os.path.join(path, file_name)
            file =file_url.split("geoportal_app")
            file_detail['name'] = file_name
            file_detail['url'] = file[1]
            inspire_roles['file'] = file_detail
        else:
            inspire_roles['file'] = ''


    rsp = {
        'roles': inspire_roles,
        'success': True
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def table_list(request):

    rows = []
    oids = list(request.bundle.bundlegis_set.values_list('oid', flat=True))
    if len(oids):

        tables = gis_tables_by_oids(oids)

        rows = [
            {
                **table,
                'fields': [
                    {
                        'name': f.attname,
                        'type': f.atttypid,
                    }
                    for f in gis_fields_by_oid(table['oid'])
                ],
            }
            for table in tables
        ]

    rsp = {
        'items': rows
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def geom_type(request, pid, fid):
    data = MGeoDatas.objects.filter(feature_id=fid).first()
    if data:
        rsp = {
            'success': True,
            'type': GEOSGeometry(data.geo_data).geom_type
        }
    else:
        rsp = {
            'success': False,
            'type': 'Tөрөл байхгүй байна'
        }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_wms_layer(request, tid, pid, fid):
    feature = LFeatures.objects.filter(feature_id=fid).first()
    view_name = utils.make_view_name(feature)
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    rsp = {
        'success': False,
        'url': '',
        'code': '',
    }
    if view_name:
        rsp = {
            'success': True,
            'url': request.build_absolute_uri(reverse('api:qgis:qgis-proxy', args=[employee.token, fid])),
            'code': 'gp_layer_' + view_name,
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def add(request, payload, oid):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

    try:

        fields_to_update = gis_fields_by_oid(oid, exclude=['id', 'geom'])
        gis_insert(oid, fields_to_update, payload, value_default='')

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }
        return JsonResponse(rsp)

    except Exception:

        rsp = {
            'success': False,
            'info': "Өгөгдлийг зөв оруулна уу!",
        }
        return HttpResponseBadRequest(json.dumps(rsp))


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def save(request, payload, pid, fid):

    form_values = payload.get('form_values')
    for data in form_values:
        if data['value_type'] == 'number':
            if data['data']:
                MDatas.objects.filter(id=data['pk'], geo_id=data['geo_id']).update(value_number=data['data'])
        elif data['value_type'] == 'option':
            if data['data']:
                MDatas.objects.filter(id=data['pk'], geo_id=data['geo_id']).update(code_list_id=data['data'])
        elif data['value_type'] == 'text':
            if data['data']:
                MDatas.objects.filter(id=data['pk'], geo_id=data['geo_id']).update(value_text=data['data'])
        elif data['value_type'] == 'date':
            if data['data']:
                MDatas.objects.filter(id=data['pk'], geo_id=data['geo_id']).update(value_date=data['data'])
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def delete(request, payload, pid, fid):
    gid = payload.get('gid')
    get_object_or_404(MGeoDatas, geo_id=gid)

    datas = MDatas.objects.filter(geo_id=gid)
    geom = MGeoDatas.objects.filter(geo_id=gid)
    if geom and datas:
        geom.delete()
        datas.delete()
        refreshMaterializedView(fid)
        rsp = {
            'success': True,
            'info': "Амжилттай",
        }
    else:
        rsp = {
            'success': False,
            'info': "Амжилтгүй",
        }
    return JsonResponse(rsp)


def _code_list_display(property_id):
    code_list_values = list()
    code_list_configs = LCodeListConfigs.objects.filter(property_id=property_id)
    if code_list_configs:
        for code_list_config in code_list_configs:
            property_id = code_list_config.property_id
            to_property_id = code_list_config.to_property_id
            if property_id == to_property_id:
                to_property_id += 1
            x_range = range(property_id, to_property_id)
            for i in x_range:
                code_lists = LCodeLists.objects.filter(property_id=i)
                if code_lists:
                    for code_list in code_lists:
                        code_list_values.append({
                            'code_list_id': code_list.code_list_id,
                            'code_list_name': code_list.code_list_name,
                            'code_list_definition': code_list.code_list_definition,
                        })
    return code_list_values


def _datetime_display(dt):
    return dt.strftime('%Y-%m-%d') if dt else None


def _get_properties(request, qs_l_properties, qs_property_ids_of_feature, fid, feature_config_ids, gid=None):
    properties = list()
    for l_property in qs_l_properties:
        pk = ''
        data = ''
        code_lists = []
        form = dict()
        value_type = utils.get_type(l_property.value_type_id)
        l_data_type = qs_property_ids_of_feature.filter(property_id=l_property.property_id).first()
        data_type_id = l_data_type.data_type_id
        property_id = l_property.property_id
        value, data_list, has_value = _get_data_list_and_value(gid, feature_config_ids, data_type_id, property_id, value_type)
        if has_value:
            data = value
            if data_list and not gid:
                data = data_list[0]['code_list_id']
            code_lists = data_list

        form['pk'] = pk
        form['data_type_id'] = data_type_id
        form['property_id'] = property_id
        form['property_name'] = l_property.property_name
        form['property_code'] = l_property.property_code
        form['property_definition'] = l_property.property_definition
        form['value_type_id'] = l_property.value_type_id
        form['value_type'] = value_type
        form['data'] = data
        form['data_list'] = code_lists
        form['roles'] = _get_roles(request, fid, property_id)
        if form['property_code'] != 'localId' or form['value_type_id'] != 'data-type':
            properties.append(form)
    return properties


def _get_data_list_and_value(gid, fcids, data_type_id, property_id, value_type):
    data_list = []
    value = ''
    m_datas = ''
    has_value = False
    if gid:
        m_datas = MDatas.objects.filter(geo_id=gid, feature_config_id__in=fcids, data_type_id=data_type_id, property_id=property_id).first()
        if m_datas:
            has_value = True
    else:
        has_value = True

    if has_value:
        if value_type == 'option':
            data_list = _code_list_display(property_id)
            if m_datas:
                value = m_datas.code_list_id
        elif value_type == 'text':
            value = m_datas.value_text if m_datas else ''
        elif value_type == 'number':
            value = m_datas.value_number if m_datas else ''
        else:
            value = _datetime_display(m_datas.value_date if m_datas else '')

    return value, data_list, has_value


def _get_roles(request, fid, property_id):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
    property_ids, roles = get_emp_property_roles(employee, fid)
    property_roles = {'PERM_VIEW': True, 'PERM_CREATE':True, 'PERM_REMOVE':True, 'PERM_UPDATE':True, 'PERM_APPROVE':True, 'PERM_REVOKE':True}
    for role in roles:
        if role.get('property_id') == property_id:
            property_roles = role.get('roles')
    return property_roles


def _get_data_types(qs_property_ids_of_feature, data_type_ids):
    qs_data_types = LDataTypes.objects
    qs_data_types = qs_data_types.filter(data_type_id__in=data_type_ids)
    data_types = list()
    for data_type in qs_data_types:
        data = dict()
        data['data_type_id'] = data_type.data_type_id
        data['data_type_name'] = data_type.data_type_name
        data['data_type_code'] = data_type.data_type_code
        data['data_type_name_eng'] = data_type.data_type_name_eng
        check_data_type_ids = list()
        qs_properties = qs_property_ids_of_feature.filter(data_type_id=data_type.data_type_id)
        property_ids = list(qs_properties.values_list('property_id', flat=True))
        data['property_ids'] = property_ids
        data_types.append(data)
    return data_types

def _get_user_perm(request, fid):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    emp_perm = get_object_or_404(EmpPerm, employee=employee)
    emp_perm = EmpPermInspire.objects.filter(
        emp_perm=emp_perm,
        feature_id=fid,
        perm_kind=EmpPermInspire.PERM_VIEW
    )
    emp_perm = emp_perm.exclude(property_id__isnull=True)
    property_list = list(emp_perm.values_list('property_id', flat=True))

    return property_list


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, gid, fid, tid):
    user_perm_property = _get_user_perm(request, fid)
    qs_feature_configs = LFeatureConfigs.objects
    qs_feature_configs = qs_feature_configs.filter(feature_id=fid)
    feature_config_ids = list(qs_feature_configs.values_list('feature_config_id', flat=True))
    data_type_ids = list(qs_feature_configs.values_list('data_type_id', flat=True))

    qs_property_ids_of_feature = LDataTypeConfigs.objects.filter(
        data_type_id__in=data_type_ids,
        property_id__in=user_perm_property)

    property_ids_of_feature = list(qs_property_ids_of_feature.values_list('property_id', flat=True))
    data_type_ids = list(qs_property_ids_of_feature.values_list('data_type_id', flat=True))
    qs_l_properties = LProperties.objects
    qs_l_properties = qs_l_properties.filter(property_id__in=property_ids_of_feature).distinct('property_id')

    rsp = {
        'success': True,
        'datas': _get_properties(request, qs_l_properties, qs_property_ids_of_feature, fid, feature_config_ids, gid),
        'data_types': _get_data_types(qs_property_ids_of_feature, data_type_ids),
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detailCreate(request, tid, pid, fid):

    user_perm_property = _get_user_perm(request, fid)
    qs_feature_configs = LFeatureConfigs.objects
    qs_feature_configs = qs_feature_configs.filter(feature_id=fid)
    feature_config_ids = list(qs_feature_configs.values_list('feature_config_id', flat=True))
    data_type_ids = list(qs_feature_configs.values_list('data_type_id', flat=True))
    qs_property_ids_of_feature = LDataTypeConfigs.objects

    qs_property_ids_of_feature = qs_property_ids_of_feature.filter(
        data_type_id__in=data_type_ids,
        property_id__in=user_perm_property)

    property_ids_of_feature = list(qs_property_ids_of_feature.values_list('property_id', flat=True))
    data_type_ids = list(qs_property_ids_of_feature.values_list('data_type_id', flat=True))
    qs_l_properties = LProperties.objects
    qs_l_properties = qs_l_properties.filter(property_id__in=property_ids_of_feature)

    rsp = {
        'success': True,
        'datas': _get_properties(request, qs_l_properties, qs_property_ids_of_feature, fid, feature_config_ids),
        'data_types': _get_data_types(qs_property_ids_of_feature, data_type_ids),
    }
    return JsonResponse(rsp)


def _data_type_ids_of_feature(feature_id):
    data_type_ids = []
    data_types = {}
    data_types_tmp = []
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        data_types_obj = LDataTypes.objects.filter(data_type_id=data_type_id).first()
        data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id)
        for data_type_config in data_type_configs:

            if data_type_id in data_type_ids:
                data_types[data_types_obj.data_type_id]['property_ids'].append(data_type_config.property_id)
            else:
                data_type_ids.append(data_type_id)
                data_types[data_types_obj.data_type_id] = {
                    'data_type_name': data_types_obj.data_type_name,
                    'data_type_code': data_types_obj.data_type_code,
                    'data_type_name_eng': data_types_obj.data_type_name_eng,
                    'data_type_id': data_types_obj.data_type_id,
                    'property_ids': [data_type_config.property_id],
                }

    for i, value in data_types.items():
        data_types_tmp.append(value)

    return data_types_tmp or []


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def updateGeom(request, payload, fid):
    geojson = payload.get('geojson')
    geo_id = payload.get('id')

    get_object_or_404(MGeoDatas, feature_id=fid, geo_id=geo_id)
    geom = GEOSGeometry(str(geojson))
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
        }
        return JsonResponse(rsp)
    MGeoDatas.objects.filter(geo_id=geo_id).update(geo_data=geom)
    refreshMaterializedView(fid)
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


def get_rows(fid):
    rows = []

    cursor = connections['default'].cursor()
    sql = """
        select datas.feature_id, datas.feature_config_id, datas.data_type_id,datas.property_id, l.property_name, l.property_code,l.property_definition,l.value_type_id
        from l_properties l
        inner join (select l_feature_configs.feature_id, l_feature_configs.feature_config_id, l_feature_configs.data_type_id,l_data_type_configs.property_id
        from l_feature_configs
        inner join l_data_type_configs on l_data_type_configs.data_type_id = l_feature_configs.data_type_id
        where l_feature_configs.feature_id = {fid}
        ) datas
        on datas.property_id = l.property_id
    """.format(
        fid=fid
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


def _geo_json_convert_geom(geojson):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom = ''.join(geom)
        geom = GEOSGeometry(geom).hex
        geom = geom.decode("utf-8")

        geom = ''.join(geom)
        geom = GEOSGeometry(geom)
        geom_type = GEOSGeometry(geom).geom_type
        if geom_type == 'Point':
            geom = MultiPoint(geom, srid=4326)
        if geom_type == 'LineString':
            geom = MultiLineString(geom, srid=4326)
        if geom_type == 'Polygon':
            geom = MultiPolygon(geom, srid=4326)
        return geom
    return None


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def create(request, payload):

    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json')
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    org = get_object_or_404(Org, pk=employee.org_id)

    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_CREATE, geo_json)
    if not success:
        return JsonResponse({'success': success, 'info': info})

    form_json = check_form_json(fid, form_json, employee)
    geo_json = json.dumps(geo_json, ensure_ascii=False)
    ChangeRequest.objects.create(
            old_geo_id=None,
            new_geo_id=None,
            theme_id=tid,
            package_id=pid,
            feature_id=fid,
            org=org,
            employee=employee,
            state=ChangeRequest.STATE_NEW,
            kind=ChangeRequest.KIND_CREATE,
            form_json=form_json,
            geo_json=geo_json,
            order_at=order_at,
            order_no=order_no,
    )

    rsp = {
        'success': True,
        'info': "Хүсэлт амжилттай үүслээ",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def remove(request, payload):
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    form_json = payload.get('form_json')
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
    org = get_object_or_404(Org, pk=employee.org_id)

    geo_data = _get_geom(old_geo_id, fid)
    if not geo_data:
        rsp = {
            'success': False,
            'info': "Аль хэдийн устсан геом байна.",
        }
        return JsonResponse(rsp)

    geo_data = geo_data[0]["geom"]
    geo_json = get_geoJson(geo_data)
    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_REMOVE, geo_json['geometry'])

    if not success:
        return JsonResponse({'success': success, 'info': info})

    ChangeRequest.objects.create(
            old_geo_id=old_geo_id,
            new_geo_id=None,
            theme_id=tid,
            package_id=pid,
            feature_id=fid,
            org=org,
            employee=employee,
            state=ChangeRequest.STATE_NEW,
            kind=ChangeRequest.KIND_DELETE,
            form_json=None,
            geo_json=None,
            order_at=order_at,
            order_no=order_no,
    )

    rsp = {
        'success': True,
        'info': "Хүсэлт амжилттай үүслээ",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def update(request, payload):
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json') or ''
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
    org = get_object_or_404(Org, pk=employee.org_id)

    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_REMOVE, geo_json)
    if not success:
        return JsonResponse({'success': success, 'info': info})

    form_json = check_form_json(fid, form_json, employee)
    geo_json = json.dumps(geo_json, ensure_ascii=False)

    ChangeRequest.objects.create(
            old_geo_id=old_geo_id,
            new_geo_id=None,
            theme_id=tid,
            package_id=pid,
            feature_id=fid,
            org=org,
            employee=employee,
            state=ChangeRequest.STATE_NEW,
            kind=ChangeRequest.KIND_UPDATE,
            form_json=form_json,
            geo_json=geo_json,
            order_at=order_at,
            order_no=order_no,
    )

    rsp = {
        'success': True,
        'info': "Хүсэлт амжилттай үүслээ",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def control_to_approve(request, payload):
    form_json = payload.get("values")
    change_request_id = payload.get("change_request_id")
    order_no = form_json['order_no']
    order_at = datetime.datetime.strptime(form_json['order_at'], '%Y-%m-%d').replace(tzinfo=datetime.timezone.utc)

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
    change_request = get_object_or_404(ChangeRequest, id=change_request_id)

    success, info = has_employee_perm(employee, change_request.feature_id, True, EmpPermInspire.PERM_UPDATE)
    if not success:
        return JsonResponse({'success': success, 'info': info})
    form_json = check_form_json(change_request.feature_id, form_json, employee)

    change_request.order_no = order_no
    change_request.order_at = order_at
    change_request.form_json = form_json
    change_request.state = ChangeRequest.STATE_NEW
    change_request.save()
    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def control_to_remove(request, payload):
    change_request_id = payload.get("change_request_id")
    get_object_or_404(ChangeRequest, id=change_request_id)
    ChangeRequest.objects.filter(id=change_request_id).delete()
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


def _check_and_make_form_json(feature_id, employee, values):
    form_json_list = list()
    code_list_values = ""
    perm_prop_ids = list()

    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    perm_qs = EmpPermInspire.objects
    perm_qs = perm_qs.filter(emp_perm=emp_perm)
    perm_qs = perm_qs.filter(feature_id=feature_id)
    perm_qs = perm_qs.filter(perm_kind=EmpPermInspire.PERM_CREATE)

    has_perm_geom = len(perm_qs.filter(geom=True)) > 0
    if has_perm_geom:
        perm_qs = perm_qs.filter(geom=False)
        perm_prop_ids = perm_qs.values_list('property_id', flat=True)

    for perm_prop in perm_prop_ids:
        prop_qs = LProperties.objects
        prop_qs = prop_qs.filter(property_id=perm_prop)
        prop_qs = prop_qs.first()

        form_json = dict()
        form_json['property_name'] = prop_qs.property_name
        form_json['property_id'] = prop_qs.property_id
        form_json['property_code'] = prop_qs.property_code
        form_json['property_definition'] = prop_qs.property_definition
        if prop_qs.value_type_id == 'single-select':
            code_list_values = _code_list_display(prop_qs.property_id)
        form_json['value_type_id'] = prop_qs.value_type_id
        form_json['value_type'] = prop_qs.value_type_id
        form_json['data_list'] = code_list_values
        form_json['data'] = ''

        for p_code, value in values.items():
            if p_code.lower() in prop_qs.property_name.lower():
                form_json['data'] = value
                if prop_qs.value_type_id == 'date':
                    form_json['data'] = utils.date_fix_format(value)

        form_json_list.append(form_json)

    form_json_list = json.dumps(form_json_list, ensure_ascii=False)
    return form_json_list


def _create_request(request_datas):
    change_request = ChangeRequest()

    change_request.old_geo_id = None
    change_request.new_geo_id = None
    change_request.theme_id = request_datas['theme_id']
    change_request.package_id = request_datas['package_id']
    change_request.feature_id = request_datas['feature_id']
    change_request.employee = request_datas['employee']
    change_request.org_id = request_datas['employee'].org.id
    change_request.state = request_datas['state']
    change_request.kind = request_datas['kind']
    change_request.form_json = request_datas['form_json'] if 'form_json' in request_datas else None
    change_request.geo_json = request_datas['geo_json'] if 'geo_json' in request_datas else None
    change_request.group_id = request_datas['group_id'] if 'group_id' in request_datas else None
    change_request.order_at = utils.date_to_timezone(request_datas['order_at']) if 'order_at' in request_datas else None
    change_request.order_no = request_datas['order_no'] if 'order_no' in request_datas else None

    change_request.save()
    return change_request.id


def _make_request(values, request_values):
    form_json_list = _check_and_make_form_json(
        request_values['feature_id'],
        request_values['employee'],
        values,
    )

    request_datas = {
        'theme_id': request_values['theme_id'],
        'package_id': request_values['package_id'],
        'feature_id': request_values['feature_id'],
        'employee': request_values['employee'],
        'state': ChangeRequest.STATE_NEW,
        'kind': request_values['kind'],
        'form_json': form_json_list,
        'geo_json': request_values['geo_json'],
        'order_at': request_values['order_at'],
        'order_no': request_values['order_no'],
        'group_id': request_values['group_id'],
    }

    success = _create_request(request_datas)
    info = 'Амжилттай хадгаллаа'

    return success, info


def _delete_file(for_delete_items, Sid=None):
    if Sid:
        transaction.savepoint_rollback(Sid)

    fileList = glob.glob(
        os.path.join(
            settings.BASE_DIR,
            'geoportal_app',
            'datas',
            for_delete_items.get('file_type_name'),
            for_delete_items.get('uniq_name')+'.*'
        )
    )
    for filePath in fileList:
        os.remove(filePath)


def _make_file_name(uniq_file_name, file_type_name):
    uniq_name = ''

    splited = uniq_file_name.split('.')
    splited.pop(len(splited)-1)

    for part_name in splited:
        uniq_name += part_name
    file_name = uniq_name + '.' + file_type_name

    return file_name, uniq_name


def _save_file_to_storage(file_type_name, uniq_file_name, fo):
    path = os.path.join(
        settings.BASE_DIR,
        'geoportal_app',
        'datas',
        file_type_name
    )
    fs = FileSystemStorage(
        location=path
    )
    file = fs.save(uniq_file_name, fo)
    fs.url(file)
    return path


def _check_file_for_geom(form_file_name, uniq_name, ext):
    return_name = ''
    file_type_name = ''
    uniq_file_name = ''

    # if ext == 'shp':
    #     exts = ['.shx', '.shp', '.prj', '.dbf', '.cpg']
    if ext == 'gml':
        exts = ['.gml', '.gfs']
    elif ext == 'geojson':
        exts = ['.geojson', '.gfs']

    for extension in exts:
        if extension in form_file_name:
            uniq_file_name = uniq_name + "_" + form_file_name
            file_type_name = ext
            return_name += form_file_name + ','

    return uniq_file_name, file_type_name, return_name


def _make_geo_id(feature_id):
    qs = LFeatures.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.first()
    feature_code = qs.feature_code
    new_geo_id = GEoIdGenerator(feature_id, feature_code).get()
    return new_geo_id


def _check_perm(employee, feature_id, geo_json):

    request_kind = ChangeRequest.KIND_CREATE
    perm_kind = EmpPermInspire.PERM_CREATE

    success, info = has_employee_perm(
                        employee,
                        feature_id,
                        True,
                        perm_kind,
                        geo_json
                    )

    return success, info, request_kind


def _check_type(val, geo_json_list):
    geo_json = val.geom.json
    geo_type = utils.json_dumps(geo_json)
    geo_json_load = utils.json_load(geo_type)
    geo_type = geo_json_load['type']
    geo_json_list.append(geo_type)
    return geo_json_list


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def file_upload_save_data(request, tid, pid, fid, ext):
    geo_json_list = list()
    data = MGeoDatas.objects.filter(feature_id=fid).first()
    geom_type = GEOSGeometry(data.geo_data).geom_type
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    files = request.FILES.getlist('data')
    order_at = request.POST.get('order_at')
    order_no = request.POST.get('order_no')
    feature_id = fid
    success = False
    info = ''
    main_request_id = None

    form = OrderForm(request.POST)
    if form.is_valid():
        uniq_name = str(uuid.uuid4())
        for fo in files:
            uniq_file_name, file_type_name, return_name = _check_file_for_geom(
                fo.name,
                uniq_name,
                ext
            )
            path = _save_file_to_storage(file_type_name, uniq_file_name, fo)

        file_name, uniq_name = _make_file_name(uniq_file_name, file_type_name)
        for_delete_items = {
            "uniq_name": uniq_name,
            "file_name": file_name,
            "file_type_name": file_type_name
        }

        ds_path = os.path.join(path, file_name)
        ds = DataSource(ds_path)

        if len(ds) <= 0:
            _delete_file(for_delete_items)
            rsp = {
                'success': False,
                'info': 'Source олдсонгүй'
            }
            return JsonResponse(rsp)

        layer = ds[0]
        if layer:
            if len(layer) > 1:
                with transaction.atomic():
                    Sid = transaction.savepoint()
                    request_datas = {
                        'theme_id': tid,
                        'package_id': pid,
                        'feature_id': feature_id,
                        'state': ChangeRequest.STATE_NEW,
                        'kind': ChangeRequest.KIND_CREATE,
                        'employee': employee,
                        'order_at': order_at,
                        'order_no': order_no,
                    }
                    main_request_id = _create_request(request_datas)
                    for val in layer:
                        values = dict()
                        for name in range(0, len(layer.fields)):
                            geo_json_list = _check_type(val, geo_json_list)

                        if all(geom_type in item for item in geo_json_list):
                            for name in range(0, len(layer.fields)):
                                field_name = val[name].name  # field name
                                value = val.get(name)  # value ni

                                if name == 0:

                                    # geo_id = _make_geo_id(feature_id)
                                    geo_json = val.geom.json  # goemetry json

                                    if geo_json:
                                        success, info, request_kind = _check_perm(
                                            employee,
                                            feature_id,
                                            geo_json
                                        )

                                        if not success:
                                            _delete_file(for_delete_items, Sid)
                                            rsp = {
                                                'success': success,
                                                'info': info,
                                            }
                                            return JsonResponse(rsp)

                                    else:
                                        _delete_file(for_delete_items, Sid)
                                        rsp = {
                                            'success': False,
                                            'info': 'ямар нэгэн зурагдсан дата байхгүй байна'
                                        }
                                        return JsonResponse(rsp)

                                values[field_name] = value

                            request_values = {
                                'theme_id': tid,
                                'package_id': pid,
                                'feature_id': fid,
                                'employee': employee,
                                'geo_json': geo_json,
                                'kind': request_kind,
                                'order_at': order_at,
                                'order_no': order_no,
                                'group_id': main_request_id,
                            }
                            success, info = _make_request(values, request_values)
                            if not success:
                                _delete_file(for_delete_items, Sid)
                                break
                        else:
                            _delete_file(for_delete_items, Sid)
                            rsp = {
                                'success': False,
                                'info': "Геометр өгөгдлийн төрөл нь тухайн feature-ийн төрөлтэй таарахгүй байна!!!."
                            }
                            return JsonResponse(rsp)
                    rsp = {
                        'success': success,
                        'info': info
                    }
            else:
                with transaction.atomic():
                    Sid = transaction.savepoint()
                    val = layer[0]
                    values = dict()
                    for name in range(0, len(layer.fields)):
                        geo_json_list = _check_type(val, geo_json_list)

                    if all(geom_type in item for item in geo_json_list):
                        for name in range(0, len(layer.fields)):
                            field_name = val[name].name  # field name
                            value = val.get(name)  # value ni

                            if name == 0:

                                # geo_id = _make_geo_id(feature_id)
                                geo_json = val.geom.json  # goemetry json

                                if geo_json:
                                    success, info, request_kind = _check_perm(
                                        employee,
                                        feature_id,
                                        geo_json
                                    )

                                    if not success:
                                        _delete_file(for_delete_items, Sid)
                                        rsp = {
                                            'success': success,
                                            'info': info,
                                        }
                                        return JsonResponse(rsp)

                                else:
                                    _delete_file(for_delete_items, Sid)
                                    rsp = {
                                        'success': False,
                                        'info': 'ямар нэгэн зурагдсан дата байхгүй байна'
                                    }
                                    return JsonResponse(rsp)

                            values[field_name] = value

                        request_values = {
                            'theme_id': tid,
                            'package_id': pid,
                            'feature_id': fid,
                            'employee': employee,
                            'geo_json': geo_json,
                            'kind': request_kind,
                            'order_at': order_at,
                            'order_no': order_no,
                            'group_id': main_request_id,
                        }
                        success, info = _make_request(values, request_values)
                        if not success:
                            _delete_file(for_delete_items, Sid)
                            rsp = {
                                'success': success,
                                'info': info,
                            }
                            return JsonResponse(rsp)
                        rsp = {
                            'success': success,
                            'info': info
                        }
                    else:
                        _delete_file(for_delete_items, Sid)
                        rsp = {
                            'success': False,
                            'info': "Геометр өгөгдлийн төрөл нь тухайн feature-ийн төрөлтэй таарахгүй байна!!!."
                        }
                        return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Дата байхгүй байна."
            }
    else:
        rsp = {
            'success': False,
            'errors': form.errors,
        }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_qgis_url(request, fid):
    emp = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    qgis_local_base_url = get_config('qgis_local_base_url')
    url = '{qgis_local_base_url}/api/qgis/{token}/{fid}/'.format(qgis_local_base_url=qgis_local_base_url, token=emp.token, fid=fid),
    rsp = {
        'success': True,
        'wms_url': url,
        'wfs_url': url,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_api_url(request):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    rsp = {
        'success': True,
        'api_links': {
            'token_auth': request.build_absolute_uri(reverse('api:inspire:token-auth')),
            'create': request.build_absolute_uri(reverse('api:inspire:create')),
            'remove': request.build_absolute_uri(reverse('api:inspire:remove')),
            'update': request.build_absolute_uri(reverse('api:inspire:update')),
            'select': request.build_absolute_uri(reverse('api:inspire:select'))
        }
    }
    return JsonResponse(rsp)


def _make_layer_code(feature):
    feature_code = feature.feature_code
    theme_code = feature_code.split('-')[0]
    code = 'gp_' + theme_code + ':' + utils.make_layer_name(utils.make_view_name(feature))

    return code


@require_GET
@ajax_required
@gov_required
@login_required(login_url='/gov/secure/login/')
def get_layers(request):
    user = request.user
    employee = get_object_or_404(Employee, user=user)
    perm = employee.empperm_set.first()
    feature_ids = perm.empperminspire_set.distinct('feature_id').values_list('feature_id', flat=True)
    layer_choices = list()

    qs_feature = LFeatures.objects
    qs_feature =qs_feature.filter(feature_id__in=feature_ids)
    qs_feature = qs_feature.order_by('feature_id')

    for feature in qs_feature:
        data = dict()
        data['name'] = feature.feature_name
        data['code'] = _make_layer_code(feature)
        layer_choices.append(data)

    rsp = {
        "success": True,
        "layer_choices": layer_choices,
    }

    return JsonResponse(rsp)
