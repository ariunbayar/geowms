import requests
from main import utils
from .models import AnotherDatabaseTable, AnotherDatabase

import json
import pymongo
from django.db import connections
from bson.json_util import default

# import pyodbc
from backend.inspire.models import LFeatures
from backend.inspire.models import LProperties
from backend.inspire.models import EmpPermInspire
from backend.inspire.models import MDatas
from backend.inspire.models import MGeoDatas
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypeConfigs


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

def mogno_db_collection_names(cursor):
    cursor = cursor.collection_names()
    names = [ c for c in cursor]
    return names


def _set_obj(cursor):
    array = []
    for name, value in cursor.items():
        if isinstance(value, dict):
            for na, val in value.items():
                data_objs1 = {"real_name": ""}
                data_objs1['name_1'] = name
                data_objs1['name_2'] = na
                array.append(data_objs1)
        else:
            data_objs = {"real_name": ""}
            data_objs['name_1'] = name
            data_objs["name_2"] = ""
            array.append(data_objs)

    return array


def mogno_db_collection_field_names(cursor, name):
    cursor = cursor[name]
    cursor = cursor.find_one()
    names_array = []
    names_array = _set_obj(cursor)
    return names_array


def mongo_config(pk):
    another_db = AnotherDatabase.objects.filter(pk=pk).first()
    connection = utils.json_load(another_db.connection)

    configs = {
        'id': pk,
        'name': another_db.name,
        'definition': another_db.definition,
        'mongo_engine': connection.get('mongo_engine'),
        'mongo_client_host': connection.get('mongo_client_host'),
        'mongo_client_username': connection.get('mongo_client_username'),
        'mongo_client_password': connection.get('msssql_password'),
        'mongo_database': connection.get('mongo_database'),
        'mongo_port': connection.get('mongo_port'),
    }
    return configs


def _mongo_settings(pk):
    configs = mongo_config(pk)
    mongo_engine = configs.get('mongo_engine')
    mongo_client_host = configs.get('mongo_client_host')
    mongo_client_username = configs.get('mongo_client_username')
    mongo_client_password = configs.get('mongo_client_password')
    mongo_database = configs.get('mongo_database')
    mongo_port = int(configs.get('mongo_port'))

    client = pymongo.MongoClient(mongo_client_host, mongo_port)
    cursor = client[mongo_database]

    return cursor


# all data from the selected table
def all_data_from_selected_table(cursor, table_name):
    cursor = cursor[table_name]
    cursor = cursor.find()
    datas = [json.loads(json.dumps(result, ensure_ascii=False, default=default, separators=(',', ':'))) for result in cursor]
    return datas


def insert_data_from_mongo(feature_id, datas, field_names, search_values, unique_id):
    property_bogolson_field_count = 0
    property_displays = property_of_feature(feature_id)
    m_datas_objs = list()
    for data in datas:
        for field_name in field_names:
            try:
                if field_name['real_name']:
                    property_bogolson_field_count += 1

                    dataaa = data[field_name['name_1']]
                    if field_name['name_2']:
                        dataaa = dataaa[field_name['name_2']]

                    property_obj = LProperties.objects.filter(property_id=int(field_name['real_name'])).first()
                    for property_display in property_displays:
                        if property_obj.property_id in property_display['property_ids']:

                            mdatas_ob = MDatas(
                                geo_id=data['globalId'],
                                feature_config_id=property_display['feature_config_id'],
                                data_type_id=property_display['data_type_id'],
                                property_id=property_obj.property_id,
                                created_by=unique_id
                            )

                            if dataaa:
                                if property_obj.value_type_id in ['text', 'multi-text', 'boolean', 'link']:
                                    mdatas_ob.value_text = dataaa
                                elif property_obj.value_type_id == 'date':
                                    mdatas_ob.value_date = utils.year_to_timezone(dataaa)
                                elif property_obj.value_type_id in ['single-select', 'multi-select']:
                                    code_list_name = search_values[dataaa]
                                    l_code_list = LCodeLists.objects.filter(property_id=property_obj.property_id, code_list_name=code_list_name).first()
                                    code_list_id = l_code_list.code_list_id
                                    if code_list_id:
                                        mdatas_ob.code_list_id = code_list_id
                                elif property_obj.value_type_id in ['double', 'number']:
                                    mdatas_ob.value_number = dataaa

                            m_datas_objs.append(mdatas_ob)

            except Exception:
                pass
    insert_success_count = len(m_datas_objs)
    insert_all_count = len(datas)
    property_bogolson_field_count

    MDatas.objects.bulk_create(m_datas_objs)

    return True, insert_all_count, insert_success_count, property_bogolson_field_count


def delete_data_from_mongo(unique_id):
    mdata_qs = MDatas.objects.filter(created_by=unique_id)
    if mdata_qs:
        mdata_qs.delete()

    return True


def mongo_check_connection(mongo_client_host, mongo_database, port):
    errors = dict()
    try:
        client = pymongo.MongoClient(mongo_client_host, port)
        client.server_info()
    except pymongo.errors.ConnectionFailure:
        errors['mongo_client_host'] = 'Уучлаарай холбогдож чадсангүй зөв оруулана уу.'
        return False, errors
    try:
        cursor = client[mongo_database]
        cursor = cursor.collection_names()
        if not cursor:
            errors['mongo_database'] = 'Уучлаарай ийм нэртэй database алга.'
            return False, errors
        return True, errors
    except pymongo.errors.ConnectionFailure:
        errors['mongo_database'] = 'Уучлаарай ийм нэртэй database алга.'
        return False, errors
