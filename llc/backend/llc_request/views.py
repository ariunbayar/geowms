from geojson import FeatureCollection
from main.decorators import ajax_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from main.utils import (
    json_load
)

from llc.backend.llc_request.models import RequestFiles, RequestFilesShape, ShapeGeom
from backend.org.models import Org


@require_GET
@ajax_required
def get_all_geo_json(request):
    features = []

    shape_geometries = ShapeGeom.objects.all()

    for shape_geometry in shape_geometries:

        single_geom = json_load(shape_geometry.geom_json)
        features.append(single_geom)

    return JsonResponse({
        'geo_json_datas': FeatureCollection(features)
    })