from backend.org.models import Org
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from backend.govorg.models import GovOrg
from backend.wms.models import WMS
from main import utils
from django.contrib.auth.decorators import login_required
from main.components import Datatable


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
@login_required(login_url='/gov/secure/login/')
def systemList(request, payload):
    org = Org.objects.filter(employee__user=request.user).first()
    qs = GovOrg.objects.filter(org_id=org.id)
    оруулах_талбарууд = ['id', 'name', 'token', 'created_at']
    datatable = Datatable(
        model=GovOrg,
        initial_qs=qs,
        payload=payload,
        оруулах_талбарууд=оруулах_талбарууд
    )
    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page
    }

    return JsonResponse(rsp)


def _get_wmslayer(request, system, wms):
    layer_list = []
    system_local_base_url = utils.get_config('system_local_base_url')
    for wmslayer in wms.wmslayer_set.all():
        layer_list.append({
            'id': wmslayer.id,
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
