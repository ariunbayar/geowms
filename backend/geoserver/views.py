import requests
from requests.auth import HTTPBasicAuth

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required
from main import geoserver
from .models import WmtsCacheConfig
from geoportal_app.models import User
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layers(request):

    config = geoserver.get_connection_conf()

    HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    AUTH = HTTPBasicAuth(
        config['geoserver_user'],
        config['geoserver_pass'],
    )

    base_url = 'http://{host}:{port}/geoserver/rest/layers'.format(
        host=config['geoserver_host'],
        port=config['geoserver_port'],
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
            'info': 'Layer Group үүсэхэд алдаа гарлаа'
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

    hoho_delete = geoserver.delete_layer_group(group_old_name)

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
    srs = glayer.get('crs').split(":")[1]

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
