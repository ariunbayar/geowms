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

    form_datas = _get_pg_conf(conn_id)
    cursor_pg = _get_pg_cursor(form_datas)

    cursor.execute(sql)
    cursor_pg.execute(sql_pg)
    view_names = list(utils.dict_fetchall(cursor))
    table_names = list(utils.dict_fetchall(cursor_pg))
    return JsonResponse({
        'view_names': view_names or [],
        'table_names': table_names or []
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    table_fields = []
    name = payload.get('name')
    id = payload.get('id')
    value = payload.get('value')
    state_name = ''

    sql = '''
        SELECT
        attname AS column_name, format_type(atttypid, atttypmod) AS data_type
        FROM
        pg_attribute
        WHERE
        attrelid = 'public.{schema_name}'::regclass AND    attnum > 0
        ORDER  BY attnum
    '''.format(schema_name=value)

    if name == 'table_name':
        form_datas = _get_pg_conf(id)
        cursor_pg = _get_pg_cursor(form_datas)
        cursor_pg.execute(sql)
        table_fields = list(utils.dict_fetchall(cursor_pg))
        state_name = 'table_fields'

    else:
        cursor = connections['default'].cursor()
        cursor.execute(sql)
        table_fields = list(utils.dict_fetchall(cursor))
        state_name = 'view_fields'

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
