import requests
import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.org.models import Org
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


@require_GET
@ajax_required
def rows(request, oid):

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
            'fields': [f.attname for f in fields],
            'rows': rows,
        }
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def add(request, payload):
    oid = payload.get('oid')
    data = payload.get('data')
    tabne_data = gis_table_by_oid(oid)
    table_fields = '('
    table_rows = []
    check = False
    # query insert and value beltgeh

    for index, row in enumerate(data):
        if not row == "id":
            table_fields = table_fields + row
            table_rows.append(data[row])
            check = True
        if index < len(data) -1 and check:
            table_fields = table_fields + ', '
    table_fields = table_fields + ')'
    # ['1', '2'] convert to ('1', '2')
    table_rows = tuple(table_rows)
    # ['1', '2'] convert to ('1', '2')  end
    try:
        with connections['postgis_db'].cursor() as cursor:
                sql = """ INSERT INTO {tabne_data} {table_fields} VALUES {table_rows} """.format(
                    tabne_data=tabne_data,
                    table_fields=table_fields,
                    table_rows=table_rows,
                )
                cursor.execute(sql)
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
    pk = pk
    tabne_data = gis_table_by_oid(oid)
    table_fields_zow = ''
    data_fields = []
    data_rows = []
    check = False
    # query set beltgeh
    for index, row in enumerate(data):
        if not row == 'id':
            data_fields.append(row)
            data_rows.append(data[row])
            table_fields_zow = table_fields_zow + str(row) + '=' + "'" + str(data[row]) + "'"
            check = True
        if index < len(data) -1 and check:
            table_fields_zow = table_fields_zow + ', '
    # query set beltgeh end
    try:
        with connections['postgis_db'].cursor() as cursor:
            sql = """ UPDATE {tabne_data} SET {table_fields_zow} WHERE id = {pk} """.format(
                tabne_data=tabne_data,
                table_fields_zow=table_fields_zow,
                pk=pk,
            )
            cursor.execute(sql)
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
        return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)