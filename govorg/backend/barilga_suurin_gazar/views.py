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
        '"{}"'.format(field.attname)
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
                fields=', '.join(fields_to_update),
                values=('%s, ' * len(values))[:-2]
            )
            cursor.execute(sql, values)

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }

    except Exception:

        rsp = {
            'success': False,
            'info': "Өгөгдлийн зөв оруулна уу!",
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def save(request, payload, oid, pk):

    data = payload.get('data')

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    tabne_data = gis_table_by_oid(oid)
    fields = gis_fields_by_oid(oid)
    table_fields_zow = ''
    data_fields_json = []
    table_fields_real = []
    data_fields = []
    data_rows = []
    check = False
    for f in fields:
        table_fields_real.append(f.attname)
    # query set beltgeh
    for index, row in enumerate(data):
        data_fields_json.append(row)
        if not row == 'id':
            data_fields.append(row)
            data_rows.append(data[row])
            table_fields_zow = table_fields_zow + str(row) + '=' + '%s'
            check = True
        if index < len(data) -1 and check:
            table_fields_zow = table_fields_zow + ', '
    # query set beltgeh end

    count = 0
    for real in table_fields_real:
        for jsons in data_fields_json:
            if real == jsons:
                count = count + 1
    if not len(table_fields_real) == count:
        rsp = {
            'success': False,
            'info': "Хүснэгтийн нэр буруу байна.",
        }
        return JsonResponse(rsp)
    try:
        with connections['postgis_db'].cursor() as cursor:
            sql = """ UPDATE {tabne_data} SET {table_fields_zow} WHERE id = {pk} """.format(
                tabne_data=tabne_data,
                table_fields_zow=table_fields_zow,
                pk=pk,
            )
            cursor.execute(sql, data_rows)
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
def delete(request, payload, oid, pk):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_BARILGA_SUURIN_GAZAR)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    table = gis_table_by_oid(oid)

    try:

        with connections['postgis_db'].cursor() as cursor:

            sql = """
                DELETE FROM
                    {table}
                WHERE id = %s
            """.format(table=table)

            cursor.execute(sql, [pk])

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
