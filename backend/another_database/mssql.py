import pyodbc
import datetime

from django.contrib.gis.geos import GEOSGeometry
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.db import connections
from django.shortcuts import get_object_or_404

from backend.inspire.models import LFeatures, LPackages, MGeoDatas
from backend.inspire.models import MDatas
from backend.inspire.models import LProperties
from backend.another_database.models import AnotherDatabase
from backend.another_database.models import AnotherDatabaseTable

from main.decorators import ajax_required
from main import utils

# Create your views here.

################################## MSSQL ############################################

# driver suulgah zaawar
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


def _get_connection_from_db(connection_id):
    db_qs = AnotherDatabase.objects
    db_qs = db_qs.filter(pk=connection_id)
    db_qs = db_qs.first()
    return db_qs


def _get_settings(connection_id):
    db = _get_connection_from_db(connection_id)
    mssql_settings = utils.json_load(db.connection)
    mssql_settings = _mssql_settings(**mssql_settings)
    return mssql_settings, db


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


def _insert_mgeo_datas(feature_code, geom, db):
    feature = utils.get_feature_from_code(feature_code)
    new_geo_id = utils.GEoIdGenerator(feature.feature_id, feature.feature_code).get()
    new_geo = MGeoDatas.objects.create(
        geo_id=new_geo_id,
        geo_data=geom,
        feature_id=feature.feature_id,
        created_by=db.unique_id
    )
    return new_geo.geo_id


def _insert_mdatas(geo_id, row_datas, feature_code, property_ids, db):
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_id__in=property_ids)
    prop_codes = list(prop_qs.values_list('property_code', flat=True))
    for prop_code in prop_codes:
        data, value_type = utils.get_filter_dicts(prop_code, feature_code=feature_code)
        for property_id, value in row_datas.items():
            if str(data['property_id']) == str(property_id):
                mdata_value = dict()
                mdata_value[value_type] = value
                MDatas.objects.create(
                    geo_id=geo_id,
                    **data,
                    **mdata_value,
                    created_by=db.unique_id
                )


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_attributes(request, payload):
    table_name = payload.get('table_name')
    connection_id = payload.get('id')
    mssql_settings, db = _get_settings(connection_id)

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
def get_all_table_names(request, payload):
    table_names = []
    connection_id = payload.get('connection_id')
    table_id = payload.get('table_id')
    mssql_settings, db = _get_settings(connection_id)

    ano_db_table_qs = AnotherDatabaseTable.objects
    ano_db_table_qs = ano_db_table_qs.filter(pk=table_id)
    ano_db_table = list(ano_db_table_qs.values())
    if ano_db_table:
        ano_db_table = ano_db_table[0]
        ano_db_table['field_config'] = utils.json_dumps(ano_db_table['field_config'])
    else:
        ano_db_table = {}

    sql = """
        SELECT
            TABLE_NAME as table_name
        FROM
            INFORMATION_SCHEMA.TABLES
        order by TABLE_NAME
    """.format(data_base=mssql_settings['database'])
    cursor = _mssql_connection(mssql_settings)
    cursor.execute(sql)
    if cursor:
        table_names = list(utils.dict_fetchall(cursor))

    rsp = {
        'success': True,
        'table_names': table_names,
        'ano_db_table': ano_db_table,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_to_ano_db_table(request, payload):
    ano_db_table_qs = AnotherDatabaseTable.objects
    payload['field_config'] = utils.json_dumps(payload['field_config'])
    print(payload)
    insert_datas = {
        key: value
        for key, value in payload.items()
        if key != 'table_id'
    }
    print(insert_datas)
    insert_datas['updated_by'] = request.user
    ano_db_table_qs.update_or_create(
        pk=payload['table_id'],
        defaults={
            **insert_datas,
        }
    )
    rsp = {
        'success': True
    }
    return JsonResponse(rsp)


def _insert_to_inspire(table_name, connection_id, columns, feature_code):
    mssql_settings, db = _get_settings(connection_id)

    fields = list()

    objectid = 'OBJECTID'

    fields = [column for column in columns.keys()]
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
        if value:
            wkt = _get_wkt(value[0])
            geom = _set_3d_dim(wkt)
            new_geo_id = _insert_mgeo_datas(feature_code, geom, db)

            print(new_geo_id)

            row_datas = dict()
            property_ids = list()
            for field_name, property_id in columns.items():
                property_ids.append(property_id)
                row_datas[property_id] = item[field_name]

            _insert_mdatas(new_geo_id, row_datas, feature_code, property_ids, db)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


def _get_theme_code(feature_code):
    return feature_code.split('-')[0]


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_properties(request, feature_code):

    theme_code = _get_theme_code(feature_code)

    sql = """
        select
            lp.property_id,
            lp.property_name,
            lp.property_code,
            lp.value_type_id,
            lt.data_type_name
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


def _delete_mgeo_mdata(unique_id):
    mgeo_qs = MGeoDatas.objects.filter(created_by=unique_id)
    if mgeo_qs:
        mgeo_qs.delete()
    mdata_qs = MDatas.objects.filter(created_by=unique_id)
    if mdata_qs:
        mdata_qs.delete()


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def refresh_datas(request, connection_id):
    ano_db = get_object_or_404(AnotherDatabase, pk=connection_id)
    ano_db_tablesqs = AnotherDatabaseTable.objects
    ano_db_tablesqs = ano_db_tablesqs.filter(another_database=ano_db)

    unique_id = ano_db.unique_id
    _delete_mgeo_mdata(unique_id)

    for table in ano_db_tablesqs:
        table_name = table.table_name
        connection_id = ano_db.id

        field_config = table.field_config.replace("'", '"')
        columns = utils.json_load(field_config)
        feature_code = table.feature_code

        print(columns)

        _insert_to_inspire(table_name, connection_id, columns, feature_code)

    ano_db.database_updated_at = datetime.datetime.now()
    ano_db.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
