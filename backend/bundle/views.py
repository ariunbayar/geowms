from itertools import groupby

from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import user_passes_test
from main.decorators import ajax_required
from main.utils import end_time, resize_b64_to_sizes, start_time
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role

from .forms import BundleForm
from .models import Bundle, BundleLayer
from backend.inspire.models import LThemes

def _layer_visible(layers):
    check = False
    for layer in layers:
        if BundleLayer.objects.filter(layer_id = layer['id']):
            check = True
            break
    return check


def _get_bundle_options():

    form_options = []

    for wms in WMS.objects.all():
        layers = list(WMSLayer.objects.filter(wms=wms).values('id', 'name').order_by('sort_order'))
        wms_display = {
            'name': wms.name,
            'is_active': wms.is_active,
            'layer_visible': _layer_visible(layers),
            'layers': layers,
        }
        form_options.append(wms_display)

    return form_options


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
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
@user_passes_test(lambda u: u.is_superuser)
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
@user_passes_test(lambda u: u.is_superuser)
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


def _get_wms_list(bundle):
    wms_list = list()
    wms_ids = list()
    bundle_layers = bundle.bundlelayer_set.all()
    for bundle_layer in bundle_layers:
        wms_id = bundle_layer.layer.wms.id
        if wms_id not in wms_ids:
            wms_list.append(
                {
                    'name': (bundle_layer.layer.wms.name),
                    'is_active': (
                        bundle_layer.layer.wms.is_active)
                }
            )
        wms_ids.append(wms_id)
    return wms_list


def _get_bundle_display(bundle):
    # roles = _get_form_check_options(bundle.id)
    wms_list = _get_wms_list(bundle)
    return {
        'id': bundle.id,
        'name': bundle.ltheme.theme_name if bundle.ltheme else '',
        'layers': [
            layer.id
            for layer in bundle.layers.all()
        ],
        'icon': '',
        'icon_url': bundle.icon.url if bundle.icon else '',
        'is_removeable': bundle.is_removeable,
        'wms_list': wms_list,
        # 'roles': roles
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):

    qs = Bundle.objects.order_by('sort_order')
    qs = qs.prefetch_related('bundlelayer_set__layer__wms')
    qs = qs.prefetch_related('layers')
    qs = qs.select_related('ltheme')

    bundle_list = [
        _get_bundle_display(bundle)
        for bundle in qs
    ]

    rsp = {
        'bundle_list': bundle_list,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def detail(request, pk):
    bundle = get_object_or_404(Bundle, pk=pk)
    bundle_list = _get_bundle_display(bundle)
    rsp = {
        'bundle_list': bundle_list,
        'form_options': _get_bundle_options(),
        'form_options_role': _get_role_options(),
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_form_options(request):
    rsp = {
        'form_options': _get_bundle_options(),
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
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
@user_passes_test(lambda u: u.is_superuser)
def swap(request, payload):
    swap_one = payload.get("swap_one")
    swap_two = payload.get("swap_two")
    bundle1 = get_object_or_404(Bundle, pk=swap_one)
    bundle2 = get_object_or_404(Bundle, pk=swap_two)
    bundle1.sort_order, bundle2.sort_order = bundle2.sort_order, bundle1.sort_order
    Bundle.objects.bulk_update([bundle1, bundle2], ['sort_order'])

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
