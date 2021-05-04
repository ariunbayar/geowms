import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET

from api.utils import filter_layers, replace_src_url
from backend.bundle.models import Bundle
from backend.wms.models import WMS
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

    wms = utils.geo_cache("open_proxy", wms_id, WMS.objects.filter(pk=wms_id).first(), 300)

    if wms is None or not wms.is_active:
        raise Http404

    if url_type == 'wmts':
        requests_url = wms.cache_url
    else:
        requests_url = wms.url

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
        content = replace_src_url(content, requests_url, service_url)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


@require_GET
@get_conf_geoserver_base_url('ows')
def file_download(request, base_url, bundle_id, wms_id, layer_id, types):

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

    file_code = code.replace('gp_layer_', '')
    file_code = file_code.replace('_view', '')
    date_now = str(localtime(now()).strftime("%Y-%m-%d_%H-%M"))
    if types == 'json':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}&outputFormat=application%2Fjson'.format(url=base_url, code=code)
        filename = 'geojson-{}-{}.json'.format(date_now, file_code)
    elif types == 'gml':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}'.format(url=base_url, code=code)
        filename = 'gml-{}-{}.xml'.format(date_now, file_code)
    elif types == 'shape-zip':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}&outputFormat=SHAPE-ZIP'.format(url=base_url, code=code)
        filename = 'shape-file-{}-{}.zip'.format(date_now, file_code)
    elif types == 'csv':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}&outputFormat=csv'.format(url=base_url, code=code)
        filename = 'csv-{}-{}'.format(date_now, file_code)
    else:
        raise Http404

    response = requests.get(req_url, request.GET, headers={**BASE_HEADERS}, timeout=5)
    content_type = response.headers.get('content-type')
    content = response.content
    response = HttpResponse(content, content_type=content_type)
    response['Content-Disposition'] = 'attachment; filename={filename}'.format(filename=filename)

    return response
