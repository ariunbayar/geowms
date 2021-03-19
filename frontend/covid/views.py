
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render, reverse
from itertools import groupby

from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404
from geojson import FeatureCollection, Feature

from main.decorators import ajax_required
from main import utils

from backend.org.models import EmployeeErguul
from backend.dedsanbutets.models import ViewNames
from backend.org.models import NemaWMS
from backend.config.models import CovidConfig
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer, Bundle
from .models import CovidDashboard, CovidDashboardLog
from backend.geoserver.models import WmtsCacheConfig


def covid_index(request):

    context = {
        'covid': "covid"
    }

    return render(request, 'covid/index.html', context)


def dashboard_index(request):

    context = {
        'covid_dashboard': "covid_dashboard"
    }

    return render(request, 'covid_dashboard/index.html', context)


def _layer_to_display(ob, bundle_id, roles):
    code = ob.code.replace('gp_layer_', '')
    zoom_start = 4
    zoom_stop = 21
    bundle_layers = BundleLayer.objects.filter(
            bundle_id=bundle_id,
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


def _get_bundle_wms_list(request, bundle_id):

    roles = {1}
    if request.user.is_authenticated:
        roles |= set(request.user.roles.all().values_list('id', flat=True))

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    wms_list = []
    qs_layers = bundle.layers.filter(bundlelayer__role_id__in=roles).order_by('wms__created_at', 'sort_order').distinct()
    for wms, layers in groupby(qs_layers, lambda ob: ob.wms):
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle.pk, wms.pk, 'wms'))
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': [_layer_to_display(layer, bundle_id, roles) for layer in layers],
            }
            wms_list.append(wms_data)

    return wms_list


def _get_nema_layers(is_open=''):
    qs = NemaWMS.objects
    if is_open:
        qs = qs.filter(is_open=is_open)
    else:
        qs = qs.all()

    wms_qs = WMS.objects
    wms_qs = wms_qs.filter(name__exact='nema')
    return wms_qs, qs


def _get_nema_code_list(qs, wms_qs, request, bundle_id):
    layer_codes = list(qs.values_list("code", flat=True))
    wms_values = wms_qs.values('name', 'url')
    wms = wms_values.first()
    wms_list = _get_bundle_wms_list(request, bundle_id)
    return wms_list, layer_codes


def _layer_to_display_nema_codes(code, bundle_id):
    layer_qs = WMSLayer.objects
    layer_qs = layer_qs.filter(code=code)
    zoom_start = 4
    zoom_stop = 21
    if layer_qs:
        layer = layer_qs.first()
        code = layer.code.replace('gp_layer_', '')
        bundle_qs = BundleLayer.objects
        bundle_layers = bundle_qs.filter(
            bundle_id=bundle_id,
            layer_id=layer.id,
        )

        return {
            'id': layer.pk,
            'name': layer.name,
            'code': layer.code,
            'defaultCheck': 1,
        }


def _get_wms_list_of_nema(wms_list, wms_qs, bundle_id, layer_codes, request):
    for wms in wms_qs:
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle_id, wms.pk, 'wms'))
            layers = list()
            for code in layer_codes:
                layer = _layer_to_display_nema_codes(code, bundle_id)
                if layer:
                    layers.append(layer)
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': layers,
            }
            wms_list.append(wms_data)
    return wms_list


@require_GET
@ajax_required
def get_nema(request, bundle_id):
    wms_qs, qs = _get_nema_layers(is_open=1)
    if not wms_qs:
        rsp = {
            'success': False,
            'info': 'WMS олдсонгүй системийн админд хандана уу'
        }
        return JsonResponse(rsp)

    wms_list, layer_codes = _get_nema_code_list(qs, wms_qs, request, bundle_id)
    if qs:
        wms_list = _get_wms_list_of_nema(wms_list, wms_qs, bundle_id, layer_codes, request)

    rsp = {
        'success': True,
        'layer_codes': layer_codes,
        'wms_list': wms_list,
        'bundle': {"id": bundle_id},
    }
    return JsonResponse(rsp)

@require_GET
@ajax_required
def get_covid_data(request, geo_id):
    form_datas = []
    geom = utils.get_geom(geo_id, 'MultiPolygon')
    geo_data = utils.get_geoJson(geom.json)
    covid_datas = CovidDashboard.objects.filter(geo_id=geo_id).first()
    if covid_datas:
        form_datas.append({
            'id': covid_datas.id,
            'name': covid_datas.name,
            'parent_id': covid_datas.parent_id,
            'batlagdsan_tohioldol_too': covid_datas.batlagdsan_tohioldol_too,
            'edgersen_humuus_too': covid_datas.edgersen_humuus_too,
            'emchlegdej_bui_humuus_too': covid_datas.emchlegdej_bui_humuus_too,
            'nas_barsan_hunii_too': covid_datas.nas_barsan_hunii_too,
            'tusgaarlagdaj_bui_humuus_too': covid_datas.tusgaarlagdaj_bui_humuus_too,
        })

    rsp = {
        'geo_data': FeatureCollection(geo_data),
        'form_datas': form_datas,
    }
    return JsonResponse(rsp)



@require_GET
@ajax_required
def get_covid_state(request, geo_id):
    qs = CovidDashboard.objects.filter(geo_id=geo_id)
    covid_datas = qs.values()
    qs_log = CovidDashboardLog.objects.filter(geo_id=geo_id)
    last_day_data = qs_log.order_by('-updated_at').values()
    count_datas = []
    for f in CovidDashboard._meta.get_fields():
        if f.name != 'id' and f.name != 'updated_by' and not 'updated_at' in f.name and not 'name' in f.name and not 'parent_id' in f.name and not 'org' in f.name and not 'geo_id' in f.name:
            if hasattr(f, 'verbose_name') and hasattr(f, 'max_length'):
                if f.name == 'batlagdsan_tohioldol_too':
                    color = "danger"
                elif f.name == 'edgersen_humuus_too':
                    color = "success"
                elif f.name == 'emchlegdej_bui_humuus_too':
                    color = "warning"
                elif f.name == 'nas_barsan_hunii_too':
                    color = "dark"
                elif f.name == 'shinjilgee_hiisen_too':
                    color = "primary"
                else:
                    color = "info"
                for covid_data in covid_datas:
                    count_datas.append({
                        'origin_name': f.name,
                        'name': f.verbose_name,
                        'data': covid_data[f.name],
                        'prev_data': last_day_data[1][f.name],
                        'color': color
                    })
    covid_data_ogj = qs.first()
    piechart_one = {
        'labels': [
            "Батлагдсан тохиолдол", "Эдгэрсэн хүмүүсийн тоо",
            "Эмчлэгдэж буй хүмүүсийн тоо", "Нас барсан хүмүүсийн тоо",
            "Тусгаарлагдаж буй хүмүүсийн тоо", "Шинжилгээ хийсэн тоо"
            ],
        'datas': [
            covid_data_ogj.batlagdsan_tohioldol_too, covid_data_ogj.edgersen_humuus_too,
            covid_data_ogj.emchlegdej_bui_humuus_too, covid_data_ogj.nas_barsan_hunii_too,
            covid_data_ogj.tusgaarlagdaj_bui_humuus_too, covid_data_ogj.shinjilgee_hiisen_too
            ],
        'backgroundColor': ['#FF6384','#4BC0C0','#FFCE56','#E7E9ED','#36A2EB', '#EC0E00', '#EC0E00']
    }

    covid_data_objs = qs_log.order_by('updated_at')
    batlagdsan_tohioldol_too = []
    edgersen_humuus_too = []
    nas_barsan_hunii_too = []
    emchlegdej_bui_humuus_too = []
    tusgaarlagdaj_bui_humuus_too = []
    shinjilgee_hiisen_too = []
    dates = []
    for covid_data_ob in covid_data_objs:
        batlagdsan_tohioldol_too.append(covid_data_ob.batlagdsan_tohioldol_too)
        edgersen_humuus_too.append(covid_data_ob.edgersen_humuus_too)
        nas_barsan_hunii_too.append(covid_data_ob.nas_barsan_hunii_too)
        emchlegdej_bui_humuus_too.append(covid_data_ob.emchlegdej_bui_humuus_too)
        tusgaarlagdaj_bui_humuus_too.append(covid_data_ob.tusgaarlagdaj_bui_humuus_too)
        shinjilgee_hiisen_too.append(covid_data_ob.shinjilgee_hiisen_too)
        dates.append(covid_data_ob.updated_at.strftime('%Y-%m-%d.%H-%M'))

    linechart_all = {
        'datas': [
            {'label': 'Батлагдсан тохиолдол', 'color': '#FF6384', 'data': batlagdsan_tohioldol_too},
            {'label': 'Эдгэрсэн хүмүүсийн тоо', 'color': '#4BC0C0', 'data': edgersen_humuus_too},
            {'label': 'Эмчлэгдэж буй хүмүүсийн тоо', 'color': '#FFCE56', 'data': emchlegdej_bui_humuus_too},
            {'label': 'Нас барсан хүмүүсийн тоо', 'color': '#E7E9ED', 'data': nas_barsan_hunii_too},
            {'label': 'Тусгаарлагдаж буй хүмүүсийн тоо', 'color': '#36A2EB', 'data': tusgaarlagdaj_bui_humuus_too},
            {'label': 'Шинжилгээ хийсэн тоо', 'color': '#EC0E00', 'data': shinjilgee_hiisen_too}

        ],
        'dates': dates
    }

    rsp = {
        'success': True,
        'count_datas': count_datas,
        'charts': {
            'piechart_one': piechart_one,
            'linechart_all': linechart_all
        }
    }
    return JsonResponse(rsp)
