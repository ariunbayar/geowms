from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from django.db import connections
from backend.inspire.models import LThemes


def all(request):
    context_list = []
    bundles = Bundle.objects.all()
    for bundle in bundles:
        bundle_list = []
        theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
        bundle_list = {
            'id': bundle.id,
            'icon': bundle.icon.url,
            'name': theme.theme_name if theme else ''
        }
        context_list.append(bundle_list)
    return render(request, 'mobile/detail.html', {'bundles': context_list})


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