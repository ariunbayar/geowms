
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from main import utils
from geoportal_app.models import Role


def get_layers(bundle):
    bundle_layers = BundleLayer.objects.filter(bundle=bundle, role_id=Role.ROLE1).values_list('layer__wms_id', flat=True).distinct()
    wms_lists = []
    for wms in bundle_layers:
        wms_obj = WMS.objects.filter(pk=wms).first()

        display = {
            'id': wms_obj.id,
            'name': wms_obj.name,
            'url': wms_obj.url,
            'cache_url': wms_obj.cache_url,
            'created_by_id': wms_obj.created_by_id,
            'layers': []
        }
        print(display)
        wms_lists.append(display)
        layers_all = bundle.layers.all().values_list('id', flat=True)



    print("...............")
    return



bundles = Bundle.objects.all().order_by('sort_order')
bundle_displays = []
for bundle in bundles:
    get_layers(bundle)
    display = {
        'id': bundle.id,
        'name': bundle.ltheme.theme_name,
        'icon': bundle.icon.url,
        'wms_list': ''
    }
    bundle_displays.append(display)








def index(request):
    bundles = Bundle.objects.all().order_by('sort_order')
    bundle_displays = []
    for bundle in bundles:
        get_layers(bundle)
        display = {
            'id': bundle.id,
            'name': bundle.ltheme.theme_name,
            'icon': bundle.icon.url,
            'wms_list': ''
        }
        bundle_displays.append(display)

    context = {
        'bundles': bundle_displays,
    }
    return render(request, 'open_layer/index.html', context)
