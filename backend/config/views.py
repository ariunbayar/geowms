import os
import re
import subprocess
import json
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from django.db import connections
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.cache import cache_page
from django.utils.timezone import localtime
from backend.bundle.models import Bundle
from backend.inspire.models import LCodeLists, LProperties, LThemes
from .models import Config
from backend.inspire.models import LValueTypes
from backend.org.models import Org
from backend.config.models import Error500
from main.decorators import ajax_required
from main import geoserver, utils

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

    error_qs = Error500.objects
    if query:
        error_qs = error_qs.annotate(search=SearchVector(
            'request_scheme',
            'request_url',
            'request_method',
            'request_headers',
            'description',
            'created_at',
        )
        ).filter(search__icontains=query)

    error500_list = error_qs.order_by(sort_name)

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
        'geoserver_protocol': '',
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
        'geoserver_protocol',

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

    property_code = 'Geodeticаlnetworktype'
    obj = get_object_or_404(LProperties, property_code__iexact=property_code)
    code_list = LCodeLists.objects.filter(property_id=obj.property_id)
    code_list = list(code_list.values('code_list_code', 'code_list_name'))

    configs = Config.objects
    part_payment = configs.filter(name__in=default_values.keys())
    point_payment = configs.filter(name='POINT_PRICE').first()
    point_payment = point_payment.value
    if point_payment:
        point_payment = utils.json_load(point_payment)

    rsp = {
        **default_values,
        **{conf.name: conf.value for conf in part_payment},
        **point_payment,
        'code_list': code_list
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def payment_configs_save(request, payload):
    point_obj = dict()
    code_list = payload.get('code_list')
    config_name = "POINT_PRICE"
    config_names = (
        'POLYGON_PER_KM_AMOUNT',
        'POLYGON_PER_M_AMOUNT',
        'PROPERTY_PER_AMOUNT',
    )

    for code in code_list:
        code_list_code = code['code_list_code']
        price = payload.get(code_list_code, '')
        point_obj[code_list_code] = price

    point_obj = utils.json_dumps(point_obj)
    Config.objects.update_or_create(
        name=config_name,
        defaults={
            "value": point_obj
        }
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
@user_passes_test(lambda u: u.is_superuser)
def get_value_type_fields(request):
    value_type_qs = LValueTypes.objects.values('value_type_id')
    value_types = list(value_type_qs)

    config_values = Config.objects.filter(name='value_types').first()
    initial_values = dict()
    for value_type in value_types:
        value = ''
        if config_values:
            obj = json.loads(config_values.value)
            value = obj[value_type['value_type_id']]
        initial_values[value_type['value_type_id']] = value

    rsp = {
        'success': True,
        'value_types': value_types,
        'initial_values': initial_values,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_value_types(request, payload):
    values = payload.get('values')
    config_name = 'value_types'

    Config.objects.update_or_create(
        name=config_name,
        defaults={
            'value': json.dumps(payload.get('values', ''))
        }
    )

    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)

# @require_GET
# @ajax_required
# @user_passes_test(lambda u: u.is_superuser)
# def qgisplugin_configs(request, payload):

#     upload_file = request.FILES['files']
#     file_name = upload_file.name
#     file_not_ext_name = utils.get_file_name(file_name)
#     form_datas = payload.get( 'form_datas')
#     if form_datas['file_name']:
#         file_name = form_datas['file_name']

#     return JsonResponse({'success': True})

@require_GET

@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qgis_plugin_configs(request):
    path = '/assets/'
    upload_file = request.FILES['files']
    file_name = upload_file.name
    if file_name != 'blob':
        # extract_path = os.path.join(path, file_name)
        file_path = os.path.join(settings.STATIC_ROOT + '/' + file_name)
    return JsonResponse ({'success': True} , file_path )


def upload_file(uploaded_file, check_data_of_file, file_name, main_path, file_path,):
    extract_path = os.path.join(settings.STATIC_ROOT, main_path)
    path = '/assets/'
    if check_data_of_file or file_name:
        if file_name != 'blob':
            extract_path = os.path.join(extract_path, 'qgis_plugin.zip')
            uploaded_file = os.path.join(settings.STATIC_ROOT, file_path, file_name='qgis_plugin.zip')
            utils.unzip(file_path, extract_path)
            utils.remove_file(uploaded_file)
        return True, extract_path


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def qgis_plugin_configs_save(request):
    path = '/assets/'
    upload_file = request.FILES['files']
    file_name = upload_file.name
    if file_name != 'blob':
        extract_path = os.path.join(path, file_name)
        zip.file(os.path.join(settings.STATIC_ROOT + '/' + file_name))
    return True, extract_path


def upload_file(uploaded_file, check_data_of_file, file_name, main_path, file_path,):
    extract_path = os.path.join(settings.STATIC_ROOT, main_path)
    path = '/assets/'
    if check_data_of_file or file_name:
        if file_name != 'blob':
            real_path = os.path.join(path, 'qgis_plugin.zip')
            print("dsnfvjcsbv jc")
            print("dsnfvjcsbv jc")
            print("dsnfvjcsbv jc")
            print("dsnfvjcsbv jc", real_path)
            file_path = os.path.realpath(settings.STATIC_ROOT, file_path, file_name='qgis_plugin.zip')
            utils.unzip(file_path, extract_path)
            utils.remove_file(file_path)
        return True, real_path
