from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from backend.dedsanbutets.models import ViewNames
from django.db.models import base
import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET

from api.utils import filter_layers, replace_src_url
from backend.bundle.models import Bundle
from backend.wms.models import WMS
from backend.inspire.models import LProperties
from django.utils.timezone import localtime, now
import main.geoserver as geoserver
from geoportal_app.models import Role
from django.core.cache import cache
from main.decorators import get_conf_geoserver, get_conf_geoserver_base_url
from main import utils


def _get_user_roles(user):
    roles = {1}
    if user.is_authenticated:
        roles |= set(user.roles.all().values_list('id', flat=True))
    return roles


def _get_service_url(request, bundle_id, wms, url_type):
    url = reverse('api:service:wms_proxy', args=[bundle_id, wms.pk, url_type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, bundle_id, wms_id, url_type='wms'):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    queryargs = request.GET
    headers = {**BASE_HEADERS}

    wms_qs = WMS.objects.filter(pk=wms_id).first()

    wms = utils.geo_cache("open_proxy", wms_id, wms_qs, 300)

    if wms is None or not wms.is_active:
        raise Http404

    if url_type == 'wmts':
        requests_url = wms.cache_url
    else:
        requests_url = wms.url

    # wms = wms_qs.wmslayer_set.filter(wms_id=wms_id, name=wms_qs.name).first()
    # code = wms.code.replace('gp_layer_', '')
    # view = ViewNames.objects.filter(view_name=code).first()
    # props = view.viewproperties_set.all()
    # property_codes = list()
    # for prop in props:
    #     prop_qs = LProperties.objects.filter(property_id=prop.property_id)
    #     property_codes.append(prop_qs.first().property_code)

    # queryargs['propertyName'] = ",".join(property_codes).lower()
    rsp = requests.get(requests_url, queryargs, headers=headers, timeout=100, verify=False)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        def _get_allowed_layers():
            user_roles = _get_user_roles(request.user)
            wms_layers = wms.wmslayer_set.filter(
                    bundlelayer__bundle__pk=bundle_id,
                    bundlelayer__role_id__in=user_roles,
                )
            allowed_layers = set([layer.code for layer in wms_layers])
            return allowed_layers

        allowed_layers = utils.geo_cache("open_allowed_layers", '', _get_allowed_layers(), 300)
        content = filter_layers(content, allowed_layers)
        service_url = _get_service_url(request, bundle_id, wms, url_type)
        service_type = request.GET.get('SERVICE')
        content = replace_src_url(content, requests_url, service_url, service_type)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


@require_GET
@get_conf_geoserver_base_url('ows')
def file_download(request, base_url, bundle_id, wms_id, layer_id, types):

    if not request.user.is_sso:
        raise Http404

    if request.GET.get('REQUEST') == 'GetCapabilities':
        raise Http404

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    wms = get_object_or_404(WMS, pk=wms_id)

    wms_layer = wms.wmslayer_set.filter(
                    bundlelayer__bundle=bundle,
                    bundlelayer__role_id=Role.ROLE1,
                    bundlelayer__layer_id=layer_id
                ).first()

    if not wms_layer:
        raise Http404
    code = wms_layer.code

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    view_name = code.replace('gp_layer_', '')
    file_code = view_name.replace('_view', '')
    date_now = str(localtime(now()).strftime("%Y-%m-%d_%H-%M"))

    view = ViewNames.objects.filter(view_name=view_name).first()
    if not view or not view.open_datas:
        raise Http404

    open_properties = _get_property_names(view)

    base_geoserver_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}'.format(url=base_url, code=code)
    base_geoserver_url = '{base_url}&propertyName=geo_data,{properties}'.format(base_url=base_geoserver_url, properties=open_properties)

    if types == 'json':
        req_url = '{base_url}&outputFormat=application%2Fjson'.format(base_url=base_geoserver_url)
        filename = '{}-{}-{}.geojson'.format(types, date_now, file_code)
    elif types == 'gml':
        req_url = '{base_url}'.format(base_url=base_geoserver_url)
        filename = '{}-{}-{}.gml'.format(types, date_now, file_code)
    elif types == 'shape-zip':
        req_url = '{base_url}&outputFormat=SHAPE-ZIP'.format(base_url=base_geoserver_url)
        filename = '{}-{}-{}.zip'.format(types, date_now, file_code)
    elif types == 'csv':
        req_url = '{base_url}&outputFormat=csv'.format(base_url=base_geoserver_url)
        filename = '{}-{}-{}.csv'.format(types, date_now, file_code)
    else:
        raise Http404

    response = requests.get(req_url, request.GET, headers={**BASE_HEADERS}, timeout=5)
    content_type = response.headers.get('content-type')
    #TODO shape zip file tathad wfsrequest.txt gesen file tataj bgaa teriig exclude hiih
    response = HttpResponse(response.content, content_type=content_type)
    response['Content-Disposition'] = 'attachment; filename={filename}'.format(filename=filename)

    return response


def _get_property_names(view):
    open_properties = ''
    if view and view.open_datas:
        open_properties = utils.json_load(view.open_datas)
        open_properties = ",".join(open_properties).lower()
    return open_properties


@require_GET
def open_layer_proxy(request, bundle_id, wms_id, layer_id, url_type='wms'):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    urls = ['wms', 'wmts', 'wfs']

    if url_type not in urls:
        raise Http404

    get_url = {
        'wms': 'url',
        'wfs': 'url',
        'wmts': 'cache_url',
    }

    bundle = get_object_or_404(Bundle, pk=bundle_id)

    wms_qs = WMS.objects.filter(pk=wms_id)
    if not wms_qs:
        raise Http404

    wms_layer = wms_qs.first().wmslayer_set.filter(
                bundlelayer__bundle=bundle,
                bundlelayer__role_id=Role.ROLE1,
                bundlelayer__layer_id=layer_id
            ).first()

    if not wms_layer:
        raise Http404

    wms_layer_code = wms_layer.code

    layer_code = wms_layer_code.replace('gp_layer_', '')

    view = ViewNames.objects.filter(view_name=layer_code).first()
    if not view or not view.open_datas:
        raise Http404

    properties = _get_property_names(view)

    wms = wms_qs.values().first()
    url = wms[get_url[url_type]]

    request.GET = request.GET.copy()
    request.GET['typeName'] = wms_layer_code
    request.GET['propertyName'] = properties

    response = requests.get(url, request.GET, headers={**BASE_HEADERS}, timeout=5, verify=False)
    content_type = response.headers.get('content-type')
    content = response.content

    return HttpResponse(content, content_type=content_type)
