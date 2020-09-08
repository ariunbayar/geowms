import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET

from backend.govorg.models import GovOrg
from backend.wms.models import WMS
from backend.wms.models import WMSLog

from api.utils import filter_layers, replace_src_url


def _get_service_url(request, token, wms):
    url = reverse('api:service:proxy', args=[token, wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, token, pk):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    govorg = get_object_or_404(GovOrg, token=token)
    wms = get_object_or_404(WMS, pk=pk)
    base_url = wms.url

    if not wms.is_active:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers)
    content = rsp.content

    allowed_layers = [layer.code for layer in govorg.wms_layers.filter(wms=wms)]
    if request.GET.get('REQUEST') == 'GetCapabilities':
        content = filter_layers(content, allowed_layers)

    content_type = rsp.headers.get('content-type')

    service_url = _get_service_url(request, token, wms)
    content = replace_src_url(content, wms.url, service_url)

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all= dict(queryargs),
        qs_request= qs_request,
        rsp_status= rsp.status_code,
        rsp_size= len(rsp.content),
        system_id= govorg.id,
        wms_id=pk,
    )

    return HttpResponse(content, content_type=content_type)
