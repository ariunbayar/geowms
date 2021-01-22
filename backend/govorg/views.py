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


def _system_validation(payload, system=None):
    system_name = payload['name']
    domain = payload['website']
    errors = {}

    if not system_name:
        errors['name'] = 'Хоосон байна утга оруулна уу.'
    elif system_name.isspace():
        errors['name'] = 'Хоосон байна утга оруулна уу.'

    if domain:
        is_domain = utils._is_domain(domain)
        if is_domain is not True:
            errors['website'] = 'Домайн нэрээ зөв оруулна уу.'

    is_name_changed = False
    if system:
        if system.name != system_name:
            is_name_changed = True
    if is_name_changed or not system:
        if GovOrg.objects.filter(name=system_name, deleted_by__isnull=True).first():
            errors['name'] = 'Системийн нэр бүртгэлтэй байна.'

    return errors


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def хадгалах(request, payload, pk=None):
    if pk:
        system = get_object_or_404(GovOrg, pk=pk, deleted_by__isnull=True)
        form = SystemForm(payload, instance=system)
        errors = _system_validation(payload, system)
    else:
        form = SystemForm(payload)
        errors = _system_validation(payload)

    if form.is_valid() and not errors:
        with transaction.atomic():
            form.instance.token = TokenGeneratorSystem().get()
            form.instance.website = payload['website']
            system = form.save()

            layers = WMSLayer.objects.filter(pk__in=payload.get('layers'))
            system.wms_layers.set(layers)

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгаллаа.'
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': {**form.errors, **errors},
        })


def _get_wmslayer(request, govorg, wms):
    layer_list = []
    system_local_base_url = utils.get_config('system_local_base_url')
    for wmslayer in wms.wmslayer_set.all():
        layer_list.append({
            'id': wmslayer.id,
            'code': wmslayer.code,
            'name': wmslayer.name,
            'title': wmslayer.title,
            'json_public_url': request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[govorg.token, wmslayer.code])),
            'json_private_url': system_local_base_url + reverse('api:service:local_system_json_proxy', args=[govorg.token, wmslayer.code]),
        })
    return layer_list


def _get_govorg_detail_display(request, govorg):
    wms_list = [
        {
            'id': wms.id,
            'name': wms.name,
            'is_active': wms.is_active,
            'url': wms.url,
            'layer_list': _get_wmslayer(request, govorg, wms),
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
def refresh_token(request, pk):

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
