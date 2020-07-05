from itertools import groupby

from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET

from main.decorators import ajax_required
from main.utils import resize_b64_to_sizes
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role

from .forms import BundleForm
from .models import Bundle, BundleLayer


def _get_bundle_options():

    form_options = []

    for wms in WMS.objects.all():
        layers = list(WMSLayer.objects.filter(wms=wms).values('id', 'name').order_by('sort_order'))
        wms_display = {
            'name': wms.name,
            'layers': layers,
        }
        form_options.append(wms_display)

    return form_options


@require_POST
@ajax_required
def roleCreate(request, payload):

    bundleId = payload.get('bundleId')
    roleId = payload.get('roleId')
    layerId = payload.get('layerId')
    check = payload.get('check')
    sav = BundleLayer.objects.filter(bundle_id=bundleId, layer_id=layerId, role_id=roleId)
    if sav:
        return JsonResponse({'success': True})
    else:
        saves = BundleLayer(bundle_id=bundleId, layer_id=layerId, role_id=roleId, defaultCheck=check)
        saves.save()
        return JsonResponse({'success': True})

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def roleRemove(request, payload):

    bundleId = payload.get('bundleId')
    roleId = payload.get('roleId')
    layerId = payload.get('layerId')
    sav = BundleLayer(bundle_id=bundleId, layer_id=layerId, role_id=roleId)
    if sav is None:
        return JsonResponse({'success': True})
    else:
        saves = BundleLayer.objects.filter(bundle_id=bundleId, layer_id=layerId, role_id=roleId)
        saves.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def defaultCheckUpdate(request, payload):

    bundleId = payload.get('bundleId')
    check = payload.get('check')
    layerId = payload.get('layerId')
    BundleLayer.objects.filter(bundle_id=bundleId, layer_id=layerId).update(defaultCheck=check)

    return JsonResponse({'success': True})


def _get_role_options():

    form_options = []

    for role in Role.objects.all():
        role_display = {
            'id': role.id,
        }
        form_options.append(role_display)

    return form_options


def _get_form_check_options(bundleId):

    bundleLayer = BundleLayer.objects.filter(bundle_id=bundleId).order_by('layer_id')

    roleOptions = []
    for name, layers in groupby(bundleLayer, lambda ob: ob.layer_id):
        roles = []
        check = 0
        for role in layers:
            roles.append(role.role_id)
            check = role.defaultCheck
        role_display = {
            'layer_id': name,
            'roles': roles,
            'checks': check
        }
        roleOptions.append(role_display)
    return roleOptions


def _get_bundle_display(bundle):
    roles = _get_form_check_options(bundle.id)
    return {
        'id': bundle.id,
        'name': bundle.name,
        'price': bundle.price,
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'icon': '',
        'icon_url': bundle.icon.url if bundle.icon else '',
        'is_removeable': bundle.is_removeable,
        'wms_list': [(WMS.objects.get(pk=wms[0]).name) for wms in BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()],
        'roles': roles
    }


@require_GET
@ajax_required
def all(request):

    bundle_list = [_get_bundle_display(ob) for ob in Bundle.objects.all()]
    form_options = _get_bundle_options()
    form_options_role = _get_role_options()

    rsp = {
        'bundle_list': bundle_list,
        'form_options': form_options,
        'form_options_role': form_options_role,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
def create(request, payload):

    сүүлийн_дэд_сан = Bundle.objects.all().order_by('sort_order').last()

    icon_data = payload.get('icon')

    form = BundleForm(payload)
    if form.is_valid() and icon_data:
        form.instance.created_by = request.user
        form.instance.sort_order = сүүлийн_дэд_сан.sort_order + 1
        form.instance.is_removeable = True
        [image_x2] = resize_b64_to_sizes(icon_data, [(200, 200)])
        form.instance.icon = SimpleUploadedFile('icon.png', image_x2)
        form.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def update(request, payload):

    bundle = get_object_or_404(Bundle, pk=payload.get('id'))

    icon_data = payload.get('icon')

    form = BundleForm(payload, instance=bundle)
    if form.is_valid():
        if icon_data:
            form.instance.icon.delete(save=False)
            [image_x2] = resize_b64_to_sizes(icon_data, [(200, 200)])
            form.instance.icon = SimpleUploadedFile('icon.png', image_x2)
        form.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def remove(request, payload):

    pk = payload.get('id')

    bundle = get_object_or_404(Bundle, pk=pk, is_removeable=True)

    bundle.layers.clear()
    bundle.icon.delete(save=False)
    bundle.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def move(request, payload):

    bundle1 = get_object_or_404(Bundle, pk=payload.get('id'))

    if payload.get('move') == 'down':
        bundle2 = Bundle.objects.filter(sort_order__gt=bundle1.sort_order).order_by('sort_order').first()

    else:
        bundle2 = Bundle.objects.filter(sort_order__lt=bundle1.sort_order).order_by('sort_order').last()

    if bundle2 is None:
        return JsonResponse({'success': False})

    bundle1.sort_order, bundle2.sort_order = bundle2.sort_order, bundle1.sort_order
    Bundle.objects.bulk_update([bundle1, bundle2], ['sort_order'])

    bundle_list = [_get_bundle_display(ob) for ob in Bundle.objects.all()]

    rsp = {
        'success': True,
        'bundle_list': bundle_list,
    }

    return JsonResponse(rsp)
