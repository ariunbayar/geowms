
from geojson import FeatureCollection
from main.decorators import ajax_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from main.components import Datatable
from main.utils import (
    json_load
)

from llc.backend.llc_request.models import RequestFiles, ShapeGeom

# Create your views here.

def _get_display_text(field, value):
    for f in RequestFiles._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == field:
                for c_id, c_type in f.choices:
                    if c_id == value:
                        return c_type


def _choice_state_display(state, item):
    display_name = _get_display_text('state', state)
    return display_name


def _choice_kind_display(kind, item):
    display_name = _get_display_text('kind', kind)
    return display_name


@require_POST
@ajax_required
def llc_request_list(request, payload):
    qs = RequestFiles.objects.all()
    if qs:
        оруулах_талбарууд = ['name', 'kind', 'state',  'created_at', 'updated_at']
        хувьсах_талбарууд = [
            {'field': 'state', 'action': _choice_state_display, "new_field": "state"},
            {'field': 'kind', 'action': _choice_kind_display, "new_field": "kind"}
        ]
        datatable = Datatable(
            model=RequestFiles,
            initial_qs=qs,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд,
            хувьсах_талбарууд=хувьсах_талбарууд
        )
        items, total_page = datatable.get()

        rsp = {
            'items': items,
            'page': payload.get('page'),
            'total_page': total_page
        }
    else:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def save_request(request):
    uploaded_file = request.FILES['files']
    description = request.POST.get
    user = request.user
    # RequestFiles.objects.create(
    #     name=user,
    #     kind=2,
    #     state=1,
    #     geo_id=496,
    #     file_path='.',
    #     )
    rsp = {
        'success': True,
        # 'info': descripion
    }
    return JsonResponse(rsp)


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
