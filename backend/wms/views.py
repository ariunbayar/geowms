import requests

from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.shortcuts import reverse, get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from backend.bundle.models import BundleLayer
from backend.wmslayer.models import WMSLayer
from main.decorators import ajax_required

from .models import WMS
from .forms import WMSForm


def _get_wms_display(request, wms):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
        'layers': [ob.code for ob in wms.wmslayer_set.all()],
        'public_url': request.build_absolute_uri(reverse('backend:wms:proxy', args=[wms.pk])),
        'created_at': wms.created_at.strftime('%Y-%m-%d'),
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):

    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.all()]
    return JsonResponse({'wms_list': wms_list})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def wms_layer_all(request, payload):

    pk = payload.get('id')

    wms_layers = WMSLayer.objects.filter(wms_id=pk).order_by('sort_order')

    def _wms_layer_display(wms_layer):
        return {
                'id': wms_layer.id,
                'name': wms_layer.name,
                'code': wms_layer.code,
                'title': wms_layer.title,
            }

    layers_all = [
        _wms_layer_display(wms_layer)
        for wms_layer in wms_layers
    ]

    return JsonResponse({
        'layers_all': layers_all,
    })


@require_POST
@ajax_required
def move(request, payload):

    wmsId = payload.get('wmsId')
    wmsLayer = get_object_or_404(WMSLayer, pk=payload.get('id'))

    if payload.get('move') == 'down':
        temp_sort_order = WMSLayer.objects.filter(sort_order__gt=wmsLayer.sort_order, wms_id=wmsId).order_by('sort_order').first()
        if temp_sort_order != None:
            WMSLayer.objects.filter(pk=temp_sort_order.id).update(sort_order=wmsLayer.sort_order)
            WMSLayer.objects.filter(pk=wmsLayer.id).update(sort_order=temp_sort_order.sort_order)
    else:
        temp_sort_order = WMSLayer.objects.filter(sort_order__lt=wmsLayer.sort_order, wms_id=wmsId).order_by('sort_order').last()
        if temp_sort_order != None:
            WMSLayer.objects.filter(pk=temp_sort_order.id).update(sort_order=wmsLayer.sort_order)
            WMSLayer.objects.filter(pk=wmsLayer.id).update(sort_order=temp_sort_order.sort_order)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def titleUpdate(request, payload):

    title = payload.get('title')
    layerId = payload.get('id')
    WMSLayer.objects.filter(pk=layerId).update(title=title)
    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def layerAdd(request, payload):

    wmsId = payload.get('wmsId')
    layerName = payload.get('id')

    sav = WMSLayer.objects.filter(name=layerName, code=layerName, wms_id=wmsId)
    if sav:
        return JsonResponse({'success': True})
    else:
        WMSLayer(name=layerName, code=layerName, wms_id = wmsId, title=layerName).save()
        return JsonResponse({'success': True})

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def layerRemove(request, payload):

    wmsId = payload.get('wmsId')
    layerName = payload.get('id')

    sav = WMSLayer(name=layerName, code=layerName, wms_id=wmsId)
    if sav == None:

        return JsonResponse({'success': True})
    else:
        WMSLayer.objects.filter(name=layerName, code=layerName, wms_id=wmsId).delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create(request, payload):

    form = WMSForm(payload)

    if form.is_valid():
        form.instance.created_by = request.user
        form.save()
        return JsonResponse({
            'wms': _get_wms_display(request, form.instance),
            'success': True
        })
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def update(request, payload):

    wmsId = payload.get('wmsId')
    name = payload.get('name')
    url = payload.get('url')
    WMS.objects.filter(pk=wmsId).update(name=name, url=url)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def delete(request, payload):

    wms = get_object_or_404(WMS, pk=payload.get('id'))
    layers = WMSLayer.objects.filter(wms=wms)
    for layer in layers:
        BundleLayer.objects.filter(layer=layer).delete()
        layer.delete()

    wms.delete()

    return JsonResponse({'success': True})


@require_GET
def proxy(request, wms_id):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    base_url = get_object_or_404(WMS, pk=wms_id).url

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)
