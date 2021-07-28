from frontend.page.views import service
import requests
import json

from django.db import connections
from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from api.utils import filter_layers, replace_src_url, filter_layers_wfs, get_cql_filter
from backend.govorg.models import System
from backend.inspire.models import (
    LCodeLists,
    LFeatureConfigs,
    LPackages,
    LFeatures,
    EmpPerm,
    EmpPermInspire,
    LProperties,
    LCodeListConfigs,
    MDatas
)
from backend.org.models import Employee
from backend.wms.models import WMSLog
from govorg.backend.org_request.models import ChangeRequest
from main import utils
from main.inspire import GEoIdGenerator
from main.decorators import get_conf_geoserver_base_url


def _get_service_url(request, token):
    url = reverse('api:service:system_proxy', args=[token])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def char_in_split(string):
    data = string.split(':')
    if len(data) > 1:
        return data[1]
    else:
        return string


def _get_qgis_service_url(request, token, fid):
    url = reverse('api:qgis:qgis-proxy', args=[token, fid])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def _get_perm_atts(system, code):
    wms_layer_qs = system.govorgwmslayer_set.filter(wms_layer__code=code)
    if wms_layer_qs:
        access = wms_layer_qs.first()
        atts = utils.json_load(access.attributes)
        atts.insert(0, 'geo_data')
        return atts
    else:
        return []


def _get_char(request):
    char = ''
    keys = ['TYPENAME', 'TYPENAMES']
    for key in keys:
        char = request.get(key)
        if char:
            break

    return char


@require_GET
@get_conf_geoserver_base_url('ows')
def proxy(request, base_url, token, pk=None):

    access_attributes = list()
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    queryargs = request.GET
    headers = {**BASE_HEADERS}

    system = utils.geo_cache("system", token, get_object_or_404(System, token=token, deleted_by__isnull=True), 300)
    allowed_layers = utils.geo_cache("allowed_layers", token, [layer.code for layer in system.wms_layers.all() if layer.wms.is_active], 300)

    if request.GET.get('TYPENAMES') or request.GET.get('TYPENAME'):
        char = _get_char(request.GET)
        code = char_in_split(char)
        access_attributes = utils.geo_cache("system_access_attributes", token, _get_perm_atts(system, code), 300)
        if not access_attributes:
            raise Http404

        queryargs = {
            **request.GET,
            "propertyName": ",".join(access_attributes).lower(),
        }

    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities' or request.GET.get('REQUEST') == 'DescribeFeatureType' or request.GET.get('REQUEST') == 'GetFeature':
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers, access_attributes)
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()

        service_type = request.GET.get('SERVICE')
        service_url = _get_service_url(request, token)
        # TODO байгууллагын хамрах хүрээгээр гаргах
        content = replace_src_url(content, base_url, service_url, service_type)

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
    headers = {**BASE_HEADERS}

    system = utils.geo_cache("system_json", token, get_object_or_404(System, token=token, deleted_by__isnull=True), 300)

    allowed_att = _get_perm_atts(system, code)
    if not system:
        raise Http404

    allowed_layers = [code]
    queryargs = {
        'service': 'WFS',
        'version': '1.0.0',
        'request': 'GetFeature',
        'typeName': code,
        'outputFormat': 'application/json',
        "propertyName": ",".join(allowed_att).lower()
    }

    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
    content = rsp.content
    content = filter_layers_wfs(content, allowed_layers)

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)
    service_url = request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[token, code]))
    service_type = request.GET.get('SERVICE')
    rsp.content = replace_src_url(rsp.content, base_url, service_url, service_type)

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
        sql = """ SELECT ST_AsGeoJSON(ST_GeomFromText(ST_AsText(ST_Force3D(ST_GeomFromGeoJSON(%s))), 4326)) as geo_json """
        cursor.execute(sql, [str(geojson)])
        geo_json = {
            cursor.description[i][0]: value
            for i, value in enumerate(cursor.fetchone())
        }
        return geo_json['geo_json']


def _code_list_display(property_id):
    code_list_values = list()
    code_list_configs = LCodeListConfigs.objects.filter(property_id=property_id)
    if code_list_configs:
        for code_list_config in code_list_configs:
            property_id = code_list_config.property_id
            to_property_id = code_list_config.to_property_id
            if property_id == to_property_id:
                to_property_id += 1
            x_range = range(property_id, to_property_id)
            for i in x_range:
                code_lists = LCodeLists.objects.filter(property_id=i)
                if code_lists:
                    for code_list in code_lists:
                        code_list_values.append({
                            'code_list_id': code_list.code_list_id,
                            'code_list_name': code_list.code_list_name,
                            'code_list_definition': code_list.code_list_definition,
                        })
    return code_list_values


def _get_data_from_mdatas(valid_type, query):
    if valid_type == 'text':
        return query.value_text
    elif valid_type == 'option':
         return query.code_list_id
    elif valid_type == 'date':
         return utils.datetime_to_string(query.value_date)
    elif valid_type == 'number':
         return query.value_number
    else :
        return ''


def _get_property_data(values, employee, feature_id, geo_id):
    datas = []
    property_perms = utils.get_emp_property_roles(employee, feature_id)
    feature_config = list(LFeatureConfigs.objects.filter(feature_id=feature_id).values_list('feature_config_id', flat=True))
    qs = MDatas.objects.filter(
        feature_config_id__in=feature_config,
        geo_id=geo_id
    )

    property_qs = LProperties.objects
    property_qs = property_qs.exclude(property_code__iexact='localId')

    for value in values:
        form = {}
        property = property_qs.filter(property_code__iexact=value)
        property = property.first()
        if property:
            data_list = []
            value_type = property.value_type_id
            valid_type = utils.get_type(value_type)
            data = values[value]
            if data and valid_type == 'option':
                code_list = LCodeLists.objects.filter(code_list_name__iexact=data).first()
                if code_list:
                    data = code_list.code_list_id
                    data_list = _code_list_display(property.property_id)
            form['pk'] = ''
            form['property_id'] = property.property_id
            form['property_name'] = property.property_name
            form['property_code'] = property.property_code
            form['property_definition'] = property.property_definition
            form['value_type_id'] = value_type
            form['value_type'] = valid_type
            form['data_list'] = data_list
            for perm in property_perms[1]:
                if perm['property_id'] == property.property_id:
                    get_perm = perm['roles']
                    if not get_perm["PERM_UPDATE"]:
                        form['data'] = data if data != 'NULL' else ''
                    else:
                        query = qs.filter(property_id=perm['property_id']).first()
                        if query:
                            form['data'] = _get_data_from_mdatas(value_type, query)

            form['roles'] = get_perm
            datas.append(form)

    return datas


def create_change_request(request_datas, feature_id, employee):
    objs = []
    info = ''

    for datas in request_datas:
        check_data = False

        for data in datas['data_list']:
            new_geo_id = None
            old_geo_id = data['att'].get('localid') or None
            if old_geo_id == 'NULL':
                old_geo_id = None

            package = LFeatures.objects.filter(feature_id=feature_id).first()
            theme = LPackages.objects.filter(package_id=package.package_id).first()

            geo_json = _geojson_convert_3d_geojson(data['geom'])
            form_json = _get_property_data(data['att'], employee, feature_id, old_geo_id)

            success, info = utils.has_employee_perm(employee, feature_id, True, datas['perm_kind'], geo_json)

            if not success:
                check_data = True
                break

            form_json = utils.json_dumps(form_json)

            if datas['perm_kind'] == EmpPermInspire.PERM_REMOVE:
                form_json = None

            elif datas['perm_kind'] == EmpPermInspire.PERM_CREATE:
                new_geo_id = GEoIdGenerator(feature_id, package.feature_code).get()

            objs.append(ChangeRequest(
                old_geo_id=old_geo_id,
                new_geo_id=new_geo_id,
                theme_id=theme.theme_id,
                package_id=package.package_id,
                feature_id=feature_id,
                employee=employee,
                org=employee.org,
                state=ChangeRequest.STATE_CONTROL,
                kind=datas['request_type'],
                form_json=form_json,
                geo_json=geo_json,
            ))

        if check_data:
            return False, info, objs

    return True, info, objs


@require_POST
@csrf_exempt
def qgis_submit(request, token, fid):
    employee = get_object_or_404(Employee, token=token)

    request_list = []
    request_list_data = {}

    update = request.POST.get('update')
    delete = request.POST.get('delete')
    create = request.POST.get('create')

    update_lists = json.loads(update)
    delete_lists = json.loads(delete)
    create_lists = json.loads(create)

    if update_lists:

        request_list_data = {
            'data_list': update_lists,
            'perm_kind': EmpPermInspire.PERM_UPDATE,
            'request_type': ChangeRequest.KIND_UPDATE
        }

        request_list.append(request_list_data)

    if create_lists:

        request_list_data = {
            'data_list': create_lists,
            'perm_kind': EmpPermInspire.PERM_CREATE,
            'request_type': ChangeRequest.KIND_CREATE
        }

        request_list.append(request_list_data)

    if delete_lists:

        request_list_data = {
            'data_list': delete_lists,
            'perm_kind': EmpPermInspire.PERM_REMOVE,
            'request_type': ChangeRequest.KIND_DELETE
        }

        request_list.append(request_list_data)

    success, info, objs = create_change_request(request_list, fid, employee)
    if not success:
        return JsonResponse({'success': False, 'msg': info})

    ChangeRequest.objects.bulk_create(objs)
    return JsonResponse({'success': True, 'msg': info})


def _get_layer_name(employee, fid):
    allowed_layers = list()
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    has_perm = EmpPermInspire.objects.filter(emp_perm=emp_perm, geom=True, perm_kind=EmpPermInspire.PERM_VIEW, feature_id=fid)
    if has_perm:
        feature_qs = LFeatures.objects.filter(feature_id=fid)
        allowed_layers = [utils.make_layer_name(utils.make_view_name(feature)) for feature in feature_qs]
    return allowed_layers


def _get_request_content(base_url, request, geo_id, headers):
    queryargs = request.GET
    if geo_id != utils.get_1stOrder_geo_id() and (request.GET.get('REQUEST') == 'GetMap' or request.GET.get('REQUEST') == 'GetFeature'):
        cql_filter = utils.geo_cache("gov_post_cql_filter", geo_id, get_cql_filter(geo_id), 20000)
        if request.GET.get('REQUEST') == 'GetMap':
            queryargs = {
                **request.GET,
                'cql_filter': cql_filter
            }
        else:
            queryargs = {
                'service': 'WFS',
                'request': 'GetFeature',
                'version': '1.0.0',
                'typeNames': request.GET.get('TYPENAMES'),
                'typeName': request.GET.get('TYPENAME'),
                'srsName': 'EPSG:4326',
                'srs': 'EPSG:4326',
                'outputFormat': 'gml3',
                'cql_filter': cql_filter
            }
        rsp = requests.post(base_url, queryargs,  headers=headers, timeout=300, verify=False)
    else:
        queryargs = request.GET
        rsp = requests.get(base_url, queryargs, headers=headers, timeout=300, verify=False)

    return rsp, queryargs


def _get_emp_perm_properties(token, fid):
    emp = Employee.objects.filter(token=token).first()
    perms = emp.empperm_set.all()
    perms_prop = list()
    for perm in perms:
        perms_inspire = perm.empperminspire_set.filter(feature_id=fid)
        geom_rm_perms = perms_inspire.filter(geom=True, perm_kind=EmpPermInspire.PERM_REMOVE)
        geom_up_perms = perms_inspire.filter(geom=True, perm_kind=EmpPermInspire.PERM_UPDATE)
        if geom_up_perms and geom_rm_perms:
            perms_inspire = perms_inspire.filter(geom=False)
            perms_inspire = perms_inspire.filter(perm_kind=EmpPermInspire.PERM_UPDATE)
            perm_property_ids = list(perms_inspire.values_list('property_id', flat=True))
            prop_qs = LProperties.objects
            prop_qs = prop_qs.filter(property_id__in=perm_property_ids)
            properties = list(prop_qs.values_list('property_code', flat=True))
            perms_prop = perms_prop + properties
    return perms_prop


def _get_value_from_request(request, param_name):
    if request.GET.get(param_name.upper()):
        return request.GET.get(param_name.upper()).lower()
    elif request.GET.get(param_name.lower()):
        return request.GET.get(param_name.lower()).lower()
    return ""


@require_GET
@get_conf_geoserver_base_url('ows')
def qgis_proxy(request, base_url, token, fid=''):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    headers = {**BASE_HEADERS}
    employee = utils.geo_cache("qgis_employee", token, Employee.objects.filter(token=token).first(), 300)
    allowed_layers = utils.geo_cache("qgis_allowed_layer", token, _get_layer_name(employee, fid), 300)
    if not employee or not allowed_layers:
        raise Http404

    geo_id = employee.org.geo_id

    queryargs = {
        **request.GET,
    }

    rsp, queryargs = _get_request_content(base_url, request, geo_id, headers)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetFeature':
        content = rsp.content
        content = replace_src_url(content, 'featureMembers', 'Members', None)

    allowed_props = utils.geo_cache("qgis_allowed_perms", token, _get_emp_perm_properties(token, fid), 300)
    if not allowed_props:
        raise Http404
    allowed_props.insert(0, 'geo_data')

    service_request = _get_value_from_request(request, 'request')

    unneed_requests = ['getmap', 'getlegendgraphic']
    if service_request not in unneed_requests:
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers, allowed_props)
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()

        service_url = _get_qgis_service_url(request, token, fid)
        service_type = request.GET.get('SERVICE')
        content = replace_src_url(content, base_url, service_url, service_type)

    elif service_request == 'getlegendgraphic':
        request_layers = _get_value_from_request(request, 'layer')
        request_layers = request_layers.split(":")[len(request_layers.split(":")) - 1]
        if request_layers not in allowed_layers:
            raise Http404

    elif service_request == 'getmap':
        request_layers = _get_value_from_request(request, 'layers')
        request_layers = request_layers.split(":")[len(request_layers.split(":")) - 1]
        if request_layers not in allowed_layers:
            raise Http404

    qs_request = queryargs.get('REQUEST', 'no request')

    WMSLog.objects.create(
        qs_all=dict(queryargs),
        qs_request=qs_request,
        rsp_status=rsp.status_code,
        rsp_size=len(rsp.content),
        user=employee.user
    )
    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    return rsp


@require_GET
@get_conf_geoserver_base_url('ows')
def geo_design_proxy(request, base_url, view_name):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    layer_code = 'gp_layer_' + view_name

    headers = {**BASE_HEADERS}

    queryargs = {
        **request.GET,
        'layers': layer_code,
    }
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
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
