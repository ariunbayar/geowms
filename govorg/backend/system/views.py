from backend.org.models import Org
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required, gov_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from backend.govorg.models import GovOrg, GovOrgWMSLayer
from backend.wms.models import WMS
from main import utils
from django.contrib.auth.decorators import login_required
from main.components import Datatable
import requests
import json


def _get_govorg_display(govorg):

    layers = list(govorg.wms_layers.all().values_list('pk', flat=True))

    return {
        'id': govorg.pk,
        'name': govorg.name,
        'token': govorg.token,
        'website': govorg.website,
        'created_at': govorg.created_at.strftime('%Y-%m-%d'),
        'layers': layers,
    }


@require_POST
@ajax_required
@gov_required
@login_required(login_url='/gov/secure/login/')
def systemList(request, payload):
    qs = request.org.govorg_set.all()
    оруулах_талбарууд = ['id', 'name', 'token', 'created_at']
    datatable = Datatable(
        model=GovOrg,
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


def _get_attribute(request, wms):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    queryargs = request.GET
    headers = {**BASE_HEADERS}
    base_url = wms.url + '?service=wfs&version=2.0.0&request=DescribeFeatureType&outputFormat=application/json'
    rsp = requests.get(base_url, queryargs, headers=headers, timeout=20)
    if rsp.status_code == 200:
        content = rsp.content.decode("utf-8")
        content = json.loads(content)
        return content
    return []


def _get_wmslayer(request, system, wms):
    layer_list = []
    system_local_base_url = utils.get_config('system_local_base_url')
    for wmslayer in wms.wmslayer_set.all():
        govorg_layers = GovOrgWMSLayer.objects.filter(govorg=system, wms_layer=wmslayer).first()
        attributes = []
        if govorg_layers:
            if govorg_layers.attributes:
                attributes = json.loads(govorg_layers.attributes)
            layer_list.append({
                'id': govorg_layers.id,
                'attributes': attributes,
                'code': wmslayer.code,
                'name': wmslayer.name,
                'title': wmslayer.title,
                'json_public_url': request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[system.token, wmslayer.code])),
                'json_private_url': system_local_base_url + reverse('api:service:local_system_json_proxy', args=[system.token, wmslayer.code]),
            })
    return layer_list


def _get_system_detail_display(request, system):

    wms_list = [
        {
            'id': wms.id,
            'name': wms.name,
            'is_active': wms.is_active,
            'url': wms.url,
            'layer_list': _get_wmslayer(request, system, wms),
            'attributes': _get_attribute(request, wms),
        }
        for wms in WMS.objects.all()
    ]

    return {
        **_get_govorg_display(system),
        'wms_list': wms_list,
    }


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, pk):

    system = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
    system_local_base_url = utils.get_config('system_local_base_url')
    rsp = {
        'system': _get_system_detail_display(request, system),
        'public_url': request.build_absolute_uri(reverse('api:service:system_proxy', args=[system.token])),
        'private_url': system_local_base_url + reverse('api:service:local_system_proxy', args=[system.token]),
        'success': True,
    }

    return JsonResponse(rsp)
