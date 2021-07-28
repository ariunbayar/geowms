from backend.inspire.models import LProperties
from django.shortcuts import get_object_or_404, reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse

from backend.wms.models import WMS
from backend.govorg.models import System

from main.decorators import ajax_required, gov_required
from main.components import Datatable
from main import utils


def _get_govorg_display(system):

    return {
        'id': system.pk,
        'name': system.name,
        'token': system.token,
        'website': system.website,
        'created_at': system.created_at.strftime('%Y-%m-%d'),
    }


@require_POST
@ajax_required
@gov_required
@login_required(login_url='/gov/secure/login/')
def systemList(request, payload):

    qs = request.org.system_set.filter(deleted_by__isnull=True)
    оруулах_талбарууд = ['id', 'name', 'token', 'created_at']

    datatable = Datatable(
        model=System,
        initial_qs=qs,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд
    )
    items, total_page, start_index = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
        'start_index': start_index
    }

    return JsonResponse(rsp)


def _display_property(property):

    if property:
        return {
            'name': property['property_name'],
            'code': property['property_code'],
        }

    return dict()


def _get_attributes(system_layer):
    if system_layer:
        if system_layer.attributes:
            attributes = utils.json_load(system_layer.attributes)

            results = [
                LProperties.objects.filter(property_code__iexact=attribute).values('property_name', 'property_code').first()
                for attribute in attributes
            ]

            attributes = [_display_property(prop) for prop in results]
            return attributes

    return list()


def _get_wmslayer(request, system, wms):
    layer_list = list()
    system_local_base_url = utils.get_config('system_local_base_url')
    system_layers = system.govorgwmslayer_set.filter(wms_layer__in=wms.wmslayer_set.all())
    for system_layer in system_layers:

        wms_layer = system_layer.wms_layer
        attributes = _get_attributes(system_layer)

        layer_list.append({
            'id': system_layer.id,
            'attributes': attributes,
            'code': wms_layer.code,
            'name': wms_layer.name,
            'title': wms_layer.title,
            'json_public_url': request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[system.token, wms_layer.code])),
            'json_private_url': system_local_base_url + reverse('api:service:local_system_json_proxy', args=[system.token, wms_layer.code]),
        })

    return layer_list


def _get_system_detail_display(request, system):

    wms_list = list()
    for wms in WMS.objects.all():
        layer_list = _get_wmslayer(request, system, wms)
        if layer_list:
            wms_obj = {
                'id': wms.id,
                'name': wms.name,
                'is_active': wms.is_active,
                'url': wms.url,
                'layer_list': layer_list,
            }
            wms_list.append(wms_obj)

    return {
        **_get_govorg_display(system),
        'wms_list': wms_list,
    }


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, pk):

    system = get_object_or_404(System, pk=pk, deleted_by__isnull=True)
    system_local_base_url = utils.get_config('system_local_base_url')
    rsp = {
        'system': _get_system_detail_display(request, system),
        'public_url': request.build_absolute_uri(reverse('api:service:system_proxy', args=[system.token])),
        'private_url': system_local_base_url + reverse('api:service:local_system_proxy', args=[system.token]),
        'success': True,
    }

    return JsonResponse(rsp)
