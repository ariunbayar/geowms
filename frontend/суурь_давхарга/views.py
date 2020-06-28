from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from geoportal.decorators import ajax_required

from backend.суурь_давхарга.models import BaseLayer
from backend.wms.models import WMS


@require_GET
@ajax_required
def all(request):

    base_layer_list = []

    for base_layer in BaseLayer.objects.all():
        wms_args = {}
        if base_layer.tilename == 'wms':
            try:
                pk = int(base_layer.url.split('/')[-2])
                wms = WMS.objects.get(pk=pk)
                wms_args['layers'] = ','.join([ob.code for ob in wms.wmslayer_set.all()])
            except Exception:
                pass

        base_layer_list.append({
            'tilename': base_layer.tilename,
            'url': base_layer.url,
            'thumbnail_1x': base_layer.thumbnail_1x.url,
            'thumbnail_2x': base_layer.thumbnail_2x.url,
            **wms_args,
        })

    rsp = {
        'base_layer_list': base_layer_list,
    }
    return JsonResponse(rsp)
