from itertools import groupby
from django.shortcuts import render, reverse
from backend.dedsanbutets.models import ViewNames
from backend.bundle.models import Bundle, BundleLayer
from backend.geoserver.models import WmtsCacheConfig


def _get_service_url(request, bundle, wms, layer, file_type):
    url = reverse('api:service:file-download', args=[bundle.pk, wms.pk, layer.pk, file_type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def wms_layers(request, bundle):

    roles = {1}

    wms_list = []
    qs_layers = bundle.layers.filter(bundlelayer__role_id__in=roles).order_by('wms__created_at', 'sort_order').distinct()

    def _layer_to_display(bundle, wms, ob):
        code = ob.code.replace('gp_layer_', '')
        zoom_start = 4
        zoom_stop = 21
        bundle_layers = BundleLayer.objects.filter(
                bundle=bundle,
                layer_id=ob.id,
                role_id__in=roles
            )

        view_obj = ViewNames.objects.filter(view_name=code).first()
        if view_obj:
            feature_id = view_obj.feature_id
            wmts_obj = WmtsCacheConfig.objects.filter(feature_id=feature_id).first()
            if wmts_obj:
                if wmts_obj.zoom_start < 4:
                    zoom_start = 5
                else:
                    zoom_start = wmts_obj.zoom_start
                if wmts_obj.zoom_stop < 13:
                    zoom_stop = 21
                else:
                    zoom_stop = wmts_obj.zoom_stop
        return {
                'id': ob.pk,
                'name': ob.name,
                'code': ob.code,
                'feature_price': ob.feature_price,
                'geodb_schema': ob.geodb_schema,
                'geodb_table': ob.geodb_table,
                'geodb_pk_field': ob.geodb_pk_field,
                'geodb_export_field': ob.geodb_export_field,
                'zoom_start': zoom_start,
                'zoom_stop': zoom_stop,
                'shape_file_url': _get_service_url(request, bundle, wms, ob, file_type='shape-zip'),
                'gml_url': _get_service_url(request, bundle, wms, ob, file_type='gml'),
                'geo_json_url': _get_service_url(request, bundle, wms, ob, file_type='json'),
                'csv_url': _get_service_url(request, bundle, wms, ob, file_type='csv'),

                'defaultCheck': bundle_layers.values('defaultCheck')[0]['defaultCheck']
            }

    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wms'))
            chache_url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wmts'))
            wms_data = {
                'id': wms.id,
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'chache_url': request.build_absolute_uri(chache_url),
                'layers': [_layer_to_display(bundle, wms, layer) for layer in layers],
                'wms_or_cache_ur': True if wms.cache_url else False
            }
            wms_list.append(wms_data)

    return wms_list


def index(request):
    bundles = Bundle.objects.all().order_by('sort_order')
    bundle_displays = []
    for bundle in bundles:
        wms_list = wms_layers(request, bundle)
        display = {
            'id': bundle.id,
            'name': bundle.ltheme.theme_name,
            'icon': bundle.icon.url if bundle.icon else '',
            'wms_list': wms_list
        }
        bundle_displays.append(display)

    context = {
        'bundles': bundle_displays,
    }

    return render(request, 'open_layer/index.html', context)
