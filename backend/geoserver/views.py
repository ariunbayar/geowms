import requests
from requests.auth import HTTPBasicAuth

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from backend.config.models import Config
from main.decorators import ajax_required


def _get_geoserver_config():

    default_values = {
        'geoserver_host': '',
        'geoserver_user': '',
        'geoserver_pass': '',
    }

    configs = Config.objects.filter(name__in=default_values.keys())

    geoserver_config = {
        **default_values,
        **{conf.name: conf.value for conf in configs},
    }

    return geoserver_config


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layers(request):

    config = _get_geoserver_config()

    HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    AUTH = HTTPBasicAuth(
        config['geoserver_user'],
        config['geoserver_pass'],
    )

    base_url = 'http://{host}:19002/geoserver/rest/layers'.format(
        host=config['geoserver_host'],
    )

    rsp = requests.get(
        base_url,
        request.GET,
        headers=HEADERS,
        auth=AUTH,
    )

    if rsp.status_code == 200:
        rsp = {
            'success': True,
            'data': rsp.json()
        }
    else:
        rsp = {
            'success': False,
            'data': None
        }
    return JsonResponse(rsp)
