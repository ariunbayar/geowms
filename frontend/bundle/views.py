from itertools import groupby

from django.http import JsonResponse
from django.shortcuts import render, reverse, get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required
from backend.dedsanbutets.models import ViewNames

from backend.bundle.models import Bundle, BundleLayer
from backend.wms.models import WMS
from django.db import connections
from backend.inspire.models import LThemes
from main import utils
from backend.geoserver.models import WmtsCacheConfig


def all(request):
    context_list = []
    bundles = Bundle.objects.all()
    for bundle in bundles:
        bundle_list = []
        theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
        bundle_list = {
            'pk': bundle.id,
            'icon': bundle.icon,
            'name': theme.theme_name if theme else ''
        }

        context_list.append(bundle_list)

    context = {
        'bundles': context_list,
    }
    return render(request, 'bundle/all.html', context)


def detail(request, pk):

    bundle = get_object_or_404(Bundle, pk=pk)
    theme = LThemes.objects.filter(theme_id = bundle.ltheme_id).first()
    bundle_layers = BundleLayer.objects.filter(bundle=bundle).values_list('layer__wms_id').distinct()

    bundle_display = {
        'id': bundle.id,
        'name': theme.theme_name if theme else '',
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
        code = ob.code.replace('gp_layer_', '')
        zoom_start = 4
        zoom_stop = 21
        bundle_layers = BundleLayer.objects.filter(
                bundle_id=pk,
                layer_id=ob.id,
                role_id__in=roles
            )

        view_obj = ViewNames.objects.filter(view_name=code).first()
        if view_obj:
            feature_id = view_obj.feature_id
            wmts_obj = WmtsCacheConfig.objects.filter(feature_id=feature_id).first()
            if wmts_obj:
                if wmts_obj.zoom_start < 4:
                    zoom_start = 5
                else:
                    zoom_start = wmts_obj.zoom_start
                if wmts_obj.zoom_stop < 13:
                    zoom_stop = 21
                else:
                    zoom_stop = wmts_obj.zoom_stop
        return {
                'id': ob.pk,
                'name': ob.name,
                'code': ob.code,
                'feature_price': ob.feature_price,
                'geodb_schema': ob.geodb_schema,
                'geodb_table': ob.geodb_table,
                'geodb_pk_field': ob.geodb_pk_field,
                'geodb_export_field': ob.geodb_export_field,
                'zoom_start': zoom_start,
                'zoom_stop': zoom_stop,
                'defaultCheck': bundle_layers.values('defaultCheck')[0]['defaultCheck']
            }

    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wms'))
            # chache_url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wmts'))
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'chache_url': wms.cache_url or '',
                'layers': [_layer_to_display(layer) for layer in layers],
                'wms_or_cache_ur': True if wms.cache_url else False
            }
            wms_list.append(wms_data)

    rsp = {
        'bundle': {'id': bundle.id},
        'wms_list': wms_list,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def get_user(request):

    if request.user.is_authenticated:
        return JsonResponse({'is_authenticated': True})

    else:
        return JsonResponse({'is_authenticated': False})


@require_GET
@ajax_required
def aimag(request):

    admin_levels = utils.get_administrative_levels()
    if admin_levels:
        success = True
        info = admin_levels
    else:
        success = False
        info = "Уучлаарай ямар нэгэн мэдээлэл олдсонгүй"

    rsp = {
        'success': success,
        'info': info,
        'firstOrder_geom': utils.get_1stOrder_geo_id(),
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def sumfind(request, payload):
    try:
        aimag_name = payload.get('aimag_name')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT "Long" as X, "Lat" as Y , "SoumMon" as aimag FROM public."AdmUnitCenter_Sum" where "AimagMon" = %s ORDER BY "SoumMon" ASC ''', [aimag_name])
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
