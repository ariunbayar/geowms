from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET

from main.decorators import ajax_required

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS


def _get_bundles_display(request, bundle):
    return {
        'id': bundle.id,
        'name': bundle.name,
        'price': bundle.price,
        'is_removeable': bundle.is_removeable,
        'created_at': bundle.created_at,
        'updated_at': bundle.updated_at,
        'created_by_id': bundle.created_by_id,
        'icon': bundle.icon.url,
        'sort_order': bundle.sort_order,
    }


def all(request):

    bundles = [_get_bundles_display(request, ob) for ob in Bundle.objects.all()]
    return render(request, 'mobile/detail.html', {'bundles': bundles})


def detail(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)

    bundle_display = {
        'id': bundle.id,
        'name': bundle.name,
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'wms_list': [(WMS.objects.get(pk=wms[0]).name) for wms in BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()],
    }

    context = {
        'bundle_display': bundle_display,
    }
    return JsonResponse(context)


@require_GET
@ajax_required
def wms_layers(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)

    wms_list = []

    qs_layers = bundle.layers.all().order_by('wms__created_at')
    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk))
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': [
                    {'name': layer.name, 'code': layer.code}
                    for layer in layers
                ],
            }
            wms_list.append(wms_data)

    rsp = {
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)
