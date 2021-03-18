
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render, reverse
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404
from geojson import FeatureCollection

from main.decorators import ajax_required
from main import utils

from backend.org.models import EmployeeErguul
from backend.org.models import NemaWMS
from backend.config.models import CovidConfig
from backend.wms.models import WMS
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer


def index(request):

    context = {
        'covid': "covid"
    }

    return render(request, 'covid/index.html', context)


@require_GET
@ajax_required
def get_nema(request):
    qs = NemaWMS.objects
    qs = qs.filter(is_open=1)

    wms_qs = WMS.objects
    wms_qs = wms_qs.filter(name__exact='nema')
    if not wms_qs:
        rsp = {
            'success': False,
            'info': 'WMS олдсонгүй системийн админд хандана уу'
        }
        return JsonResponse(rsp)

    layer_codes = list(qs.values_list("code", flat=True))
    wms_values = wms_qs.values('name', 'url')
    wms = wms_values.first()

    bundle = utils.get_config('bundle', CovidConfig)

    wms_list = list()

    def _layer_to_display(code):
        layer_qs = WMSLayer.objects
        
        layer_qs = layer_qs.filter(code=code)
        zoom_start = 4
        zoom_stop = 21
        if layer_qs:
            layer = layer_qs.first()
            code = layer.code.replace('gp_layer_', '')
            bundle_qs = BundleLayer.objects
            bundle_layers = bundle_qs.filter(
                bundle_id=bundle,
                layer_id=layer.id,
            )

            return {
                'id': layer.pk,
                'name': layer.name,
                'code': layer.code,
                'feature_price': layer.feature_price,
                'geodb_schema': layer.geodb_schema,
                'geodb_table': layer.geodb_table,
                'zoom_start': zoom_start,
                'zoom_stop': zoom_stop,
                'geodb_pk_field': layer.geodb_pk_field,
                'geodb_export_field': layer.geodb_export_field,
                'defaultCheck': 1,
            }

    for wms in wms_qs:
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle, wms.pk, 'wms'))
            layers = list()
            for code in layer_codes:
                layer = _layer_to_display(code)
                if layer:
                    layers.append(layer)
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': layers,
            }
            wms_list.append(wms_data)
    rsp = {
        'success': True,
        'layer_codes': layer_codes,
        'wms_list': wms_list,
        'bundle': {"id": bundle},
    }
    return JsonResponse(rsp)
