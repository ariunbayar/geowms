from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from django.db import connections


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
                'id': ob.pk,
                'name': ob.name,
                'code': ob.code,
                'legendURL': ob.legend_url.url,
                'feature_price': ob.feature_price,
                'geodb_schema': ob.geodb_schema,
                'geodb_table': ob.geodb_table,
                'geodb_pk_field': ob.geodb_pk_field,
                'geodb_export_field': ob.geodb_export_field,
                'defaultCheck': bundle_layers.values('defaultCheck')[0]['defaultCheck']
            }
    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk))
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': [_layer_to_display(layer) for layer in layers],
            }
            wms_list.append(wms_data)

    rsp = {
        'bundle': {'id': bundle.id},
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def aimag(request):
    try:
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT "Long" as X, "Lat" as Y , "AimagMon" as aimag FROM public."AdmUnitCenter_Aimag" ORDER BY "AimagMon"  ASC ''')
        data = find_cursor.fetchall()
        if(data):

            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def sumfind(request, payload):
    try:
        aimag_name = payload.get('aimag_name')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT "Long" as X, "Lat" as Y , "SoumMon" as aimag FROM public."AdmUnitCenter_Sum" where "AimagMon" = %s ORDER BY "SoumMon"  ASC ''', [aimag_name])
        data = find_cursor.fetchall()
        if(data):

            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)
