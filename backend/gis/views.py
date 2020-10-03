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


def _dict_fetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    for row in cursor.fetchall():
        yield dict(zip(columns, row))


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
        ORDER BY
            schemaname, tablename
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

    if '\'' in schema + table or '"' in schema + table:
        raise Http404

    """
    postgis_db=# select ST_GeometryType(geom) from public.mpoint7 limit 1;
    -[ RECORD 1 ]---+---------
    st_geometrytype | ST_Point

    postgis_db=# select pg_typeof(geom) from public.mpoint7 limit 1;
    -[ RECORD 1 ]-------
    pg_typeof | geometry
    """

    # public.mpoint1

    sql = """
        ********* QUERY **********
        SELECT c.oid,
          n.nspname,
          c.relname
        FROM pg_catalog.pg_class c
             LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname OPERATOR(pg_catalog.~) '^(mpoint1)$' COLLATE pg_catalog.default
          AND n.nspname OPERATOR(pg_catalog.~) '^(public)$' COLLATE pg_catalog.default
        ORDER BY 2, 3;
        **************************

        ********* QUERY **********
        SELECT c.relchecks, c.relkind, c.relhasindex, c.relhasrules, c.relhastriggers, c.relrowsecurity, c.relforcerowsecurity, false AS relhasoids, c.relispartition, '', c.reltablespace, CASE WHEN c.reloftype = 0 THEN '' ELSE c.reloftype::pg_catalog.regtype::pg_catalog.text END, c.relpersistence, c.relreplident, am.amname
        FROM pg_catalog.pg_class c
         LEFT JOIN pg_catalog.pg_class tc ON (c.reltoastrelid = tc.oid)
        LEFT JOIN pg_catalog.pg_am am ON (c.relam = am.oid)
        WHERE c.oid = '82516';
        **************************

        ********* QUERY **********
        SELECT a.attname,
          pg_catalog.format_type(a.atttypid, a.atttypmod),
          (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid, true) for 128)
           FROM pg_catalog.pg_attrdef d
           WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef),
          a.attnotnull,
          (SELECT c.collname FROM pg_catalog.pg_collation c, pg_catalog.pg_type t
           WHERE c.oid = a.attcollation AND t.oid = a.atttypid AND a.attcollation <> t.typcollation) AS attcollation,
          a.attidentity,
          a.attgenerated
        FROM pg_catalog.pg_attribute a
        WHERE a.attrelid = '82516' AND a.attnum > 0 AND NOT a.attisdropped
        ORDER BY a.attnum;
        **************************

        ********* QUERY **********
        SELECT pol.polname, pol.polpermissive,
          CASE WHEN pol.polroles = '{0}' THEN NULL ELSE pg_catalog.array_to_string(array(select rolname from pg_catalog.pg_roles where oid = any (pol.polroles) order by 1),',') END,
          pg_catalog.pg_get_expr(pol.polqual, pol.polrelid),
          pg_catalog.pg_get_expr(pol.polwithcheck, pol.polrelid),
          CASE pol.polcmd
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT'
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            END AS cmd
        FROM pg_catalog.pg_policy pol
        WHERE pol.polrelid = '82516' ORDER BY 1;
        **************************

        ********* QUERY **********
        SELECT oid, stxrelid::pg_catalog.regclass, stxnamespace::pg_catalog.regnamespace AS nsp, stxname,
          (SELECT pg_catalog.string_agg(pg_catalog.quote_ident(attname),', ')
           FROM pg_catalog.unnest(stxkeys) s(attnum)
           JOIN pg_catalog.pg_attribute a ON (stxrelid = a.attrelid AND
                a.attnum = s.attnum AND NOT attisdropped)) AS columns,
          'd' = any(stxkind) AS ndist_enabled,
          'f' = any(stxkind) AS deps_enabled,
          'm' = any(stxkind) AS mcv_enabled
        FROM pg_catalog.pg_statistic_ext stat WHERE stxrelid = '82516'
        ORDER BY 1;
        **************************

        ********* QUERY **********
        SELECT pubname
        FROM pg_catalog.pg_publication p
        JOIN pg_catalog.pg_publication_rel pr ON p.oid = pr.prpubid
        WHERE pr.prrelid = '82516'
        UNION ALL
        SELECT pubname
        FROM pg_catalog.pg_publication p
        WHERE p.puballtables AND pg_catalog.pg_relation_is_publishable('82516')
        ORDER BY 1;
        **************************

        ********* QUERY **********
        SELECT c.oid::pg_catalog.regclass FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i WHERE c.oid=i.inhparent AND i.inhrelid = '82516' AND c.relkind != 'p' ORDER BY inhseqno;
        **************************

        ********* QUERY **********
        SELECT c.oid::pg_catalog.regclass,       pg_catalog.pg_get_expr(c.relpartbound, c.oid),       c.relkind FROM pg_catalog.pg_class c, pg_catalog.pg_inherits i WHERE c.oid=i.inhrelid AND i.inhparent = '82516' ORDER BY pg_catalog.pg_get_expr(c.relpartbound, c.oid) = 'DEFAULT',          c.oid::pg_catalog.regclass::pg_catalog.text;
        **************************
    """

    with connections['postgis_db'].cursor() as cursor:

        sql = """
            SELECT
                attname,
                atttypid::regtype AS atttypid
            FROM
                pg_catalog.pg_attribute
            WHERE
                attrelid = %s::regclass
                AND NOT attisdropped
                AND attnum > 0
            ORDER BY
                attnum ASC
        """

        cursor.execute(sql, ['"%s"."%s"' % (schema, table)])
        fields = list(_named_tuple_fetchall(cursor))

    columns_to_select = [
        'SUBSTR(ST_AsText("%s"), 0, 26) AS %s' % (f.attname, f.attname) if f.atttypid == 'geometry' else '"%s"' % f.attname
        for f in fields
    ]

    with connections['postgis_db'].cursor() as cursor:
        sql = """
            SELECT
                {columns}
            FROM
                "{schema}"."{table}"
            LIMIT {limit}
        """.format(
            columns=', '.join(columns_to_select),
            schema=schema,
            table=table,
            limit=10,
        )
        cursor.execute(sql)
        rows = list(_dict_fetchall(cursor))

    fields_display = [
        {
            'name': field.attname,
            'type': field.atttypid,
        }
        for field in fields
    ]

    rows_display = rows

    rsp = {
        'items': fields_display,
        'data': rows_display,
    }

    return JsonResponse(rsp)
