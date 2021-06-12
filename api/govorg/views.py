from django.db.models import base
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
from backend.govorg.models import GovOrgWMSLayer, GovOrg as System
from backend.inspire.models import LPackages, LFeatures, EmpPerm, EmpPermInspire, LProperties
from backend.org.models import Employee, Org
from backend.wms.models import WMSLog
from govorg.backend.org_request.models import ChangeRequest
from main import utils
from django.core.cache import cache
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


def allowed_attbs(request, token, system, code):
    allowed_att = cache.get('allowed_att_{}_{}'.format(token, code))
    if not allowed_att:
        wms_layer = system.wms_layers.filter(code=code).first()
        govorg_layer = GovOrgWMSLayer.objects.filter(wms_layer=wms_layer, govorg=system).first()
        allowed_att = ''
        if govorg_layer and govorg_layer.attributes:
            govort_attributes = govorg_layer.attributes.replace("\'", "\"")
            attributes = json.loads(govort_attributes)
            for attribute in attributes:
                allowed_att = allowed_att + attribute.lower() + ','
            allowed_att = allowed_att[:-1]
        cache.set('allowed_att_{}_{}'.format(token, code), allowed_att, 600)

    return allowed_att


def _get_qgis_service_url(request, token):
    url = reverse('api:service:qgis-proxy', args=[token])
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
    system = utils.geo_cache("system", token, get_object_or_404(System, token=token, deleted_by__isnull=True), 300)
    allowed_layers = utils.geo_cache("allowed_layers", token, [layer.code for layer in system.wms_layers.all() if layer.wms.is_active], 300)
    if request.GET.get('TYPENAMES'):
        code = char_in_split(request.GET.get('TYPENAMES'))
        allowed_att = allowed_attbs(request, token, system, code)
        queryargs = {
            **request.GET,
            "propertyName": [allowed_att],
        }

    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities' or request.GET.get('REQUEST') == 'DescribeFeatureType' or request.GET.get('REQUEST') == 'GetFeature':
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers)
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()


    qs_request = queryargs.get('REQUEST', 'no request')
    base_url_wfs = base_url.replace('ows', 'wfs')
    service_url = _get_service_url(request, token)
    content = replace_src_url(content, base_url_wfs, service_url)

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

    allowed_att = allowed_attbs(request, token, system, code)

    # if not system:
    #     raise Http404
    allowed_layers = [code]
    queryargs = {
        'service': 'WFS',
        'version': '1.0.0',
        'request': 'GetFeature',
        'typeName': code,
        # 'outputFormat': 'application/json',
        # "propertyName": [allowed_att]
    }

    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
    print("hoh")
    print("hoh")
    print("hoh", rsp.status_code, rsp.text)
    content = rsp.content
    content = filter_layers_wfs(content, allowed_layers)

    content_type = rsp.headers.get('content-type')
    rsp = HttpResponse(content, content_type=content_type)

    service_url = request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[token, code]))
    base_url_wfs = base_url.replace('ows', 'wfs')
    rsp.content = replace_src_url(rsp.content, base_url_wfs, service_url)

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


def _get_type(value_type_id):
    if value_type_id == 'number':
        value_type = 'number'
    elif value_type_id == 'double':
        value_type = 'number'
    elif value_type_id == 'multi-text':
        value_type = 'text'
    elif value_type_id == 'text':
        value_type = 'text'
    elif value_type_id == 'date':
        value_type = 'date'
    elif value_type_id == 'link':
        value_type = 'text'
    elif value_type_id == 'boolean':
        value_type = 'text'
    else:
        value_type = 'option'
    return value_type


def _get_property_data(values):
    datas = []
    for value in values:
        form = {}
        property = LProperties.objects.filter(property_code__iexact=value).first()
        if property:
            form['pk'] = ''
            form['property_id'] = property.property_id
            form['property_name'] = property.property_name
            form['property_code'] = property.property_code
            form['property_definition'] = property.property_definition
            form['value_type_id'] = property.value_type_id
            form['value_type'] = _get_type(property.value_type_id)
            form['data'] = values[value] or ''
            form['data_list'] = []
            form['roles'] = {"PERM_VIEW": True, "PERM_CREATE": True, "PERM_REMOVE": False, "PERM_UPDATE": True, "PERM_APPROVE": True, "PERM_REVOKE": False}
            datas.append(form)

    return datas


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
    form_json = []
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
        form_json = _get_property_data(update_item['att'])

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
                form_json=utils.json_dumps(form_json),
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
    hoho = ChangeRequest.objects.bulk_create(objs)
    return JsonResponse({'success': True, 'msg': msg})


def _get_layer_name(employee):
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm, geom=True, perm_kind=EmpPermInspire.PERM_VIEW).values_list('feature_id', flat=True)
    features = LFeatures.objects.filter(feature_id__in=feature_ids)
    allowed_layers = ['gp_layer_' + utils.make_view_name(feature) for feature in features]
    return allowed_layers


def _get_cql_filter(geo_id):
    cql_data = utils.get_2d_data(geo_id)
    cql_filter = 'WITHIN(geo_data, {cql_data})'.format(cql_data=cql_data)
    return cql_filter if cql_data else ''


def _get_request_content(base_url, request, geo_id, headers):
    queryargs = request.GET
    print("hoho")
    print("hoho")
    print("hoho")
    print("hoho", queryargs)
    if geo_id != utils.get_1stOrder_geo_id() and (request.GET.get('REQUEST') == 'GetMap' or request.GET.get('REQUEST') == 'GetFeature'):
        queryargs = {
            **request.GET
            # 'service': 'WFS',
            # 'version': '1.0.0',
            # 'request': 'GetFeature',
            # 'typeName': 'gp_layer_building_b_view',
            # 'outputFormat': 'application/json',
        }


        # queryargs = {
        #     'service':'wfs',
        #     'version':'2.0.0',
        #     'request':'GetFeature',
        #     'typeNames':'gp_bu:gp_layer_building_b_view',
        #     'srsName':'EPSG:4326',
        #     'bbox':'90.00002124600024, 48.42005555600019,95.6890555560002,50.88442842400025'
        # }
        base_url = 'http://localhost:8080/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=gp_bu:gp_layer_building_b_view&count=10&srsName=EPSG:4326&%20bbox=90.00002124600024,%2048.42005555600019,95.6890555560002,50.88442842400025'
        # if request.GET.get('REQUEST') == 'GetMap':
        #     cql_filter = utils.geo_cache("gov_post_cql_filter", geo_id, _get_cql_filter(geo_id), 20000)
        #     queryargs = {
        #         **request.GET,
        #         'cql_filter': cql_filter,
        #     }
        # else:
        #     print("hoho")
        #     print("hoho", request.GET)
        #     # cql_filter = utils.geo_cache("gov_post_cql_filter", geo_id, _get_cql_filter(geo_id), 20000)

        #     cql_filter = '''
        #         <fes:Filter>
        #             <fes:Within>
        #             <fes:ValueReference>geo_data</fes:ValueReference>
        #             <gml:Polygon  gml:id="polygon.1" srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
        #                 <gml:exterior>
        #                 <gml:LinearRing>
        #                     <gml:posList>
        #                         90.00002124600024 48.42005555600019
        #                         90.00002124600024 50.88442842400025
        #                         95.6890555560002 50.88442842400025
        #                         95.6890555560002 48.42005555600019
        #                         90.00002124600024 48.42005555600019
        #                     </gml:posList>
        #                 </gml:LinearRing>
        #                 </gml:exterior>
        #             </gml:Polygon>
        #             </fes:Within>
        #         </fes:Filter>
        #     '''
        #     queryargs = {
        #         'service': 'WFS',
        #         'request': 'GetFeature',
        #         'typeName': request.GET.get('TYPENAME'),
        #         'version': request.GET.get('VERSIO'),
        #         'TYPENAMES': request.GET.get('TYPENAMES'),
        #         'STARTINDEX': request.GET.get('STARTINDEX'),
        #         'COUNT': request.GET.get('COUNT'),
        #         'SRSNAME': request.GET.get('SRSNAME'),
        #         'BBOX': '90.00002124600024,48.42005555600019,95.6890555560002,50.88442842400025',
        #     }
        # base_url = 'http://127.0.0.1:8080/geoserver/wfs?'
        rsp = requests.get(base_url, headers=headers, timeout=5, verify=False)
        print("hoh")
        print("hoh")
        print("hoh", rsp.status_code, rsp.text)
    else:
        queryargs = request.GET
        rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
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

    queryargs = {
        **request.GET,
    }
    # rsp, queryargs = _get_request_content(base_url, request, geo_id, headers)
    # if request.GET.get('REQUEST') == 'GetFeature':

    #     queryargs = {
    #         'SERVICE':'WFS',
    #         'REQUEST':'GetFeature',
    #         'VERSION':'2.0.0',
    #         'TYPENAMES':'gp_bu:gp_layer_building_b_view',
    #         'TYPENAME':'gp_bu:gp_layer_building_b_view',
    #         'STARTINDEX':0,
    #         'COUNT':1000000,
    #         'srsName':'EPSG:4326',
    #         'bbox':'90.00002124600024, 48.42005555600019,95.6890555560002,50.88442842400025'
    #     }
    #     print("hoho")
    #     print("hoho", base_url, queryargs)
    #     rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)
    #     print("hoho")
    #     print("hoho")
    #     print("hoho", rsp.status_code)
    # else:
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=5, verify=False)

    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        if request.GET.get('SERVICE') == 'WFS':
            content = filter_layers_wfs(content, allowed_layers)
            base_url = base_url.replace('ows', 'wfs')
        elif request.GET.get('SERVICE') == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()

        service_url = _get_qgis_service_url(request, token)
        content = replace_src_url(content, base_url, service_url)

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
