import requests
import json
from geojson import Feature, FeatureCollection
from collections import namedtuple

from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.org.models import Org
from main.decorators import ajax_required


def _get_changeset_display(ob):

    geom= eval(ob.geom)
    geometry = eval(geom['geom'])
    coordinates = geometry['coordinates']
    geom_type = geometry['type']

    return {
        'coordinate':coordinates,
        'geom_type':geom_type,
        'changeset_id':ob.id,
        'changeset_attributes':ob.features,
        'projection': ob.projection
    }

def _get_feature_coll(ob, changeset_list):
    geom_type = changeset_list[ob]['geom_type']
    if geom_type == 'Point':
        from geojson import Point
        point = Point((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)
    elif geom_type == 'LineString':
        from geojson import LineString
        point = LineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'Polygon':
        from geojson import Polygon
        point = Polygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'MultiPoint':
        from geojson import MultiPoint
        point = MultiPoint((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


    elif geom_type == 'MultiLineString':
        from geojson import MultiLineString
        point = MultiLineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


    else:
        from geojson import MultiPolygon
        point = MultiPolygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


@require_GET
@ajax_required
def changeset_all(request):

    feature = []
    geoJson = []
    changeset_list = [_get_changeset_display(ob) for ob in ChangeSet.objects.all()]
    features = [ _get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]
    feature_collection = FeatureCollection(features)
    rsp = {
        'GeoJson': feature_collection,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def table_list(request):

    org = get_object_or_404(Org, employee__user=request.user)

    rsp = {
        'items': [
            {
                'oid': 88363,
                'schema': 'public',
                'table': 'AU_SumUnit',
            },
            {
                'oid': 83299,
                'schema': 'public',
                'table': 'AU_StateUnit',
            },
            {
                'oid': 83311,
                'schema': 'public',
                'table': 'AU_AimagUnit',
            },
            {
                'oid': 59907,
                'schema': 'public',
                'table': 'AddressPoint',
            },
            {
                'oid': 24149,
                'schema': 'public',
                'table': 'AdmUnitSum',
            },
            {
                'oid': 24630,
                'schema': 'public',
                'table': 'AdmUnitUls',
            },
            {
                'oid': 35684,
                'schema': 'public',
                'table': 'Sand',
            },
            {
                'oid': 85312,
                'schema': 'public',
                'table': 'Shuudan_uilchilgeenii_salbaruud',
            },
        ]
    }

    return JsonResponse(rsp)


def table_name_schema(oid):

    sql = """
		SELECT
            c.oid as "oid",
            n.nspname as "schema",
            c.relname as "name"
        FROM
            pg_catalog.pg_class c
        LEFT JOIN
            pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind IN ('r', 'p', '', 'v', 'm')
              AND n.nspname <> 'pg_catalog'
              AND n.nspname <> 'information_schema'
          AND pg_catalog.pg_table_is_visible(c.oid)
		  AND c.oid = %s;
    """
    cursor = connections['postgis_db'].cursor()

    cursor.execute(sql, [oid])
    table = cursor.fetchone()
    tables_display = {
            'oid': table[0],
            'schemaname': table[1],
            'tablename': table[2],
        }

    return tables_display


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
def rows(request, oid):
    tabne_data = table_name_schema(oid)
    schema = tabne_data['schemaname']
    table = tabne_data['tablename']
    org = get_object_or_404(Org, employee__user=request.user)

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
    fields = []
    for i in fields_display:
        fields.append(i['name'])
    rsp = {
        'data': {
            'fields': fields,
            'rows': rows,
        }
    }
    return JsonResponse(rsp)
