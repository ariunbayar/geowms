from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET

from main.decorators import ajax_required

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS


def all(request):

    bundles = Bundle.objects.all()

    context = {
        'bundles': bundles,
    }

    return render(request, 'bundle/all.html', context)


def detail(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)

    bundle_layers = BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()

    bundle_display = {
        'id': bundle.id,
        'name': bundle.name,
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'wms_list': [
            (WMS.objects.get(pk=wms[0]).name)
            for wms in bundle_layers
        ],
    }

    context = {
        'bundle_display': bundle_display,
    }

    return render(request, 'bundle/detail.html', context)


@require_GET
@ajax_required
def wms_layers(request, pk):

    roles = {1}
    if request.user.is_authenticated:
        roles |= set(request.user.roles.all().values_list('id', flat=True))

    bundle = get_object_or_404(Bundle, pk=pk)
    wms_list = []
    qs_layers = bundle.layers.filter(bundlelayer__role_id__in=roles).order_by('wms__created_at', 'sort_order').distinct()
    def _layer_to_display(ob):
        bundle_layers = BundleLayer.objects.filter(
                bundle_id=pk,
                layer_id=ob.id,
                role_id__in=roles
            )
        return {
                'name': ob.name,
                'code': ob.code,
                'legendURL': ob.legend_url,
                'defaultCheck': bundle_layers.values('defaultCheck')[0]['defaultCheck']
            }

    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(reverse('backend:wms:proxy', args=[wms.pk])),
                'layers': [_layer_to_display(layer) for layer in layers],
            }
            wms_list.append(wms_data)

    rsp = {
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)