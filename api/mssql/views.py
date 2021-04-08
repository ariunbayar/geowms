import pyodbc

from django.contrib.gis.geos import GEOSGeometry
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.db import connections

from backend.config.models import Config
from backend.inspire.models import MGeoDatas
from backend.inspire.models import MDatas
from backend.inspire.models import LProperties
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypeConfigs

from main.decorators import ajax_required
from main import utils

# Create your views here.


CONNECTION_NAME = 'MSSQL_CONNECTION'


def _get_settings():
    mssql_settings = utils.get_config(CONNECTION_NAME)
    mssql_settings = utils.json_load(mssql_settings)
    mssql_settings = _mssql_settings(**mssql_settings)
    return mssql_settings


def _mssql_settings(msssql_port='1433', msssql_server='192.168.1.4', msssql_database='urban', msssql_username='sa', msssql_password='123456'):
    drivers = pyodbc.drivers()
    connection_dict = {
        'driver': drivers[0],
        'server': msssql_server + ', ' + msssql_port,
        'database': msssql_database,
        'uid': msssql_username,
        'password': msssql_password
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


def _insert_mgeo_datas(feature_code, geom):
    feature = utils.get_feature_from_code(feature_code)
    new_geo_id = utils.GEoIdGenerator(feature.feature_id, feature.feature_code).get()
    MGeoDatas.objects.create(
        geo_id=new_geo_id,
        geo_data=geom,
        feature_id=feature.feature_id
    )
    return new_geo_id


def _insert_mdatas(geo_id, row_datas, feature_code, property_ids):
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_id__in=property_ids)
    prop_codes = list(prop_qs.values_list('property_code', flat=True))
    feature = utils.get_feature_from_code(feature_code)
    properties_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(feature.feature_id)
    datas = utils._get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs, prop_codes)
    for data in datas:
        print(data, row_datas)
        # MDatas.objects.create(geo_id=geo_id, **row_datas)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_attributes(request, payload):
    table_name = payload.get('table_name')
    mssql_settings = _get_settings()

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

    cursor = _mssql_connection(mssql_settings)
    row = _execute_query(cursor, sql)
    not_display_columns = ['OBJECTID', 'Shape']
    fields = [
        item['column_name']
        for item in row
        if item['column_name'] not in not_display_columns
    ]

    rsp = {
        'success': True,
        'fields': fields,
    }

    return JsonResponse(rsp)


# mssql ees shape eer filter hiih uyd heregtei
# .STAsText() str
# .STAsBinary() binary
# .AsTextZM() str
# .AsGml gml


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def insert_to_inspire(request, payload):
    table_name = payload.get('table_name')
    mssql_settings = _get_settings()

    fields = list()

    columns = payload.get("columns")
    feature_code = 'bu-bb-b'

    objectid = 'OBJECTID'

    for column in columns.values():
        fields.append(column)

    fields.append(objectid)

    select_sql = """
        SELECT [{fields}]
        FROM [dbo].[{table_name}]
    """.format(
        fields="]\n          ,[".join(fields),
        table_name=table_name,
    )

    cursor = _mssql_connection(mssql_settings)
    row = _execute_query(cursor, select_sql)
    for item in row:
        shape_sql = """
            SELECT shape.STAsText()
            FROM {table_name}
            WHERE {where_object_id} = {object_id}
        """.format(
            where_object_id=objectid,
            table_name=table_name,
            object_id=item[objectid]
        )

        cursor = _mssql_connection(mssql_settings)
        cursor = cursor.execute(shape_sql)
        value = cursor.fetchone()
        wkt = _get_wkt(value[0])
        geom = _set_3d_dim(wkt)
        # new_geo_id = _insert_mgeo_datas(feature_code, geom)

        row_datas = dict()
        property_ids = [
            property_id
            for property_id in columns.keys()
        ]

        print(property_ids)

        # _insert_mdatas(new_geo_id, row_datas, feature_code, property_ids)

    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_connection_config(request):

    configs = Config.objects.filter(name=CONNECTION_NAME).first()

    value_json = utils.json_load(configs.value)

    rsp = {**value_json}

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_connection_config(request, payload):

    config_qs = Config.objects
    config_qs = config_qs.filter(name=CONNECTION_NAME)

    values = utils.json_dumps(payload)
    config_qs.update(value=values)

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_properties(request):

    theme_code = 'bu'
    feature_code = 'bu-bb-b'

    sql = """
        select
            lp.property_id,
            lp.property_name,
            lp.property_code,
            lp.value_type_id
        from
            l_themes t
        inner join
            l_packages p
        on
            t.theme_id = p.theme_id
        inner join
            l_features f
        on
            f.package_id = p.package_id
        inner join
            l_feature_configs lfc
        on
            lfc.feature_id = f.feature_id
        inner join
            l_data_type_configs ld
        on
            lfc.data_type_id = ld.data_type_id
        inner join
            l_data_types lt
        on
            lt.data_type_id = ld.data_type_id
        inner join
            l_properties lp
        on
            lp.property_id = ld.property_id
        where t.theme_code = '{theme_code}'
        and f.feature_code = '{feature_code}'
        and lp.value_type_id != 'data-type'
        and lp.value_type_id != 'data_type'
    """.format(
        theme_code=theme_code,
        feature_code=feature_code,
    )
    cursor = connections['default'].cursor()
    cursor.execute(sql)
    rows = utils.dict_fetchall(cursor)
    rows = list(rows)

    rsp = {
        'success': True,
        'properties': rows,
    }

    return JsonResponse(rsp)
