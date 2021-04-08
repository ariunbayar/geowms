import requests
from main import utils
from .models import AnotherDatabaseTable, AnotherDatabase

import pymongo
import json
from pymongo import MongoClient


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

    client = MongoClient()
    client = MongoClient(mongo_client_host, 27017)
    cursor = client[mongo_database]

    return cursor
