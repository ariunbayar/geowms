import json

from django.contrib.auth.decorators import user_passes_test
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse

from main.utils import resize_b64_to_sizes
from .models import BaseLayer
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer

from django.views.decorators.http import require_POST
from main.decorators import ajax_required


def _get_base_layer_display(base_layer):
    return {
        'id': base_layer.pk,
        'name': base_layer.name,
        'url': base_layer.url,
        'thumbnail_1x': base_layer.thumbnail_1x.url,
        'thumbnail_2x': base_layer.thumbnail_2x.url,
    }


@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    display_items = [_get_base_layer_display(o) for o in BaseLayer.objects.all().order_by('sort_order')]

    wms_list = []

    for wms in WMS.objects.all():
        layers = []
        for layer in WMSLayer.objects.filter(wms=wms):
            layers.append(layer.code)

        wms_list.append({
            'name': wms.name,
            'url': request.build_absolute_uri(reverse('api:service:wms_proxy', args=[wms.pk])),
            'layers': layers,
        })

    rsp = {
        'wms_list': wms_list,
        'items': display_items,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def move(request, payload):
    baseLayer = get_object_or_404(BaseLayer, pk=payload.get('id'))
    if payload.get('move') == 'down':
        temp_sort_order = BaseLayer.objects.filter(sort_order__gt=baseLayer.sort_order).order_by('sort_order').first()
        if temp_sort_order is not None:
            BaseLayer.objects.filter(pk=temp_sort_order.id).update(sort_order=baseLayer.sort_order)
            BaseLayer.objects.filter(pk=baseLayer.id).update(sort_order=temp_sort_order.sort_order)
    else:
        temp_sort_order = BaseLayer.objects.filter(sort_order__lt=baseLayer.sort_order).order_by('sort_order').last()
        if temp_sort_order is not None:
            BaseLayer.objects.filter(pk=temp_sort_order.id).update(sort_order=baseLayer.sort_order)
            BaseLayer.objects.filter(pk=baseLayer.id).update(sort_order=temp_sort_order.sort_order)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request):

    try:
        payload = json.loads(request.body)

        base_layer = BaseLayer()

        sizes = [
            (128 * 2, 72 * 2),
            (128 * 1, 72 * 1),
        ]

        base_layer.name = payload.get('name')
        base_layer.url = payload.get('url')
        base_layer.tilename = payload.get('tilename')

        [thumbnail_2x, thumbnail_1x] = resize_b64_to_sizes(payload.get('thumbnail'), sizes)
        base_layer.thumbnail_1x = SimpleUploadedFile('thumbnail.png', thumbnail_1x)
        base_layer.thumbnail_2x = SimpleUploadedFile('thumbnail.png', thumbnail_2x)

        base_layer.save()

    except Exception as e:
        raise e
        rsp = {'success': False}
    else:
        rsp = {'success': True}

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def detail(request, pk):

    base_layer = get_object_or_404(BaseLayer, pk=pk)
    display_item = _get_base_layer_display(base_layer)

    return JsonResponse(display_item)


@user_passes_test(lambda u: u.is_superuser)
def устгах(request, pk):

    base_layer = get_object_or_404(BaseLayer, pk=pk)

    try:
        base_layer.thumbnail_1x.delete(save=False)
        base_layer.thumbnail_2x.delete(save=False)
        base_layer.delete()

    except Exception as e:
        raise e
        rsp = {'success': False}
    else:
        rsp = {'success': True}

    return JsonResponse(rsp)
