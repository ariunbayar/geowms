from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_POST, require_GET

from backend.token.utils import TokenGeneratorSystem
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer

from main.decorators import ajax_required
from main import utils

from .models import GovOrg
from .forms import SystemForm
import requests
from django.http import HttpResponse, Http404
from datetime import datetime

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
@user_passes_test(lambda u: u.is_superuser)
def хадгалах(request, payload, pk=None):

    if pk:
        system = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
        form = SystemForm(payload, instance=system)
    else:
        form = SystemForm(payload)

    if form.is_valid():

        with transaction.atomic():

            form.instance.token = TokenGeneratorSystem().get()
            system = form.save()

            layers = WMSLayer.objects.filter(pk__in=payload.get('layers'))
            system.wms_layers.set(layers)

        return JsonResponse({'success': True})

    else:

        return JsonResponse({'success': False, 'errors': form.errors})


def _get_govorg_detail_display(request, govorg):
    wms_list = [
        {
            'id': wms.id,
            'name': wms.name,
            'is_active': wms.is_active,
            'url': wms.url,
            'layer_list': list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title')),
        }
        for wms in WMS.objects.all()
    ]

    return {
        **_get_govorg_display(govorg),
        'wms_list': wms_list,
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def дэлгэрэнгүй(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
    system_local_base_url = utils.get_config('system_local_base_url')
    rsp = {
        'govorg': _get_govorg_detail_display(request, govorg),
        'public_url': request.build_absolute_uri(reverse('api:service:system_proxy', args=[govorg.token])),
        'private_url': system_local_base_url + reverse('api:service:local_system_proxy', args=[govorg.token]),
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def шинэ_токен(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
    govorg.token = TokenGeneratorSystem().get()
    govorg.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def устгах(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
    govorg.deleted_by = request.user
    govorg.deleted_at = localtime(now())
    govorg.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def тоо(request, pk):

    rsp = {
        'count': GovOrg.objects.filter(org_id=pk, deleted_by__isnull=True).count(),
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def govorgList(request, payload):

    page = payload.get('page')
    per_page = payload.get('perpage')
    query = payload.get('query')
    org_id = payload.get('org_id')
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    if not query:
        query = ''
    govorg_list = GovOrg.objects.all().annotate(search=SearchVector(
        'name')).filter(search__contains=query, org_id = org_id, deleted_by__isnull=True).order_by(sort_name)

    total_items = Paginator(govorg_list, per_page)
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


@require_GET
@user_passes_test(lambda u: u.is_superuser)
def file_download(request, pk, code, types, service_type):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    govorg = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
    if not govorg.wms_layers.filter(code=code):
        raise Http404

    if service_type == 'private':
        system_local_base_url = utils.get_config('system_local_base_url')
        proxy_url = system_local_base_url + reverse('api:service:local_system_proxy', args=[govorg.token]),
    elif service_type == 'public':
        proxy_url = request.build_absolute_uri(reverse('api:service:system_proxy', args=[govorg.token])),
    else:
        raise Http404

    date_now = str(localtime(now()).strftime("%Y-%m-%d_%H-%M"))
    if types == 'json':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}&outputFormat=application%2Fjson'.format(url=proxy_url[0], code=code)
        filename = '{}.json'.format(date_now)
    elif types == 'gml':
        req_url = '{url}?service=WFS&version=1.0.0&request=GetFeature&typeName={code}'.format(url=proxy_url[0], code=code)
        filename = '{}.xml'.format(date_now)
    else:
        raise Http404

    response = requests.get(req_url, request.GET, headers={**BASE_HEADERS}, timeout=5)
    content_type = response.headers.get('content-type')
    content = response.content
    response = HttpResponse(content, content_type=content_type)
    response['Content-Disposition'] = 'attachment; filename={filename}'.format(filename=filename)

    return response
