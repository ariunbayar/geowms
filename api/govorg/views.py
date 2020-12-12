import requests
import json

from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url, filter_layers_wfs
from backend.govorg.models import GovOrg as System
from backend.wms.models import WMS, WMSLog
from govorg.backend.org_request.models import ChangeRequest
from backend.org.models import Employee
from geoportal_app.models import User
from backend.inspire.models import LThemes, LPackages, LFeatures, EmpPerm, EmpPermInspire
from django.contrib import auth
from django.db import connections
import main.geoserver as geoserver
from backend.dedsanbutets.models import ViewNames


def _get_service_url(request, token):
    url = reverse('api:service:system_proxy', args=[token])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
def proxy(request, token, pk=None):
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
        service_url = _get_service_url(request, token)
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


def geoJsonConvertGeom(geojson):
    with connections['default'].cursor() as cursor:
        sql = """ SELECT ST_AsGeoJSON(ST_Transform(ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326),4326)) """
        cursor.execute(sql, [str(geojson)])
        geom = cursor.fetchone()
        geom =  ''.join(geom)
        return geom


@require_POST
@csrf_exempt
def qgis_submit(request, token):
    update = request.POST.get('update')
    delete = request.POST.get('delete')
    try:
        employee = get_object_or_404(Employee, token=token)
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
                    state = ChangeRequest.STATE_CONTROL,
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
                    state = ChangeRequest.STATE_CONTROL,
                    kind = ChangeRequest.KIND_UPDATE,
                    form_json = None,
                    geo_json = geoJsonConvertGeom(update_list['geom']),
                )
        return JsonResponse({'success': True})
    except Exception:
        return JsonResponse({'success': False})


def _get_wms_name(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm, geom=True, perm_kind=EmpPermInspire.PERM_UPDATE).values_list('feature_id', flat=True)
    view_names = ViewNames.objects.filter(feature_id__in=feature_ids)
    allowed_layers = []
    if view_names:
        for view_name in view_names:
            feature = LFeatures.objects.filter(feature_id=view_name.feature_id).first()
            package = LPackages.objects.filter(package_id=feature.package_id).first()
            theme = LThemes.objects.filter(theme_id=package.theme_id).first()
            theme_ws_name = 'gp_'+ theme.theme_code
            layer_ws_name = 'gp_layer_'+ view_name.view_name
            layer_code = theme_ws_name + ":" + layer_ws_name
            allowed_layers.append(layer_code)
        return allowed_layers
    else:
        return allowed_layers


@require_GET
def qgisProxy(request, token):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    employee = get_object_or_404(Employee, token=token)
    allowed_layers = _get_wms_name(employee)
    conf_geoserver = geoserver.get_connection_conf()
    base_url = 'http://{host}:{port}/geoserver/ows'.format(
        host=conf_geoserver['geoserver_host'],
        port=conf_geoserver['geoserver_port'],
    )
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers)
        else:
            content = filter_layers(content, allowed_layers)

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all= dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        employee=employee,
    )
    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    return rsp
