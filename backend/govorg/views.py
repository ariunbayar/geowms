import uuid

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET
from django.core.paginator import Paginator

from main.decorators import ajax_required
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from .models import GovOrg
from django.contrib.postgres.search import SearchVector


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


def _generate_govorg_token():
    return uuid.uuid4().hex[:32]


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request, payload):
    org_id = payload.get('org_id')
    website = payload.get('website')

    govorg = GovOrg.objects.create(
        name=payload.get('name'),
        token=_generate_govorg_token(),
        org_id=org_id,
        website=website
    )

    layers = WMSLayer.objects.filter(pk__in=payload.get('layers'))
    govorg.wms_layers.set(layers)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


def _get_govorg_detail_display(request, govorg):
    wms_list = [
        {
            'id': wms.id,
            'name': wms.name,
            'is_active': wms.is_active,
            'url': wms.url,
            'layer_list': list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title')),
            'public_url': request.build_absolute_uri(reverse('api:service:proxy', args=[govorg.token, wms.pk])),
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

    govorg = get_object_or_404(GovOrg, pk=pk)
    rsp = {
        'govorg': _get_govorg_detail_display(request, govorg),
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def хадгалах(request, payload, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)

    govorg.name = payload.get('name')
    govorg.website = payload.get('website')
    govorg.org_id = payload.get('org_id')
    govorg.save()

    layers = WMSLayer.objects.filter(pk__in=payload.get('layers'))
    govorg.wms_layers.set(layers)

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def шинэ_токен(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)
    govorg.token = _generate_govorg_token()
    govorg.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def устгах(request, pk):

    govorg = get_object_or_404(GovOrg, pk=pk)
    govorg.delete()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def тоо(request, pk):

    rsp = {
        'count': GovOrg.objects.filter(org_id=pk).count(),
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
    govorg_list = GovOrg.objects.all().annotate(search=SearchVector(
        'name')).filter(search__contains=query, org_id = org_id).order_by(sort_name)

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