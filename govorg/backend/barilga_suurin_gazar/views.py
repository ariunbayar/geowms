import requests
import json
from geojson import Feature, FeatureCollection

from django.conf import settings
from django.db import connections
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404, get_list_or_404
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.org.models import Org
from backend.bundle.models import Bundle
from main.decorators import ajax_required
from main.utils import gis_table_by_oid, gis_fields_by_oid, dict_fetchall


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
@cache_page(settings.DEBUG and 300 or 0)
def table_list(request):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]

    oids = list(bundle.bundlegis_set.values_list('oid', flat=True))
    rows = []

    if len(oids):

        with connections['postgis_db'].cursor() as cursor:

            oids = list(bundle.bundlegis_set.values_list('oid', flat=True))

            sql = """
                SELECT
                    c.oid as "oid",
                    n.nspname as "schema",
                    c.relname as "table"
                FROM
                    pg_catalog.pg_class c
                LEFT JOIN
                    pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                WHERE
                    c.oid IN ({oids})
            """.format(
                oids=('%s, ' * len(oids))[:-2],
            )
            cursor.execute(sql, oids)
            tables = list(dict_fetchall(cursor))

        rows = [
            {
                **table,
                'fields': [
                    {
                        'name': f.attname,
                        'type': f.atttypid,
                    }
                    for f in gis_fields_by_oid(table['oid'])
                ],
            }
            for table in tables
        ]

    rsp = {
        'items': rows
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@cache_page(settings.DEBUG and 300 or 0)
def rows(request, oid):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    table = gis_table_by_oid(oid)

    fields = gis_fields_by_oid(oid)

    columns_to_select = [
        'ST_AsGeoJSON(ST_Transform(%s,4326)) AS %s' % (f.attname, f.attname) if f.atttypid == 'geometry' else '"%s"' % f.attname
        for f in fields
    ]

    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            {columns}
        FROM
            {table}
        LIMIT {limit}
    """.format(
        columns=', '.join(columns_to_select),
        table=table,
        limit=10,
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)

    rsp = {
        'rows': rows,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def add(request, payload, oid):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    fields = gis_fields_by_oid(oid)
    table = gis_table_by_oid(oid)

    fields_to_update = [
        field.attname
        for field in fields
        if field.attname not in ['id', 'geom']
    ]

    values = [
        payload.get(f, '')
        for f in fields_to_update
    ]

    try:
        with connections['postgis_db'].cursor() as cursor:

            sql = """
                INSERT INTO
                    {table}
                    ({fields})
                VALUES
                    ({values})
            """.format(
                table=table,
                fields=', '.join(['"{}"'.format(f) for f in fields_to_update]),
                values=('%s, ' * len(values))[:-2]
            )
            cursor.execute(sql, values)

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }

    except Exception as e:

        if settings.DEBUG:
            raise e

        rsp = {
            'success': False,
            'info': "Өгөгдлийн зөв оруулна уу!",
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def save(request, payload, oid, pk):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    tabne_data = gis_table_by_oid(oid)
    fields = gis_fields_by_oid(oid)
    # query set beltgeh
    fields_to_update = [
        field.attname
        for field in fields
        if field.attname not in ['id', 'geom']
    ]

    values = [
        payload.get(f, '')
        for f in fields_to_update
    ]

    try:
        with connections['postgis_db'].cursor() as cursor:
            sql = """ UPDATE {tabne_data} SET {fields} = %s WHERE id = {pk} """.format(tabne_data=tabne_data, pk=pk, fields='= %s, '.join(['"{}"'.format(f) for f in fields_to_update]))
            cursor.execute(sql, values)
        rsp = {
            'success': True,
            'info': "Амжилттай",
        }
        return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request, oid, pk):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    table = gis_table_by_oid(oid)
    try:

        with connections['postgis_db'].cursor() as cursor:

            sql = """ DELETE FROM {table} WHERE id = {pk} """.format(table=table, pk=pk)
            cursor.execute(sql)

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }

    except Exception:

        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def detail(request, oid, pk):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    table = gis_table_by_oid(oid)

    fields = gis_fields_by_oid(oid)

    columns_to_select = [
        'ST_AsGeoJSON(ST_Transform(%s,4326)) AS %s' % (f.attname, f.attname) if f.atttypid == 'geometry' else '"%s"' % f.attname
        for f in fields
    ]

    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            {columns}
        FROM
            {table}
        WHERE
            id = %s
        LIMIT 1
    """.format(
        columns=', '.join(columns_to_select),
        table=table,
    )

    cursor.execute(sql, [pk])
    rows = list(dict_fetchall(cursor))

    if len(rows) == 0:
        raise Http404

    rsp = {
        'values': rows[0],
    }
    return JsonResponse(rsp)


def geoJsonConvertGeom(json):
    geojson = str(json)
    try:
        with connections['postgis_db'].cursor() as cursor:

                    sql = """ SELECT ST_GeomFromGeoJSON(%s); """
                    cursor.execute(sql, [geojson])
                    geom = cursor.fetchone()
        return geom
    except Exception:
        return None


def findGeomField(fields):
    geom_field = None
    for field in fields:
        if field.atttypid == 'geometry':
            geom_field = field.attname
    return geom_field


@require_POST
@ajax_required
def updateGeom(request, payload, oid, pk):

    # pk = table row id
    # geojson = {"type":"Point","coordinates":[106.956508889,48.70858]} point polygon alinch bolno
    # oid = 89180 table id avna
    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    geojson = payload.get('geojson')
    table = gis_table_by_oid(oid)
    fields = gis_fields_by_oid(oid)
    geom_field = findGeomField(fields)

    geom = geoJsonConvertGeom(geojson)
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
        }
        return JsonResponse(rsp)
    try:
        with connections['postgis_db'].cursor() as cursor:
                    sql = """ UPDATE {table} SET {geom_field} = %s WHERE id = %s """.format(table=table, geom_field=geom_field)
                    cursor.execute(sql, [geom, pk])

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }
        return JsonResponse(rsp)

    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def geomAdd(request, payload, oid):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    fields = gis_fields_by_oid(oid)
    table = gis_table_by_oid(oid)
    geom_field = findGeomField(fields)
    fields_to_update = [
        field.attname
        for field in fields
        if field.attname not in ['id', geom_field]
    ]
    values = [
        payload.get(f, '')
        for f in fields_to_update
    ]

    geojson = payload.get(geom_field)
    geom = geoJsonConvertGeom(geojson)
    if geom:
        values.append(geom)
    else:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
        }
        return JsonResponse(rsp)
    try:
        with connections['postgis_db'].cursor() as cursor:

            sql = """
                INSERT INTO
                    {table}
                    ({fields}, "{geom}")
                VALUES
                    ({values})
            """.format(
                table=table,
                geom=geom_field,
                fields=', '.join(['"{}"'.format(f) for f in fields_to_update]),
                values=('%s, ' * len(values))[:-2]
            )
            cursor.execute(sql, values)
        rsp = {
            'success': True,
            'info': "Амжилттай",
        }

    except Exception as e:

        if settings.DEBUG:
            raise e

        rsp = {
            'success': False,
            'info': "Өгөгдлийн зөв оруулна уу!",
        }

    return JsonResponse(rsp)
