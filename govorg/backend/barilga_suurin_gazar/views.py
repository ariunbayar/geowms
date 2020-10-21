import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBuilding, MGeoDatas, LCodeListConfigs, LCodeLists

from backend.changeset.models import ChangeSet
from backend.bundle.models import Bundle
from main.decorators import ajax_required, gov_bundle_required
from backend.inspire.models import LThemes, LPackages, LFeatures
from django.contrib.auth.decorators import user_passes_test
from django.contrib.gis.geos import GEOSGeometry, GeometryCollection, Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon, WKBWriter

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
        order by geo_id desc
        limit {limit}
    """.format(
        fid=fid,
        limit=1000
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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
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
            if data['data'] != [None]:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(value_number=data['data'])
        elif data['value_type'] == 'option':
            if data['data'] != [None]:
                if data['data']:
                    MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(code_list_id=data['data'])
        elif data['value_type'] == 'text':
            if data['data'] != [None]:
                MDatasBuilding.objects.filter(building_id=data['building_id'], geo_id=data['geo_id']).update(value_text=data['data'])
        elif data['value_type'] == 'date':
            if data['data'] != [None]:
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
    elif ob['value_type_id'] == ('text' or 'multi-text'):
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
        'property_id':ob['property_id'],
        'data':data,
        'data_list': data_list
    }


@require_GET
@ajax_required
def detail(request, pk):
    Properties = []
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
        datas.value_date
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
    properties = [_get_property(ob) for ob in data]
    rsp = {
        'success': True,
        'datas': properties
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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
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
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)


def get_rows(fid):
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


def geoJsonConvertGeom(geojson, fid):
    with connections['default'].cursor() as cursor:

        sql = """ SELECT ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        return geom
    return None


@require_POST
@ajax_required
def geomAdd(request, payload, fid):

    geojson = payload.get('geojson')
    geom = geoJsonConvertGeom(geojson, fid)
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
            'id': None
        }
        return JsonResponse(rsp)


    count = MGeoDatas.objects.filter(feature_id=fid).count()
    count = str(count+22)+'test'

    with connections['default'].cursor() as cursor:
        sql = """
                INSERT INTO public.m_geo_datas(
                geo_id, geo_data, feature_id, created_by , modified_by)
                VALUES (%s, %s ,%s, 1, 1);
            """
        cursor.execute(sql, [count, geom, fid])
    fields = get_rows(fid)
    for field in fields:
        MDatasBuilding.objects.create(
            geo_id = count,
            feature_config_id = field['feature_config_id'],
            data_type_id = field['data_type_id'],
            property_id = field['property_id'],
            created_by = 1,
            modified_by = 1
        )
    rsp = {
        'success': True,
        'info': "Ажилттай ",
        'id': count
    }
    return JsonResponse(rsp)