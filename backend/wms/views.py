import json
import requests

from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, reverse, redirect, get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from backend.bundle.models import Bundle, BundleLayer
from backend.wmslayer.models import WMSLayer
from geoportal.decorators import ajax_required

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
def wmsLayerall(request, payload):
    wmsid = payload.get('id')
    layers_all = []
    for layer in WMSLayer.objects.filter(wms_id=wmsid).order_by('sort_order'):
        wmslayer_display = {
                'id': layer.id,
                'name': layer.name,
                'code': layer.code,
                'title': layer.title,
            }
        layers_all.append(wmslayer_display)
    return JsonResponse({'layers_all': layers_all})


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

    wms = get_object_or_404(WMS, pk=payload.get('id'))
    layers = payload.get('layers')
    layer_choices = payload.get('layer_choices')
    form = WMSForm(payload, instance=wms)

    if form.is_valid():

        with transaction.atomic():

            form.save()
            wms = form.instance

            # cleanup wms relations
            BundleLayer.objects.filter(layer__wms_id=wms.pk).delete()
            wms.wmslayer_set.all().delete()

            for layer_choices in layer_choices:
                if layer_choices.get('code') in layers:
                    WMSLayer.objects.create(
                        wms=form.instance,
                        name=layer_choices.get('name'),
                        code=layer_choices.get('code'),
                    )

        return JsonResponse({
                'wms': _get_wms_display(request, form.instance),
                'success': True
            })
    else:
        return JsonResponse({'success': False})


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
