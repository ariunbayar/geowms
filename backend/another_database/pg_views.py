import pyodbc
import datetime

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
    cursor = utils.check_pg_connection(host, db, port, user, password)

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

    cursor = connections['default'].cursor()
    sql = '''
        SELECT
            relname
        FROM
            pg_class
        WHERE
            relkind = 'm'
    '''

    sql_pg = '''
        SELECT
            table_name
        FROM
            information_schema.tables
        WHERE
            table_type='BASE TABLE'
            and table_schema='public'
    '''

    cursor_pg = _get_cursor_pg(conn_id)
    view_names = _get_sql_execute(sql, cursor, 'all')
    table_names = _get_sql_execute(sql_pg, cursor_pg, 'all')

    return JsonResponse({
        'view_names': view_names or [],
        'table_names': table_names or []
    })


def _get_pg_table_fields(schema_name, cursor):
    sql = '''
        SELECT
        attname AS column_name, format_type(atttypid, atttypmod) AS data_type
        FROM
        pg_attribute
        WHERE
        attrelid = 'public.{schema_name}'::regclass AND    attnum > 0
        ORDER  BY attnum
    '''.format(schema_name=schema_name)
    table_fields = _get_sql_execute(sql, cursor, 'all')
    return table_fields


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):

    table_fields = []
    state_name = ''
    cursor = []
    name = payload.get('name')
    id = payload.get('id')
    value = payload.get('value')

    if name == 'table_name':
        cursor = _get_cursor_pg(id)
        state_name = 'table_fields'

    else:
        cursor = connections['default'].cursor()
        state_name = 'view_fields'

    table_fields = _get_pg_table_fields(value, cursor)

    return JsonResponse({
        'state_name': state_name,
        'table_fields': table_fields or []
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_table(request, payload):
    table_id = payload.get('table_id')
    id = payload.get('id')
    matched_feilds = payload.get('matched_feilds')
    view_name = payload.get('view_name')
    table_name = payload.get('table_name')

    another_database = get_object_or_404(AnotherDatabase, pk=id)
    AnotherDatabaseTable.objects.update_or_create(
        pk=table_id,
        defaults={
            'table_name': table_name,
            'feature_code': view_name,
            'field_config': utils.json_dumps(matched_feilds),
            'another_database': another_database,
            'created_by': request.user
        }
    )
    return JsonResponse({
        'success': True,
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def table__detail(request, id, table_id):
    another_db_tb = get_object_or_404(AnotherDatabaseTable, pk=table_id)
    field_config = another_db_tb.field_config.replace("'", '"')
    field_config = utils.json_load(field_config)

    cursor = connections['default'].cursor()
    view_fields = _get_pg_table_fields(another_db_tb.feature_code, cursor)

    cursor_pg = _get_cursor_pg(id)
    table_fields = _get_pg_table_fields(another_db_tb.table_name, cursor_pg)
    form_datas = {
        'id': another_db_tb.id,
        'field_config': field_config,
        'table_name': another_db_tb.table_name,
        'feature_code': another_db_tb.feature_code,
        'view_fields': view_fields,
        'table_field_names': table_fields
    }

    return JsonResponse({
        'success': True,
        'form_datas': form_datas
    })


def _get_count_of_someone_db_table(table_name, cursor):
    sql = '''
        select
            count(*)
        from
            {table_name}
    '''.format(
        table_name=table_name
    )

    row_count = _get_sql_execute(sql, cursor, 'one')

    return row_count


def _insert_to_someone_db(table_name, cursor_pg, cursor, columns, feature_code):

    number_of_row = _get_count_of_someone_db_table(table_name, cursor_pg)
    if number_of_row[0] and columns:
        matched_columns = []
        for i in columns:
            matched_columns.append(i['view_field'])

        matched_columns = ','.join(matched_columns)

        sql = '''
            select
                {column}
            from
                {view_name}
            limit
                {row_count}
        '''.format(
            view_name=feature_code,
            row_count=number_of_row[0],
            column=matched_columns
        )
        view_datas = _get_sql_execute(sql, cursor, 'all')
        for view in view_datas:
            sql_update = '''
            '''

    return True


@require_GET
@csrf_exempt
def refresh_datas(request, id):

    ano_db = get_object_or_404(AnotherDatabase, pk=id)
    ano_db_table_pg = AnotherDatabaseTable.objects
    ano_db_table_pg = ano_db_table_pg.filter(another_database=ano_db)

    cursor_pg = _get_cursor_pg(id)
    cursor = connections['default'].cursor()

    for table in ano_db_table_pg:
        table_name = table.table_name
        field_config = table.field_config.replace("'", '"')
        columns = utils.json_load(field_config)
        feature_code = table.feature_code

        _insert_to_someone_db(table_name, cursor_pg, cursor, columns, feature_code)

    # ano_db.database_updated_at = datetime.datetime.now()
    # ano_db.save()

    rsp = {
        'success': True,
    }
