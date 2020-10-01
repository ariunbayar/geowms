from django.shortcuts import render

from django.views.decorators.http import require_GET
from backend.changeset.models import ChangeSet
from main.decorators import ajax_required


def _get_changeset_display(ob):
    geom= eval(ob[1])
    geometry = eval(geom['geom'])
    coordinates = geometry['coordinates']
    geom_type = geometry['type']
    return {
        'coordinate':coordinates,
        'geom_type':geom_type,
        'changeset_id':ob[0],
        'changeset_attributes':ob[2]
    }

def _get_feature_coll(ob, changeset_list):
    return {
        'type': 'Feature',
        'geometry':{
            "type":changeset_list[ob]['geom_type'],
            "coordinates":changeset_list[ob]['coordinate'],
        }
        "properties": {'changeset_id', changeset_list[ob]['changeset_id'],}
    }


@require_GET
@ajax_required
def changeset_all(request):

    cursor = connections['default'].cursor()
    cursor.execute(''' select * from changeset_changeset''')
    changesets = cursor.fetchall()
    feature = []
    geoJson = []
    changeset_list = [_get_changeset_display(ob) for ob in changesets]
    feature = [ _get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]

    geoJson =[{
        "type": "FeatureCollection",
        "features":feature,
    }]


