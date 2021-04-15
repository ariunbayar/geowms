from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from backend.inspire.models import LThemes
from main.inspire import InspireSearchValue
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import json
from backend.inspire.models import MGeoDatas
from main import utils


def all(request):
    geo_id = request.GET.get('geo_id')
    geo_json = None
    if geo_id:
        geom = utils.get_geom(geo_id)
        if geom:
            geo_json = geom.json
            print(geo_json)

    context_list = []
    bundles = Bundle.objects.all()
    for bundle in bundles:
        bundle_list = []
        theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
        bundle_list = {
            'id': bundle.id,
            'icon': bundle.icon.url if bundle.icon else '',
            'name': theme.theme_name if theme else ''
        }
        context_list.append(bundle_list)
    context = {
        'bundles': context_list,
        'geo_data': {
            'geo_json': geo_json,
        }
    }
    return render(request, 'mobile/detail.html', {'bundles': context})


def detail(request, pk):
    bundle = get_object_or_404(Bundle, pk=pk)
    theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
    bundle_layers = BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()

    bundle_display = {
        'id': bundle.id,
        'name': theme.theme_name if theme else '',
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'wms_list': [
            (WMS.objects.get(pk=wms[0]).name)
            for wms in bundle_layers
        ],
    }

    context = {
        'bundle_display': bundle_display,
    }
    return JsonResponse(context)


@require_POST
@csrf_exempt
def search_value(request):

    payload = json.loads(request.body)
    search_value = payload.get("search_value")
    ins_search_obj = InspireSearchValue([], [], search_value, 50, 'value_text')
    search_values = ins_search_obj.get()
    context = {
        'success': True,
        'search_values': search_values,
    }

    return JsonResponse(context)