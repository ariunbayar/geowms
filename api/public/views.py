
import zipfile
from io import BytesIO

from django.conf.urls import url

from django.contrib.auth.decorators import login_required
from backend.dedsanbutets.models import ViewNames
from django.db.models import base
import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_GET

from api.utils import (
    filter_layers,
    replace_src_url,
    filter_layers_wfs,
    get_cql_filter,
    calc_radius,
    get_buffer_of_point,
)
from backend.bundle.models import Bundle
from backend.wms.models import WMS
from backend.inspire.models import LProperties
from django.utils.timezone import localtime, now
import main.geoserver as geoserver
from geoportal_app.models import Role
from django.core.cache import cache
from main.decorators import get_conf_geoserver, get_conf_geoserver_base_url
from main import utils


def _get_user_roles(user):
    roles = {1}
    if user.is_authenticated:
        roles |= set(user.roles.all().values_list('id', flat=True))
    return roles


def _get_service_url(request, bundle_id, wms, url_type):
    url = reverse('api:service:wms_proxy', args=[bundle_id, wms.pk, url_type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def _access_filter_keys():
    return [
        'within', 'buffer', 'scale'
    ]


def _check_access_query_keys(query, access_keys):
    remove_keys = list()
    for key in query.keys():
        if key not in access_keys:
            remove_keys.append(key)

    for remove_key in remove_keys:
        del query[remove_key]

    return query


def _make_body(filters):
    body = dict()
    for filter in filters:
        for key, values in filter.items():
            body[key] = ",".join(values)
    return body


def _get_srid(querys):
    srid = 4326

    srs = querys.get("SRS")
    if not srs:
        return srid

    srid = srs.split(":")[1]
    return srid


def _public_filter(querys):
    filters = list()
    filter_query = querys.get('FILTER')
    if not filter_query:
        return filters

    srid = int(_get_srid(querys))

    filter_query = utils.json_load(filter_query)
    filter_query = _check_access_query_keys(filter_query, _access_filter_keys())

    cql_filters = list()
    filter_cql_filter_key = 'CQL_FILTER'
    filter = {
        filter_cql_filter_key: cql_filters
    }

    def _append_to_list(item, filter_key=filter_cql_filter_key):
        cql_filters.append(item)
        filter[filter_key] = cql_filters
        filters.append(filter)

    # within үеийн хайлт
    within = "within"
    if within in filter_query:
        geo_id = filter_query[within]
        first_au_level_geo_id = utils.geo_cache('first_au_level_geo_id', '', utils.get_1stOrder_geo_id(), 1800)
        if geo_id == first_au_level_geo_id:
            return filters

        within = utils.geo_cache('search', geo_id, get_cql_filter(geo_id, srid=4326), 1800)
        _append_to_list(within)

    # buffer үеийн хайлт
    coordinates = 'buffer'
    if coordinates in filter_query:
        coordinates = filter_query[coordinates]
        coordinates = utils.json_load(coordinates)

        radius = calc_radius(filter_query['scale'])
        buffer_circle = get_buffer_of_point(coordinates, radius)

        buffer = get_cql_filter('', srid=4326, cql_data=buffer_circle)
        _append_to_list(buffer)

    return filters  # return list


def _change_query_args(queryargs, body):
    queryargs._mutable = True

    queryargs.pop('FILTER')
    for key, value in body.items():
        queryargs.appendlist(key, value)

    queryargs._mutable = False
    return queryargs


@require_GET
def proxy(request, bundle_id, wms_id, url_type='wms'):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    queryargs = request.GET
    headers = {**BASE_HEADERS}

    wms_qs = WMS.objects.filter(pk=wms_id).first()

    wms = utils.geo_cache("open_proxy", wms_id, wms_qs, 300)

    if wms is None or not wms.is_active:
        raise Http404

    if url_type == 'wmts':
        requests_url = wms.cache_url
    else:
        requests_url = wms.url

    # wms = wms_qs.wmslayer_set.filter(wms_id=wms_id, name=wms_qs.name).first()
    # code = wms.code.replace('gp_layer_', '')
    # view = ViewNames.objects.filter(view_name=code).first()
    # props = view.viewproperties_set.all()
    # property_codes = list()
    # for prop in props:
    #     prop_qs = LProperties.objects.filter(property_id=prop.property_id)
    #     property_codes.append(prop_qs.first().property_code)

    # queryargs['propertyName'] = ",".join(property_codes).lower()

    request_args = {
        "headers": headers,
        "timeout": 100,
        "verify": False,
    }

    filters = _public_filter(queryargs)
    if filters:
        request_args['timeout'] = 300

        body = _make_body(filters)
        queryargs = _change_query_args(queryargs, body)
        queryargs = queryargs.dict()

        rsp = requests.post(requests_url, queryargs, **request_args)

    else:
        rsp = requests.get(requests_url, queryargs, **request_args)

    content = rsp.content

    if request.GET.get('REQUEST') == 'GetCapabilities':
        def _get_allowed_layers():
            user_roles = _get_user_roles(request.user)
            wms_layers = wms.wmslayer_set.filter(
                    bundlelayer__bundle__pk=bundle_id,
                    bundlelayer__role_id__in=user_roles,
                )
            allowed_layers = set([layer.code for layer in wms_layers])
            return allowed_layers

        allowed_layers = utils.geo_cache("open_allowed_layers", '', _get_allowed_layers(), 300)
        content = filter_layers(content, allowed_layers)
        service_url = _get_service_url(request, bundle_id, wms, url_type)
        service_type = request.GET.get('SERVICE')
        content = replace_src_url(content, requests_url, service_url, service_type)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(content, content_type=content_type)


def _get_file_ext():
    obj = {
        'json': ['geojson', '&outputFormat=application%2Fjson'],
        'gml': ['gml', '&outputFormat=GML3'],
        'shape-zip': ['zip', '&outputFormat=SHAPE-ZIP'],
        'csv': ['csv', '&outputFormat=csv']
    }
    return obj


def _generate_zip(files):
    mem_zip = BytesIO()

    with zipfile.ZipFile(mem_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.writestr(f[0], f[1])

    return mem_zip.getvalue()


def _file_replace(content):
    filebytes = BytesIO(content)
    myzipfile = zipfile.ZipFile(filebytes)
    files = []
    for file in myzipfile.infolist():
        file_items = []
        if '.txt' not in file.filename:
            buffer = myzipfile.read(file.filename)

            file_items.append(file)
            file_items.append(buffer)
            files.append(file_items)

    content = _generate_zip(files)
    return content


@require_GET
@get_conf_geoserver_base_url('ows')
def file_download(request, base_url, bundle_id, wms_id, layer_id, types):

    def _make_service_url():
        url = reverse('api:service:file-download', args=[bundle_id, wms_id, layer_id, types])
        absolute_url = request.build_absolute_uri(url)
        return absolute_url

    ext = 0
    url_ext = 1

    request_request = ''
    if request.GET.get('REQUEST'):
        request_request = request.GET.get('REQUEST')
    elif request.GET.get('request'):
        request_request = request.GET.get('request')
    request_request = request_request.lower()

    if request_request == 'getcapabilities':
        raise Http404

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    wms = get_object_or_404(WMS, pk=wms_id)

    wms_layer_qs = wms.wmslayer_set.filter(id=layer_id)

    if not wms_layer_qs:
        raise Http404

    wms_layer = wms_layer_qs.first()
    code = wms_layer.code

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    file_ext_obj = _get_file_ext()
    if types not in file_ext_obj.keys():
        raise Http404

    file_ext = file_ext_obj[types][ext]
    url_ext = file_ext_obj[types][url_ext]

    view_name = utils.remove_text_from_str(code)
    file_code = view_name.replace('_view', '')
    date_now = str(localtime(now()).strftime("%Y-%m-%d_%H-%M"))

    view = ViewNames.objects.filter(view_name=view_name).first()
    if not view or not _check_open_datas(view.open_datas):
        raise Http404

    open_properties = _get_property_names(view, has_geo_data=True, get_text=False)
    properties = ",".join(open_properties).lower()

    if request_request == 'describefeaturetype':
        req_url = base_url
    else:
        base_geoserver_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}'.format(url=base_url, code=code)
        base_geoserver_url = '{base_url}&propertyName={properties}'.format(base_url=base_geoserver_url, properties=properties)

        req_url = '{base_url}{format}'.format(base_url=base_geoserver_url, format=url_ext)
        filename = '{}-{}-{}.{}'.format(types, date_now, file_code, file_ext)

        req_url = req_url + '&format_options=CHARSET:UTF-8'

    response = requests.get(req_url, request.GET, headers={**BASE_HEADERS}, timeout=5)
    content = response.content

    if file_ext == 'gml' and request_request != 'describefeaturetype':
        service_url = _make_service_url()
        content = replace_src_url(content, base_url, service_url, 'wfs')

    elif types == 'shape-zip' and request_request != 'describefeaturetype':
        content = _file_replace(content)

    elif request_request == 'describefeaturetype':
        content = filter_layers_wfs(content, [code], open_properties)

    content_type = response.headers.get('content-type')
    response = HttpResponse(content, content_type=content_type)
    if request_request != 'describefeaturetype':
        response['Content-Disposition'] = 'attachment; filename={filename}'.format(filename=filename)

    return response


def _get_property_names(view, get_text=True, has_geo_data=False):
    open_properties = ''
    if view and view.open_datas:
        open_properties = utils.json_load(view.open_datas)
        if has_geo_data:
            open_properties.insert(0, 'geo_data')
        if get_text:
            open_properties = ",".join(open_properties).lower()
    return open_properties


def _get_open_layer_url(request, bundle_id, wms_id, layer_id, url_type):
    url = reverse('api:open-layer:open_layer_proxy', args=[bundle_id, wms_id, layer_id, url_type])
    absolute_url = request.build_absolute_uri(url)
    return absolute_url


def _check_open_datas(open_datas):
    is_true = True
    open_datas = utils.json_load(open_datas)
    if not open_datas:
        return False
    len_datas = len(open_datas)
    if len_datas == 1:
        if not open_datas[0]:
            is_true = False
    elif len_datas < 1:
        is_true = False

    return is_true


@require_GET
def open_layer_proxy(request, bundle_id, wms_id, layer_id, url_type='wms'):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    urls = ['wms', 'wmts', 'wfs']

    url_type = url_type.lower()

    if url_type not in urls:
        raise Http404

    service_type = request.GET.get('SERVICE')

    if service_type:
        if url_type != service_type.lower():
            raise Http404

    get_url = {
        'wms': 'url',
        'wfs': 'url',
        'wmts': 'cache_url',
    }

    bundle = get_object_or_404(Bundle, pk=bundle_id)

    wms_qs = WMS.objects.filter(pk=wms_id)
    if not wms_qs:
        raise Http404

    wms_layer_qs = wms_qs.first().wmslayer_set.filter(id=layer_id)

    if not wms_layer_qs:
        raise Http404

    wms_layer = wms_layer_qs.first()
    wms_layer_code = wms_layer.code
    layer_code = utils.remove_text_from_str(wms_layer_code)

    view = ViewNames.objects.filter(view_name=layer_code).first()
    if not view or not _check_open_datas(view.open_datas):
        raise Http404

    allowed_layers = [layer_code]
    properties = _get_property_names(view, get_text=False, has_geo_data=True)

    wms = wms_qs.values().first()
    url = wms[get_url[url_type]]

    response = requests.get(url, request.GET, headers={**BASE_HEADERS}, timeout=5, verify=False)
    content_type = response.headers.get('content-type')
    content = response.content

    allow_requests = ['GetCapabilities', 'DescribeFeatureType', 'GetFeature']
    if request.GET.get('REQUEST') in allow_requests:
        if service_type == 'WFS':
            content = filter_layers_wfs(content, allowed_layers, properties)
        elif service_type == 'WMS':
            content = filter_layers(content, allowed_layers)
        else:
            raise Exception()

        service_url = _get_open_layer_url(request, bundle_id, wms_id, layer_id, url_type)
        content = replace_src_url(content, url, service_url, url_type)

    return HttpResponse(content, content_type=content_type)
