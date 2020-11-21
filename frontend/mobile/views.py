from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET

from main.decorators import ajax_required

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from backend.inspire.models import LThemes


def _get_bundles_display(request, bundle):
    theme = LThemes.objects.filter(theme_id=bundle.ltheme)
    return {
        'name': theme.theme_name if theme else '' ,
        'price': bundle.price,
        'is_removeable': bundle.is_removeable,
        'created_at': bundle.created_at,
        'updated_at': bundle.updated_at,
        'created_by_id': bundle.created_by_id,
        'icon': bundle.icon.url,
        'sort_order': bundle.sort_order,
    }


def all(request):

    bundles = [_get_bundles_display(request, ob) for ob in Bundle.objects.all()]
    return render(request, 'mobile/detail.html', {'bundles': bundles})


def detail(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)
    theme = LThemes.objects.filter(theme_id=bundle.ltheme)

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