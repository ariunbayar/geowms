import os
import json
import datetime
import uuid
import glob
import random
from django.conf import settings
from django.db.utils import InternalError
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.db.models import Q

from django.views.decorators.http import require_GET, require_POST
from backend.inspire.models import (
    LThemes, 
    LPackages, 
    LFeatures, 
    MDatasBoundary, 
    MDatasGeographical, 
    MDatasCadastral,
    LDataTypeConfigs, 
    LFeatureConfigs, 
    LDataTypes, 
    LProperties, 
    LValueTypes, 
    LCodeListConfigs, 
    LCodeLists, 
    MGeoDatas, 
    MDatasBuilding, 
    MDatasHydrography, 
    EmpPerm, 
    EmpPermInspire
    )
from govorg.backend.org_request.models import ChangeRequest
from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString

from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import FileSystemStorage

from backend.changeset.models import ChangeSet
from backend.bundle.models import Bundle
from main.decorators import ajax_required, gov_bundle_required
from django.contrib.auth.decorators import user_passes_test
from django.contrib.gis.geos import GEOSGeometry, GeometryCollection, Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon, WKBWriter, WKBReader, fromstr
from backend.org.models import Org, Employee, InspirePerm

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.gdal import OGRGeometry
from django.contrib.gis.geos.error import GEOSException
from django.contrib.gis.gdal.error import GDALException
from govorg.backend.org_request.views import _get_geom, _get_geoJson, _convert_text_json

from main.utils import (
    gis_delete,
    gis_fetch_one,
    gis_fields_by_oid,
    gis_insert,
    gis_table_by_oid,
    gis_tables_by_oids,
    dict_fetchall,
    refreshMaterializedView
)


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


def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': list(LFeatures.objects.filter(package_id=package.package_id).extra(select={'id': 'feature_id', 'code': 'feature_code', 'name': 'feature_name'}).values('id', 'code', 'name'))
            })
    return package_data



@require_GET
@ajax_required
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
def getRoles(request, fid):
    
    inspire_roles = {'PERM_VIEW': False, 'PERM_CREATE':False, 'PERM_REMOVE':False, 'PERM_UPDATE':False, 'PERM_APPROVE':False, 'PERM_REVOKE':False}
    
    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
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
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all():
        if themes.theme_name =='Барилга, суурин газар':
            data.append({
                    'id': themes.theme_id,
                    'code': themes.theme_code,
                    'name': themes.theme_name,
                    'packages': _get_package(themes.theme_id),
                })
    rsp = {
        'success': True,
        'data': data,
    }
    return JsonResponse(rsp)

@require_GET
@ajax_required
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
def rows(request, pid, fid):
    cursor = connections['default'].cursor()
    sql = """
        SELECT
            geo_id as id, ST_AsGeoJSON(ST_Transform(geo_data,4326)) as geom
        FROM
            m_geo_datas
        WHERE
            feature_id = {fid}
        order by created_on desc
        limit {limit}
    """.format(
        fid=fid,
        limit=4000
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    rsp = {
        'rows': rows,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
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
def save(request, payload, pid, fid):

    form_values = payload.get('form_values')
    for data in form_values:
        if data['value_type'] == 'number':
            if data['data']:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(value_number=data['data'])
        elif data['value_type'] == 'option':
            if data['data']:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(code_list_id=data['data'])
        elif data['value_type'] == 'text':
            if data['data']:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(value_text=data['data'])
        elif data['value_type'] == 'date':
            if data['data']:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(value_date=data['data'])
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def delete(request, payload, pid, fid):
    gid = payload.get('gid')
    get_object_or_404(MGeoDatas, geo_id=gid)

    geom = MDatasBuilding.objects.filter(geo_id=gid)
    datas = MGeoDatas.objects.filter(geo_id=gid)
    if geom and datas:
        geom.delete()
        datas.delete()
        view_check = refreshMaterializedView(fid)
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
        data = ob.get('value_date') or ''

    for role in roles:
        if role.get('property_id') == lproperties.property_id:
            property_roles = role.get('roles')


    return {
        'pk':ob.get('pk'),
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

def _get_emp_roles(employee, fid):

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
def detail(request, gid, fid, tid):
    property_ids = []
    properties = []

    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
    property_ids, property_details = _get_emp_roles(employee, fid)
    theme_code = LThemes.objects.filter(theme_id=tid).first().theme_code
    model = _MDatasName(theme_code)
    if property_ids:
        mdatas = model.objects.filter(geo_id=gid).filter(property_id__in=property_ids).values('property_id', 'value_text', 'value_number', 'value_date', 'pk')
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
    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
    property_ids, property_roles = _get_emp_roles(employee, fid)

    if property_ids:
        for prop in property_ids:
            lproperty = LProperties.objects.filter(property_id=prop).first()
            org_propties_front.append(_get_property(value_data, property_roles, lproperty))
    rsp = {
        'success': True,
        'datas': org_propties_front
    }
    return JsonResponse(rsp)


def tableLastfindID(table_name):
    try:
        with connections['postgis_db'].cursor() as cursor:
            sql = """ select id from {table_name} order by id desc limit 1; """.format(table_name=table_name)
            cursor.execute(sql)
            row_id = cursor.fetchone()
        return row_id
    except Exception:
        return None


def findGeomField(fields):
    geom_field = None
    for field in fields:
        if field.atttypid == 'geometry':
            geom_field = field.attname
    return geom_field



@require_POST
@ajax_required
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
    view_check = refreshMaterializedView(fid)
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


def _geoJsonConvertGeom(geojson):
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
def geomAdd(request, payload, fid):

    geojson = payload.get('geojson')
    geom = _geoJsonConvertGeom(geojson)
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
            'id': None
        }
        return JsonResponse(rsp)
    check = True
    count = random.randint(1062, 9969)
    geo_id = str(fid) + str(count) + 'geo'
    MGeoDatas.objects.create(geo_id=geo_id, geo_data=geom, feature_id=fid, created_by=1, modified_by=1)
    fields = get_rows(fid)
    for field in fields:
        MDatasBuilding.objects.create(
            geo_id = geo_id,
            feature_config_id = field['feature_config_id'],
            data_type_id = field['data_type_id'],
            property_id = field['property_id'],
            created_by = 1,
            modified_by = 1
        )
    view_check = refreshMaterializedView(fid)
    rsp = {
        'success': True,
        'info': "Ажилттай ",
        'id': geo_id
    }
    return JsonResponse(rsp)



def _is_geom_included(geojson, org_geo_id):

    geom_type = str(geojson['type'])
    coordinate_syntax = ''
    if geom_type == 'Polygon' or geom_type == 'Linestring':
        geom_coordinates = geojson['coordinates'][0]
        for i in range(len(geom_coordinates)):
            coordinate_syntax += str(geom_coordinates[i][0]) + ' ' + str(geom_coordinates[i][1]) + ','
        coordinate_syntax  = "(({coordinate_syntax}))".format(coordinate_syntax=coordinate_syntax[:-1])

    elif geom_type == 'Point':
        coordinate_syntax = str(geojson['coordinates'][0]) + ' ' + str(geojson['coordinates'][1])
        coordinate_syntax = "({coordinate_syntax})".format(coordinate_syntax=coordinate_syntax)

    elif geom_type == 'MultiPolygon':
        geom_coordinates = geojson['coordinates'][0][0]
        for i in range(len(geom_coordinates)):
            coordinate_syntax += str(geom_coordinates[i][0]) + ' ' + str(geom_coordinates[i][1]) + ','
        coordinate_syntax = "((({coordinate_syntax})))".format(coordinate_syntax=coordinate_syntax[:-1])

    cursor = connections['default'].cursor()
    sql = """
        select ST_Contains(
            ((
                SELECT ST_ASText(ST_Transform(geo_data,4326))
                FROM m_geo_datas
                WHERE geo_id = '{org_geo_id}'
            )),
            ((
                select ST_ASText('{geom_type}{coordinate_syntax}')
            ))
        )
    """.format(
        geom_type = geom_type,  
        org_geo_id = org_geo_id,
        coordinate_syntax = coordinate_syntax
    )
    cursor.execute(sql)
    is_included = cursor.fetchone()[0]
    return is_included


def _check_form_json(fid, form_json, employee):

    request_json = []
    property_ids, roles = _get_emp_roles(employee, fid)
    if form_json and roles:
        for role in roles:
            for propert in form_json['form_values']:
                if role.get('property_id') == propert.get('property_id'):
                    request_json.append({
                        'pk':propert.get('pk'),
                        'property_name': propert.get('property_id') or '',
                        'property_id': propert.get('property_id'),
                        'property_code': propert.get('property_code') or '',
                        'property_definition': propert.get('property_definition') or '',
                        'value_type_id': propert.get('value_type_id') or '',
                        'value_type': propert.get('value_type') or '',
                        'data': propert.get('data') or '',
                        'data_list': propert.get('data_list') or '',
                        'roles': propert.get('roles') or ''
                    })

    return request_json


@require_POST
@ajax_required
def create(request, payload):

    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json')
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')
    
    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
    emp_perm = get_object_or_404( EmpPerm,employee_id=employee.id)
    perm_kind = EmpPermInspire.objects.filter(Q(emp_perm_id=emp_perm.id, feature_id=fid, geom=True) and (Q(perm_kind=EmpPermInspire.PERM_APPROVE) or Q(perm_kind=EmpPermInspire.PERM_CREATE)))
    
    if perm_kind:

        form_json = _check_form_json(fid, form_json, employee)
        if not form_json:
            form_json = ''
        is_included = _is_geom_included(geo_json, org.geo_id)

        if is_included:
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
        else:
            rsp =  {
                'success': False,
                'info': "Хүсэлт алдаатаЙ байна",
            }
    else:
        rsp = {
            'success': False,
            'info': "Хүсэлт амжилтгүй боллоо",
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def createDel(request, payload):
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    form_json = payload.get('form_json')
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')


    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
    emp_perm = get_object_or_404( EmpPerm,employee_id=employee.id)
    perm_kind = EmpPermInspire.objects.filter(Q(emp_perm_id=emp_perm.id, feature_id=fid, geom=True) and (Q(perm_kind=EmpPermInspire.PERM_APPROVE) or Q(perm_kind=EmpPermInspire.PERM_REMOVE)))
    
    if perm_kind:
        
        geo_data = _get_geom(old_geo_id, fid)
        geo_data = _convert_text_json(geo_data[0]["geom"])
        geo_json = _get_geoJson(geo_data)
        is_included = _is_geom_included(geo_json['geometry'], org.geo_id)
        if is_included:
            ChangeRequest.objects.create(
                    old_geo_id = old_geo_id,
                    new_geo_id = None,
                    theme_id = tid,
                    package_id = pid,
                    feature_id = fid,
                    employee = employee,
                    state = ChangeRequest.STATE_NEW,
                    kind = ChangeRequest.KIND_UPDATE,
                    form_json = None,
                    geo_json = None,
                    order_at=order_at,
                    order_no=order_no,
            )
            rsp = {
                'success': True,
                'info': "Хүсэлт амжилттай үүслээ",
            }
        else:
            rsp =  {
                'success': False,
                'info': "Хүсэлт алдаатаЙ байна",
            }
    else:
        rsp = {
            'success': False,
            'info': "Хүсэлт амжилтгүй боллоо",
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def createUpd(request, payload):

    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json')
    order_no = form_json.get('order_no')
    order_at = form_json.get('order_at')

    org = get_object_or_404(Org, employee__user=request.user)
    employee = Employee.objects.filter(org_id=org.id, user__username=request.user).first()
    emp_perm = get_object_or_404( EmpPerm,employee_id=employee.id)

    if not geo_json:
        geo_json = ''

    perm_kind = EmpPermInspire.objects.filter(Q(emp_perm_id=emp_perm.id, feature_id=fid, geom=True) and (Q(perm_kind=EmpPermInspire.PERM_APPROVE) or Q(perm_kind=EmpPermInspire.PERM_UPDATE)))
    
    if perm_kind:
        form_json = _check_form_json(fid, form_json, employee)
        if not form_json:
            form_json = ''
        _is_included = _is_geom_included(geo_json, org.geo_id)
  
        if _is_included:    
            ChangeRequest.objects.create(
                    old_geo_id = old_geo_id,
                    new_geo_id = None,
                    theme_id = tid,
                    package_id = pid,
                    feature_id = fid,
                    employee = employee,
                    state = ChangeRequest.STATE_NEW,
                    kind = ChangeRequest.KIND_DELETE,
                    form_json = form_json,
                    geo_json = geo_json,
                    order_at=order_at,
                    order_no=order_no,
            )

            rsp = {
                'success': True,
                'info': "Хүсэлт амжилттай үүслээ",
            }
        else:
            rsp =  {
                'success': False,
                'info': "Хүсэлт алдаатаЙ байна",
            }
    else:
        rsp = {
            'success': False,
            'info': "Хүсэлт амжилтгүй боллоо",
        }

    return JsonResponse(rsp)


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        return geom
    return None


def _saveToMainData(values, model_name, geo_id, feature_id):
    keys = ''
    feature_config_id = None
    savename = model_name
    model_name = _MDatasName(model_name)
    code_value = None
    try:
        if not isinstance(model_name, str):
            if values:
                feature_config = LFeatureConfigs.objects.filter(feature_id=feature_id).first()
                if feature_config:
                    # feature_config_id = feature_config.feature_config_id
                    feature_config_id = None
                else:
                    feature_config_id = None
                data_type_id = None
                for j in values:
                    for key, value in j.items():
                        properties = LProperties.objects.filter(property_code__icontains=key)
                        if properties:
                            for property in properties:
                                datas = {}
                                value_types = LValueTypes.objects.filter(value_type_id=property.value_type_id)
                                if value_types:
                                    for value_type in value_types:
                                        val_type = value_type.value_type_id
                                        if val_type == 'single-select':
                                           code_list_values = LCodeLists.objects.filter(property_id=property.property_id, code_list_code=value)
                                           for code_list_value in code_list_values:
                                                if code_list_value.code_list_code.lower() == value.lower():
                                                    code_value = code_list_value.code_list_id
                                        if val_type != 'boolean':
                                            for i in model_name._meta.get_fields():
                                                if 'value' in i.name:
                                                    out = i.name.split('_')
                                                    if out[1] == 'date' and val_type == 'date':
                                                        if '/' in value:
                                                            dt = value.split('/')
                                                            value = dt[0] + "-" + dt[1] + '-' + dt[2]
                                                    if out[1] == val_type:
                                                        datas[i.name] = value
                                                    else:
                                                        datas[i.name] = None
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
                                        else:
                                            rsp = {
                                                'success': False,
                                                'info': "Алдаа гарсан байна: " + val_type + ' буруу байна'
                                            }
                                            return rsp
                                    sain = model_name.objects.create(**datas)
                        else:
                            keys += key + ' ,'
                rsp = {
                    'success': True,
                    'info': 'Амжилттай хадгалалаа',
                    'key': 'Буруу орсон ' + keys if keys != '' else 'Бүгд зөв'
                }
            else:
                rsp = {
                    'success': False,
                    'info': 'Хоосон ирж байна. ' + savename,
                }
        else:
            rsp = {
                'success': False,
                'info': 'Алдаа гарсан байна.' + savename,
            }
    except Exception as e:
        rsp = {
            'success': False,
            'info': 'Алдаа ' + str(e)
        }
    return rsp


def _MDatasName(model_name):
    if model_name == 'au':
        model_name = MDatasBoundary
    if model_name == 'bu':
        model_name = MDatasBuilding
    if model_name == 'cp':
        model_name = MDatasCadastral
    if model_name == 'gn':
        model_name = MDatasGeographical
    if model_name == 'hg':
        model_name = MDatasHydrography
    return model_name


def _deleteFile(file_name, for_delete_name, type_name):
    fileList = glob.glob(os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas', type_name, file_name+'.*'))
    text = ''
    for filePath in fileList:
        try:
            os.remove(filePath)
        except:
            text = "(Устгах явцад алдаа гарлаа : " + for_delete_name + ')'
    return text


def _deleteDB(id_made, model_name):
    try:
        if id_made != '':
            delete_geos = MGeoDatas.objects.filter(geo_id=id_made)
            if delete_geos:
                for geo in delete_geos:
                    geo.delete()
            delete_main_datas = model_name.objects.filter(geo_id=id_made)
            if delete_main_datas:
                for data in delete_main_datas:
                    data.delete()
        rsp = {
            'success': True,
            'info': 'Дутуу датаг устгасан'
        }
    except Exception as e:
        rsp = {
            'success': False,
            'info': "Устгах явцад алдаа гарсан" + str(e)
        }
    return rsp

@require_POST
@ajax_required
def FileUploadSaveData(request, tid, fid):
    form = request.FILES.getlist('data')
    file_name = ''
    for_delete_name = ''
    feature_id = fid
    id_made = ''
    return_name = ''
    try:
        unique_filename = str(uuid.uuid4())
        for fo in form:
            if '.shx' in fo.name or '.shp' in fo.name or '.prj' in fo.name or '.dbf' in fo.name or '.cpg' in fo.name:
                file_name = unique_filename + fo.name
                for_delete_name = fo.name
                file_type_name = 'shp'
                return_name += fo.name + ','
            elif '.gml' in fo.name or '.gfs' in fo.name:
                file_type_name = 'gml'
                file_name = unique_filename + fo.name
                for_delete_name = fo.name
                return_name += fo.name + ','
            elif '.geojson' in fo.name or '.gfs' in fo.name:
                file_type_name = 'geojson'
                file_name = unique_filename + fo.name
                for_delete_name = fo.name.split('.')[0]
                return_name += fo.name + ','
            else:
                file_name = fo.name
            if file_type_name:
                path = os.path.join(settings.BASE_DIR, 'geoportal_app', 'datas', file_type_name)
                fs = FileSystemStorage(
                    location=path
                )
                file = fs.save(file_name, fo)
                fileurl = fs.url(file)
        uniq_name = file_name.split('.')[0]
        if '.shx' in file_name or '.shp' in file_name or '.prj' in file_name or '.dbf' in file_name or '.cpg' in file_name:
            file_name = uniq_name + '.' + file_type_name
        if '.gml' in file_name or '.gfs' in file_name:
            file_name = uniq_name + '.' + file_type_name
        if '.geojson' in file_name:
            file_name = uniq_name + '.' + file_type_name
        ds_path = os.path.join(path, file_name)
        ds = DataSource(ds_path)
        if len(ds) <= 0:
            deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
            rsp = {
                'success': False,
                'info': 'Source олдсонгүй ' + deleted
            }
            return JsonResponse(rsp)
        layer = ds[0]
        for val in layer:
            values = []
            try:
                code = LThemes.objects.filter(theme_id=tid).first()
                model_name = code.theme_code
                need_id = MGeoDatas.objects.count()
                for name in range(0, len(layer.fields)):
                    field_name = val[name].name # field name
                    if name == 0:
                        geom = ''
                        geom_type = ''
                        g_id = val.get(name)
                        dim = val.geom.coord_dim # dimension
                        geom = val.geom.json # goemetry json
                        # layer_type = str(val.geom.geom_type) #layeriin type
                        srid = GEOSGeometry(geom).srid # geomiin srid
                        if geom:
                            if srid != 4326:
                                geom = GEOSGeometry(geom, srid=4326)
                            if dim == 3:
                                geom_type = GEOSGeometry(geom).geom_type #geom iin type
                                geom = GEOSGeometry(geom).hex
                                geom = geom.decode("utf-8") #binary hurwuuleh
                                geom = GEOSGeometry(geom)
                            if dim == 2:
                                geom = geoJsonConvertGeom(geom)
                                geom =  ''.join(geom) # list iig str luu hurwuulj bgaa ni
                                geom = GEOSGeometry(geom)
                                geom_type = GEOSGeometry(geom).geom_type # field turul
                            if geom_type == 'Point':
                                geom = MultiPoint(geom, srid=4326) # Pointiig MultiPoint bolgoj bna
                            if geom_type == 'LineString':
                                geom = MultiLineString(geom, srid=4326) # LineString MultiLineString bolgoj bna
                            if geom_type == 'Polygon':
                                geom = MultiPolygon(geom, srid=4326) # Polygon MultiPolygon bolgoj bna
                            if geom:
                                id_made = str(need_id) + str(g_id)
                                geo = MGeoDatas.objects.create(
                                    geo_id=id_made,
                                    geo_data=geom,
                                    feature_id=feature_id,
                                    created_by=1,
                                    modified_by=1,
                                )
                                if geo:
                                    geo_id = geo.geo_id
                                else:
                                    rsp = {
                                        'success': False,
                                        'info': 'үүсгэх geom байхгүй байна. Файлаа бүтэн оруулсан эсэхийг шалгана уу'
                                    }
                                    return JsonResponse(rsp)
                        else:
                            deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
                            delete_db = _deleteDB(id_made, model_name)
                            rsp = {
                                "success": False,
                                'info': 'geom байхгүй дата' + deleted,
                            }
                            return JsonResponse(rsp)
                    type_name = val[name].type_name
                    type_name = type_name.decode('utf-8') # type ner
                    type_code = val[name].type # type code
                    value = val.get(name) # value ni
                    values.append({
                        field_name: value,
                    })
            except InternalError as e:
                deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
                delete_db = _deleteDB(id_made, model_name)
                rsp = {
                    'success': False,
                    'info': return_name + '-д Алдаа гарсан байна: UTM байгаа тул болохгүй ' + deleted
                }
                return JsonResponse(rsp)
            except GEOSException as e:
                deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
                delete_db = _deleteDB(id_made, model_name)
                rsp = {
                    'success': False,
                    'info': return_name + '-д Алдаа гарсан байна: Geometry утга нь алдаатай байна'
                }
                return JsonResponse(rsp)
            saved = _saveToMainData(values, model_name, geo_id, feature_id)
            if not saved['success']:
                deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
                delete_db = _deleteDB(id_made, model_name)
                rsp = saved
                return JsonResponse(rsp)
            else:
                rsp = saved
    except GDALException as e:
        deleted = _deleteFile(uniq_name, for_delete_name, file_type_name)
        rsp = {
            'success': False,
            'info': return_name + '-д Алдаа гарсан байна: файлд алдаа гарсан тул файлаа шалгана уу'
        }
    return JsonResponse(rsp)
