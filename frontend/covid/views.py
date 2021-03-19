
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render, reverse
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404
from geojson import FeatureCollection

from main.decorators import ajax_required
from main import utils

from backend.org.models import EmployeeErguul
from backend.org.models import NemaWMS
from backend.config.models import CovidConfig
from backend.wms.models import WMS
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer
from .models import CovidDashboard, CovidDashboardLog


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


@require_GET
@ajax_required
def get_nema(request):
    qs = NemaWMS.objects
    qs = qs.filter(is_open=1)

    wms_qs = WMS.objects
    wms_qs = wms_qs.filter(name__exact='nema')
    if not wms_qs:
        rsp = {
            'success': False,
            'info': 'WMS олдсонгүй системийн админд хандана уу'
        }
        return JsonResponse(rsp)

    layer_codes = list(qs.values_list("code", flat=True))
    wms_values = wms_qs.values('name', 'url')
    wms = wms_values.first()

    bundle = utils.get_config('bundle', CovidConfig)

    wms_list = list()

    def _layer_to_display(code):
        layer_qs = WMSLayer.objects
        
        layer_qs = layer_qs.filter(code=code)
        zoom_start = 4
        zoom_stop = 21
        if layer_qs:
            layer = layer_qs.first()
            code = layer.code.replace('gp_layer_', '')
            bundle_qs = BundleLayer.objects
            bundle_layers = bundle_qs.filter(
                bundle_id=bundle,
                layer_id=layer.id,
            )

            return {
                'id': layer.pk,
                'name': layer.name,
                'code': layer.code,
                'feature_price': layer.feature_price,
                'geodb_schema': layer.geodb_schema,
                'geodb_table': layer.geodb_table,
                'zoom_start': zoom_start,
                'zoom_stop': zoom_stop,
                'geodb_pk_field': layer.geodb_pk_field,
                'geodb_export_field': layer.geodb_export_field,
                'defaultCheck': 1,
            }

    for wms in wms_qs:
        if wms.is_active:
            url = reverse('api:service:wms_proxy', args=(bundle, wms.pk, 'wms'))
            layers = list()
            for code in layer_codes:
                layer = _layer_to_display(code)
                if layer:
                    layers.append(layer)
            wms_data = {
                'name': wms.name,
                'url': request.build_absolute_uri(url),
                'layers': layers,
            }
            wms_list.append(wms_data)
    rsp = {
        'success': True,
        'layer_codes': layer_codes,
        'wms_list': wms_list,
        'bundle': {"id": bundle},
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