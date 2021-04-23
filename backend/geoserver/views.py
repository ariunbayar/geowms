import requests
from requests.auth import HTTPBasicAuth

from xml.etree import ElementTree as etree

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.db import connections
from geojson import FeatureCollection

from main import geoserver, update_cache_layer
from main.decorators import get_conf_geoserver, ajax_required
from .models import WmtsCacheConfig
from geoportal_app.models import User
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer
from django.views.decorators.csrf import csrf_exempt
from main.utils import (
    dict_fetchall,
    get_geoJson
)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
@get_conf_geoserver
def layers(request, conf_geoserver):

    HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    AUTH = HTTPBasicAuth(
        conf_geoserver['geoserver_user'],
        conf_geoserver['geoserver_pass'],
    )

    base_url = '{protocol}://{host}:{port}/geoserver/rest/layers'.format(
        host=conf_geoserver['geoserver_host'],
        port=conf_geoserver['geoserver_port'],
        protocol=conf_geoserver['geoserver_protocol'],
    )

    rsp = requests.get(
        base_url,
        request.GET,
        headers=HEADERS,
        auth=AUTH,
    )

    if rsp.status_code == 200:
        rsp = {
            'success': True,
            'data': rsp.json()
        }
    else:
        rsp = {
            'success': False,
            'data': None
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layer_groups(request):
    layer_group_names = []

    layer_group_lists = geoserver.get_layer_groups()
    if layer_group_lists:
        for layer in layer_group_lists:
            layer_group_names.append(layer.get('name'))

    rsp = {
        'success': True,
        'group_list': layer_group_names
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_layer_group(request, payload):
    group_name = payload.get('group_name')

    rsp = geoserver.delete_layer_group(group_name)
    if rsp.status_code != 200:

        return JsonResponse({
            'success': False,
            'info': 'Layer Group устгахад алдаа гарлаа'
        })

    cache_layer = WmtsCacheConfig.objects.filter(group_name=group_name).first()
    if cache_layer:
        cache_layer.delete()

    wms_url = geoserver.get_wms_url(group_name)
    wms = WMS.objects.filter(url=wms_url).first()
    if wms:
        layers = WMSLayer.objects.filter(wms=wms)
        for layer in layers:
            BundleLayer.objects.filter(layer=layer).delete()
            layer.delete()

        wms.delete()

    return JsonResponse({
        'success': True,
        'info': 'Амжилттай утсгалаа'
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_group_detial(request, payload):
    group_name = payload.get('group_name')
    layer_detial = []
    detial_list = geoserver.get_layer_group_detail(group_name)
    glayers = detial_list.get('publishables').get('published')
    styles = detial_list.get('styles').get('style')

    if isinstance(glayers, list):

        for i in range(len(glayers)):
            if isinstance(glayers, list):
                style_name = styles[i].get('name') if not isinstance(styles[i], str) else ''

            elif isinstance(glayers, dict):
                style_name = styles[0].get('name') if not isinstance(styles[i], str) else ''

            layer_detial.append({
                'type': glayers[i].get('@type') if glayers[i] else '',
                'layer_name': glayers[i].get('name') if glayers[i] else '',
                'style_name': style_name
            })

    elif isinstance(glayers, dict):
        layer_detial.append({
                'type': glayers.get('@type') if glayers else '',
                'layer_name': glayers.get('name') if glayers else '',
                'style_name': styles.get('name') if type(styles) == 'object' else styles[0].get('name')
            })

    return JsonResponse({
        'detial_list': detial_list,
        'layer_list': layer_detial
    })


def _get_ws_layers_in_wms(ws_name, ws_url):

    ws_detial = []
    datastores = []
    data_store_url = ws_url + '/' + ws_name + '/datastores'
    datastores = geoserver.get_detail_geoserver(data_store_url)
    if datastores and datastores['dataStores']:
        datastores = datastores['dataStores']['dataStore']
    if datastores:
        for ds in datastores:
            layer_url = ws_url + '/' + ws_name + '/datastores' + '/' + str(ds['name']) + '/featuretypes'
            featuretypes = geoserver.get_detail_geoserver(layer_url)
            if featuretypes and featuretypes['featureTypes']:
                for layer in featuretypes['featureTypes']['featureType']:
                    ws_detial.append(layer['name'])

    return ws_detial


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_layer_detial(request, payload):
    layer_list = []
    ws_name = payload.get('ws_name')
    if ws_name:
        ws_url = 'workspaces'
        w_layers = _get_ws_layers_in_wms(ws_name, ws_url)
    else:
        w_layers = geoserver.get_layers()

    for layer in w_layers:
        if isinstance(layer, str):
            layer_name = layer
        else:
            layer_name = layer.get('name')
        style_name = geoserver.get_layer_style(layer_name)
        layer_list.append({
            'layer_name': layer_name,
            'style_name': style_name,
            'type': 'layer'
        })

    return JsonResponse({
        'layer_list': layer_list,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_layer_group(request, payload):

    group_values = payload.get('values')
    group_layers = payload.get('layer_list')
    group_name = group_values.get('name')
    group_title = group_values.get('title')
    group_state = payload.get('group_state')
    group_old_name = payload.get('old_name') or group_name

    user = User.objects.filter(username=request.user).first()
    errors = {}

    if not group_layers:
        return JsonResponse({
            'success': False,
            'info': 'Layer сонгоно уу.'
        })

    check_layer = geoserver.get_layer_group_detail(group_name)
    if check_layer:
        if not group_state:
            errors['name'] = 'group-ийн нэр давхцаж байна !'
            return JsonResponse({
                'success': False,
                'errors': errors
            })

    geoserver.delete_layer_group(group_old_name)

    rsp = geoserver.create_layer_group(group_values, group_layers)
    if rsp.status_code != 201:
        return JsonResponse({
            'success': False,
            'info': "Layer group үүсгэхэд алдаа гарлаа"
        })

    check_wms_url = geoserver.get_wms_url(group_old_name)
    wms = WMS.objects.filter(url=check_wms_url).first()
    wms_url = geoserver.get_wms_url(group_name)

    if wms:
        wms.url = wms_url
        wms.name = group_title
        wms.save()

    else:
        wms = WMS.objects.create(
                name=group_title,
                url=wms_url,
                created_by_id=user.id
        )

    wms_layer = wms.wmslayer_set.filter(wms=wms).first()
    if wms_layer:
        wms_layer.title = group_title
        wms_layer.code = group_name
        wms_layer.name = group_title
        wms_layer.save()

    else:
        wms_layer = WMSLayer.objects.create(
            name=group_title,
            code=group_name,
            wms=wms,
            title=group_title,
            feature_price=0,
        )

    return JsonResponse({
        'success': True,
        'info': "Амжилттай хадгалагдлаа"
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_group_cache(request, payload):
    cache_list = []
    group_name = payload.get('group_name')

    group_cache = WmtsCacheConfig.objects.filter(group_name=group_name).first()
    if group_cache:
        cache_list.append({
            'image_format': group_cache.img_format,
            'zoom_start': group_cache.zoom_start,
            'zoom_stop': group_cache.zoom_stop,
            'cache_type': group_cache.type_of_operation,
            'number_of_cache': group_cache.number_of_tasks_to_use
        })

    return JsonResponse({
        'cache_list': cache_list,
    })


def _cache_value_validation(zoom_start, zoom_stop, number_of_cache):
    errors = {}
    if zoom_start > 21:
        errors['zoom_start'] = 'Томруулах эхний утга нь хэтэрсэн байна !'
    elif zoom_stop > 21:
        errors['zoom_stop'] = 'Томруулах сүүлчийн утга нь хэтэрсэн байна !'
    elif number_of_cache > 21:
        errors['number_of_cache'] = 'Хэрэглэх таскуудын утга хэтэрсэн байна !'
    return errors


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_group_cache(request, payload, group_name):
    values = payload.get('values')
    image_format = values.get('image_format')
    zoom_start = values.get('zoom_start')
    zoom_stop = values.get('zoom_stop')
    cache_type = values.get('cache_type')
    number_of_cache = values.get('number_of_cache')

    detial_list = geoserver.get_layer_group_detail(group_name)
    glayer = detial_list.get('bounds')
    srs = glayer.get('crs')

    errors = _cache_value_validation(zoom_start, zoom_stop, number_of_cache)
    if errors:
        return JsonResponse({
            'success': False,
            'errors': errors
        })

    cache_layer = geoserver.create_tilelayers_cache(None, group_name, srs, image_format, zoom_start, zoom_stop, cache_type, number_of_cache)
    wmts_url = ''
    if cache_layer.status_code != 200:

        return JsonResponse({
            'success': False,
            'info': 'TileCache үүсгэхэд алдаа гарлаа'
        })

    cache_field = WmtsCacheConfig.objects.filter(group_name=group_name).first()
    if cache_field:
        WmtsCacheConfig.objects.filter(id=cache_field.id).update(
            img_format=image_format,
            zoom_start=zoom_start,
            zoom_stop=zoom_stop,
            type_of_operation=cache_type,
            number_of_tasks_to_use=number_of_cache
        )
    else:
        WmtsCacheConfig.objects.create(
            group_name=group_name,
            img_format=image_format,
            zoom_start=zoom_start,
            zoom_stop=zoom_stop,
            type_of_operation=cache_type,
            number_of_tasks_to_use=number_of_cache
        )

    wms = WMS.objects.filter(name=group_name).first()
    if wms:
        wmts_url = geoserver.get_wmts_url(group_name)
        wms.cache_url = wmts_url
        wms.save()

    return JsonResponse({
        'success': True,
        'info': 'Амжилттай хадгалагдлаа'
    })


@require_GET
@csrf_exempt
def update_geo_cache(request):
    update_cache_layer.update_web_cache()
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def check_styles_name(request, payload):
    style_name = payload.get('style_name')
    style_update = payload.get('style_update')
    info = _check_style_name(style_name, style_update)
    if info:
        return JsonResponse({'success': False, 'info': info})
    else:
        return JsonResponse({
            'success': True,
        })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_style_data(request, payload):

    geom_type = payload.get('geom_type')
    cursor = connections['default'].cursor()
    sql = '''
            SELECT
                ST_AsGeoJSON(ST_Transform(geo_data,4326)) as geom
            FROM
                geoserver_desing_view
            where
                ST_GeometryType(geo_data) like '%{geom_type}%'
            limit 1000
            '''.format(geom_type=geom_type)

    cursor.execute(sql)
    some_attributes = dict_fetchall(cursor)
    some_attributes = list(some_attributes)
    features = []
    for i in some_attributes:
        data = get_geoJson(i.get('geom'))
        features.append(data)
    return JsonResponse({
        'data': FeatureCollection(features)
    })


def _check_style_name(style_name, old_style_name):
    info = ''
    if not style_name:
        info = 'Style-ийн нэр хоосон байна.'

    check_state = False

    if old_style_name:
        if old_style_name != style_name:
            check_state = True
    check_name = geoserver.check_geoserver_style(style_name)
    if check_name.status_code == 200:
        if not old_style_name or check_state:
            info = '{style_name} нэртэй style geoserver дээр бүртгэлтэй байна'.format(style_name=style_name)

    if old_style_name:
        geoserver.delete_style(old_style_name)
    return info


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_style(request, payload):

    style_datas = payload.get('style_datas')
    style_name = payload.get('style_name')
    style_title = payload.get('style_title')
    style_abstract = payload.get('style_abstract')
    style_update = payload.get('style_update')
    old_style_name = payload.get('old_style_name')
    info = _check_style_name(style_name, style_update)

    if info:
        return JsonResponse({'success': False, 'info': info})

    
    rsp = geoserver.create_style(style_datas, style_name, style_title, style_abstract, old_style_name)
    if rsp.status_code == 201:
        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгалагдлаа'
        })
    else:
        return JsonResponse({
            'success': False,
            'info': 'Style үүсгэхэд алдаа гарлаа'
        })


def _get_fill_stroke(data):
    shape_data = []
    geom_type = ''
    style_datas = []
    try:
        rule_name = data.get('Name') or ''
        max_range = data.get('MaxScaleDenominator') or 0
        min_range = data.get('MinScaleDenominator') or 0
        

        if data.get('RasterSymbolizer'):
            return [], '', True

        elif data.get('LineSymbolizer'):
            shape_data = data.get('LineSymbolizer')
            geom_type = 'LineString'
            shape_type = 'LineSymbolizer'

        elif data.get('PointSymbolizer'):
            shape_data = data.get('PointSymbolizer')
            geom_type = 'Point'
            shape_type = 'PointSymbolizer'
            if shape_data.get('Graphic'):
                shape_data = shape_data.get('Graphic')
                onlinesource = shape_data.get('ExternalGraphic')
                if onlinesource:
                    return [], '', True
                shape_data = shape_data.get('Mark')
                wellknownname = shape_data.get('WellKnownName') or 'circle'

        elif data.get('PolygonSymbolizer'):
            shape_data = data.get('PolygonSymbolizer')
            geom_type = 'Polygon'
            shape_type = 'PolygonSymbolizer'

        if shape_data:
            stroke = shape_data.get('Stroke')
            fill = shape_data.get('Fill')
            style_datas = {}
            if stroke:
                if stroke.get('stroke'):
                    style_datas['style_color'] = stroke.get('stroke') or ''
                if stroke.get('stroke-width'):
                    style_datas['style_size'] = stroke.get('stroke-width') or 1

                dashed_line = stroke.get('stroke-dasharray')
                if dashed_line:
                    dashed_line = dashed_line.split()
                    style_datas['dashed_line_length'] = dashed_line[0]
                    style_datas['dashed_line_gap'] = dashed_line[1]

            if fill:
                graphic_fill = fill.get('GraphicFill')
                if graphic_fill:
                    return [], '', True

                if fill.get('fill'):
                    style_datas['fill_color'] = fill.get('fill') or ''
                if fill.get('fill-opacity'):
                    style_datas['color_opacity'] = fill.get('fill-opacity') or 0.3

            style_datas['rule_name'] = rule_name
            style_datas['max_range'] = max_range
            style_datas['min_range'] = min_range
            style_datas['wellknownname'] = wellknownname
            style_datas['rule_name'] = rule_name
            style_datas['shape_type'] = shape_type

            return style_datas, geom_type, False

    except Exception:
        return style_datas, geom_type, True


def _get_style_json(content_data):

    shape_rules = []
    style_content = {}
    check_style = False
    try:
        if content_data:
            named_layer = content_data.get('NamedLayer')
            style_name = named_layer.get('Name') or ''
            user_style = named_layer.get('UserStyle') or ''
            if user_style:
                style_title = user_style.get('Title') or ''
                style_abstract = user_style.get('Abstract') or ''
                feature_style = user_style.get('FeatureTypeStyle') or ''
                if feature_style:
                    rules = feature_style.get('Rule') or ''
                    if isinstance(rules, list):
                        for rule in rules:
                            style_datas, geom_type, check_single = _get_fill_stroke(rule)
                            if check_single:
                                check_style = check_single

                            if style_datas and geom_type and not check_single:
                                shape_rules.append(style_datas)
                        style_content['shape_rules'] = shape_rules

                    else:
                        style_datas, geom_type, check_style = _get_fill_stroke(rules)
                        if style_datas and geom_type and not check_style:
                            style_content['shape_type'] = style_datas.get('shape_type')
                            style_content['shape_rules'] = shape_rules
                            style_content['style_color'] = style_datas.get('style_color')
                            style_content['style_size'] = style_datas.get('style_size')
                            style_content['dashed_line_length'] = style_datas.get('dashed_line_length')
                            style_content['dashed_line_gap'] = style_datas.get('dashed_line_gap')
                            style_content['fill_color'] = style_datas.get('fill_color')
                            style_content['wellknownname'] = style_datas.get('wellknownname')

                style_content['style_name'] = style_name
                style_content['style_title'] = style_title
                style_content['style_abstract'] = style_abstract
                style_content['geom_type'] = geom_type

        return style_content, check_style
    except Exception:
        return [], True


def _parse_xml_to_json(xml):
    try:
        response = {}
        for child in list(xml):
            tag_name = etree.QName(child.tag)
            if tag_name:
                tag_name = child.tag.split('}')[1]
            if len(list(child)) > 0:
                tag_in_res = response.get(tag_name) or ''
                if tag_in_res:
                    response[tag_name] = []
                    if isinstance(tag_in_res, dict):
                        response[tag_name].append(tag_in_res)
                    else:
                        for i in tag_in_res:
                            response[tag_name].append(i)
                    response[tag_name].append(_parse_xml_to_json(child))
                else:
                    response[tag_name] = _parse_xml_to_json(child)
            else:
                tag_attr = child.attrib.get('name')
                if tag_attr:
                    tag_name = tag_attr
                response[tag_name] = child.text or ''
        return response
    except Exception:
        return []


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def conver_sld_json(request, payload):
    rsp_style_data = []
    file_content = payload.get('file_content')
    tree = etree.fromstring(file_content.encode('utf-8'))
    content_data = _parse_xml_to_json(tree)
    simple_details = []
    check_design = False
    style_detail_datas, check_design = _get_style_json(content_data)
    if check_design or not style_detail_datas:
        check_design = True
        if style_detail_datas:
            simple_details = {
                'style_name': style_detail_datas.get('style_name') or '',
                'old_style_name': style_detail_datas.get('style_name') or '',
                'style_title': style_detail_datas.get('style_title') or '',
                'style_abstract': style_detail_datas.get('style_abstract') or ''
            }
            rsp_style_data = file_content
    else:
        rsp_style_data = style_detail_datas
    return JsonResponse({
        'style_content': rsp_style_data,
        'check_style_content': check_design,
        'simple_details': simple_details
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def style_list(request):

    style_names = []
    geoserver_style = geoserver.get_styles()
    for style in geoserver_style:
        style_names.append(style.get('name'))

    return JsonResponse({
        'style_list': style_names,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def style_remove(request, payload):
    style_name = payload.get('style_name')

    rsp = geoserver.delete_style(style_name)
    if rsp.status_code != 200:
        return JsonResponse({
            'success': False,
            'info': 'Layer Group устгахад алдаа гарлаа'
        })
    else:
        return JsonResponse({
            'success': True,
            'info': 'Амжилттай утсгалаа'
        })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def style_detail(request, payload):

    style_detail_content = []
    simple_details = []
    style_name = payload.get('style_name')
    check_style_name = geoserver.check_geoserver_style(style_name)
    style_content = check_style_name.text
    style_title = ''
    style_abstract = ''
    if check_style_name.status_code == 200:
        tree = etree.fromstring(style_content.encode('utf-8'))
        content_data = _parse_xml_to_json(tree)
        style_detail_datas, check_design = _get_style_json(content_data)
        if check_design:
            if style_detail_datas:
                style_abstract = style_detail_datas.get('style_abstract') or ''
                style_title = style_detail_datas.get('style_title') or ''

            simple_details = {
                'style_name': style_name,
                'style_title': style_title,
                'old_style_name': style_name,
                'style_abstract': style_abstract
            }

            style_detail_content = style_content
        else:
            style_detail_datas['style_name'] = style_name
            style_detail_content = style_detail_datas
    return JsonResponse({
        'style_content': style_detail_content,
        'check_style_content': check_design,
        'simple_details': simple_details
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_ws_list(request):

    work_space_list = []
    work_spaces = geoserver.get_ws_list()
    for work_space in work_spaces:
        work_space_list.append(work_space.get('name'))

    return JsonResponse({
        'work_space_list': work_space_list,
    })
