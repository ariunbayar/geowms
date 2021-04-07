import pyodbc
from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from backend.inspire.models import LFeatures
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypeConfigs
from main import utils
from main.inspire import GEoIdGenerator
from backend.dedsanbutets.models import FeatureOverlaps
from main.decorators import api_inspire_perm
from rest_framework.decorators import api_view


def property_of_feature(feature_id):

    l_feature_configs = LFeatureConfigs.objects.filter(feature_id=feature_id).exclude(data_type_id__isnull=True).values('feature_config_id', 'data_type_id')
    property_displays = list()
    for l_feature_config in l_feature_configs:
        l_data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=l_feature_config['data_type_id']).values_list('property_id', flat=True)
        l_data_type_configs = [i for i in l_data_type_configs]
        property_displays.append({
            'property_ids': l_data_type_configs,
            'feature_config_id': l_feature_config['feature_config_id'],
            'data_type_id': l_feature_config['data_type_id']
        })
    return property_displays


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_CREATE)
def create(request, payload):
    datas = payload.get('datas') or None
    feature_id = payload.get('feature_id') or None

    feature_obj = LFeatures.objects.filter(feature_id=feature_id).first()
    property_displays = property_of_feature(feature_id)
    m_datas_objs = list()
    info = []
    for data in datas:
        geojson = data['geojson']
        overlap_feature_id = FeatureOverlaps.objects.filter(feature_id=feature_id).values_list('overlap_feature_id', flat=True)
        overlap_feature_id = [i for i in overlap_feature_id]
        overlap_feature_id.append(feature_id)
        is_contains = utils._geom_contains_feature_geoms(geojson, overlap_feature_id)
        if is_contains:
            info = '''{feature_ids} дугааруудтай geom-той давхцаж байна.'''.format(feature_ids=', '.join(['{}'.format(f['geo_id']) for f in is_contains]))
            return JsonResponse({"success": False, "info": info})
        else:
            new_geo_id = GEoIdGenerator(feature_obj.feature_id, feature_obj.feature_code).get()
            geojson = utils.geojson_to_geom(geojson)
            MGeoDatas.objects.create(
                geo_id=new_geo_id,
                geo_data=geojson,
                feature_id=feature_id
            )
            for propertie in data['properties']:
                for property_display in property_displays:
                    if propertie['property_id'] in property_display['property_ids']:
                        m_datas_objs.append(MDatas(
                            geo_id=new_geo_id,
                            feature_config_id=property_display['feature_config_id'],
                            data_type_id=property_display['data_type_id'],
                            property_id=propertie['property_id'],
                            code_list_id=propertie['code_list_id'],
                            value_text=propertie['value_text'],
                            value_number=propertie['value_number'],
                            value_date=propertie['value_date'],
                            value_connected_geo_id=propertie['value_connected_geo_id']
                        ))
            MDatas.objects.bulk_create(m_datas_objs)

    return JsonResponse({'success': True, 'msg': "Амжилттай үүсгэлээ"})


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_UPDATE)
def update(request, payload):
    datas = payload.get('datas') or None
    feature_id = payload.get('feature_id') or None

    property_displays = property_of_feature(feature_id)
    info = []
    for data in datas:
        geojson = data['geojson']
        old_geo_id = data['geo_id']
        properties = data['properties']
        overlap_feature_id = FeatureOverlaps.objects.filter(feature_id=feature_id).values_list('overlap_feature_id', flat=True)
        overlap_feature_id = [i for i in overlap_feature_id]
        overlap_feature_id.append(feature_id)
        is_contains = utils._geom_contains_feature_geoms(geojson, overlap_feature_id)
        is_contains_update_id_busad = list()
        for is_contain in is_contains:
            if is_contain['geo_id'] != old_geo_id:
                is_contains_update_id_busad.append(is_contain)
        if is_contains_update_id_busad:
            info = '''{feature_ids} дугааруудтай geom-той давхцаж байна.'''.format(feature_ids=', '.join(['{}'.format(f['geo_id']) for f in is_contains_update_id_busad]))
            return JsonResponse({"success": False, "info": info})
        else:
            geojson = utils.geojson_to_geom(geojson)
            MGeoDatas.objects.filter(geo_id=old_geo_id, feature_id=feature_id).update(
                geo_data=geojson,
                feature_id=feature_id
            )
            for propertie in properties:
                for property_display in property_displays:
                    if propertie['property_id'] in property_display['property_ids']:
                        MDatas.objects.filter(
                                geo_id=old_geo_id,
                                feature_config_id=property_display['feature_config_id'],
                                data_type_id=property_display['data_type_id'],
                                property_id=propertie['property_id'],
                            ).update(
                                feature_config_id=property_display['feature_config_id'],
                                data_type_id=property_display['data_type_id'],
                                property_id=propertie['property_id'],
                                code_list_id=propertie['code_list_id'],
                                value_text=propertie['value_text'],
                                value_number=propertie['value_number'],
                                value_date=propertie['value_date'],
                                value_connected_geo_id=propertie['value_connected_geo_id']
                        )

    return JsonResponse({'success': True, 'info': "Амжилттай заслаа."})


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_REMOVE)
def remove(request, payload):
    feature_id = payload.get('feature_id')
    geo_id = payload.get('geo_id') or ''
    m_geo_datas = MGeoDatas.objects.filter(geo_id=geo_id, feature_id=feature_id)
    m_datas = MDatas.objects.filter(geo_id=geo_id)
    m_geo_datas.delete()
    m_datas.delete()

    rsp = {
        'success': True,
        'info': geo_id + " тай geom болон attribute ийг амжилттай устаглаа"
    }

    return JsonResponse(rsp)


@api_view(['POST'])
@csrf_exempt
@api_inspire_perm(EmpPermInspire.PERM_VIEW)
def select(request, payload):
    feature_id = payload.get('feature_id') or None
    limit = payload.get('limit') or None
    search_geo_ids = payload.get('search_geo_ids') or None
    sort_type = payload.get('sort_type') or None
    sort_name = payload.get('sort_name') or None

    datas = select_query(
        feature_id,
        sort_name=sort_name,
        sort_type=sort_type,
        limit=limit,
        search_geo_ids=search_geo_ids
    )

    return JsonResponse({ 'success': True, 'result': datas })


def select_query(feature_id, sort_name="geo_id", sort_type="ASC", limit=10, search_geo_ids=[]):
    datas = list()
    with connections['default'].cursor() as cursor:
        sql = """
            select
                gd.geo_id,
                gd.geo_data,
                ST_AsGeoJSON(gd.geo_data) as geojson,
                gd.feature_id,
                md.id,
                md.feature_config_id,
                md.data_type_id,
                md.property_id,
                md.code_list_id,
                md.value_text,
                md.value_number,
                md.value_date,
                md.value_connected_geo_id,
                md.created_on
            from m_geo_datas gd
            inner join m_datas md
            on gd.geo_id = md.geo_id
            where
                gd.feature_id = {feature_id}
                {search_geo_ids}
                ORDER BY {sort_name} {sort_type}
                limit {limit}
        """.format(
                feature_id=feature_id,
                sort_name=sort_name,
                sort_type=sort_type,
                limit=limit,
                search_geo_ids=' AND gd.geo_id in({}) '.format(', '.join(["'{}'".format(f) for f in search_geo_ids])) if search_geo_ids else ''
            )
        cursor.execute(sql)

        datas = [dict((cursor.description[i][0], value) \
            for i, value in enumerate(row)) for row in cursor.fetchall()]

    return datas


#######################################__Urban__#########################################################3
# from bson.json_util import dumps, loads, default
# import json

# def mogno_db_urban_all_data():
#     cursor = connections['mongodb'].cursor()
#     cursor = cursor.urban.find()
#     datas = [json.dumps(result, ensure_ascii=False, default=default, separators=(',', ':')) for result in cursor]
#     return datas


# def mogno_db_collection_names():
#     cursor = connections['mongodb'].cursor()
#     cursor = cursor.collection_names()
#     names = [ c for c in cursor]
#     return names


# def mogno_db_collection_field_names():
#     cursor = connections['mongodb'].cursor()
#     cursor = cursor.urban.find_one()
#     names = [ c for c in cursor]
#     return names


################################## MSSQL ############################################

# 1. sudo su
# 2. curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
# 3. curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
# 4. sudo apt-get update
# 5. sudo ACCEPT_EULA=Y apt-get install -y msodbcsql17
# 6. sudo ACCEPT_EULA=Y apt-get install -y mssql-tools
# 7. echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
# 8. source ~/.bashrc
# 9. sudo apt-get install -y unixodbc-dev
# 10. pip install pyodbc


from django.contrib.gis.geos import GEOSGeometry


def _mssql_settings(port='1433', server='192.168.1.4', database='urban', username='sa', password='123456'):
    drivers = pyodbc.drivers()
    connection_dict = {
        'driver': drivers[0],
        'server': server + ', ' + port,
        'database': database,
        'uid': username,
        'password': password
    }
    return connection_dict


def _mssql_connection(connection_dict):
    connection = pyodbc.connect(**connection_dict)
    cursor = connection.cursor()
    return cursor


def _execute_query(cursor, sql):
    cursor.execute(sql)
    datas = utils.dict_fetchall(cursor)
    return datas


def _fix_coordinates(wkt):
    sql = """
        SELECT
            ST_AsEWKT(
                ST_FlipCoordinates(
                    GeomFromEWKT('{wkt}')
                )
            ) as wkt;
        """.format(wkt=wkt)
    cursror = connections['default'].cursor()
    row = _execute_query(cursror, sql)
    datas = [item for item in row]
    wkt = datas[0]['wkt']
    return wkt


def _check_coordiante(geo_json, to_srid=4326):
    has_problem = False

    geo_json = utils.json_load(geo_json)
    coordinates = geo_json['coordinates']
    if 'Multi' in geo_json['type']:
        coord = coordinates[0][0][0]
    else:
        coord = coordinates[0][0]

    x = coord[0]
    y = coord[1]
    if x < y:
        has_problem = True

    return has_problem


def _get_wkt(value, from_srid=32648, to_srid=4326):
    pnt = GEOSGeometry(value, srid=from_srid)
    pnt.transform(to_srid)
    has_problem = _check_coordiante(pnt.json, to_srid)
    wkt = pnt.wkt
    if has_problem:
        wkt = _fix_coordinates(wkt)
    return wkt


def _set_3d_dim(wkt, srid=4326):
    geom = GEOSGeometry(wkt, srid=srid)
    geom = utils.geoJsonConvertGeom(geom.json)  # set 3d
    geom = GEOSGeometry(geom, srid=srid)
    geom = utils.get_geom_for_filter_from_geometry(geom.json, change_to_multi=True)  # set Multi
    return geom


def _create_mgeo(feature_code, geom):
    feature = utils.get_feature_from_code(feature_code)
    new_geo_id = GEoIdGenerator(feature.feature_id, feature.feature_code).get()
    MGeoDatas.objects.create(
        geo_id=new_geo_id,
        geo_data=geom,
        feature_id=feature.feature_id
    )
    return new_geo_id


cursor = _mssql_connection(_mssql_settings())

table_name = 'BUILDING_ALS3'
sql = """
    SELECT OBJECT_SCHEMA_NAME(T.[object_id],DB_ID()) AS [Schema],
            T.[name] AS [table_name], AC.[name] AS [column_name],
            TY.[name] AS system_data_type, AC.[max_length],
            AC.[precision], AC.[scale], AC.[is_nullable], AC.[is_ansi_padded]
    FROM sys.[tables] AS T
    INNER JOIN sys.[all_columns] AC ON T.[object_id] = AC.[object_id]
    INNER JOIN sys.[types] TY ON AC.[system_type_id] = TY.[system_type_id] AND AC.[user_type_id] = TY.[user_type_id]
    WHERE T.[is_ms_shipped] = 0 and T.[name] = '{table_name}'
    ORDER BY T.[name], AC.[column_id]
""".format(table_name=table_name)

row = _execute_query(cursor, sql)
datas = [item for item in row]
fields = list()
for data in datas[:len(datas) - 1]:
    fields.append(data['column_name'])


select_sql = """
    SELECT [{fields}]
    FROM [dbo].[{table_name}]
""".format(
    fields="]\n          ,[".join(fields),
    table_name=table_name,
)
print(select_sql)

# row = _execute_query(cursor, select_sql)
# datas = [item for item in row]
# for data in datas:
#     print(data)




# -------------------------------------------------- mgeo_datas


# .STAsText() str
# .STAsBinary() binary
# .AsTextZM() str
# .AsGml gml


# select_sql = """
#     select objectid, shape.STAsText()
#     FROM {table_name}
#     where objectid = 2
# """.format(table_name=table_name)
# print(select_sql)


# cursor = _mssql_connection(_mssql_settings())
# cursor = cursor.execute(select_sql)
# value = cursor.fetchone()
# wkt = _get_wkt(value[1])
# geom = _set_3d_dim(wkt)
# new_geo_id = _create_mgeo('bu-bb-b', geom)
# print("saved", new_geo_id)
