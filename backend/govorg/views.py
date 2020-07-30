from itertools import groupby
import uuid

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, reverse
from django.views.decorators.http import require_POST, require_GET


from main.decorators import ajax_required
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from .models import GovOrg


def _get_govorg_display(govorg):

    layers = list(govorg.wms_layers.all().values_list('pk', flat=True))

    return {
        'id': govorg.pk,
        'name': govorg.name,
        'token': govorg.token,
        'created_at': govorg.created_at.strftime('%Y-%m-%d'),
        'layers': layers,
    }


def _generate_govorg_token():
    return uuid.uuid4().hex[:32]


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def жагсаалт(request):

    govorg_list = GovOrg.objects.all()

    govorg_list_display = [
        _get_govorg_display(govorg)
        for govorg in govorg_list
    ]

    rsp = {
        'govorg_list': govorg_list_display,
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def үүсгэх(request, payload):

    govorg = GovOrg.objects.create(
        name=payload.get('name'),
        token=_generate_govorg_token(),
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
            'url': wms.url,
            'layer_list': list(wms.wmslayer_set.all().values('id', 'code', 'name', 'title')),
            'public_url': request.build_absolute_uri(reverse('api:систем:proxy', args=[govorg.token, wms.pk])),
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
def тоо(request):

    rsp = {
        'count': GovOrg.objects.count(),
    }

    return JsonResponse(rsp)
