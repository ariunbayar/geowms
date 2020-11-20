import re
import subprocess

from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
from django.contrib.postgres.search import SearchVector
from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.cache import cache_page
from django.utils.timezone import localtime, now

from .models import Config

from backend.config.models import Error500
from backend.payment.models import Payment
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
def geoserver_configs(request):

    default_values = {
        'geoserver_host': '',
        'geoserver_user': '',
        'geoserver_pass': '',
        'site_title': '',
        'site_footer_text': '',
        'agency_name': '',
        'agency_contact_address': '',
        'agency_contact_email': '',
        'agency_contact_phone': '',
        'geoserver_port': '',
        'geoserver_db': '',
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
        'site_title',
        'site_footer_text',
        'agency_name',
        'agency_contact_address',
        'agency_contact_email',
        'agency_contact_phone',
        'geoserver_port',
        'geoserver_db',
    )

    for config_name in config_names:
        Config.objects.update_or_create(
            name=config_name,
            defaults={
                'value': payload.get(config_name, '')
            }
        )

    return JsonResponse({"success": True})
