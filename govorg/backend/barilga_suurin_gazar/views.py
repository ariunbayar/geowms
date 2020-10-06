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
                'schema': 'public',
                'name': 'AU_SumUnit',
            },
            {
                'schema': 'public',
                'name': 'AU_StateUnit',
            },
            {
                'schema': 'public',
                'name': 'AU_AimagUnit',
            },
            {
                'schema': 'public',
                'name': 'AddressPoint',
            },
            {
                'schema': 'public',
                'name': 'AdmUnitSum',
            },
            {
                'schema': 'public',
                'name': 'AdmUnitUls',
            },
            {
                'schema': 'public',
                'name': 'Sand',
            },
            {
                'schema': 'public',
                'name': 'Shuudan_uilchilgeenii_salbaruud',
            },
        ]
    }

    return JsonResponse(rsp)
