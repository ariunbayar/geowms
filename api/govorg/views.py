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
from backend.org.models import Employee, Org
from backend.wms.models import WMSLog
from govorg.backend.org_request.models import ChangeRequest
from main import utils
import main.geoserver as geoserver
from django.core.cache import cache
from main.decorators import get_conf_geoserver, get_conf_geoserver_base_url


def _get_service_url(request, token):
    url = reverse('api:service:system_proxy', args=[token])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


@require_GET
@get_conf_geoserver_base_url('ows')
def proxy(request, base_url, token, pk=None):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    system = utils.geo_cache("system", token, get_object_or_404(System, token=token, deleted_by__isnull=True), 300)
    allowed_layers = utils.geo_cache("allowed_layers", token, [layer.code for layer in system.wms_layers.all() if layer.wms.is_active], 300)

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
@get_conf_geoserver_base_url('ows')
def json_proxy(request, base_url, token, code):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    system = utils.geo_cache("system_json", token, get_object_or_404(System, token=token, deleted_by__isnull=True), 300)

    if not system.wms_layers.filter(code=code):
        raise Http404

    headers = {**BASE_HEADERS}

    if request.GET.get('REQUEST') == 'GetCapabilities':
        allowed_layers = [code]
        if request.GET.get('SERVICE') == 'WFS':
            queryargs = {
                **request.GET
            }
            rsp = requests.get(base_url, queryargs, headers=headers, timeout=50)
            content = rsp.content
            content = filter_layers_wfs(content, allowed_layers)
        else:
            raise Http404

    else:
        queryargs = {
            'service': 'WFS',
            'version': '1.0.0',
            'request': 'GetFeature',
            'typeName': code,
            'outputFormat': 'application/json',
        }

        rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
        content = rsp.content

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    qs_request = queryargs.get('REQUEST', 'no request')
    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        system_id=system.id,
    )

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
    org = get_object_or_404(Org, pk=employee.org_id)
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
                org=org,
                state=ChangeRequest.STATE_CONTROL,
                kind=ChangeRequest.KIND_UPDATE,
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
                org=org,
                state=ChangeRequest.STATE_CONTROL,
                kind=ChangeRequest.KIND_DELETE,
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


def _get_cql_filter(geo_id):
    cql_data = utils.get_2d_data(geo_id)
    cql_filter = 'WITHIN(geo_data, {cql_data})'.format(cql_data = cql_data)
    return cql_filter if cql_data else ''


def _get_request_content(base_url, request, geo_id, headers):
    if request.GET.get('REQUEST') == 'GetMap' and geo_id != utils.get_1stOrder_geo_id():

        cql_filter = utils.geo_cache("gov_post_cql_filter", geo_id, _get_cql_filter(geo_id), 20000)
        queryargs = {
            **request.GET,
            'cql_filter': cql_filter,
        }

        rsp = requests.post(base_url, data=queryargs, headers=headers, timeout=5)

    else:
        queryargs = request.GET
        rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)

    return rsp, queryargs


@require_GET
@get_conf_geoserver_base_url('ows')
def qgis_proxy(request, base_url, token):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    headers = {**BASE_HEADERS}
    employee = utils.geo_cache("qgis_employee", token, Employee.objects.filter(token=token).first(), 300)
    allowed_layers = utils.geo_cache("qgis_allowed_layer", token, _get_layer_name(employee), 300)

    if not employee:
        raise Http404

    geo_id = employee.org.geo_id

    rsp, queryargs = _get_request_content(base_url, request, geo_id, headers)
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


@require_GET
@get_conf_geoserver_base_url('ows')
def geo_design_proxy(request, base_url, veiw_name):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    layer_code = 'gp_layer_' + veiw_name

    headers = {**BASE_HEADERS}

    queryargs = {
        **request.GET,
        'layers': layer_code,
    }
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5)
    content = rsp.content

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        user=request.user
    )
    content_type = rsp.headers.get('content-type')
    return HttpResponse(content, content_type=content_type)
