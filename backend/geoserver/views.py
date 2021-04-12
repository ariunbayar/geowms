import requests
from requests.auth import HTTPBasicAuth

import os
from lxml import etree

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
import main.geoserver as geoserver
from main.utils import (
    dict_fetchall,
    check_gp_design,
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
    group_status = True
    info = ''

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
            styel_name = ''
            if isinstance(glayers, list):
                style_name = styles[i].get('name') if not isinstance(styles[i], str)  else ''

            elif isinstance(glayers, dict):
                style_name = styles[0].get('name') if not isinstance(styles[i], str)  else ''

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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_layer_detial(request):
    layer_list = []

    w_layers = geoserver.get_layers()
    for layer in w_layers:
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
                url = wms_url,
                created_by_id = user.id
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
    success = True
    info = ''
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
            'errors':errors
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
    success = False
    check_name = geoserver.check_geoserver_style(style_name)
    if check_name.status_code != 200:
        success = True
    return JsonResponse({
        'success': success,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_style_data(request, payload):

    geom_type = payload.get('geom_type')
    check_design = check_gp_design()
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



@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_style(request, payload):

    style_datas = payload.get('style_datas')
    style_name = payload.get('style_name')
    style_title = payload.get('style_title')
    style_abstract = payload.get('style_abstract')
    if not style_name:
        return JsonResponse({
            'success': False,
            'info': 'Style-ийн нэр хоосон байна.'
        })

    check_name = geoserver.check_geoserver_style(style_name)
    if check_name.status_code == 200:
        return JsonResponse({
            'success': False,
            'info': 'Style-ийн нэр давхцаж байна.'
        })

    rsp = geoserver.create_style(style_datas, style_name, style_title, style_abstract)
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
    stroke = data.get('Stroke')
    fill = data.get('Fill')
    style_datas = {
        'style_color': '',
        'style_size':0,
        'dashed_line_length':0,
        'dashed_line_gap':0,
        'fill_color':'',
        'wellknownname': 'circle'
    }
    if stroke:
        if stroke.get('stroke'):
            style_datas['style_color'] = stroke.get('stroke')
        if stroke.get('stroke-width'):
            style_datas['style_size'] = stroke.get('stroke-width')

        dashed_line = stroke.get('stroke-dasharray')
        if dashed_line:
            dashed_line = dashed_line.split()
            style_datas['dashed_line_length'] = dashed_line[0]
            style_datas['dashed_line_gap'] = dashed_line[1]
    if fill:
        if fill.get('fill'):
            style_datas['fill_color'] = fill.get('fill')
        if fill.get('fill-opacity'):
            style_datas['color_opacity']= fill.get('fill-opacity')

    return style_datas


def _get_style_json(content_data):

    shape_rules= []
    style_datas = []
    named_layer = content_data.get('NamedLayer')
    style_name = named_layer.get('Name') or ''
    user_style = named_layer.get('UserStyle') or ''

    if user_style:
        style_title = user_style.get('Title') or ''
        style_abstract = user_style.get('Abstract') or ''
        feature_style = user_style.get('FeatureTypeStyle') or ''
        if feature_style:
            single_rule_data = {}
            rules = feature_style.get('Rule') or ''
            for rule in rules:
                rule_name = rule.get('Name') or ''
                max_range = rule.get('MaxScaleDenominator') or 0
                min_range = rule.get('MinScaleDenominator') or 0
                shape_data = []
                if rule.get('LineSymbolizer'):
                    shape_data = rule.get('LineSymbolizer')
                    geom_type = 'LineString'
                    shape_type = 'LineSymbolizer'
                elif rule.get('PointSymbolizer'):
                    shape_data = rule.get('PointSymbolizer')
                    geom_type = 'Point'
                    shape_type = 'PointSymbolizer'
                    if shape_data.get('Graphic'):
                        shape_data = shape_data.get('Graphic')
                        shape_data = shape_data.get('Mark')
                else:
                    shape_data = rule.get('PolygonSymbolizer')
                    geom_type = 'Polygon'
                    shape_type = 'PolygonSymbolizer'
                fil_and_stroke_datas = _get_fill_stroke(shape_data)
                single_rule_data  = {
                    'rule_name': rule_name,
                    'min_range': min_range,
                    'max_range': max_range,
                    'style_color': fil_and_stroke_datas.get('style_color') or '',
                    'style_size': fil_and_stroke_datas.get('style_size') or 1,
                    'dashed_line_length': fil_and_stroke_datas.get('dashed_line_length') or 0,
                    'dashed_line_gap': fil_and_stroke_datas.get('dashed_line_gap') or 0,
                    'fill_color': fil_and_stroke_datas.get('fill_color') or '',
                    'color_opacity': fil_and_stroke_datas.get('color_opacity') or 0.5,
                    'wellknownname': fil_and_stroke_datas.get('wellknownname') or 'circle',
                    'shape_type': shape_type
                }
                shape_rules.append(single_rule_data)

    style_datas.append({
        'style_name': style_name,
        'style_title': style_title,
        'geom_type': geom_type,
        'style_abstract': style_abstract,
        'shape_rules':  shape_rules
    })

    return style_datas


def _parse_xml_to_json(xml):
    response = {}

    for child in list(xml):
        tag_name = etree.QName(child.tag)
        if tag_name:
            tag_name = tag_name.localname
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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def conver_sld_json(request, payload):

    hoho= payload.get('file_content')


    tree = etree.fromstring(hoho.encode('utf-8'))
    content_data= _parse_xml_to_json(tree)
    style_datas = _get_style_json(content_data)
    return JsonResponse({
        'style_content': style_datas
    })
