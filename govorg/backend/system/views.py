from backend.org.models import Org
from backend.wmslayer.models import WMSLayer
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
    page = payload.get('page')
    per_page = payload.get('per_page')
    query = payload.get('query') or ''
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    system_list = GovOrg.objects.all().annotate(search=SearchVector(
        'name')).filter(search__contains=query, org_id = org.id, deleted_by__isnull=True).order_by(sort_name)

    total_items = Paginator(system_list, per_page)
    items_page = total_items.page(page)
    items = [
        _get_govorg_display(govorg)
        for govorg in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
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
