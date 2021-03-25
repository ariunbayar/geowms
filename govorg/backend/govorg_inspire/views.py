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

from backend.dedsanbutets.models import ViewNames
from backend.dedsanbutets.models import ViewProperties
from backend.inspire.models import EmpPerm
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import LCodeListConfigs
from backend.inspire.models import LCodeLists
from backend.inspire.models import LProperties
from backend.inspire.models import LFeatures
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.org.models import Employee, Org, NemaWMS

from govorg.backend.org_request.models import ChangeRequest
from govorg.backend.org_request.views import _get_geom

from main.utils import get_geoJson
from main.decorators import ajax_required
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
from backend.config.models import CovidConfig



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
def getRoles(request, fid):

    inspire_roles = {'PERM_VIEW': False, 'PERM_CREATE':False, 'PERM_REMOVE':False, 'PERM_UPDATE':False, 'PERM_APPROVE':False, 'PERM_REVOKE':False}

    employee = get_object_or_404(Employee, user__username=request.user)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
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
    view_name_ob = ViewNames.objects.filter(feature_id=fid).first()
    employee = get_object_or_404(Employee, user=request.user)
    rsp = {
        'success': False,
        'url': '',
        'code': '',
    }
    if view_name_ob:
        rsp = {
            'success': True,
            'url': request.build_absolute_uri(reverse('api:service:qgis-proxy', args=[employee.token])),
            'code': 'gp_layer_' + view_name_ob.view_name,
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
    code_list_values = []
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


def _get_type(value_type_id):
    if value_type_id == 'number':
        value_type = 'number'
    elif value_type_id == 'double':
        value_type = 'number'
    elif value_type_id == 'multi-text':
        value_type = 'text'
    elif value_type_id == 'text':
        value_type = 'text'
    elif value_type_id == 'date':
        value_type = 'date'
    elif value_type_id == 'link':
        value_type = 'text'
    elif value_type_id == 'boolean':
        value_type = 'text'
    else:
        value_type = 'option'
    return value_type


def _get_property(ob, roles, lproperties):

    data = ''
    value_type = ''
    data_list = []
    property_roles = {'PERM_VIEW': False, 'PERM_CREATE':False, 'PERM_REMOVE':False, 'PERM_UPDATE':False, 'PERM_APPROVE':False, 'PERM_REVOKE':False}
    value_type = _get_type(lproperties.value_type_id)

    if value_type == 'option':
        data_list = _code_list_display(lproperties.property_id)
    elif value_type == 'text':
        data = ob.get('value_text') or ''
    elif value_type == 'number':
        data = ob.get('value_number') or ''
    else:
        data = _datetime_display(ob.get('value_date') or '')

    for role in roles:
        if role.get('property_id') == lproperties.property_id:
            property_roles = role.get('roles')

    return {
        'pk': ob.get('id'),
        'property_name': lproperties.property_name,
        'property_id': lproperties.property_id,
        'property_code': lproperties.property_code,
        'property_definition': lproperties.property_definition,
        'value_type_id': lproperties.value_type_id,
        'value_type': value_type,
        'data': data,
        'data_list': data_list,
        'roles': property_roles
    }


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, gid, fid, tid):
    property_ids = []
    properties = []
    employee = get_object_or_404(Employee, user__username=request.user)
    property_ids, property_details = get_emp_property_roles(employee, fid)
    if property_ids:
        mdatas = MDatas.objects.filter(geo_id=gid).filter(property_id__in=property_ids).values('property_id', 'value_text', 'value_number', 'value_date', 'id')
        for prop in mdatas:
            lproperty = LProperties.objects.filter(property_id=prop.get('property_id')).first()
            properties.append(_get_property(prop, property_details, lproperty))
    rsp = {
        'success': True,
        'datas': properties
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detailCreate(request, tid, pid, fid):
    property_ids = []
    property_roles = []
    org_propties_front = []
    value_data = {
        'pk': '',
        'value_text': '',
        'value_date': '',
        'value_number': ''
        }
    employee = get_object_or_404(Employee, user__username=request.user)
    property_ids, property_roles = get_emp_property_roles(employee, fid)

    if property_ids:
        for prop in property_ids:
            lproperty = LProperties.objects.filter(property_id=prop).first()
            org_propties_front.append(_get_property(value_data, property_roles, lproperty))
    rsp = {
        'success': True,
        'datas': org_propties_front
    }
    return JsonResponse(rsp)


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

    employee = get_object_or_404(Employee, user=request.user)
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

    employee = get_object_or_404(Employee, user__username=request.user)
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

    employee = get_object_or_404(Employee, user__username=request.user)
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

    employee = get_object_or_404(Employee, user__username=request.user)
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


def _check_and_make_form_json(feature_id, values):
    form_json_list = list()
    code_list_values = ""

    view_qs = ViewNames.objects
    view_qs = view_qs.filter(feature_id=feature_id)
    view = view_qs.first()

    view_props = ViewProperties.objects.filter(view=view)

    for view_prop in view_props:
        prop_qs = LProperties.objects
        prop_qs = prop_qs.filter(property_id=view_prop.property_id)
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
        values
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
            for_delete_items.get('file_name')+'.*'
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

    if ext == 'shp':
        exts = ['.shx', '.shp', '.prj', '.dbf', '.cpg']
    elif ext == 'gml':
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


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def file_upload_save_data(request, tid, pid, fid, ext):
    employee = get_object_or_404(Employee, user=request.user)
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

                    rsp = {
                        'success': success,
                        'info': info
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
def get_qgis_url(request):
    emp = get_object_or_404(Employee, user=request.user)
    qgis_local_base_url = get_config('qgis_local_base_url')
    rsp = {
        'success': True,
        'wms_url': '{qgis_local_base_url}/api/service/{token}/'.format(qgis_local_base_url=qgis_local_base_url, token=emp.token),
        'wfs_url': '{qgis_local_base_url}/api/service/{token}/'.format(qgis_local_base_url=qgis_local_base_url, token=emp.token),
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_api_url(request):
    employee = get_object_or_404(Employee, user=request.user)
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


def _get_nema_code(code):
    rows = []
    cursor = connections['nema'].cursor()
    sql = """
      select layer_name from _layer where layer_id = '{code}'
    """.format(
        code=code
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


def _check_nema_details(nema_detial_list):
    layer_name = ''
    if isinstance(nema_detial_list, list):
        layer_name = nema_detial_list[0].get('layer_name')
    elif isinstance(nema_detial_list, dict):
        layer_name = nema_detial_list.get('layer_name')
    return layer_name


def _get_layer_names(item):
    nema_code_list = []
    layer_code = item.get('code') if isinstance(item, dict) else item[0].get('code')
    nema_base_layer = _get_nema_code(layer_code)
    if(nema_base_layer):
        layer_name = _check_nema_details(nema_base_layer)

    return layer_name


def _get_nema_status(item):
    id = item.get('id') if isinstance(item, dict) else item[0].get('id')
    nema_items = NemaWMS.objects.filter(id=id).first()
    nema_status = nema_items.get_is_open_display()
    return nema_status


def _get_created_by(item):
    id = item.get('created_by') if isinstance(item, dict) else item[0].get('created_by')
    user = User.objects.filter(id=id).first()
    return user.first_name if user else  id


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def nema_list(request, payload):
    оруулах_талбарууд = ['id', 'code', 'created_at', 'is_open', 'created_by']

    нэмэлт_талбарууд = [
        {"field": "is_open", "action": _get_nema_status},
        {"field": "created_by", "action": _get_created_by},
        {"field": "code", "action": _get_layer_names},
    ]

    datatable = Datatable(
        model=NemaWMS,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд,
        нэмэлт_талбарууд=нэмэлт_талбарууд
    )

    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page
    }

    return JsonResponse(rsp)



@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def create_nema(request, payload):
    values = payload.get('values')
    layer_code = values.get('code')
    is_open = values.get('is_open')
    id = payload.get('id')

    user = User.objects.filter(username=request.user).first()
    errors = {}

    if not layer_code:
        errors['code'] = 'Давхаргын code оруулна уу'
        return JsonResponse({
            'success': False,
            'info': 'Давхаргын code оруулна уу',
            'errors': errors
        })

    nema_detial_list = _get_nema_code(layer_code)
    if not nema_detial_list:
        return JsonResponse({
            'success': False,
            'info': '{code} нэртэй давхаргын code олдсонгүй !!!.'.format(code=layer_code),
        })

    layer_state = False
    nema = NemaWMS.objects.filter(code=layer_code).first()
    if not id:
        if nema:
            return JsonResponse({
                    'success': False,
                    'info': '{code} нэртэй давхарга бүртгэлтэй байна !!!.'.format(code=layer_code),
                })
    if id:
        nema = NemaWMS.objects.filter(id=id).first()
        if nema.code !=layer_code:
            if nema:
                return JsonResponse({
                    'success': False,
                    'info': '{code} нэртэй давхарга бүртгэлтэй байна !!!.'.format(code=layer_code),
                })


    layer_name = _check_nema_details(nema_detial_list)

    wms = WMS.objects.filter(name__iexact='NEMA').first()
    if not wms:
        return JsonResponse({
            'success': False,
            'info': 'Геопортал дээр WMS бүртгэлгүй байна !!!.',
        })

    wms_layer = wms.wmslayer_set.filter(code=layer_code).first()

    if wms_layer:
        wms_layer.title = layer_name
        wms_layer.code = layer_code
        wms_layer.name = layer_name
        wms_layer.save()

    else:
        wms_layer = WMSLayer.objects.create(
                        name=layer_name,
                        code=layer_code,
                        wms=wms,
                        title=layer_name,
                        feature_price=0,
        )

    if not nema:
        NemaWMS.objects.create(
            is_open=is_open,
            code=layer_code,
            created_by=user.id
        )
    else:
        nema.code=layer_code
        nema.is_open=is_open
        nema.save()

    return JsonResponse({
        'success': True,
        'info': "Амжилттай хадгалагдлаа"
    })

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def nema_detail(request, pk):
    nema_detail_list = []
    bundle = utils.get_config('bundle', CovidConfig)
    wms_qs = WMS.objects.filter(name__exact='nema').first()
    nema_detail = list(NemaWMS.objects.filter(id=pk).values('code', 'id', 'created_by', 'created_at', 'is_open'))
    url = reverse('api:service:wms_proxy', args=(bundle, wms_qs.pk, 'wms'))
    user_id = nema_detail[0]['created_by']
    nema_detail_list.append({
        'code': nema_detail[0]['code'],
        'layer_name': _get_layer_names(nema_detail),
        'is_open': nema_detail[0]['is_open'],
        'created_by': User.objects.filter(id=user_id).first().first_name,
        'created_at': utils.datetime_to_string(nema_detail[0]['created_at']),
        'user_id': user_id,
    })

    return JsonResponse({
        'nema_detail_list':nema_detail_list,
        'url': url
        })


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def nema_remove(request, pk):

    nema = NemaWMS.objects.filter(id=pk).first()
    wms = WMS.objects.filter(name__iexact='NEMA').first()

    wms_layer = WMSLayer.objects.filter(code=nema.code, wms=wms).first()
    BundleLayer.objects.filter(layer=wms_layer).delete()
    wms_layer.delete()
    nema.delete()

    return JsonResponse({
        'success': True,
        'info': 'Ажилттай устгалаа'
    })



@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def update_c2405(request, payload):
    attr10 = payload.get('attr10')
    attr_layer = payload.get('attr_layer')
    cursor = connections['nema'].cursor()
    if not attr_layer:
        return JsonResponse({
            'success': True,
            'info': "Attribute хоосон байна"
        })

    sql = """
    UPDATE c2405
    set attr10='{attr10}'
    where
        attr1='{attr1}' and attr3='{attr3}' and
        attr4 = '{attr4}' and attr5='{attr5}' and attr7='{attr7}' and
        attr8 = '{attr8}' and attr9='{attr9}'
    """.format(
        attr1=str(attr_layer[4][1]),
        attr3=str(attr_layer[6][1]),
        attr4=str(attr_layer[7][1]),
        attr5=str(attr_layer[8][1]),
        attr7=str(attr_layer[10][1]),
        attr8=str(attr_layer[11][1]),
        attr9=str(attr_layer[12][1]),
        attr10=attr10
    )
    cursor.execute(sql)
    return JsonResponse({
        'success': True,
        'info': "Амжилттай хадгалагдлаа"
    })


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_attr_details(request, payload):

    datas = payload.get('datas')
    table_name = datas[0][-1]
    cursor = connections['nema'].cursor()
    attributes_1_10 = []
    attr_10 = False
    attr_10_value = ''
    for attr in datas[0][0][1]:
        attr_1_19 = []
        if 'attr' in attr[0]:
            sql = """
                select
                    attr_name
                from
                    _attr
                where
                    attr_layer_id = '{table_name}' and attr_id='{attr}'
            """.format(
                table_name=table_name,
                attr = attr[0]
            )
            cursor.execute(sql)
            attr_name = list(cursor.fetchone())
            attr_1_19 = [attr_name[0], attr[1]]
            attributes_1_10.append(attr_1_19)

        else:
            attributes_1_10.append(attr)

        if attr[0] == 'attr10':
            attr_10_value = attr[1]
            attr_10 = True

    datas[0][0][1] = attributes_1_10
    return JsonResponse({
        'datas': datas,
        'attr10_status': attr_10,
        'attr_10_value': attr_10_value
    })