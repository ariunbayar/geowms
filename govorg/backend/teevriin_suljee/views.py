import requests
import json
from geojson import Point, Feature, FeatureCollection, dump,MultiPolygon
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from django.db import connections
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
    
    point = MultiPolygon((changeset_list[ob]['coordinate']))
    projection = changeset_list[ob]['projection']
    return Feature(type = 'Feature', crs= projection, properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


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
