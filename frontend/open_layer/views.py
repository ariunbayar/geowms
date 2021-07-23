
from itertools import groupby

from django.http.response import Http404
from django.shortcuts import redirect, render, reverse

from backend.dedsanbutets.models import ViewNames
from backend.wmslayer.models import WMSLayer
from backend.inspire.models import LFeatures, LPackages, LThemes
from backend.geoserver.models import WmtsCacheConfig

from main import utils


def _get_service_url(request, bundle, wms, layer, file_type):
    url = reverse('api:service:file-download', args=[bundle.pk, wms.pk, layer.pk, file_type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def _get_geoserver_url(request, bundle, wms, layer, type):
    url = reverse('api:open-layer:open_layer_proxy', args=[bundle.pk, wms.pk, layer.pk, type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def _wms_layers(wms_layers, bundle, request, views):

    wms_list = []

    def _layer_to_display(wms, ob):

        code = ob.code.replace(utils.LAYERPREFIX, '')
        zoom_start = 4
        zoom_stop = 21

        for view in views:
            if view.view_name == code:
                feature_id = view.feature_id
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
                        'wms_url': _get_geoserver_url(request, bundle, wms, ob, 'wms'),
                        'wfs_url': _get_geoserver_url(request, bundle, wms, ob, 'wfs'),
                        'wmts_url': _get_geoserver_url(request, bundle, wms, ob, 'wmts'),
                        'shape_file_url': _get_service_url(request, bundle, wms, ob, file_type='shape-zip'),
                        'gml_url': _get_service_url(request, bundle, wms, ob, file_type='gml'),
                        'geo_json_url': _get_service_url(request, bundle, wms, ob, file_type='json'),
                        'csv_url': _get_service_url(request, bundle, wms, ob, file_type='csv'),
                    }
        return

    for wms, layers in groupby(wms_layers, lambda ob: ob.wms):
        if wms.is_active:
            filter_layer = list()
            for layer in layers:
                lyr = _layer_to_display(wms, layer)
                if lyr:
                    filter_layer.append(lyr)

            wms_data = {
                'id': wms.id,
                'name': wms.name,
                'layers': filter_layer,
                'wms_or_cache_ur': True if wms.cache_url else False
            }
            if wms_data['layers']:
                wms_list.append(wms_data)

    return wms_list


def _check_open_datas(open_datas):
    has_datas = True
    open_datas = utils.json_load(open_datas)
    if not open_datas:
        return False
    len_datas = len(open_datas)
    if len_datas == 1:
        if not open_datas[0]:
            has_datas = False

    elif len_datas < 1:
        has_datas = False

    return has_datas


def index(request):

    if not request.user.is_authenticated:
        return redirect('secure:loginUser')

    if not request.user.is_sso:
        raise Http404

    display_bundles = []
    themes = LThemes.objects.order_by('theme_id')
    for theme in themes:
        wms_layers = list()
        views = list()
        packages = LPackages.objects.filter(theme_id=theme.theme_id)
        for pack in packages:

            features_qs = LFeatures.objects
            features_qs = features_qs.filter(package_id=pack.package_id)
            feature_ids = features_qs.values_list('feature_id', flat=True)

            view_qs = ViewNames.objects
            view_qs = view_qs.filter(feature_id__in=feature_ids)

            for view in view_qs:
                if _check_open_datas(view.open_datas):
                    layer_code = utils.LAYERPREFIX + view.view_name
                    wms_layer_qs = WMSLayer.objects.filter(code=layer_code)
                    if wms_layer_qs:
                        wms_layer = wms_layer_qs.first()
                        wms_layers.append(wms_layer)
                        views.append(view)

        if wms_layers:
            bundle = theme.bundle
            wms_list = _wms_layers(wms_layers, bundle, request, views)

            if wms_list:
                display = {
                    'id': bundle.id,
                    'name': theme.theme_name,
                    'icon': bundle.icon.url if bundle.icon else '',
                    'wms_list': wms_list
                }
                display_bundles.append(display)

    context = {
        'bundles': display_bundles,
    }

    return render(request, 'open_layer/index.html', context)
