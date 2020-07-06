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

    bundle_display = {
        'id': bundle.id,
        'name': bundle.name,
        'layers': list(bundle.layers.all().values_list('id', flat=True)),
        'wms_list': [(WMS.objects.get(pk=wms[0]).name) for wms in BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()],
    }

    context = {
        'bundle_display': bundle_display,
    }

    return render(request, 'bundle/detail.html', context)


@require_GET
@ajax_required
def wms_layers(request, pk):

    if request.user.is_authenticated:
        userObject = request.user
        role = userObject.roles.all().values_list('id').first()
    else:
        role = 1

    bundle = get_object_or_404(Bundle, pk=pk)
    wms_list = []
    qs_layers = bundle.layers.filter(bundlelayer__role_id = role).order_by('wms__created_at').order_by('sort_order')
    _layer_to_display = lambda ob: {'name': ob.name, 'code': ob.code, 'defaultCheck':  BundleLayer.objects.filter(id=ob.id).values('defaultCheck')[0]}
    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
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

def purchase(request):

    return render(request, 'bundle/purchase.html', context)

def success(request):

    return render(request, 'bundle/success.html', context)

def failed(request):

    return render(request, 'bundle/failed.html', context)
