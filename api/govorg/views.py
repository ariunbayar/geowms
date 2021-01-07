import requests
import json

from django.db import connections
from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url, filter_layers_wfs
from backend.dedsanbutets.models import ViewNames
from backend.govorg.models import GovOrg as System
from backend.inspire.models import LPackages, LFeatures, EmpPerm, EmpPermInspire
from backend.org.models import Employee
from backend.wms.models import WMSLog
from govorg.backend.org_request.models import ChangeRequest
from main import utils
import main.geoserver as geoserver


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
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers)
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()
        service_url = _get_service_url(request, token)
        content = replace_src_url(content, base_url, service_url)

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        system_id=system.id,
    )

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    if system.website:
        rsp['Access-Control-Allow-Origin'] = system.website
    else:
        rsp['Access-Control-Allow-Origin'] = '*'

    return rsp


@require_GET
def json_proxy(request, token, code):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    conf_geoserver = geoserver.get_connection_conf()
    system = get_object_or_404(System, token=token, deleted_by__isnull=True)
    if not system.wms_layers.filter(code=code):
        raise Http404
    if not conf_geoserver['geoserver_host'] and not conf_geoserver['geoserver_port']:
        raise Http404

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    base_url = 'http://{host}:{port}/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName={code}&outputFormat=application%2Fjson'.format(
        host=conf_geoserver['geoserver_host'],
        port=conf_geoserver['geoserver_port'],
        code=code
    )
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    qs_request = queryargs.get('REQUEST', 'no request')
    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        system_id=system.id,
    )
    content_type = rsp.headers.get('content-type')

    rsp = HttpResponse(content, content_type=content_type)

    if system.website:
        rsp['Access-Control-Allow-Origin'] = system.website
    else:
        rsp['Access-Control-Allow-Origin'] = '*'

    return rsp


def _geojson_convert_3d_geojson(geojson):
    with connections['default'].cursor() as cursor:
        sql = """ SELECT ST_AsGeoJSON(ST_Transform(ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326),4326)) as geo_json """
        cursor.execute(sql, [str(geojson)])
        geo_json = {
            cursor.description[i][0]: value
            for i, value in enumerate(cursor.fetchone())
        }
        return geo_json['geo_json']


@require_POST
@csrf_exempt
def qgis_submit(request, token):
    update = request.POST.get('update')
    delete = request.POST.get('delete')
    employee = get_object_or_404(Employee, token=token)
    update_lists = json.loads(update)
    delete_lists = json.loads(delete)
    objs = []
    msg = []
    for update_item in update_lists:
        feature_id = update_item['att']['feature_id']
        if update_item['att']['inspire_id']:
            geo_id = update_item['att']['inspire_id']
        else:
            geo_id = update_item['att']['geo_id']
        package = LFeatures.objects.filter(feature_id=feature_id).first()
        theme = LPackages.objects.filter(package_id=package.package_id).first()
        geo_json = _geojson_convert_3d_geojson(update_item['geom'])
        success, info = utils.has_employee_perm(employee, feature_id, True, EmpPermInspire.PERM_UPDATE, geo_json)
        if success:
            objs.append(ChangeRequest(
                old_geo_id=geo_id,
                new_geo_id=None,
                theme_id=theme.theme_id,
                package_id=package.package_id,
                feature_id=feature_id,
                employee=employee,
                state=ChangeRequest.STATE_CONTROL,
                kind=ChangeRequest.KIND_DELETE,
                form_json=None,
                geo_json=geo_json,
            ))
            msg.append({'geo_id': geo_id, 'info': 'Амжилттай хадгалагдлаа', 'type': True, 'state': 'update'})
        else:
            msg.append({'geo_id': geo_id, 'info': info, 'type': False, 'state': 'update'})

    for delete_item in delete_lists:
        feature_id = delete_item['att']['feature_id']
        if delete_item['att']['inspire_id']:
            geo_id = delete_item['att']['inspire_id']
        else:
            geo_id = delete_item['att']['geo_id']
        package = LFeatures.objects.filter(feature_id=feature_id).first()
        theme = LPackages.objects.filter(package_id=package.package_id).first()
        geo_json = _geojson_convert_3d_geojson(delete_item['geom'])
        success, info = utils.has_employee_perm(employee, feature_id, True, EmpPermInspire.PERM_REMOVE, geo_json)
        if success:
            objs.append(ChangeRequest(
                old_geo_id=geo_id,
                new_geo_id=None,
                theme_id=theme.theme_id,
                package_id=package.package_id,
                feature_id=feature_id,
                employee=employee,
                state=ChangeRequest.STATE_CONTROL,
                kind=ChangeRequest.KIND_UPDATE,
                form_json=None,
                geo_json=geo_json,
            ))
            msg.append({'geo_id': geo_id, 'info': 'Амжилттай хадгалагдлаа', 'type': True, 'state': 'delete'})
        else:
            msg.append({'geo_id': geo_id, 'info': info, 'type': False, 'state': 'delete'})
    ChangeRequest.objects.bulk_create(objs)

    return JsonResponse({'success': True, 'msg': msg})


def _get_layer_name(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm, geom=True, perm_kind=EmpPermInspire.PERM_VIEW).values_list('feature_id', flat=True)
    allowed_layers = ViewNames.objects.filter(feature_id__in=feature_ids).values_list("view_name", flat=True)
    allowed_layers = ['gp_layer_' + allowed_layer for allowed_layer in allowed_layers]
    return allowed_layers


@require_GET
def qgis_proxy(request, token):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    employee = get_object_or_404(Employee, token=token)
    allowed_layers = _get_layer_name(employee)
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
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        user=employee.user,
    )
    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    return rsp
