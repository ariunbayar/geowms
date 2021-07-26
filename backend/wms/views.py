from backend.config.models import Config
from backend import payment
import re
from backend.inspire.models import LDataTypeConfigs, LFeatureConfigs, LFeatures, LPackages, LProperties, LThemes
import requests
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET

from api.utils import replace_src_url
from backend.bundle.models import BundleLayer
from backend.wmslayer.models import WMSLayer
from backend.inspire.models import GovPerm
from backend.inspire.models import GovPermInspire
from backend.payment.models import PaymentLayer
from backend.dedsanbutets.models import ViewNames, ViewProperties

from main.decorators import ajax_required
from main.components import Datatable
from main import utils, geoserver

from .models import WMS
from .forms import WMSForm


def _display_property(prop):
    property_detail = dict()
    property_detail['prop_id'] = prop.property_id
    property_detail['prop_name'] = prop.property_name
    property_detail['prop_eng'] = prop.property_name_eng
    property_detail['prop_code'] = prop.property_code
    return property_detail


def _wms_return_display(wms, request, layer_list):
    return {
        'id': wms.id,
        'name': wms.name,
        'url': wms.url,
        'wmts_url': wms.cache_url if wms.cache_url else '',
        'is_active': wms.is_active,
        'layers': [ob.code for ob in wms.wmslayer_set.all()],
        'layer_list': layer_list,
        'public_url': request.build_absolute_uri(reverse('backend:wms:proxy', args=[wms.pk])),
        'created_at': wms.created_at.strftime('%Y-%m-%d'),
    }


def _get_wms_display(request, wms):
    layer_list = list()
    property_ids = list()
    wms_layers = list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title'))
    for wms_layer in wms_layers:
        properties = list()
        prop_all = list()
        if utils.LAYERPREFIX in wms_layer['code']:
            layer_code = wms_layer['code'].split('gp_layer_')[1]
            feature = utils.get_feature_from_layer_code(layer_code)
            if feature:
                prop_qs = LProperties.objects
                v_prop_qs = ViewProperties.objects
                v_prop_qs = v_prop_qs.filter(view__feature_id=feature.feature_id)
                property_ids = list(v_prop_qs.values_list('property_id', flat=True))
                prop_all = prop_qs.filter(property_id__in=property_ids)

                for prop in prop_all:
                    property_detail = _display_property(prop)
                    properties.append(property_detail)

        wms_layer_detail = {
            **wms_layer,
            'properties': properties
        }
        layer_list.append(wms_layer_detail)
    return _wms_return_display(wms, request, layer_list)


def _get_feature_id_from_layers(layers_with_fid, layer_code):
    for code, fid in layers_with_fid:
        if code == layer_code:
            return fid
    return False


def _get_system_layers(request, gov_perm_inspire_qs, layers_qs, wms_id, layers_with_fid):

    wms = WMS.objects.filter(id=wms_id).first()
    layers = list()
    for layer in layers_qs.filter(wms_id=wms_id).values():
        data_types = list()
        feature_id = _get_feature_id_from_layers(layers_with_fid, layer['code'])
        if not feature_id:
            continue

        filtered_perms = gov_perm_inspire_qs.filter(feature_id=feature_id)
        data_type_qs = filtered_perms.distinct('data_type_id')
        data_type_ids = list(data_type_qs.values_list('data_type_id', flat=True))
        for data_type_id in data_type_ids:
            data_type = dict()

            feature_c_qs = LFeatureConfigs.objects
            feature_c_qs = feature_c_qs.filter(feature_id=feature_id)
            feature_c_qs = feature_c_qs.filter(data_type_id=data_type_id)
            feature_c = feature_c_qs.first()

            if not feature_c:
                continue

            data_type['data_type_display_name'] = feature_c.data_type_display_name
            filtered_perms = gov_perm_inspire_qs.filter(data_type_id=data_type_id)

            property_ids = list(filtered_perms.values_list('property_id', flat=True))
            prop_all = LProperties.objects.filter(property_id__in=property_ids)

            properties = [_display_property(prop) for prop in prop_all]
            data_type['properties'] = properties
            if properties:
                data_types.append(data_type)

        wms_layer_detail = {
            **layer,
            'data_types': data_types
        }
        layers.append(wms_layer_detail)
    return _wms_return_display(wms, request, layers)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request, org_id):

    wms_list = list()

    gov_perm = GovPerm.objects.filter(org_id=org_id).first()
    if gov_perm:
        gov_perm_inspire_qs = gov_perm.govperminspire_set
        gov_perm_geom_qs = gov_perm_inspire_qs.filter(geom=True, perm_kind=GovPermInspire.PERM_CREATE)
        feature_ids = list(gov_perm_geom_qs.values_list('feature_id', flat=True))
        layers = list()
        feature_ids.sort()
        for feature_id in feature_ids:
            feature = LFeatures.objects.filter(feature_id=feature_id).first()
            if feature:
                layer_code = utils.make_layer_name(utils.make_view_name(feature))
                layers.append([layer_code, feature_id])

        layer_codes = [code for code, f_id in layers]
        layers_qs = WMSLayer.objects.filter(code__in=layer_codes)
        ids = list(layers_qs.values_list('wms_id', flat=True))
        wms_ids = sorted(set(ids))
        gov_perm_inspire_qs = gov_perm_inspire_qs.filter(geom=False)
        gov_perm_inspire_qs = gov_perm_inspire_qs.filter(perm_kind=GovPermInspire.PERM_CREATE)

        wms_list = [
            _get_system_layers(request, gov_perm_inspire_qs, layers_qs, wms_id, layers)
            for wms_id in wms_ids
        ]

    return JsonResponse({ 'wms_list': wms_list })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pagination(request, payload):
    last = payload.get('last')
    first = payload.get('first')
    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.all()[first:last]]
    return JsonResponse({
        'wms_list': wms_list,
        'len': WMS.objects.all().count()
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def updateMore(request, pk):

    wms_list = [_get_wms_display(request, ob) for ob in WMS.objects.filter(id=pk)]
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
def activeUpdate(request, payload):

    wms_id = payload.get('id')
    is_active = payload.get('is_active')

    WMS.objects.filter(pk=wms_id).update(is_active=is_active)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def titleUpdate(request, payload):

    title = payload.get('title')
    layer_id = payload.get('id')
    WMSLayer.objects.filter(pk=layer_id).update(title=title)
    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layerAdd(request, payload):

    wmsId = payload.get('wmsId')
    layer_name = payload.get('id')
    layer_code = payload.get('code')

    wms = get_object_or_404(WMS, pk=wmsId)
    wms_layer = WMSLayer.objects.filter(code=layer_code, wms_id=wms.id)
    if wms_layer:
        return JsonResponse({'success': False})
    else:
        WMSLayer.objects.create(name=layer_name, code=layer_code, wms=wms, title=layer_name, feature_price=0)
        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layerRemove(request, payload):

    wmsId = payload.get('wmsId')
    layer_name = payload.get('id')
    wms_layer = get_object_or_404(WMSLayer, code=layer_name, wms=wmsId)
    BundleLayer.objects.filter(layer=wms_layer).delete()
    PaymentLayer.objects.filter(wms_layer=wms_layer).delete()
    wms_layer.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create(request, payload):

    wmst_url = payload.get('wmts_url') or ''
    form = WMSForm(payload)
    if form.is_valid():
        form.instance.created_by = request.user
        form.instance.cache_url = wmst_url
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
    pk = payload.get('id')
    wms = get_object_or_404(WMS, pk=pk)
    form = WMSForm(payload, instance=wms)
    is_active = payload.get('is_active')
    url_service = payload.get('url')
    wmts_url = payload.get('wmts_url')
    if wms:
        wms.cache_url = wmts_url or None
        wms.save()

    if is_active:
        wms.is_active = True
    else:
        wms.is_active = False
    if url_service == wms.url:
        if form.is_valid():
            with transaction.atomic():
                form.save()
                wms = form.instance
            rsp = {'success': True}
        else:
            rsp = {'success': False}
    else:
        if form.is_valid():
            layers = WMSLayer.objects.filter(wms=wms)
            for layer in layers:
                PaymentLayer.objects.filter(wms_layer=layer).delete()
                BundleLayer.objects.filter(layer=layer).delete()
            layers.delete()
            form.save()
            rsp = {'success': True}
        else:
            rsp = {'success': False}

    return JsonResponse(rsp)


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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def paginated_list(request, payload):

    wms_name = ''
    nsdi_geoserver = 'geo.nsdi.gov.mn'
    оруулах_талбарууд = ['id', 'name', 'url', 'created_at', 'is_active']

    geoserver_host = get_object_or_404(Config, name='geoserver_host').value
    wms_objects = WMS.objects
    wms_list = wms_objects.values('name', 'url', 'id')
    geoserver_layer_group = geoserver.get_layer_groups()
    geoserver_ws_list = geoserver.get_ws_list()
    geoserver_detail = geoserver_layer_group + geoserver_ws_list

    for wms in wms_list:
        if geoserver_host or nsdi_geoserver in wms['url']:
            wms_name = wms['url'].split('/')[-2]
        if wms_name:
            search_item = next((item for item in geoserver_detail if item['name'] == wms_name), None)
            if not search_item:
                delete_layers = WMSLayer.objects.filter(wms_id=wms['id'])
                for layer in delete_layers:
                    PaymentLayer.objects.filter(wms_layer=layer).delete()
                    BundleLayer.objects.filter(layer=layer).delete()
                delete_layers.delete()
                wms_objects.filter(pk=wms['id']).delete()

    datatable = Datatable(
        model=WMS,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд
    )

    items, total_page, start_index = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page,
        'start_index': start_index
    }

    return JsonResponse(rsp)


def _get_service_url(request, wms):
    url = reverse('backend:wms:proxy', args=[wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
@user_passes_test(lambda u: u.is_superuser)
def proxy(request, wms_id):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    wms = get_object_or_404(WMS, pk=wms_id)
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    url = wms.url
    rsp = requests.get(url, queryargs, headers=headers, verify=False)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        service_url = _get_service_url(request, wms)
        rep_url = wms.url
        service_type = request.GET.get('SERVICE')
        content = replace_src_url(content, rep_url, service_url, service_type)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_geo(requist, payload):
    wms_id = payload.get('id')
    code = payload.get('code')
    item = WMSLayer.objects.filter(wms_id=wms_id, code=code).first()
    items = []
    if item:
        items.append({
            'schema': item.geodb_schema,
            'pk_field': item.geodb_pk_field,
            'export_field': item.geodb_export_field,
            'price': item.feature_price,
            'table': item.geodb_table,
        })
    rsp = {
        'success': True,
        'items': items
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_geo(request, payload):
    datas = payload.get('data')
    wms_id = payload.get('id')
    code = payload.get('code')
    schema = None
    pk_field = None
    export_field = None
    price = None
    table = None
    schema = datas[0]['schema']
    pk_field = datas[0]['pk_field']
    export_field = datas[0]['export_field']
    if datas[0]['price']:
        price = datas[0]['price']
    else:
        price = 0
    table = datas[0]['table']

    WMSLayer.objects.filter(wms_id=wms_id, code=code).update(
        geodb_schema=schema,
        geodb_table=table,
        geodb_pk_field=pk_field,
        geodb_export_field=export_field,
        feature_price=price,
    )
    rsp = {
        'success': True
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_invalid_layers(request, payload, id):
    layers = payload.get('invalid_layers')
    wms_layer = WMSLayer.objects.filter(wms_id=id, code__in=layers)
    for layer in wms_layer:
        PaymentLayer.objects.filter(wms_layer=layer).delete()
        BundleLayer.objects.filter(layer=layer).delete()
    wms_layer.delete()

    rsp = {
        'success': True
    }
    return JsonResponse(rsp)
