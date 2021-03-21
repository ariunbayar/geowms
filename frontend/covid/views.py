
from django.shortcuts import get_object_or_404, get_list_or_404
from django.shortcuts import render, reverse
from itertools import groupby
from django.db.models import Count
from django.db.models.query import QuerySet

from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, FileResponse, Http404
from geojson import FeatureCollection
from datetime import datetime, timedelta
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
from backend.geoserver.models import WmtsCacheConfig


from .models import CovidDashboard, CovidDashboardLog, PopulationAge, PopulationCount


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
    count_covid_datas = []
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
                    if color != 'info':
                        count_datas.append({
                            'origin_name': f.name,
                            'name': f.verbose_name,
                            'data': covid_data[f.name],
                            'prev_data': last_day_data[1][f.name],
                            'color': color
                        })
                    else:
                        count_covid_datas.append({
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

    # const data = {
    #         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    #         datasets: [
    #           {
    #             label: "First dataset",
    #             data: [33, 53, 85, 41, 44, 65],
    #             fill: true,
    #             backgroundColor: 'rgba(52, 168, 235, 0.2)',
    #             borderColor: 'rgba(52, 168, 235, 1)',
    #             borderWidth: 1,
    #           },
    #           {
    #             label: "Second dataset",
    #             data: [33, 25, 35, 51, 54, 76],
    #             fill: false,
    #             backgroundColor: 'linear-gradient(to right, #0088CA, #0B3A7D)',
    #             borderColor: 'rgba(255, 99, 132, 1)',
    #             borderWidth: 1,
    #           },
    #           {
    #             label: "Tirth dataset",
    #             data: [3, 15, 25, 41, 34, 66],
    #             fill: false,
    #             backgroundColor: 'rgba(52, 168, 235, 0.2)',
    #             borderColor: 'rgba(52, 168, 235, 1)',
    #             borderWidth: 1,
    #           },
    #         ]
    #     }

    sorted_age_list = PopulationAge.objects.all().values('age_group').annotate(Count('age_group')).order_by('age_group_number')
    sorted_age_list = list(sorted_age_list)

    age_labels = []
    for sorted_age in sorted_age_list:
        age_labels.append(sorted_age['age_group'])
    print(age_labels)

    rsp = {
        'success': True,
        'count_datas': count_datas,
        'count_covid_datas': count_covid_datas,
        'charts': {
            'piechart_one': piechart_one,
            'linechart_all': linechart_all
        },
        'name': qs.first().name,
    }
    return JsonResponse(rsp)


def _for_dashb_list():
    return [
        'batlagdsan_tohioldol_too',
        'edgersen_humuus_too',
        'emchlegdej_bui_humuus_too',
        'nas_barsan_hunii_too',
        'tusgaarlagdaj_bui_humuus_too',
        'niit_eruul_mendiin_baiguullaga_too',
        'emnelegiin_too',
        'emiin_sangiin_too',
        'shinjilgee_hiisen_too'
    ]


def _get_child(children, data):
    childs = []
    for child in children.values():
        child_dict = dict()
        child_dict['name'] = child['name']
        child_dict['geo_id'] = child['geo_id']
        for name in _for_dashb_list():
            data[name] = child[name]
        childs.append(child_dict)
        data['children'] = childs
    return data


def _make_json_for_dashb(initial_qs, items, get_child=True):
    datas = list()
    for item in items.values():
        data = dict()
        parent_id = item['id']
        data['name'] = item['name']
        data['geo_id'] = item['geo_id']
        for name in _for_dashb_list():
            data[name] = item[name]
        children = initial_qs.filter(parent_id=parent_id)
        if children and get_child:
            data['children'] = _make_json_for_dashb(initial_qs, children)
            datas.append(data)
        else:
            data['children']= []
            datas.append(data)

    return datas


def _days_hours_minutes(td):
    return td.days, td.seconds//3600, (td.seconds//60)%60


def _for_mongol_list():
    return {
        'batlagdsan_tohioldol_too',
        'emchlegdej_bui_humuus_too',
        'nas_barsan_hunii_too',
    }


@require_GET
@ajax_required
def get_data_dashboard(request):
    initial_qs = CovidDashboard.objects
    parents = initial_qs.filter(parent_id__isnull=True)
    data = _make_json_for_dashb(initial_qs, parents)

    updated = parents.first().updated_at
    date_now = datetime.today()
    timed = date_now - updated.utcnow()
    day, hour, minut = _days_hours_minutes(timed)
    msg = ''
    if day:
        msg = str(day) + " өдрийн"
    elif hour:
        msg = str(hour) + " цагийн"
    elif minut:
        msg = str(minut) + " минутын"

    qs_log = CovidDashboardLog.objects.filter(parent_id__isnull=True)
    last_day_data = qs_log.order_by('-updated_at').values()
    zuruu = dict()
    if last_day_data:
        last_day_data = last_day_data[1]
        mongol = parents.values()[0]
        for name in _for_mongol_list():
            zuruu[name + "_zuruu"] = str(mongol[name] - last_day_data[name])

    rsp = {
        'success': True,
        'data': data,
        'update_time': msg,
        'zuruu': zuruu if zuruu else '',
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def get_nema_all(request, payload, bundle_id):
    choice_list = payload.get('choice_list')
    wms_list = []
    if len(choice_list) == 1:
        wms_qs, qs = _get_nema_layers(int(choice_list[0]))
    else:
        wms_qs, qs = _get_nema_layers()

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

