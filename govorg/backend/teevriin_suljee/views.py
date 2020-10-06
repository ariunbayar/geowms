import requests
import json
from geojson import Feature, FeatureCollection
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404

from backend.changeset.models import ChangeSet
from django.db import connections
from main.decorators import ajax_required
from django.db import connections
from backend.org.models import Org



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