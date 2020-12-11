import requests
import json

from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url
from backend.govorg.models import GovOrg as System
from backend.wms.models import WMS, WMSLog
from backend.changeset.models import ChangeSet
import main.geoserver as geoserver
from django.shortcuts import redirect


def _get_service_url_all(request, token):
    url = reverse('api:service:proxy-all', args=[token])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxyAll(request, token):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    system = get_object_or_404(System, token=token, deleted_by__isnull=True)
    conf_geoserver = geoserver.get_connection_conf()

    if not conf_geoserver['geoserver_host'] and not conf_geoserver['geoserver_port']:
        raise Http404

    base_url = 'http://{host}:{port}/geoserver/ows'.format(
        host=conf_geoserver['geoserver_host'],
        port=conf_geoserver['geoserver_port'],
    )
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content
    allowed_layers = [layer.code for layer in system.wms_layers.all() if layer.wms.is_active]
    if request.GET.get('REQUEST') == 'GetCapabilities':
        content = filter_layers(content, allowed_layers)
        service_url = _get_service_url_all(request, token)
        content = replace_src_url(content, base_url, service_url)

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all= dict(queryargs),
        qs_request= qs_request,
        rsp_status= rsp.status_code,
        rsp_size= len(rsp.content),
        system_id= system.id,
    )

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    if system.website:
        rsp['Access-Control-Allow-Origin'] = system.website
    else:
        rsp['Access-Control-Allow-Origin'] = '*'

    return rsp


@require_GET
def proxy(request, token, pk):
    redirect_url = _get_service_url_all(request, token)
    return redirect(redirect_url)


@require_POST
@csrf_exempt
def qgis_submit(request):

    values = request.POST.get('values')

    try:
        values_list = json.loads(values)

        changeset = ChangeSet()
        changeset.geom = values_list[0]
        changeset.features = values_list[1]
        changeset.projection = values_list[2]    
        changeset.save()
        return JsonResponse({'success': True})

    except Exception:
        return JsonResponse({'success': False})
