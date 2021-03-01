import requests
from requests.auth import HTTPBasicAuth

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required
from main import geoserver


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
    for layer in layer_group_lists:
        layer_group_names.append(layer.get('name'))

    rsp = {
        'success': False,
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
    if rsp.status_code == 200:
        group_status = True
        info = 'Амжилттай хадгаллаа'
    else:
        group_status = False
        info = 'Layer-group үүсгэхэд алдаа гарлаа'

    return JsonResponse({
        'success': group_status,
        'info': info
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
    for i in range(len(glayers)):
        layer_detial.append({
            'type': glayers[i].get('@type'),
            'layer_name': glayers[i].get('name'),
            'style_name': styles[i].get('name')
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
    layer_name = group_values.get('name')
    if not group_layers:
        return JsonResponse({
            'success': False,
            'info': 'Layer сонгоно уу.'
        })
    check_layer = geoserver.get_layer_group_detail(layer_name)
    if check_layer:
        geoserver.delete_layer_group(layer_name)
    rsp = geoserver.create_layer_group(group_values, group_layers)
    if rsp.status_code == 201:
        return JsonResponse({
            'success': True,
            'info': "Амжилттай хадгалагдлаа"
        })
    else:
        return JsonResponse({
            'success': False,
            'info': "Layer group үүсгэхэд алдаа гарлаа"
        })
