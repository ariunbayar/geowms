from collections import namedtuple

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse, Http404
from django.views.decorators.http import require_GET
from django.db import connections

from main.decorators import ajax_required


def _named_tuple_fetchall(cursor):
    """ Return all rows from a cursor as a namedtuple """
    desc = cursor.description
    nt_result = namedtuple('Result', [col[0] for col in desc])
    for row in cursor.fetchall():
        yield nt_result(*row)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def table_list(request):

    sql = """
        SELECT
           schemaname,
           tablename
        FROM
            pg_catalog.pg_tables
        WHERE
            schemaname != 'pg_catalog' AND
            schemaname != 'information_schema'
    """

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql)
        tables_display = [
            {
                'schemaname': table.schemaname,
                'tablename': table.tablename,
            }
            for table in _named_tuple_fetchall(cursor)
        ]

    rsp = {
        'items': tables_display,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def field_list(request, schema, table):

    if schema.startswith('pg_') or table.startswith('pg_'):
        raise Http404

    sql = """
        SELECT
            attname,
            atttypid::regtype AS atttypid
        FROM
            pg_catalog.pg_attribute
        WHERE
            attrelid = %s::regclass
            AND NOT attisdropped
        ORDER BY
            attnum ASC
    """

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, ['"%s"."%s"' % (schema, table)])
        fields_display = [
            {
                'name': field.attname,
                'type': field.atttypid,
            }
            for field in _named_tuple_fetchall(cursor)
        ]

    rsp = {
        'items': fields_display,
    }

    return JsonResponse(rsp)
