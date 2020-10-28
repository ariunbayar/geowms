import re
import subprocess
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.cache import cache_page

from main.decorators import ajax_required
from .models import Config
from django.db import connections
from backend.payment.models import Payment
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


def _get_config_display(config):
    return {
        'id': config.id,
        'name': config.name,
        'value': config.value,
        'updated_at': config.updated_at.strftime('%Y-%m-%d'),
    }


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request):

    config_list = [_get_config_display(ob) for ob in Config.objects.all()]

    return JsonResponse({'config_list': config_list})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def detail(request, pk):

    config = get_object_or_404(Config, pk=pk)
    rsp = {
        'config': _get_config_display(config),
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def update(request, payload, pk):

    config = get_object_or_404(Config, pk=pk)
    config.name = payload.get('name')
    config.value = payload.get('value')
    config.save()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create(request, payload):

    name = payload.get('name')
    value = payload.get('value')
    Config.objects.create(name=name, value=value)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def delete(request, pk):
    config = get_object_or_404(Config, pk=pk)
    config.delete()
    return JsonResponse({'success': True})


@ajax_required
@cache_page(60 * CACHE_TIMEOUT_DISK_INFO)
@user_passes_test(lambda u: u.is_superuser)
def disk(request):
    disk_info = _get_disk_info()
    for name, info in disk_info.items():
        disk = {
                'name': name,
                'size_used': info['used'],
                'size_total': info['used'] + info['avail'],
                'mount_point': info['target'],
        }
    return JsonResponse({'success': True, 'disk': disk})

@ajax_required
def postresqlVersion(request):
    version_postgre_sql = connections['default'].cursor()
    version_postgre_sql.execute("SELECT version()")
    version_postgre_sql_data = version_postgre_sql.fetchone()
    version_post_gis = connections['default'].cursor()
    version_post_gis.execute("SELECT postgis_full_version()")
    version_post_gis_data = version_post_gis.fetchone()

    return JsonResponse({'postgreVersion': version_postgre_sql_data, 'versionOfPostGis': version_post_gis_data})
