import requests
import json

from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url
from backend.govorg.models import GovOrg
from backend.wms.models import WMS, WMSLog
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Employee
from geoportal_app.models import User
from backend.inspire.models import LThemes, LPackages, LFeatures
from django.contrib import auth

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
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    allowed_layers = [layer.code for layer in govorg.wms_layers.filter(wms=wms)]
    if request.GET.get('REQUEST') == 'GetCapabilities':
        content = filter_layers(content, allowed_layers)
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

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


@require_POST
@csrf_exempt
def qgis_submit(request):
    values = request.POST.get('values')
    user_id = request.POST.get('user_id')
    try:
        user = User.objects.filter(id=user_id).first()
        employee = get_object_or_404(Employee, user=user)
        values_list = json.loads(values)
        feature_id = values_list[1]['att']['feature_id']
        package = LFeatures.objects.filter(feature_id=feature_id).first()
        theme=LPackages.objects.filter(package_id=package.package_id).first()
        ChangeRequest.objects.create(
            old_geo_id = None,
            new_geo_id = None,
            theme_id = theme.theme_id,
            package_id = package.package_id,
            feature_id = feature_id,
            employee = employee,
            state = ChangeRequest.STATE_NEW,
            kind = ChangeRequest.KIND_CREATE,
            form_json = None,
            geo_json = values_list[0]['geom'],
        )
        return JsonResponse({'success': True})
    except Exception:
        return JsonResponse({'success': False})


@require_POST
@csrf_exempt
def user_check(request):
    user_info = request.POST.get('user_info')
    user_info = json.loads(user_info)
    try:
        username = user_info[0]["username"]
        password = user_info[0]["password"]
        user = auth.authenticate(request, username=username, password=password)
        if user:
            return JsonResponse({'success': True, "user_id": user.id})
        else:
            return JsonResponse({'success': False, "user_id": user.id})
    except Exception:
        return JsonResponse({'success': False, "user_id": None})
