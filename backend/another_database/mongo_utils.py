import requests
from main import utils
from .models import AnotherDatabaseTable, AnotherDatabase

import json
from pymongo import MongoClient
from django.db import connections


def mogno_db_collection_names(cursor):
    cursor = cursor.collection_names()
    names = [ c for c in cursor]
    return names


def _set_obj(cursor):
    array = []
    for name, value in cursor.items():
        data_objs = {"real_name": ""}
        data_objs['name_1'] = name

        if isinstance(value, dict):
            for na, val in value.items():
                data_objs['name_2'] = na
                array.append(data_objs)
        else:
            data_objs["name_2"] = ""
            array.append(data_objs)

    return array


def mogno_db_collection_field_names(cursor, name):
    cursor = cursor[name]
    cursor = cursor.find_one()
    names_array = []
    names_array = _set_obj(cursor)


    # print(json.dumps(names_array))
    return names_array


def mongo_config(pk):
    another_db = AnotherDatabase.objects.filter(pk=pk).first()
    connection = utils.json_load(another_db.connection)

    cinfigs = {
        'id': pk,
        'name': another_db.name,
        'definition': another_db.definition,
        'mongo_engine': connection.get('mongo_engine'),
        'mongo_client_host': connection.get('mongo_client_host'),
        'mongo_client_username': connection.get('mongo_client_username'),
        'mongo_client_password': connection.get('msssql_password'),
        'mongo_database': connection.get('mongo_database'),
    }
    return cinfigs


def _mongo_settings(pk):
    cinfigs = mongo_config(pk)
    mongo_engine = cinfigs.get('mongo_engine')
    mongo_client_host = cinfigs.get('mongo_client_host')
    mongo_client_username = cinfigs.get('mongo_client_username')
    mongo_client_password = cinfigs.get('mongo_client_password')
    mongo_database = cinfigs.get('mongo_database')

    client = MongoClient(mongo_client_host, 27017)
    cursor = client[mongo_database]

    return cursor


# all data from the selected table
def all_data_from_selected_table(cursor, table_name):
    # cursor = connections[cursor].cursor()
    print(cursor)
    # cursor = cursor.table_name.find()
    # datas = [json.loads(json.dumps(result, ensure_ascii=False, default=default, separators=(',', ':'))) for result in cursor]
    # return datas


def insert_data_from_mongo(feature_id, datas, field_names):

    property_displays = property_of_feature(feature_id)
    m_datas_objs = list()
    for data in datas:
        for field_name in field_names:
            try:
                dataaa = data[field_name['name_1']]
                if field_name['name_2']:
                    dataaa = dataaa[field_name['name_2']]
                property_obj = LProperties.objects.filter(property_code=field_name['real_name']).first()
                for property_display in property_displays:
                    if property_obj.property_id in property_display['property_ids']:
                        mdatas_ob = MDatas(
                            geo_id=data['globalId'],
                            feature_config_id=property_display['feature_config_id'],
                            data_type_id=property_display['data_type_id'],
                            property_id=property_obj.property_id,
                            # created_by=end zoriulj goy  too ogoh darana haij olj ustgah,
                        )
                        if dataaa:
                            if property_obj.value_type_id in ['text', 'multi-text', 'boolean', 'link']:
                                mdatas_ob.value_text = dataaa
                            elif property_obj.value_type_id == 'date':
                                mdatas_ob.value_date = utils.year_to_timezone(dataaa)
                            elif property_obj.value_type_id in ['single-select', 'multi-select']:
                                mdatas_ob.code_list_id = dataaa
                            elif property_obj.value_type_id in ['double', 'number']:
                                mdatas_ob.value_number

                        # print(
                        #     data['globalId'],
                        #     property_display['feature_config_id'],
                        #     property_display['data_type_id'],
                        #     property_obj.property_id,
                        #     dataaa,
                        # )
                        # print(mdatas_ob)
                        m_datas_objs.append(mdatas_ob)

            except Exception:
                a = 2
    # MDatas.objects.bulk_create(m_datas_objs)
