import requests
import json
from geojson import Feature, FeatureCollection

from django.conf import settings
from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, get_list_or_404
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET, require_POST

from backend.bundle.models import Bundle
from backend.changeset.models import ChangeSet
from backend.org.models import Org
from main.decorators import ajax_required
from main.utils import dict_fetchall
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
def testGet(request):
    # find_cursor = connections['postgis_db'].cursor()
    find_cursor2 = connections['postgis_db'].cursor()
    # find_cursor.execute(''' SELECT  code, name, ST_X(ST_TRANSFORM(ST_CENTROID(geom),4326)), ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4326))) FROM public.test_polygon ORDER BY name ASC ''')
    find_cursor2.execute(''' SELECT id, ST_AsGeoJSON(ST_Transform(geom,4326)) as geom FROM public.test_polygon limit 1 ''')
    geojson = find_cursor2.fetchall()
    if(geojson):
        rsp = {
            'success': True,
            'info': geojson
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def saveJson(request, payload, oid):
    print("Hahaha")
    data = payload.get('data')
    print(data)
    print(data)
    print(data)
    print(data)
    print(oid)
    print(oid)
    print(oid)
    print(oid)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@cache_page(settings.DEBUG and 300 or 0)
def table_list(request):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_TEEVRIIN_SULJEE)[0]

    oids = list(bundle.bundlegis_set.values_list('oid', flat=True))
    rows = []

    if len(oids):

        with connections['postgis_db'].cursor() as cursor:

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
            rows = list(dict_fetchall(cursor))

    rsp = {
        'items': rows
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@cache_page(settings.DEBUG and 300 or 0)
def rows(request, oid):

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_TEEVRIIN_SULJEE)[0]
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
        'data': {
            'fields': [
                {
                    'name': f.attname,
                    'type': f.atttypid,
                }
                for f in fields
            ],
            'rows': rows,
        }
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def add(request, payload):

    oid = payload.get('oid')
    data = payload.get('data')

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_TEEVRIIN_SULJEE)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    fields = gis_fields_by_oid(oid)

    tabne_data = gis_table_by_oid(oid)
    table_fields = '('
    table_rows = []
    table_fields_real = []
    table_fields_json = []
    check = False
    # query insert and value beltgeh
    for f in fields:
        table_fields_real.append(f.attname)

    for index, row in enumerate(data):
        table_fields_json.append(row)
        if not row == "id":
            table_fields = table_fields + row
            table_rows.append(data[row])
            check = True
        if index < len(data) -1 and check:
            table_fields = table_fields + ', '
    table_fields = table_fields + ')'
    count = 0
    for real in table_fields_real:
        for jsons in table_fields_json:
            if real == jsons:
                count = count + 1
    if not len(table_fields_real) == count:
        rsp = {
            'success': False,
            'info': "Хүснэгтийн нэр буруу байна.",
        }
        return JsonResponse(rsp)

    # ['1', '2'] convert to ('1', '2')
    # table_rows = tuple(table_rows)
    # ['1', '2'] convert to ('1', '2')  end
    try:
        with connections['postgis_db'].cursor() as cursor:
                sql = """ INSERT INTO {tabne_data} {table_fields} VALUES ({values}) """.format(
                    tabne_data=tabne_data,
                    table_fields=table_fields,
                    values=('%s, ' * len(table_rows))[:-2]
                )
                cursor.execute(sql, table_rows)
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
def save(request, payload, pk):

    oid = payload.get('oid')
    data = payload.get('data')

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_TEEVRIIN_SULJEE)[0]
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
def delete(request, payload, pk):

    oid = payload.get('oid')

    org = get_object_or_404(Org, employee__user=request.user)
    bundle = get_list_or_404(Bundle, module=Bundle.MODULE_TEEVRIIN_SULJEE)[0]
    get_object_or_404(bundle.bundlegis_set, oid=oid)

    tabne_data = gis_table_by_oid(oid)

    try:

        with connections['postgis_db'].cursor() as cursor:
                sql = """ DELETE FROM {tabne_data} where id = {pk} """.format(
                    tabne_data=tabne_data,
                    pk=pk,
                )
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
