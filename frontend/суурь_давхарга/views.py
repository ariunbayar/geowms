from django.http import JsonResponse
from django.views.decorators.http import require_GET

from main.decorators import ajax_required

from backend.суурь_давхарга.models import BaseLayer
from backend.wms.models import WMS
from backend.config.models import Config


@require_GET
@ajax_required
def all(request):

    base_layer_list = []

    for base_layer in BaseLayer.objects.all().order_by('sort_order'):
        wms_args = {}
        wms = None
        if base_layer.tilename == 'wms' or base_layer.tilename == 'wmts':
            base_layer_url = base_layer.url.replace('wms/', '')
            base_layer_url = base_layer_url.replace('wmts/', '')
            pk = int(base_layer_url.split('/')[-2])
            wms = WMS.objects.get(pk=pk)
            wms_args['layers'] = ','.join([ob.code for ob in wms.wmslayer_set.all()])

        protocol  = Config.objects.filter(name='geoserver_protocol').first().value
        url = ''
        if wms:
            url_data = wms.url.split(":")
            url = protocol
            if url_data[0] != protocol:
                i = 1
                while i < len(url_data):
                    url = url + ":" + url_data[i]
                    i = i+1
            else:
                url = url_data
        base_layer_list.append({
            'tilename': base_layer.tilename,
            'url': base_layer.url,
            'geoserver_url': url if wms else '',
            'thumbnail_1x': base_layer.thumbnail_1x.url,
            'thumbnail_2x': base_layer.thumbnail_2x.url,
            **wms_args,
        })

    rsp = {
        'base_layer_list': base_layer_list,
    }
    return JsonResponse(rsp)
