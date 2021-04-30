import pyodbc
import datetime
import psycopg2

from django.contrib.gis.geos import GEOSGeometry
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.db import connections
from django.shortcuts import get_object_or_404

from backend.another_database.models import AnotherDatabase
from backend.another_database.models import AnotherDatabaseTable
from main.components import Datatable
from django.views.decorators.csrf import csrf_exempt

from main.decorators import ajax_required
from main import utils

from backend.inspire.models import (
    LFeatures,
    LThemes,
    LPackages,
    LFeatures,
    LDataTypeConfigs,
    LFeatureConfigs,
    LProperties,
    LValueTypes,
    LCodeListConfigs,
    LCodeLists,
    LDataTypes
)


def _get_pg_conf(conn_id):
    another_db = get_object_or_404(AnotherDatabase, pk=conn_id)
    connection = utils.json_load(another_db.connection)
    form_datas = {
        'id': conn_id,
        'name': another_db.name,
        'definition': another_db.definition,
        'pg_host': connection.get('server'),
        'pg_port': connection.get('port'),
        'pg_username': connection.get('username'),
        'pg_password': connection.get('password'),
        'pg_database': connection.get('database'),
    }
    return form_datas


def _get_cursor_pg(conn_id):
    form_datas = _get_pg_conf(conn_id)
    cursor_pg = _get_pg_cursor(form_datas)
    return cursor_pg


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def config_detail(request, pk):

    rsp = {
        'success': True,
        'values': _get_pg_conf(pk)
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_pg_table_list(request, payload, pk):
    another_database = get_object_or_404(AnotherDatabase, pk=pk)

    оруулах_талбарууд = ['id', 'table_name', 'feature_code', 'updated_at', 'created_at', 'another_database_id']
    initial_qs = AnotherDatabaseTable.objects.filter(another_database=another_database)
    if not initial_qs:
        rsp = {
            'items': [],
            'page': payload.get("page"),
            'total_page': 1
        }

        return JsonResponse(rsp)
    datatable = Datatable(
        model=AnotherDatabaseTable,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд,
        initial_qs=initial_qs
    )

    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page
    }

    return JsonResponse(rsp)


def _get_pg_cursor(conn_details):
    host = conn_details.get('pg_host')
    port = conn_details.get('pg_port')
    user = conn_details.get('pg_username')
    password = conn_details.get('pg_password')
    db = conn_details.get('pg_database')
    try:
        cursor = utils.check_pg_connection(host, db, port, user, password)
    except Exception:
        cursor = []
    return cursor


def _get_sql_execute(sql, cursor, fetch_type):
    cursor.execute(sql)
    if fetch_type == 'one':
        values = list(cursor.fetchone())
    else:
        values = list(utils.dict_fetchall(cursor))
    return values


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_pg_table_names(request, conn_id):
    themes = LThemes.objects.all()
    l_themes = []
    l_packages = []
    l_features = []
    for theme in themes:
        theme_name = theme.theme_name
        theme_id = theme.theme_id
        l_themes.append({
            'name': theme_name,
            'code': theme_id
        })
        packages = LPackages.objects.filter(theme_id=theme.theme_id)
        for package in packages:
            package_id = package.package_id
            l_packages.append({
                'name': package.package_name,
                'code': package_id,
                'parent': theme_id
            })

            features = LFeatures.objects.filter(package_id=package_id)
            for feat in features:
                l_features.append({
                    'name': feat.feature_name,
                    'code': feat.feature_id,
                    'parent': feat.package_id
                })


    return JsonResponse({
        'themes': l_themes,
        'packages': l_packages,
        'features': l_features
    })



@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    feature_id = payload.get('feature_id')

    value_types = ['boolean', 'multi-select', 'single-select']
    data_types_datas = []
    data_type_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('data_type_id', flat=True))

    for data_type_id in data_type_ids:
        properties = list(LDataTypeConfigs.objects.filter(data_type_id=data_type_id).values_list('property_id', flat=True))
        data_types = LDataTypes.objects.filter(data_type_id=data_type_id).first()
        if data_types and properties:
            properties_data = []
            for property_id in properties:
                single_property = LProperties.objects.filter(property_id=property_id).first()
                code_data_list = []
                if single_property:
                    if single_property.value_type_id in value_types:
                        code_lists = LCodeLists.objects.filter(property_id=property_id)
                        for code_list in code_lists:
                            code_data_list.append({
                                'code_list_name': code_list.code_list_name,
                                'code_list_code': code_list.code_list_code,
                                'code_list_id': code_list.code_list_id
                            })

                    properties_data.append({
                        'property_name': single_property.property_name,
                        'property_id': single_property.property_id,
                        'code_list': code_data_list
                    })

            data_types_datas.append({
                'data_type_name': data_types.data_type_name,
                'data_type_eng': data_types.data_type_name_eng,
                'properties': properties_data
            })

    return JsonResponse({
        'data_type_list': data_types_datas
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_table(request, payload):
    table_id = payload.get('table_id')
    id = payload.get('id')
    feature_name = payload.get('feature_name')
    table_name = payload.get('table_name')
    id_list = payload.get('id_list')
    if not table_name:
        return JsonResponse({
            'success': False,
            'info': 'Table-ийн нэр хоосон байна !!!'
        })
    feature_name = get_object_or_404(LFeatures, feature_id=feature_name)
    another_database = get_object_or_404(AnotherDatabase, pk=id)
    AnotherDatabaseTable.objects.update_or_create(
        pk=table_id,
        defaults={
            'table_name': table_name,
            'feature_code': feature_name.feature_name,
            'field_config': utils.json_dumps(id_list),
            'another_database': another_database,
            'created_by': request.user
        }
    )
    return JsonResponse({
        'success': True,
        'info': 'Амжилттай хадгалагдлаа'
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def table__detail(request, id, table_id):
    another_db_tb = get_object_or_404(AnotherDatabaseTable, pk=table_id)
    field_config = another_db_tb.field_config.replace("'", '"')
    field_config = utils.json_load(field_config)
    feature = LFeatures.objects.filter(feature_name=another_db_tb.feature_code).first()
    package = LPackages.objects.filter(package_id=feature.package_id).first()

    form_datas = {
        'id_list': field_config,
        'table_name': another_db_tb.table_name,
        'feature_name': feature.feature_id,
        'theme_name': package.theme_id,
        'package_name': package.package_id
    }

    return JsonResponse({
        'success': True,
        'form_datas': form_datas
    })



def _get_row_to_list(field_name, dict_data):
    row_list = []
    for i in dict_data:
        row_list.append(i[field_name])
    return row_list


def _insert_to_someone_db(table_name, cursor, columns, feature_id):
    columns.sort()
    feature_id = LFeatures.objects.filter(feature_name=feature_id).first().feature_id
    fields = list(LProperties.objects.filter(property_id__in=columns).values_list('property_code', flat=True))
    feature_config_id = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('feature_config_id', flat=True))

    detete_query = '''
        DROP TABLE IF EXISTS public.{table_name}
    '''.format(table_name=table_name)
    crosstab_query = '''
        CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public
    '''

    try:
        query = '''
            CREATE TABLE public.{table_name}
                AS
            SELECT
                d.geo_id,
                d.geo_data,
                {columns},
                d.feature_id
            FROM
                crosstab('
                    select
                        b.geo_id,
                        b.property_id,
                        COALESCE(
                            b.code_list_id::character varying(1000),
                            b.value_text::character varying(1000),
                            b.value_number::character varying(1000),
                            b.value_date::character varying(1000)
                        ) as value_text
                    from
                        public.m_datas b
                    inner join
                        m_geo_datas mg
                    on
                        mg.geo_id = b.geo_id
                    and
                        mg.feature_id = {feature_id}
                    where
                        property_id in ({properties})
                    and
                        feature_config_id in ({feature_config_id})
                    order by 1,2'::text
                )
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text
        '''.format(
                table_name = table_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in columns]),
                feature_config_id=', '.join(['{}'.format(f) for f in feature_config_id]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]),
                feature_id=feature_id,
        )
        query_index = ''' CREATE UNIQUE INDEX {table_name}_index ON {table_name}(geo_id) '''.format(table_name=table_name)

        with connections['default'].cursor() as cursor:
            cursor.execute(crosstab_query)
            cursor.execute(detete_query)
            cursor.execute(query)
            cursor.execute(query_index)
        return True
    except Exception:
        return False


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_pg_table(request, id, table_id):

    pg_table = AnotherDatabaseTable.objects.filter(pk=table_id)
    pg_table.delete()
    return JsonResponse({
        'success': True,
    })


@require_GET
@csrf_exempt
def refresh_datas(request, id):

    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(another_database=ano_db)

    cursor_pg = _get_cursor_pg(id)
    success = True
    for table in ano_db_table_pg:
        table_name = table.table_name
        field_config = table.field_config.replace("'", '"')
        columns = utils.json_load(field_config)
        feature_code = table.feature_code
        success = _insert_to_someone_db(table_name, cursor_pg, columns, feature_code)
        if not success:
            return JsonResponse({
                'success': success,
                'info': table_name.upper() + '-ийг шинэчилэхэд алдаа гарлаа'
            })

    ano_db.database_updated_at = datetime.datetime.now()
    ano_db.save()

    return JsonResponse({
        'success': success,
    })
