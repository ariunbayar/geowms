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
        'layer_list': list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title')),
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
                'sort_order': wms_layer.sort_order
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
@user_passes_test(lambda u: u.is_superuser)
def move(request, payload):

    wms = get_object_or_404(WMS, pk=payload.get('wmsId'))
    current_layer = get_object_or_404(WMSLayer, pk=payload.get('id'))

    wms_layers = wms.wmslayer_set.all().order_by('sort_order')

    if payload.get('move') == 'down':
        other_layer = wms_layers.filter(sort_order__gt=current_layer.sort_order).first()
    else:
        other_layer = wms_layers.filter(sort_order__lt=current_layer.sort_order).last()

    if other_layer:
        (other_layer.sort_order, current_layer.sort_order) = (current_layer.sort_order, other_layer.sort_order)
        other_layer.save()
        current_layer.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
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
@user_passes_test(lambda u: u.is_superuser)
def layerAdd(request, payload):

    wmsId = payload.get('wmsId')
    layerName = payload.get('id')
    legendURL = payload.get('legendURL')

    wms = get_object_or_404(WMS, pk=wmsId)
    wms_layer = WMSLayer.objects.filter(code=layerName, wms_id=wms.id)
    if wms_layer:
        return JsonResponse({'success': False})
    else:
        WMSLayer.objects.create(name=layerName, code=layerName, wms = wms, title=layerName, LegendURL=legendURL)
        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layerRemove(request, payload):

    wmsId = payload.get('wmsId')
    layerName = payload.get('id')

    wms_layer = get_object_or_404(WMSLayer, name=layerName, code=layerName, wms_id=wmsId)
    wms_layer.delete()

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

    wms = get_object_or_404(WMS, pk=payload.get('id'))
    layers = payload.get('layers')
    layer_choices = payload.get('layer_choices')
    form = WMSForm(payload, instance=wms)
    if form.is_valid():

        with transaction.atomic():

            form.save()

        return JsonResponse({
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
