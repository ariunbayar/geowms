import os
import requests
from itertools import groupby

from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponse, Http404
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET, require_POST
from django.core.cache import cache
from django.db import connections
from django.db.models.query import Prefetch

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from backend.inspire.models import LThemes, MDatas, MGeoDatas
from backend.geoserver.models import WmtsCacheConfig

from main import utils
from main.decorators import ajax_required

from api.utils import (
    calc_radius,
    get_buffer_of_point,
)


CACHE_TIMEOUT = 30


def all(request):
    context_list = []

    bundles = Bundle.objects.prefetch_related('ltheme')
    for bundle in bundles:
        theme = bundle.ltheme
        bundle_list = {
            'pk': bundle.id,
            'icon': bundle.icon,
            'name': theme.theme_name if theme else ''
        }

        context_list.append(bundle_list)

    context = {
        'bundles': context_list,
    }
    return render(request, 'bundle/all.html', context)


def _not_hesegchlen_hudaldan_awalt():
    return [
        'gnp'
    ]


def detail(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)
    theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
    is_point = theme.theme_code in _not_hesegchlen_hudaldan_awalt()

    bundle_layers = BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()

    bundle_display = {
        'id': bundle.id,
        'name': theme.theme_name if theme else '',
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'wms_list': [
            (WMS.objects.get(pk=wms[0]).name)
            for wms in bundle_layers
        ],
        'is_point': is_point,
    }

    context = {
        'bundle_display': bundle_display,
    }
    return render(request, 'bundle/detail.html', context)


@require_GET
@ajax_required
def wms_layers(request, pk):

    roles = {1}
    if request.user.is_authenticated:
        roles |= set(request.user.roles.all().values_list('id', flat=True))

    bundle = get_object_or_404(Bundle, pk=pk)
    wms_list = []
    qs_layers = bundle.layers.filter(bundlelayer__role_id__in=roles).order_by('wms__created_at', 'sort_order').distinct()

    def _layer_to_display(ob):
        code = ob.code.replace('gp_layer_', '')
        zoom_start = 4
        zoom_stop = 21
        bundle_layers = BundleLayer.objects.filter(
                bundle_id=pk,
                layer_id=ob.id,
                role_id__in=roles
            )

        has_mat = utils.has_materialized_view(code)
        if has_mat:
            feature = utils.get_feature_from_layer_code(code)
            if feature:
                feature_id = feature.feature_id
                wmts_obj = WmtsCacheConfig.objects.filter(feature_id=feature_id).first()
                if wmts_obj:
                    if wmts_obj.zoom_start and wmts_obj.zoom_start < 4:
                        zoom_start = 5
                    else:
                        zoom_start = wmts_obj.zoom_start
                    if wmts_obj.zoom_stop and wmts_obj.zoom_stop < 13:
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
                'defaultCheck': bundle_layers.values('defaultCheck')[0]['defaultCheck']
            }

    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        chache_url = ''
        url = ''
        if wms.is_active:
            check_url = wms.url
            if utils.check_nsdi_address(request) and ('geo.nsdi.gov.mn' in check_url or '192.168.10.15' in check_url):
                ws_name = check_url.split('/')[3]
                if wms.cache_url:
                    chache_url = 'https://geo.nsdi.gov.mn/{ws_name}/gwc/service/wmts'.format(
                        ws_name=ws_name,
                    )
                url = check_url
            else:
                url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wms'))
                chache_url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wmts'))

            proxy_url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wms'))
            proxy_cache_url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wmts'))

            wms_data = {
                'name': wms.name,
                'url': url,
                "proxy_url": proxy_url,
                "proxy_chache_url": proxy_cache_url,
                'chache_url': chache_url,
                'layers': [_layer_to_display(layer) for layer in layers],
                'wms_or_cache_ur': True if wms.cache_url else False,
            }
            wms_list.append(wms_data)

    rsp = {
        'bundle': {'id': bundle.id},
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def get_user(request):

    if request.user.is_authenticated:
        return JsonResponse({'is_authenticated': True})

    else:
        return JsonResponse({'is_authenticated': False})


@require_GET
@cache_page(60 * CACHE_TIMEOUT)
@ajax_required
def aimag(request):

    admin_levels = utils.geo_cache('admin_levels', '', utils.get_administrative_levels(), 1800)
    if admin_levels:
        success = True
        data = admin_levels

    else:
        success = False
        data = "Уучлаарай ямар нэгэн мэдээлэл олдсонгүй"

    first_au_level_geo_id = utils.geo_cache('first_au_level_geo_id', '', utils.get_1stOrder_geo_id(), 1800)
    rsp = {
        'success': success,
        'info': data,
        'firstOrder_geom': first_au_level_geo_id,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def sumfind(request, payload):
    try:
        aimag_name = payload.get('aimag_name')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT "Long" as X, "Lat" as Y , "SoumMon" as aimag FROM public."AdmUnitCenter_Sum" where "AimagMon" = %s ORDER BY "SoumMon" ASC ''', [aimag_name])
        data = find_cursor.fetchall()
        if(data):

            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def findPoints(request, payload):

    rsp = {
        'success': False,
        'data': [],
        'error': '',
    }

    point_id = payload.get("point_id")
    if not point_id:
        rsp['error'] = 'Цэгийн дугаарыг оруулна уу'
        return JsonResponse(rsp)

    point_id = str(point_id)
    theme_code = 'gnp'

    feature_ids = utils.geo_cache(
        'feature_ids_of_theme_code',
        theme_code,
        utils.get_feature_ids_of_theme(theme_code),
        30000
    )

    mgeo_qs = MGeoDatas.objects
    mgeo_qs = mgeo_qs.filter(
        geo_id=point_id,
        feature_id__in=feature_ids
    )

    if not mgeo_qs:
        rsp['error'] = 'Цэг олдсонгүй'
        return JsonResponse(rsp)

    mgeo = mgeo_qs.first()
    geo_json = mgeo.geo_data.json
    geo_json = utils.json_load(geo_json)

    data = geo_json['coordinates']
    if 'Multi' in geo_json['type']:
        data = data[0]

    rsp['success'] = True
    rsp['data'] = data

    return JsonResponse(rsp)


@require_POST
@ajax_required
def get_search_value(request, payload):
    bundle_id = payload.get('bundle_id')
    search_value = payload.get('value')

    rsp = {
        'success': False,
        'data': [],
        'error': ""
    }

    if not search_value:
        rsp['error'] = 'Хайх утгаа оруулна уу'
        return JsonResponse(rsp)

    bundle_pk_cache_key = 'bundle_{}'.format(bundle_id)
    geo_ids_cache_key = 'bundle_{}_geo_ids'.format(bundle_id)
    cache_time = 3000

    pk = cache.get(bundle_pk_cache_key)
    if pk != bundle_id:
        cache.set(bundle_pk_cache_key, bundle_id, cache_time)
        bundle = get_object_or_404(Bundle, pk=bundle_id)
        theme_code = bundle.ltheme.theme_code

        feature_ids = utils.get_feature_ids_of_theme(theme_code)
        mgeo_qs = MGeoDatas.objects
        mgeo_qs = mgeo_qs.filter(feature_id__in=feature_ids)
        geo_ids = list(mgeo_qs.values_list('geo_id', flat=True))

        cache.set(geo_ids_cache_key, geo_ids, cache_time)
    else:
        geo_ids = cache.get(geo_ids_cache_key)

    qs_datas = MDatas.objects
    qs_datas = qs_datas.filter(
        geo_id__in=geo_ids,
    )
    qs_datas = qs_datas.filter(
        value_text__icontains=search_value
    )
    qs_datas = qs_datas.extra(
        select={
            'name': 'value_text'
        }
    )  # select value_text as name
    qs_datas = qs_datas.order_by('geo_id')[:5]
    datas = list(qs_datas.values('geo_id', 'name'))

    if not datas:
        rsp['error'] = 'Мэдээлэл олдсонгүй'
        return JsonResponse(rsp)

    rsp['success'] = True
    rsp['data'] = datas

    return JsonResponse(rsp)


def download_ppt(request):
    file_path = os.path.join(settings.MEDIA_ROOT, 'geoportal.pptx')
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-powerpoint")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404


@require_POST
@ajax_required
def get_point_buffer_geom(request, payload):
    center = payload.get('center')
    scale = payload.get('scale')

    radius = calc_radius(scale)
    buffer = get_buffer_of_point(center, radius)
    feature = utils.get_feature_from_geojson(buffer.json)

    rsp = {
        'success': True,
        'data': feature
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def get_search_property_value(request, payload):
    search_value = payload.get('value')
    datas = list()
    cache_time = 3000
    geo_id = 'inspire_id'

    rsp = {
        'success': False,
        'data': [],
        'error': ""
    }

    if not search_value:
        rsp['error'] = 'Хайх утгаа оруулна уу'
        return JsonResponse(rsp)

    headers = {
        'User-Agent': 'geo 1.0'
    }

    cached_datas = cache.get(search_value)
    if cached_datas:
        rsp['success'] = True
        rsp['data'] = cached_datas
        return JsonResponse(rsp)

    bundle_qs = Bundle.objects
    bundle_qs = bundle_qs.prefetch_related('ltheme__lpackages_set__lfeatures_set__viewnames_set__viewproperties_set__property')
    bundle_qs = bundle_qs.prefetch_related(Prefetch('layers__wms'))
    bundle_qs = bundle_qs.order_by('sort_order')
    for bundle in bundle_qs:
        pack_qs = bundle.ltheme.lpackages_set.all()
        data = dict()
        data['name'] = bundle.ltheme.theme_name
        data['id'] = bundle.id
        data['values'] = list()
        for pack in pack_qs:
            features_qs = pack.lfeatures_set.all()
            for feature in features_qs:
                data_feature_dict = dict()
                data_feature_dict['id'] = feature.feature_id
                data_feature_dict["name"] = feature.feature_name
                data_feature_dict["values"] = list()

                view_names = feature.viewnames_set.all()
                for view in view_names:
                    view_properties = view.viewproperties_set.all()
                    if not view_properties:
                        continue

                    property_codes = [
                        utils.remove_empty_spaces(view_property.property.property_code.lower())
                        for view_property in view_properties
                        if view_property.property
                    ]

                    value_text_idx = 1
                    value_text_types = utils.value_types()[value_text_idx]['value_names']

                    value_types = value_text_types

                    properties = [
                        {
                            "property_code": view_property.property.property_code.lower(),
                            "value_type_id": view_property.property.value_type_id
                        }
                        for view_property in view_properties
                        if view_property.property
                    ]

                    layer_name = utils.make_layer_name(utils.make_view_name(feature))

                    has_codes = list()
                    bundle_layers = bundle.layers.all()
                    for bundle_layer in bundle_layers:
                        layer_code = bundle_layer.code
                        if layer_code == layer_name and layer_code not in has_codes:
                            wms_url = bundle_layer.wms.url
                            has_codes.append(layer_code)

                            cql_filters = list()
                            for prop in properties:
                                op = ''
                                if prop['value_type_id'] in value_types:
                                    op = 'ilike'

                                if op:
                                    _filter = """{} {} '%{}%'""".format(prop['property_code'], op, search_value)
                                    cql_filters.append(_filter)

                            property_codes.append(geo_id)

                            select_properties = ",".join(property_codes)

                            geo_server_url = '{url}?service=WFS&version=1.1.0&request=GetFeature&TYPENAME={code}'.format(url=wms_url, code=layer_code)
                            geo_server_url = '{base_url}&propertyName={properties}'.format(base_url=geo_server_url, properties=select_properties)
                            geo_server_url = geo_server_url + "&" + "srsName=EPSG:4326"
                            if not cql_filters:
                                continue

                            cql_filters = " or ".join(cql_filters)
                            geo_server_url = geo_server_url + "&" + "cql_filter=" + cql_filters

                            geo_server_url = geo_server_url + "&outputFormat=application/json"
                            geo_server_url = geo_server_url + '&format_options=CHARSET:UTF-8'
                            geo_server_url = geo_server_url + '&MAXFEATURES=5'

                            _response = requests.get(geo_server_url, headers=headers, timeout=300, verify=False)
                            content = _response.content.decode()
                            if 'Exception' in content:
                                continue

                            try:
                                geo_json = utils.json_load(content)
                            except Exception as e:
                                raise e

                            features = geo_json['features']
                            for geo_feature in features:
                                properties = geo_feature['properties']

                                geo_value = ''
                                for key, value in properties.items():
                                    if not value or not isinstance(value, str) or key == geo_id:
                                        continue

                                    if search_value.lower() in value.lower():
                                        geo_value = value
                                        break

                                data_feature_dict['values'].append({
                                    "id": properties[geo_id],
                                    "name": geo_value,
                                })

                if not data_feature_dict['values']:
                    continue

                data['values'].append(data_feature_dict)

        if not data['values']:
            continue

        datas.append(data)

    cache.set(search_value, datas, cache_time)
    if not datas:
        rsp['error'] = 'Мэдээлэл олдсонгүй'
        return JsonResponse(rsp)

    rsp['success'] = True
    rsp['data'] = datas

    return JsonResponse(rsp)


@require_POST
@ajax_required
def get_geom(request, payload):
    feature = []
    geo_id = payload.get('geo_id')
    bundle_id = payload.get('bundle_id')

    rsp = {
        'success': False,
        'data': [],
    }

    geom = utils.geo_cache('geom', geo_id, utils.get_geom(geo_id), 1800)
    if geom:
        mgeo_qs = MGeoDatas.objects
        mgeo_qs = mgeo_qs.select_related('feature__package__theme__bundle')
        mgeo_qs = mgeo_qs.prefetch_related('feature__viewnames_set__viewproperties_set')
        mgeo_qs = mgeo_qs.prefetch_related('feature__viewnames_set__viewproperties_set')
        mgeo_qs = mgeo_qs.filter(geo_id=geo_id)
        mgeo = mgeo_qs.first()

        if bundle_id != mgeo.feature.package.theme.bundle.id:
            return JsonResponse(rsp)

        view_names = mgeo.feature.viewnames_set.all()
        for view in view_names:
            view_properties = view.viewproperties_set.all()
            if view_properties:
                geom = utils.geo_cache('geom', geo_id, utils.get_geom(geo_id), 1800)
                if geom:
                    geo_json = geom.json
                    feature = utils.get_feature_from_geojson(geo_json)
                    rsp['success'] = True
                    rsp['data'] = feature
            else:
                rsp['success'] = False
                rsp['data'] = feature

            break

    return JsonResponse(rsp)
