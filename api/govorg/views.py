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
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Employee
from geoportal_app.models import User
from backend.inspire.models import LPackages, LFeatures
from django.contrib import auth
import datetime
from django.db import connections


def _get_service_url(request, token, wms):
    url = reverse('api:service:proxy', args=[token, wms.pk])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, token, pk):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    system = get_object_or_404(System, token=token)
    wms = get_object_or_404(WMS, pk=pk)
    base_url = wms.url

    if not wms.is_active:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    allowed_layers = [layer.code for layer in system.wms_layers.filter(wms=wms)]
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
        system_id= system.id,
        wms_id=pk,
    )

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    if system.website:
        rsp['Access-Control-Allow-Origin'] = system.website
    else:
        rsp['Access-Control-Allow-Origin'] = '*'

    return rsp


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:
        sql = """ SELECT ST_AsGeoJSON(ST_Transform(ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326),4326)) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom =  ''.join(geom)
        return geom


@require_POST
@csrf_exempt
def qgis_submit(request):
    update = request.POST.get('update')
    delete = request.POST.get('delete')
    user_id = request.POST.get('user_id')
    try:
        user = User.objects.filter(id=user_id).first()
        employee = get_object_or_404(Employee, user=user)
        update_lists = json.loads(update)
        delete_lists = json.loads(delete)
        if len(update_lists) > 0:
            for update_list in update_lists:
                feature_id = update_list['att']['feature_id']
                if update_list['att']['inspire_id']:
                    geo_id = update_list['att']['inspire_id']
                else:
                    geo_id = update_list['att']['geo_id']
                package = LFeatures.objects.filter(feature_id=feature_id).first()
                theme=LPackages.objects.filter(package_id=package.package_id).first()
                ChangeRequest.objects.create(
                    old_geo_id = geo_id,
                    new_geo_id = None,
                    theme_id = theme.theme_id,
                    package_id = package.package_id,
                    feature_id = feature_id,
                    employee = employee,
                    state = ChangeRequest.STATE_NEW,
                    kind = ChangeRequest.KIND_DELETE,
                    form_json = None,
                    geo_json = geoJsonConvertGeom(update_list['geom']),
                )

        if len(delete_lists) > 0:
            for update_list in delete_lists:
                feature_id = update_list['att']['feature_id']
                if update_list['att']['inspire_id']:
                    geo_id = update_list['att']['inspire_id']
                else:
                    geo_id = update_list['att']['geo_id']
                package = LFeatures.objects.filter(feature_id=feature_id).first()
                theme=LPackages.objects.filter(package_id=package.package_id).first()
                ChangeRequest.objects.create(
                    old_geo_id = geo_id,
                    new_geo_id = None,
                    theme_id = theme.theme_id,
                    package_id = package.package_id,
                    feature_id = feature_id,
                    employee = employee,
                    state = ChangeRequest.STATE_NEW,
                    kind = ChangeRequest.KIND_UPDATE,
                    form_json = None,
                    geo_json = geoJsonConvertGeom(update_list['geom']),
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


@require_GET
def qgisProxy(request, token):
    print(token)
    print(token)
    print(token)
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    employee = get_object_or_404(Employee, token=token)
    print(employee)
    print(employee)
    print(employee)
    print(employee)
    print(employee)
    base_url = 'http://localhost:8080/geoserver/ows'


    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content


    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    if system.website:
        rsp['Access-Control-Allow-Origin'] = system.website
    else:
        rsp['Access-Control-Allow-Origin'] = '*'

    return rsp
