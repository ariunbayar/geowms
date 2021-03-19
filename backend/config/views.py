import re
import subprocess
import json

from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from django.db import connections
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.cache import cache_page
from django.utils.timezone import localtime
from backend.bundle.models import Bundle
from backend.inspire.models import LThemes

from .models import Config
from .models import CovidConfig

from backend.org.models import Org
from backend.config.models import Error500
from main.decorators import ajax_required
from main import geoserver

CACHE_TIMEOUT_DISK_INFO = 5


def _get_disk_info():

    disk_info = {}

    try:
        command = ['/bin/df', '-k', '--type=ext4', '--output=source,used,avail,target']
        proc = subprocess.Popen(command, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        stdout = proc.communicate()[0]
        lines = stdout.decode().splitlines()[1:]
        for line in lines:
            source, used, avail, target = re.split(' +', line)
            disk_info[source] = {
                    'used': int(used) * 1024,
                    'avail': int(avail) * 1024,
                    'target': target,
                }
    except Exception:
        pass

    return disk_info


@ajax_required
@cache_page(60 * CACHE_TIMEOUT_DISK_INFO)
@user_passes_test(lambda u: u.is_superuser)
def disk(request):

    disk_info = _get_disk_info()

    disks = [
        {
            'name': name,
            'size_used': info['used'],
            'size_total': info['used'] + info['avail'],
            'mount_point': info['target'],
        }
        for name, info in disk_info.items()
    ]
    return JsonResponse({'success': True, 'disks': disks})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def postresqlVersion(request):

    version_postgre_sql = connections['default'].cursor()
    version_postgre_sql.execute("SELECT version()")
    version_postgre_sql_data = version_postgre_sql.fetchone()

    version_post_gis = connections['default'].cursor()
    version_post_gis.execute("SELECT postgis_full_version()")
    version_post_gis_data = version_post_gis.fetchone()


    return JsonResponse({
        'postgreVersion': version_postgre_sql_data,
        'versionOfPostGis': version_post_gis_data,
    })


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def geoserver_version(request):

    return JsonResponse({
        'geoserverVersion': geoserver.get_version(),
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def paginatedList(request, payload):

    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('per_page')
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = '-created_at'

    error500_list = Error500.objects.all().annotate(search=SearchVector(
        'request_scheme',
        'request_url',
        'request_method',
        'request_headers',
        'description',
        'created_at',)
    ).filter(search__contains=query).order_by(sort_name)

    total_items = Paginator(error500_list, per_page)
    items_page = total_items.page(page)
    items = [
        _get_error500_display(error500)
        for error500 in items_page.object_list
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)


def _get_error500_display(error500):
    return {
        'request_scheme': error500.request_scheme,
        'request_url': error500.request_url,
        'request_method': error500.request_method,
        'request_headers': error500.request_headers,
        'request_data': error500.request_data,
        'description': error500.description,
        'created_at': localtime(error500.created_at).strftime('%Y-%m-%d %H:%M:%S.%f'),
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def site_configs(request):

    default_values = {
        'site_title': '',
        'site_footer_text': '',
        'agency_name': '',
        'agency_contact_address': '',
        'agency_contact_email': '',
        'agency_contact_phone': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def site_configs_save(request, payload):

    config_names = (
        'site_title',
        'site_footer_text',
        'agency_name',
        'agency_contact_address',
        'agency_contact_email',
        'agency_contact_phone',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def geoserver_configs(request):

    default_values = {
        'geoserver_host': '',
        'geoserver_user': '',
        'geoserver_pass': '',
        'geoserver_port': '',
        'geoserver_db_host': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def geoserver_configs_save(request, payload):

    config_names = (
        'geoserver_host',
        'geoserver_user',
        'geoserver_pass',
        'geoserver_port',
        'geoserver_db_host',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def system_configs(request):

    default_values = {
        'system_local_base_url': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def system_configs_save(request, payload):

    config_names = (
        'system_local_base_url',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def email_configs(request):

    default_values = {
        'EMAIL_USE_TLS': '',
        'EMAIL_HOST': '',
        'EMAIL_HOST_NAME': '',
        'EMAIL_HOST_USER': '',
        'EMAIL_HOST_PASSWORD': '',
        'EMAIL_PORT': ''
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def email_configs_save(request, payload):

    config_names = (
        'EMAIL_USE_TLS',
        'EMAIL_HOST',
        'EMAIL_HOST_NAME',
        'EMAIL_HOST_USER',
        'EMAIL_HOST_PASSWORD',
        'EMAIL_PORT'
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qgis_configs(request):

    default_values = {
        'qgis_local_base_url': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qgis_configs_save(request, payload):

    config_names = (
        'qgis_local_base_url',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def dan_configs(request):

    default_values = {
        'AUTHORIZE': '',
        'TOKEN': '',
        'SERVICE': '',
        'CLIENT_ID': '',
        'CLIENT_SECRET': '',
        'CALLBACK_URI': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def dan_configs_save(request, payload):

    config_names = (
        'AUTHORIZE',
        'TOKEN',
        'SERVICE',
        'CLIENT_ID',
        'CLIENT_SECRET',
        'CALLBACK_URI',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def payment_configs(request):

    default_values = {
        'POLYGON_PER_KM_AMOUNT': '',
        'POLYGON_PER_M_AMOUNT': '',
        'PROPERTY_PER_AMOUNT': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def payment_configs_save(request, payload):

    config_names = (
        'POLYGON_PER_KM_AMOUNT',
        'POLYGON_PER_M_AMOUNT',
        'PROPERTY_PER_AMOUNT',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


def _get_bundles():
    context_list = []
    bundles = Bundle.objects.all()
    for bundle in bundles:
        theme = LThemes.objects.filter(theme_id=bundle.ltheme_id).first()
        bundle_list = {
            'pk': bundle.id,
            'icon': bundle.icon.url if bundle.icon else '',
            'name': theme.theme_name if theme else ''
        }
        context_list.append(bundle_list)

    return context_list


def _get_orgs():
    org_qs = Org.objects
    org_qs = org_qs.filter(level=3)
    orgs = list(org_qs.values('id', 'name'))
    return orgs


def _get_line_chart_org(name):
    org_id = None
    qs = CovidConfig.objects
    qs = qs.filter(name=name)
    qs = qs.first()
    if qs:
        org_id = qs.org_id
    return org_id


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qpay_configs(request):

    default_values = {
        'id': '',
        'register_no': '',
        'name': '',
        'email': '',
        'phone_number': '',
        'note': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qpay_configs_save(request, payload):

    config_names = (
        'id',
        'register_no',
        'name',
        'email',
        'phone_number',
        'note',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})


@require_GET
@ajax_required
def covid_configs(request):

    default_values = {
        'emy_logo': '',
        'batlagdsan_tohioldol': '',
        'edgersen_humuusiin_too': '',
        'emchlegdej_bui_humuus_too': '',
        'tusgaarlagdsan_humuusiin_too': '',
        'medeellin_eh_survalj': '',
        'emiin_sangiin_too': '',
        'emlegiin_too': '',
        'niit_eruul_mend_baiguullaga_too': '',
        'gzbgzzg_logo': '',
        'title': '',
        'bundle': '',
        'shinjilgee_too': '',
        'nas_barsan_too': '',
        'erguul_ungu': '',
    }

    configs = CovidConfig.objects.filter(name__in=default_values.keys())
    line_chart_datas = CovidConfig.objects.filter(name='line_chart_datas').first()

    values = []
    if line_chart_datas:
        values = line_chart_datas.value
        values = json.loads(values)
    bundles = _get_bundles() or {}
    orgs = _get_orgs()
    default_values = _get_org_id(default_values)

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
        'line_chart_datas': values,
        'line_graph_org': _get_line_chart_org('line_chart_datas'),
        'bundles': bundles,
        'orgs': orgs,
    }

    return JsonResponse(rsp)


def _get_org_id(default_values):
    datas = list()
    org_datas = dict()

    config_org_ids = {
        'line_graph_org',
        'nas_barsan_too_org',
        'shinjilgee_too_org',
        'niit_eruul_mend_baiguullaga_too_org',
        'emlegiin_too_org',
        'emiin_sangiin_too_org',
        'tusgaarlagdsan_humuusiin_too_org',
        'emchlegdej_bui_humuus_too_org',
        'edgersen_humuusiin_too_org',
        'batlagdsan_tohioldol_org',
    }
    org = []

    for default_value in default_values:
        qs = CovidConfig.objects
        qs = qs.filter(name=default_value)
        if qs:
            org = qs.first().org
        for config_org_id in config_org_ids:
            splited = config_org_id.split("_org")
            conf_name = splited[0]
            if conf_name == default_value:
                if org:
                    org_datas[config_org_id] = org.id

    for key, value in org_datas.items():
        default_values[key] = value
    return default_values


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def covid_configs_save(request, payload):
    config_names = (
        'emy_logo',
        'batlagdsan_tohioldol',
        'edgersen_humuusiin_too',
        'emchlegdej_bui_humuus_too',
        'tusgaarlagdsan_humuusiin_too',
        'medeellin_eh_survalj',
        'emiin_sangiin_too',
        'emlegiin_too',
        'niit_eruul_mend_baiguullaga_too',
        'gzbgzzg_logo',
        'title',
        'bundle',
        'shinjilgee_too',
        'nas_barsan_too',
        'erguul_ungu',
    )

    config_org_ids = {
        'line_graph_org',
        'nas_barsan_too_org',
        'shinjilgee_too_org',
        'niit_eruul_mend_baiguullaga_too_org',
        'emlegiin_too_org',
        'emiin_sangiin_too_org',
        'tusgaarlagdsan_humuusiin_too_org',
        'emchlegdej_bui_humuus_too_org',
        'edgersen_humuusiin_too_org',
        'batlagdsan_tohioldol_org',
    }

    line_chart_datas = payload.get('line_chart_datas')
    line_chart_datas_obj = CovidConfig.objects.filter(name='line_chart_datas').first()

    if line_chart_datas_obj:
        line_chart_datas_obj.value = json.dumps(line_chart_datas, ensure_ascii=False)
        line_chart_datas_obj.save()
    else:
        Config.objects.create(
                name='line_chart_datas',
                value=json.dumps(line_chart_datas, ensure_ascii=False)
            )

    for config_name in config_names:
        CovidConfig.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, ''),
            }
        )
        for config_org_id in config_org_ids:
            if config_org_id != 'line_graph_org':
                splited = config_org_id.split("_org")
                conf_name = splited[0]
                if conf_name == config_name:
                    qs = CovidConfig.objects
                    qs = qs.filter(name=config_name)
                    qs.update(org=payload.get(config_org_id))
            else:
                qs = CovidConfig.objects
                qs = qs.filter(name='line_chart_datas')
                qs.update(org=payload.get(config_org_id))

    return JsonResponse({"success": True})
