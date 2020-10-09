import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.bundle.models import Bundle
from main.decorators import ajax_required, gov_bundle_required
from main.utils import (
    gis_delete,
    gis_fetch_one,
    gis_fields_by_oid,
    gis_insert,
    gis_table_by_oid,
    gis_tables_by_oids,
    dict_fetchall
)


def _get_changeset_display(ob):

    geom = eval(ob.geom)
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
    features = [_get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]
    feature_collection = FeatureCollection(features)
    rsp = {
        'GeoJson': feature_collection,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def table_list(request):

    rows = []
    oids = list(request.bundle.bundlegis_set.values_list('oid', flat=True))

    if len(oids):

        tables = gis_tables_by_oids(oids)

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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def rows(request, oid):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def add(request, payload, oid):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

    try:

        fields_to_update = gis_fields_by_oid(oid, exclude=['id', 'geom'])
        gis_insert(oid, fields_to_update, payload, value_default='')

        rsp = {
            'success': True,
            'info': "Амжилттай",
        }
        return JsonResponse(rsp)

    except Exception:

        rsp = {
            'success': False,
            'info': "Өгөгдлийг зөв оруулна уу!",
        }
        return HttpResponseBadRequest(json.dumps(rsp))


@require_POST
@ajax_required
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def save(request, payload, oid, pk):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def delete(request, oid, pk):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)
    gis_delete(oid, pk)

    rsp = {
        'success': True,
        'info': "Амжилттай",
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def detail(request, oid, pk):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

    row = gis_fetch_one(oid, pk)
    if not row:
        raise Http404

    rsp = {
        'values': row,
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


def tableLastfindID(table_name):
    try:
        with connections['postgis_db'].cursor() as cursor:
            sql = """ select id from {table_name} order by id desc limit 1; """.format(table_name=table_name)
            cursor.execute(sql)
            row_id = cursor.fetchone()
        return row_id
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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def updateGeom(request, payload, oid, pk):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

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
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def geomAdd(request, payload, oid):

    get_object_or_404(request.bundle.bundlegis_set, oid=oid)

    geojson = payload.get('geojson')
    fields = gis_fields_by_oid(oid)
    table = gis_table_by_oid(oid)
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

            sql = """
                INSERT INTO
                    {table}
                    ("{geom}")
                VALUES
                    (%s)
            """.format(
                table=table,
                geom=geom_field,
            )
            cursor.execute(sql, geom)
        row_id = tableLastfindID(table)[0]
        rsp = {
            'success': True,
            'info': "Амжилттай",
            'row_id': row_id
        }

    except Exception:

        rsp = {
            'success': False,
            'info': "Өгөгдлийн зөв оруулна уу!",
        }

    return JsonResponse(rsp)
