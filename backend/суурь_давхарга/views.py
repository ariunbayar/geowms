import json
import requests

from django.contrib.auth.decorators import user_passes_test
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404, reverse
from main.utils import resize_b64_to_sizes
from .models import BaseLayer
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.config.models import Config
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.core.cache import cache


def _get_base_layer_display(base_layer):
    return {
        'id': base_layer.pk,
        'name': base_layer.name,
        'url': base_layer.url,
        'thumbnail_1x': base_layer.thumbnail_1x.url,
        'thumbnail_2x': base_layer.thumbnail_2x.url,
        'sort_order': base_layer.sort_order,
    }


@require_GET
@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    display_items = [_get_base_layer_display(o) for o in BaseLayer.objects.all().order_by('sort_order')]

    wms_list = []

    for wms in WMS.objects.filter(is_active=True):
        layers = []
        for layer in WMSLayer.objects.filter(wms=wms):
            layers.append(layer.code)

        wms_list.append({
            'name': wms.name,
            'url': request.build_absolute_uri(reverse('backend:суурь-давхарга:wms-preview', args=[wms.pk, 'wms'])),
            'cache_url': request.build_absolute_uri(reverse('backend:суурь-давхарга:wms-preview', args=[wms.pk, 'wmts'])),
            'wms_or_wmts': True if wms.cache_url else False,
            'layers': layers,
        })

    rsp = {
        'wms_list': wms_list,
        'items': display_items,
    }

    return JsonResponse(rsp)


@require_GET
@user_passes_test(lambda u: u.is_superuser)
def wms_preview(request, pk, url_type):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    wms = cache.get('proxy_{}'.format(pk))
    if not wms:
        wms = WMS.objects.filter(pk=pk).first()
        cache.set('proxy_{}'.format(pk), wms, 300)

    if wms is None or not wms.is_active:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    if url_type == "wmts":
        rsp = requests.get(wms.cache_url, queryargs, headers=headers)
    else:
        rsp = requests.get(wms.url, queryargs, headers=headers)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def swap(request, payload):
    swap_one = payload.get("swap_one")
    swap_two = payload.get("swap_two")
    baseLayer_one = get_object_or_404(BaseLayer, pk=swap_one)
    baseLayer_two = get_object_or_404(BaseLayer, pk=swap_two)
    baseLayer_one.sort_order, baseLayer_two.sort_order = baseLayer_two.sort_order, baseLayer_one.sort_order
    BaseLayer.objects.bulk_update([baseLayer_one, baseLayer_two], ['sort_order'])

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request):

    try:
        payload = json.loads(request.body)

        base_layer = BaseLayer()
        protocol  = Config.objects.filter(name='geoserver_protocol').first().value
        if protocol:
            url_data = payload.get('url').split(":")
            url = protocol
            if url_data[0] != protocol:
                i = 1
                while i < len(url_data):
                    url = url + ":" + url_data[i]
                    i = i+1
            else:
                url = payload.get('url')
        sizes = [
            (128 * 2, 72 * 2),
            (128 * 1, 72 * 1),
        ]
        base_layer.name = payload.get('name')
        base_layer.url = url
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
