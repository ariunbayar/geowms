import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse, Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBuilding, MGeoDatas

from backend.changeset.models import ChangeSet
from backend.bundle.models import Bundle
from main.decorators import ajax_required, gov_bundle_required
from backend.inspire.models import LThemes, LPackages, LFeatures
from django.contrib.auth.decorators import user_passes_test
from django.contrib.gis.geos import GEOSGeometry, GeometryCollection, Point, LineString, LinearRing, Polygon, MultiPoint, MultiLineString, MultiPolygon, WKBWriter

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

    geom = ob.geom.replace("\'", "\"")
    geom1 = geom[:9]
    geom2 = geom[10:-2]
    geom3 = geom[-1]
    geom4 = geom1 + geom2 +geom3
    values_list = json.loads(geom4)
    coordinates = values_list['geom']['coordinates']
    geom_type = values_list['geom']['type']

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


def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': list(LFeatures.objects.filter(package_id=package.package_id).extra(select={'id': 'feature_id', 'code': 'feature_code', 'name': 'feature_name'}).values('id', 'code', 'name'))
            })
    return package_data


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
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all():
        if themes.theme_name =='Барилга, суурин газар':
            data.append({
                    'id': themes.theme_id,
                    'code': themes.theme_code,
                    'name': themes.theme_name,
                    'packages': _get_package(themes.theme_id),
                })
    rsp = {
        'success': True,
        'data': data,
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

def getGeomType(table, geom_field):

    schema = table.split('"')[1]
    table = table.split('"')[3]
    geojson = str(json)

    with connections['postgis_db'].cursor() as cursor:
        sql = """
            SELECT type
            FROM
                geometry_columns
            WHERE
                f_table_schema = '{schema}' and
                f_table_name = '{table}' and
                f_geometry_column = '{geom_field}';
        """.format(
            schema=schema,
            table=table,
            geom_field=geom_field)

        cursor.execute(sql)

        type = cursor.fetchone()
        return type
    return None


@require_GET
@ajax_required
@gov_bundle_required(Bundle.MODULE_BARILGA_SUURIN_GAZAR)
def geom_type(request, pid, fid):

    data = MGeoDatas.objects.filter(feature_id=fid).first()
    if data:
        rsp = {
            'success': True,
            'type': GEOSGeometry(data.geo_data).geom_type
        }
    else:
        rsp = {
            'success': False,
            'type': None
        }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def rows(request, pid, fid):
    cursor = connections['default'].cursor()
    sql = """
        SELECT
            geo_id as id, ST_AsGeoJSON(ST_Transform(geo_data,4326)) as geom
        FROM
            m_geo_datas
        WHERE
            feature_id = {fid}
        limit {limit}
    """.format(
        fid=fid,
        limit=1000
    )
    # geo_id='386642Ub'
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
    row = gis_fetch_one(oid, pk)

    if row:
        gis_delete(oid, pk)
        rsp = {
        'success': True,
        'info': "Амжилттай",
        }
    else:
        raise Http404

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
def updateGeom(request, payload, fid):
    geojson = payload.get('geojson')
    geo_id = payload.get('id')

    get_object_or_404(MGeoDatas, feature_id=fid, geo_id=geo_id)
    geom = GEOSGeometry(str(geojson))
    if not geom:
        rsp = {
            'success': False,
            'info': "Geojson алдаатай байна.",
        }
        return JsonResponse(rsp)
    MGeoDatas.objects.filter(geo_id=geo_id).update(geo_data=geom)
    rsp = {
        'success': True,
        'info': "Амжилттай",
    }
    return JsonResponse(rsp)



def get_rows(fid):
    cursor = connections['default'].cursor()
    sql = """
        select datas.feature_id, datas.feature_config_id, datas.data_type_id,datas.property_id, l.property_name, l.property_code,l.property_definition,l.value_type_id  
        from l_properties l
        inner join (select l_feature_configs.feature_id, l_feature_configs.feature_config_id, l_feature_configs.data_type_id,l_data_type_configs.property_id 
        from l_feature_configs
        inner join l_data_type_configs on l_data_type_configs.data_type_id = l_feature_configs.data_type_id
        where l_feature_configs.feature_id = {fid}
        ) datas
        on datas.property_id = l.property_id
    """.format(
        fid=fid
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


@require_POST
@ajax_required
def geomAdd(request, payload, fid):

    geojson = payload.get('geojson')
    fields = get_rows(fid)
    geom = GEOSGeometry(str(geojson))
    count = MGeoDatas.objects.filter(feature_id=fid).count()
    # nice = MGeoDatas.objects.create(geo_id = str(count)+'test',geo_data=geom, feature_id=fid, created_by=1, modified_by=1)
    nice = str(count)+'test'

    if nice:
        for field in fields:
            MDatasBuilding.objects.create(
                geo_id = nice,
                feature_config_id = field['feature_config_id'],
                data_type_id = field['data_type_id'],
                property_id = field['property_id'],
                created_by = 1,
                modified_by = 1
            )
        rsp = {
            'success': True,
            'info': "Ажилттай ",
        }
    else:
        rsp = {
            'success': False,
            'info': "Амжилтгүй  geom үүссэнгүй",
        }
    return JsonResponse(rsp)

