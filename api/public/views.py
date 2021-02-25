import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET

from api.utils import filter_layers, replace_src_url
from backend.bundle.models import Bundle
from backend.wms.models import WMS


def _get_user_roles(user):
    roles = {1}
    if user.is_authenticated:
        roles |= set(user.roles.all().values_list('id', flat=True))
    return roles


def _get_service_url(request, bundle_id, wms):
    url = reverse('api:service:wms_proxy', args=[bundle_id, wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, bundle_id, wms_id, url_type='wms'):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    wms = WMS.objects.filter(pk=wms_id).first()

    if wms is None or not wms.is_active:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}

    if url_type == 'wmts':
        requests_url = wms.cache_url
    else:
        requests_url = wms.url

    rsp = requests.get(requests_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        print("wrewrwerwerw")
        user_roles = _get_user_roles(request.user)
        wms_layers = wms.wmslayer_set.filter(
                bundlelayer__bundle__pk=bundle_id,
                bundlelayer__role_id__in=user_roles,
            )
        allowed_layers = set([layer.code for layer in wms_layers])

        content = filter_layers(content, allowed_layers)

        service_url = _get_service_url(request, bundle_id, wms)
        content = replace_src_url(content, requests_url, service_url)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)
