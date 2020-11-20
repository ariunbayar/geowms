import requests
from requests.auth import HTTPBasicAuth

from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from backend.config.models import Config
from main.decorators import ajax_required
from main import geoserver


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def layers(request):

    config = geoserver.get_connection_conf()

    HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    AUTH = HTTPBasicAuth(
        config['geoserver_user'],
        config['geoserver_pass'],
    )

    base_url = 'http://{host}:{port}/geoserver/rest/layers'.format(
        host=config['geoserver_host'],
        port=config['geoserver_port'],
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
