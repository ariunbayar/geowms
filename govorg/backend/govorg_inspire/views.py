import os
import json
import datetime
import uuid
import glob
import random
from geojson import Feature, FeatureCollection

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.gdal.error import GDALException
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import MultiPoint
from django.contrib.gis.geos import MultiLineString
from django.contrib.gis.geos import MultiPolygon
from django.contrib.gis.geos.error import GEOSException
from django.core.files.storage import FileSystemStorage
from django.db import connections
from django.db.utils import InternalError
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.dedsanbutets.models import ViewNames
from backend.inspire.models import EmpPerm
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import LCodeListConfigs
from backend.inspire.models import LCodeLists
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LProperties
from backend.inspire.models import LValueTypes
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.org.models import Employee
from govorg.backend.org_request.models import ChangeRequest
from govorg.backend.org_request.views import _get_geom
from govorg.backend.org_request.views import _get_geoJson
from govorg.backend.org_request.views import _convert_text_json
from main.decorators import ajax_required
from main.utils import check_form_json
from main.utils import dict_fetchall
from main.utils import get_config
from main.utils import gis_fields_by_oid
from main.utils import gis_insert
from main.utils import gis_tables_by_oids
from main.utils import has_employee_perm
from main.utils import refreshMaterializedView


def _get_changeset_display(ob):

    geom = ob.geom.replace("\'", "\"")
    geom1 = geom[:9]
    geom2 = geom[10:-2]
    geom3 = geom[-1]
    geom4 = geom1 + geom2 +geom3
    values_list = json.loads(geom4)
    coordinates = values_list['geom']['coordinates']
    geom_type = values_list['geom']['type']

    return {
        'coordinate':coordinates,
        'geom_type':geom_type,
        'changeset_id':ob.id,
        'changeset_attributes':ob.features,
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
def changeset_all(request):

    changeset_list = [_get_changeset_display(ob) for ob in ChangeSet.objects.all()]
    features = [_get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]
    feature_collection = FeatureCollection(features)
    rsp = {
        'GeoJson': feature_collection,
    }
    return JsonResponse(rsp)


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
        'roles':inspire_roles,
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
       data_list =  _code_list_display(lproperties.property_id)
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
        'pk':ob.get('id'),
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

def _get_emp_property_roles(employee, fid):

    property_ids = []
    property_details = []
    property_roles = {'PERM_VIEW': False, 'PERM_CREATE':False, 'PERM_REMOVE':False, 'PERM_UPDATE':False, 'PERM_APPROVE':False, 'PERM_REVOKE':False}

    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()

    property_perms = EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=fid).distinct('property_id', 'perm_kind').exclude(property_id__isnull=True).values('property_id', 'perm_kind')
    if property_perms:
        for prop in property_perms:
            if prop.get('property_id') not in property_ids:
                property_ids.append(prop.get('property_id'))
        for property_id in property_ids:
            for prop in property_perms:
                if property_id == prop['property_id']:
                    if prop.get('perm_kind') == EmpPermInspire.PERM_VIEW:
                        property_roles['PERM_VIEW'] = True
                    if prop.get('perm_kind') == EmpPermInspire.PERM_CREATE:
                        property_roles['PERM_CREATE'] = True
                    if prop.get('perm_kind') == EmpPermInspire.PERM_REMOVE:
                        property_roles['PERM_REMOVE'] = True
                    if prop.get('perm_kind') == EmpPermInspire.PERM_UPDATE:
                        property_roles['PERM_UPDATE'] = True
                    if prop.get('perm_kind') == EmpPermInspire.PERM_APPROVE:
                        property_roles['PERM_APPROVE'] = True
                    else:
                        property_roles['PERM_REVOKE'] = True

            property_details.append({
                'property_id': property_id,
                'roles':property_roles
            })

    return property_ids, property_details


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, gid, fid, tid):
    property_ids = []
    properties = []
    employee = get_object_or_404(Employee, user__username=request.user)
    property_ids, property_details = _get_emp_property_roles(employee, fid)
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
        'pk':'',
        'value_text':'',
        'value_date':'',
        'value_number':''
        }
    employee = get_object_or_404(Employee, user__username=request.user)
    property_ids, property_roles = _get_emp_property_roles(employee, fid)

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
        geom =  ''.join(geom)
        geom = GEOSGeometry(geom).hex
        geom = geom.decode("utf-8")

        geom =  ''.join(geom)
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
def geomAdd(request, payload, fid):

    geojson = payload.get('geojson')
    geom = _geo_json_convert_geom(geojson)
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
            'id': None
        }
        return JsonResponse(rsp)
    count = random.randint(1062, 9969)
    geo_id = str(fid) + str(count) + 'geo'
    MGeoDatas.objects.create(geo_id=geo_id, geo_data=geom, feature_id=fid, created_by=1, modified_by=1)
    fields = get_rows(fid)
    for field in fields:
        MDatas.objects.create(
            geo_id = geo_id,
            feature_config_id = field['feature_config_id'],
            data_type_id = field['data_type_id'],
            property_id = field['property_id'],
            created_by = 1,
            modified_by = 1
        )
    refreshMaterializedView(fid)
    rsp = {
        'success': True,
        'info': "Ажилттай ",
        'id': geo_id
    }
    return JsonResponse(rsp)


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
    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_CREATE, geo_json)
    if not success:
        return JsonResponse({'success': success, 'info': info})

    form_json = check_form_json(fid, form_json, employee)
    ChangeRequest.objects.create(
            old_geo_id = None,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = ChangeRequest.STATE_NEW,
            kind = ChangeRequest.KIND_CREATE,
            form_json = form_json,
            geo_json = geo_json,
            order_at=order_at,
            order_no=order_no,
    )

    rsp = {
        'success': True,
        'info': "Хүсэлт амжилттай үүслээ",
    }
    return JsonResponse(rsp)


def _create_revoke_request(employee, payload):

    theme_id = payload.get('tid')
    package_id = payload.get('pid')
    feature_id = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    geo_json = payload.get('geo_json')
    form_json = payload.get('form_json')
    order_no = payload.get('order_no')
    order_at = payload.get('order_at')

    form_json = check_form_json(feature_id, form_json, employee)

    change_request = ChangeRequest()
    change_request.old_geo_id = old_geo_id
    change_request.new_geo_id = None
    change_request.theme_id = theme_id
    change_request.package_id = package_id
    change_request.feature_id = feature_id
    change_request.employee = employee
    change_request.state = ChangeRequest.STATE_NEW
    change_request.kind = ChangeRequest.KIND_REVOKE
    change_request.form_json = form_json
    change_request.geo_json = geo_json
    change_request.order_at = order_at
    change_request.order_no = order_no
    change_request.save()

    return change_request


@require_POST
@ajax_required
def revoke_new(request, payload):
    employee = get_object_or_404(Employee, user=request.user)

    success, info = has_employee_perm(employee, payload.get('fid'), True, EmpPermInspire.PERM_REVOKE, payload.get('geo_json'))
    if success:
        _create_revoke_request(employee, payload)
        info = "Цуцлах хүсэлт амжилттай үүслээ"

    return JsonResponse({ 'success': success, 'info': info })


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
    geo_data = _get_geom(old_geo_id, fid)
    geo_data = _convert_text_json(geo_data[0]["geom"])
    geo_json = _get_geoJson(geo_data)
    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_REMOVE, geo_json['geometry'])

    if not success:
        return JsonResponse({'success': success, 'info': info})

    ChangeRequest.objects.create(
            old_geo_id = old_geo_id,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = ChangeRequest.STATE_NEW,
            kind = ChangeRequest.KIND_DELETE,
            form_json = None,
            geo_json = None,
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
    success, info = has_employee_perm(employee, fid, True, EmpPermInspire.PERM_REMOVE, geo_json)
    if not success:
        return JsonResponse({'success': success, 'info': info})

    form_json = check_form_json(fid, form_json, employee)
    ChangeRequest.objects.create(
            old_geo_id = old_geo_id,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = ChangeRequest.STATE_NEW,
            kind = ChangeRequest.KIND_UPDATE,
            form_json = form_json,
            geo_json = geo_json,
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


def _make_value_json(val_type, property, value, geo_id, feature_config_id, data_type_id):
    datas = {}
    code_value = None
    if val_type == 'single-select':
        code_list_values = LCodeLists.objects.filter(property_id=property.property_id, code_list_code=value)
        for code_list_value in code_list_values:
            if code_list_value.code_list_code.lower() == value.lower():
                code_value = code_list_value.code_list_id
    for i in MDatas._meta.get_fields():
        if 'value' in i.name:
            datas[i.name] = None
            out = i.name.split('_')
            type_name = 1
            if out[type_name] == 'date' and val_type == 'date':
                if '/' in value:
                    dt = value.split('/')
                    value = dt[0] + "-" + dt[1] + '-' + dt[2]
            if out[type_name] == val_type:
                datas[i.name] = value
        else:
            if i.name == 'geo_id':
                datas[i.name] = geo_id
            if i.name == 'data_type_id':
                datas[i.name] = data_type_id
            if i.name == 'property_id':
                datas[i.name] = property.property_id
            if i.name == 'feature_config_id':
                datas[i.name] = feature_config_id
            if i.name == 'code_list_id':
                datas[i.name] = code_value
            if i.name == 'created_by':
                datas[i.name] = 1
            if i.name == 'modified_by':
                datas[i.name] = 1
    return datas


def _save_to_m_data(values, geo_id, feature_id):
    feature_config_id = None
    success = False
    info = ''
    data_type_id = None
    try:

        feature_config = LFeatureConfigs.objects.filter(feature_id=feature_id).first()
        if feature_config:
            feature_config_id = feature_config.feature_config_id
            data_type_id = feature_config.data_type_id

        for j in values:
            for key, value in j.items():
                prop = LProperties.objects.filter(property_code__icontains=key).first()
                if prop:
                    value_types = LValueTypes.objects.filter(value_type_id=prop.value_type_id)
                    for value_type in value_types:
                        val_type = value_type.value_type_id

                        if val_type == 'boolean':
                            success = False
                            info = "Алдаа гарсан байна: " + val_type + ' буруу байна'
                            return success, info
                        datas = _make_value_json(val_type, prop, value, geo_id, feature_config_id, data_type_id)

                        qs = MDatas.objects.filter(geo_id=geo_id, property_id=prop.property_id, feature_config_id=feature_config_id)
                        if qs:
                            qs = qs.update(**datas)
                        else:
                            qs = MDatas.objects.create(**datas)

        success = True
        info = 'Амжилттай хадгалалаа'

    except Exception as e:
        success = False
        info = 'Алдаа ' + str(e)

    return success, info


def _delete_file(for_delete_items):
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


def _delete_db(geo_id):
    success = False
    deleted_db_info = ''
    try:
        if geo_id:
            delete_geos = MGeoDatas.objects.filter(geo_id=geo_id)
            if delete_geos:
                for geo in delete_geos:
                    geo.delete()
            delete_main_datas = MDatas.objects.filter(geo_id=geo_id)
            if delete_main_datas:
                for data in delete_main_datas:
                    data.delete()
            success = True
    except Exception as e:
        deleted_db_info = "Устгах явцад алдаа гарсан " + str(e)
    return success, deleted_db_info


def _remove_uploaded_file(geo_id, for_delete_items, info, success):
    success, deleted_db_info = _delete_db(geo_id)
    _delete_file(for_delete_items)
    rsp = {
        'success': success,
        'info': deleted_db_info if deleted_db_info else info
    }
    return rsp


def _make_file_name(file_name, file_type_name):
    uniq_name = file_name.split('.')[0]
    if '.shx' in file_name or '.shp' in file_name or '.prj' in file_name or '.dbf' in file_name or '.cpg' in file_name:
        file_name = uniq_name + '.' + file_type_name
    if '.gml' in file_name or '.gfs' in file_name:
        file_name = uniq_name + '.' + file_type_name
    if '.geojson' in file_name:
        file_name = uniq_name + '.' + file_type_name
    return file_name, uniq_name


def _save_file_to_storage(file_type_name, file_name, fo):
    path = os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas', file_type_name)
    fs = FileSystemStorage(
        location=path
    )
    file = fs.save(file_name, fo)
    fs.url(file)
    return path


def _check_file_for_geom(form_file_name, unique_filename):
    return_name = ''
    file_type_name = ''
    file_name = ''
    if '.shx' in form_file_name or '.shp' in form_file_name or '.prj' in form_file_name or '.dbf' in form_file_name or '.cpg' in form_file_name:
        file_name = unique_filename + form_file_name
        file_type_name = 'shp'
        return_name += form_file_name + ','
    elif '.gml' in form_file_name or '.gfs' in form_file_name:
        file_type_name = 'gml'
        file_name = unique_filename + form_file_name
        return_name += form_file_name + ','
    elif '.geojson' in form_file_name or '.gfs' in form_file_name:
        file_type_name = 'geojson'
        file_name = unique_filename + form_file_name
        return_name += form_file_name + ','
    return file_name, file_type_name, return_name


def _geom_to_multi(geom, geom_type, SRID):
    geom = None
    if geom_type == 'Point':
        geom = MultiPoint(geom, srid=SRID) # Pointiig MultiPoint bolgoj bna
    if geom_type == 'LineString':
        geom = MultiLineString(geom, srid=SRID) # LineString MultiLineString bolgoj bna
    if geom_type == 'Polygon':
        geom = MultiPolygon(geom, srid=SRID) # Polygon MultiPolygon bolgoj bna
    return geom


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def file_upload_save_data(request, tid, fid):
    employee = get_object_or_404(Employee, user=request.user)
    form = request.FILES.getlist('data')
    feature_id = fid
    geo_id = ''

    try:
        unique_filename = str(uuid.uuid4())
        for fo in form:
            file_name, file_type_name, return_name = _check_file_for_geom(fo.name, unique_filename)
            if not file_name:
                file_name = fo.name
            if file_type_name:
                path = _save_file_to_storage(file_type_name, file_name, fo)

        file_name, uniq_name = _make_file_name(file_name, file_type_name)

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
        for val in layer:
            values = []
            try:
                for name in range(0, len(layer.fields)):
                    field_name = val[name].name # field name

                    value = val.get(name) # value ni
                    if name == 0:
                        if field_name == 'geo_id':
                            geo_id = value
                        else:
                            g_id = val.get(name)
                            need_id = MGeoDatas.objects.count()
                            geo_id = str(need_id) + str(g_id)
                        geom = ''
                        geom_type = ''
                        SRID = 4326
                        dim = val.geom.coord_dim # dimension
                        geo_json = val.geom.json # goemetry json
                        if geo_json:
                            geom_srid = GEOSGeometry(geo_json).srid # geomiin srid
                            if geom_srid != SRID:
                                geom = GEOSGeometry(geo_json, srid=SRID)
                            if dim == 3:
                                geom_type = GEOSGeometry(geo_json).geom_type # geom iin type
                                geom = GEOSGeometry(geo_json).hex
                                geom = geo_json.decode("utf-8") # binary hurwuuleh
                                geom = GEOSGeometry(geom)
                                geom = _geom_to_multi(geom, geom_type, SRID)
                            if dim == 2:
                                geom = _geo_json_convert_geom(geo_json)
                            if geom:
                                geo = MGeoDatas.objects.filter(geo_id=geo_id)
                                if geo:
                                    success, info = has_employee_perm(employee, feature_id, True, EmpPermInspire.PERM_UPDATE, geo_json)
                                    if not success:
                                        _delete_file(for_delete_items)
                                        return JsonResponse({'success': success, 'info': info})

                                    geo = geo.update(geo_data=geom)

                                else:

                                    success, info = has_employee_perm(employee, feature_id, True, EmpPermInspire.PERM_CREATE, geo_json)
                                    if not success:
                                        _delete_file(for_delete_items)
                                        return JsonResponse({'success': success, 'info': info})

                                    geo = MGeoDatas.objects.create(
                                        geo_id=geo_id,
                                        geo_data=geom,
                                        feature_id=feature_id,
                                        created_by=1,
                                        modified_by=1,
                                    )
                        else:
                            info = 'geom байхгүй дата'
                            rsp = _remove_uploaded_file(geo_id, for_delete_items, info, False)
                            return JsonResponse(rsp)

                    values.append({
                        field_name: value,
                    })

            except InternalError as e:
                return_info = return_name + '-д Алдаа гарсан байна: UTM байгаа тул болохгүй'
                rsp = _remove_uploaded_file(geo_id, for_delete_items, return_info, False)
            except GEOSException as e:
                return_info = return_name + '-д Алдаа гарсан байна: Geometry утга нь алдаатай байна'
                rsp = _remove_uploaded_file(geo_id, for_delete_items, return_info, False)

            success, info = _save_to_m_data(values, geo_id, feature_id)
            if not success:
                rsp = _remove_uploaded_file(geo_id, for_delete_items, info, success)
                return JsonResponse(rsp)
            else:
                refreshMaterializedView(feature_id)
                rsp = {
                    'success': success,
                    'info': info,
                }

    except GDALException as e:
        _delete_file(for_delete_items)
        rsp = {
            'success': False,
            'info': return_name + '-д Алдаа гарсан байна: файлд алдаа гарсан тул файлаа шалгана уу'
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
