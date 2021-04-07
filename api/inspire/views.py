# import pyodbc
from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from backend.inspire.models import LFeatures
from backend.inspire.models import LProperties
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
from bson.json_util import dumps, loads, default
import json

def mogno_db_urban_all_data():
    cursor = connections['mongodb'].cursor()
    cursor = cursor.urban.find()
    datas = [json.loads(json.dumps(result, ensure_ascii=False, default=default, separators=(',', ':'))) for result in cursor]
    return datas


# def fucking_insert_data_mongo(feature_id, datas, field_names):

#     feature_obj = LFeatures.objects.filter(feature_id=feature_id).first()
#     property_displays = property_of_feature(feature_id)
#     m_datas_objs = list()
#     info = []
#     for data in datas:
#         for field_name in field_names:
#             try:
#                 dataaa = data[field_name['name_1']]
#                 if field_name['name_2']:
#                     dataaa = dataaa[field_name['name_2']]
#                 property_obj = LProperties.objects.filter(property_code=field_name['real_name']).first()
#                 for property_display in property_displays:
#                     if property_obj.property_id in property_display['property_ids']:
#                         mdatas_ob = MDatas(
#                             geo_id=data['globalId'],
#                             feature_config_id=property_display['feature_config_id'],
#                             data_type_id=property_display['data_type_id'],
#                             property_id=property_obj.property_id,
#                         )
#                         if dataaa:
#                             if property_obj.value_type_id in ['text', 'multi-text', 'boolean', 'link']:
#                                 mdatas_ob.value_text = dataaa
#                             elif property_obj.value_type_id == 'date':
#                                 mdatas_ob.value_date = utils.year_to_timezone(dataaa)
#                             elif property_obj.value_type_id in ['single-select', 'multi-select']:
#                                 mdatas_ob.code_list_id = dataaa
#                             elif property_obj.value_type_id in ['double', 'number']:
#                                 mdatas_ob.value_number

#                         print(
#                             data['globalId'],
#                             property_display['feature_config_id'],
#                             property_display['data_type_id'],
#                             property_obj.property_id,
#                             dataaa,
#                         )
#                         print(mdatas_ob)
#                         m_datas_objs.append(mdatas_ob)

#             except Exception:
#                 a = 2


# feature_id = 50103
# datas = mogno_db_urban_all_data()
# field_name = [
#     {'real_name': 'namespace', 'name_1': 'step7', 'name_2': 'firstCost'},
#     {'real_name': 'beginLifespanVersion', 'name_1': 'step7', 'name_2': 'buildArea'},
# ]
# feature_id = 50103
# fucking_insert_data_mongo(feature_id, datas, field_name)


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


# def _mssql_settings(port='1433', server='192.168.1.4', database='urban', username='sa', password='123456'):
#     drivers = pyodbc.drivers()
#     connection_dict = {
#         'driver': drivers[0],
#         'server': server + ', ' + port,
#         'database': database,
#         'uid': username,
#         'password': password
#     }
#     return connection_dict


# def _mssql_connection(connection_dict):
#     connection = pyodbc.connect(**connection_dict)
#     cursor = connection.cursor()
#     return cursor


# def _execute_query(cursor, sql):
#     cursor.execute(sql)
#     datas = utils.dict_fetchall(cursor)
#     return datas


# cursor = _mssql_connection(_mssql_settings())
# sql = """
#     SELECT TOP (1000) [OBJECTID], [KH_MON], [DUUREG] FROM [urban].[dbo].[ACHB]
# """
# row = _execute_query(cursor, sql)
# datas = [item for item in row]
# print(datas)
