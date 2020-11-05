import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBuilding, MGeoDatas, LCodeListConfigs, LCodeLists
from govorg.backend.org_request.models import ChangeRequest
from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString

from backend.changeset.models import ChangeSet
from backend.bundle.models import Bundle
from main.decorators import ajax_required, gov_bundle_required
from django.contrib.auth.decorators import user_passes_test
from django.contrib.gis.geos import GEOSGeometry, GeometryCollection, Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon, WKBWriter
import random
from backend.org.models import Org, Employee, InspirePerm

from main.utils import (
    gis_delete,
    gis_fetch_one,
    gis_fields_by_oid,
    gis_insert,
    gis_table_by_oid,
    gis_tables_by_oids,
    dict_fetchall
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

    feature = []
    geoJson = []
    changeset_list = [_get_changeset_display(ob) for ob in ChangeSet.objects.all()]
    features = [_get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]
    feature_collection = FeatureCollection(features)
    rsp = {
        'GeoJson': feature_collection,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def getRoles(request,pid, fid):

    inspire_roles = []
    org = get_object_or_404(Org, employee__user=request.user)
    org_roles = InspirePerm.objects.filter(org=org, module=3, module_root_id=pid, module_id=fid, perm_view=True).first()
    if org_roles:
        inspire_roles = [
            org_roles.perm_view, 
            org_roles.perm_create, 
            org_roles.perm_remove, 
            org_roles.perm_update, 
            org_roles.perm_revoke, 
            org_roles.perm_review, 
            org_roles.perm_approve, 
        ]

        rsp = {
            'success': True,
            'roles': inspire_roles,
        }
    else:
        rsp = {
            'success': False,
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
            'type': None
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


def _get_property(ob):
    data = None
    value_type = ''
    data_list = []
    if ob['value_type_id'] == 'number':
        value_type = 'number'
        data = ob.get('value_number'),
    elif ob['value_type_id'] == 'double':
        value_type = 'number'
        data = ob.get('value_number'),
    elif ob['value_type_id'] == 'multi-text':
        value_type = 'text'
        data = ob['value_text'],
    elif ob['value_type_id'] == 'text':
        value_type = 'text'
        data = ob['value_text'],
    elif ob['value_type_id'] == 'date':
        value_type = 'date'
        data = _datetime_display(ob['value_date']),
    elif ob['value_type_id'] == 'link':
        value_type = 'text'
        data = ob['value_text'],
    elif ob['value_type_id'] == 'boolean':
        value_type = 'text'
        data = ob['value_text'],
    else:
        value_type = 'option'
        data = ob['code_list_id'],
        data_list = _code_list_display(ob['property_id'])
    if data:
        data = data[0]
    return {
        'building_id':ob['building_id'],
        'geo_id':ob['geo_id'],
        'property_name':ob['property_name'],
        'property_id':ob['property_id'],
        'property_code':ob['property_code'],
        'property_definition':ob['property_definition'],
        'value_type_id':ob['value_type_id'],
        'value_type':value_type,
        'data':data if data else '',
        'data_list': data_list,
        'role':False
    }


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


@require_GET
@ajax_required
def detail(request, pk, fid):
    org = get_object_or_404(Org, employee__user=request.user)
    org_properties = InspirePerm.objects.filter(org=org, module=4, module_root_id=fid,perm_view=True)
    find_cursor = connections['default'].cursor()
    find_cursor.execute('''
    select
        datas.building_id,
        datas.geo_id,
        l.property_name,
        l.property_code,
        l.property_definition,
        l.value_type_id,
        datas.property_id,
        datas.value_text,
        datas.value_number,
        datas.value_date,
        datas.code_list_id
    from l_properties l
    inner join m_datas_building datas on
        l.property_id = datas.property_id
    where
        datas.geo_id = %s
    order by property_name asc
    '''
    , [pk])

    data = dict_fetchall(find_cursor)
    data = list(data)
    org_propties_front = []
    properties = [_get_property(ob) for ob in data]
    for org_prop in org_properties:
        for inspire_prop in properties:
            if org_prop.module_id == inspire_prop['property_id']:
                org_propties_front.append({
                    'building_id':inspire_prop['building_id'] if inspire_prop['building_id'] else '',
                    'geo_id':inspire_prop['geo_id'] if inspire_prop['geo_id'] else inspire_prop['geo_id'],
                    'property_name':inspire_prop['property_name'] if inspire_prop['property_name'] else '',
                    'property_id':inspire_prop['property_id'] if inspire_prop['property_id'] else '',
                    'property_code':inspire_prop['property_code'] if inspire_prop['property_code'] else '',
                    'property_definition':inspire_prop['property_definition'] if inspire_prop['property_definition'] else '',
                    'value_type_id':inspire_prop['value_type_id'] if inspire_prop['value_type_id'] else '',
                    'value_type':inspire_prop['value_type'] if inspire_prop['value_type'] else '',
                    'data': inspire_prop['data'] if inspire_prop['data'] else '',
                    'data_list':inspire_prop['data_list'] if inspire_prop['data_list'] else '',
                    'role': '1' if org_prop.perm_update else '0',
                })
    rsp = {
        'success': True,
        'datas': org_propties_front
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def detailNone(request, tid, pid, fid):
    org = get_object_or_404(Org, employee__user=request.user)
    org_properties = InspirePerm.objects.filter(org=org, module=4, module_root_id=fid,perm_view=True)
    find_cursor = connections['default'].cursor()
    find_cursor.execute('''
        select datas.feature_id, datas.feature_config_id, datas.data_type_id,datas.property_id, l.property_name, l.property_code,l.property_definition,l.value_type_id
        from l_properties l
        inner join (select l_feature_configs.feature_id, l_feature_configs.feature_config_id, l_feature_configs.data_type_id,l_data_type_configs.property_id
        from l_feature_configs
        inner join l_data_type_configs on l_data_type_configs.data_type_id = l_feature_configs.data_type_id
        where l_feature_configs.feature_id = 38
        ) datas
        on datas.property_id = l.property_id
    '''
    , [fid])

    data = dict_fetchall(find_cursor)
    datas = list(data)
    org_propties_front = []


    for data in datas:
        org_propties_front.append({
            'property_name':data['property_name'] if data['property_name'] else '' ,
            'property_id':data['property_id'] if data['property_id'] else '',
            'property_code':data['property_code'] if data['property_code'] else '',
            'property_definition': data['property_definition'] if data['property_definition'] else '',
            'value_type_id':data['value_type_id'] if data['value_type_id'] else '',
            'feature_id' : data['feature_id'] if data['feature_id'] else '',
            'theme_id' : tid,
            'package_id' : pid,
            'value_type' : _get_type(data['value_type_id']) if _get_type(data['value_type_id']) else '',
            'data': '',
            'data_list': _code_list_display(data['property_id']) if data['value_type_id'] == 'single-select' else '',
            # 'role': not org_prop.perm_update
        })

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
    geom = geoJsonConvertGeom(geojson)
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
        }
        return JsonResponse(rsp)
    MGeoDatas.objects.filter(geo_id=geo_id).update(geo_data=geom)
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


def geoJsonConvertGeom(geojson):
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
    geom = geoJsonConvertGeom(geojson)
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
    rsp = {
        'success': True,
        'info': "Ажилттай ",
        'id': geo_id
    }
    return JsonResponse(rsp)



@require_POST
@ajax_required
def create(request, payload):
    employee = get_object_or_404(Employee, user=request.user)
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json')      
    ChangeRequest.objects.create(
            old_geo_id = None,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = 1,
            kind = 1,
            form_json = form_json,
            geo_json = geo_json
    )

    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def createDel(request, payload):
    employee = get_object_or_404(Employee, user=request.user)
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')

    ChangeRequest.objects.create(
            old_geo_id = old_geo_id,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = 1,
            kind = 3,
            form_json = None,
            geo_json = None
    )
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def createUpd(request, payload):
    employee = get_object_or_404(Employee, user=request.user)
    tid = payload.get('tid')
    pid = payload.get('pid')
    fid = payload.get('fid')
    old_geo_id = payload.get('old_geo_id')
    form_json = payload.get('form_json')
    geo_json = payload.get('geo_json')

    if not form_json:
        form_json = ''
    if not geo_json:
        geo_json = ''
    
    ChangeRequest.objects.create(
            old_geo_id = old_geo_id,
            new_geo_id = None,
            theme_id = tid,
            package_id = pid,
            feature_id = fid,
            employee = employee,
            state = 1,
            kind = 2,
            form_json = form_json,
            geo_json = geo_json
    )

    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)
