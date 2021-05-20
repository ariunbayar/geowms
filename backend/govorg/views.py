from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
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
from .models import GovOrg, GovOrgWMSLayer
from .forms import SystemForm
from main.components import Datatable
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


def _system_validation(payload, system=None):
    system_name = payload['name']
    domain = payload['website']
    org = payload['org']
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
        if GovOrg.objects.filter(name=system_name, deleted_by__isnull=True, org_id=org).first():
            errors['name'] = 'Системийн нэр бүртгэлтэй байна.'

    return errors


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def хадгалах(request, payload, pk=None):
    accepted_props = payload.get('accepted_props')

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
            for accepted_prop in accepted_props:
                GovOrgWMSLayer.objects.update_or_create(
                    govorg_id=system.id,
                    wms_layer_id=accepted_prop.get('layer_id'),
                    defaults={
                        'attributes': utils.json_dumps(accepted_prop.get('attributes'))
                    }
                )

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгаллаа.'
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': {**form.errors, **errors},
        })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def set_attributes(request, payload, pk):
    array = payload.get('array')
    system_layer = get_object_or_404(GovOrgWMSLayer, pk=pk)
    system_layer.attributes = json.dumps(array, ensure_ascii=False)
    system_layer.save()

    return JsonResponse({
        'success': True,
        'info': 'Амжилттай хадгаллаа.'
    })


def _get_govorg_detail_display(request, govorg):
    wms_ids = []
    wms_detail_list = []
    govorg_layer_detail = []
    govorg_id = govorg.id
    system_local_base_url = utils.get_config('system_local_base_url')

    govorg_layers = list(GovOrgWMSLayer.objects.filter(govorg_id=govorg_id).values('wms_layer_id', 'attributes'))

    wms_layer_ids = []
    for govorg_layer in govorg_layers:

        if govorg_layer['wms_layer_id'] not in wms_layer_ids:
            wms_layer_ids.append(govorg_layer['wms_layer_id'])
        if govorg_layer['attributes']:
            govorg_layer_attr = govorg_layer['attributes'].replace("\'", "\"")
            govorg_layer_detail.append({
                'layer_id': govorg_layer['wms_layer_id'],
                'attributes': utils.json_load(govorg_layer_attr)
            })

    wms_layer_detail = WMSLayer.objects.filter(id__in=wms_layer_ids)
    wms_layer_detail = list(wms_layer_detail.values('id', 'code', 'wms_id', 'title', 'name'))

    for wms_layer in wms_layer_detail:
        if wms_layer['wms_id'] not in wms_ids:
            wms_ids.append(wms_layer['wms_id'])

    wms_qs = list(WMS.objects.filter(id__in=wms_ids).values('id', 'name', 'url'))

    for wms in wms_qs:
        wms_layers = []
        for wms_layer in wms_layer_detail:
            if wms['id'] == wms_layer['wms_id']:
                layer_detail = {
                    'id': wms_layer['id'],
                    'code': wms_layer['code'],
                    'name': wms_layer['name'],
                    'title': wms_layer['title'],
                    'json_public_url': request.build_absolute_uri(reverse('api:service:system_json_proxy', args=[govorg.token, wms_layer['code']])),
                    'json_private_url': system_local_base_url + reverse('api:service:local_system_json_proxy', args=[govorg.token, wms_layer['code']]),
                }
                wms_layers.append(layer_detail)

        wms_detail = {
            'id': wms['id'],
            'name': wms['name'],
            'layers': wms_layers
        }
        wms_detail_list.append(wms_detail)
    return {
        **_get_govorg_display(govorg),
        'wms_list': wms_detail_list,
        'govorg_attributes': govorg_layer_detail
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
def govorgList(request, payload, org_id):
    qs = GovOrg.objects.filter(org_id=org_id, deleted_by__isnull=True)
    оруулах_талбарууд = ['id', 'name', 'token', 'created_at', 'updated_at', 'org_id', 'website']
    items = []
    total_page = 1

    if qs:
        datatable = Datatable(
            model=GovOrg,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд,
            initial_qs=qs
        )
        items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
    }
    return JsonResponse(rsp)
