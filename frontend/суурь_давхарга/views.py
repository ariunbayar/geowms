from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from geoportal.decorators import ajax_required

from backend.суурь_давхарга.models import BaseLayer


@require_GET
@ajax_required
def all(request):

    base_layer_list = []

    for base_layer in BaseLayer.objects.all():
        base_layer_list.append({
            'tilename': base_layer.tilename,
            'url': base_layer.url,
            'thumbnail_1x': base_layer.thumbnail_1x.url,
            'thumbnail_2x': base_layer.thumbnail_2x.url,
        })

    rsp = {
        'base_layer_list': base_layer_list,
    }
    return JsonResponse(rsp)
