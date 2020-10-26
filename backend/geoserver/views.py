from main.decorators import ajax_required
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404, reverse
from django.views.decorators.csrf import csrf_exempt
from api.utils import filter_layers, replace_src_url
from django.contrib.auth.decorators import user_passes_test
import requests
import json
from requests.auth import HTTPBasicAuth
from django.conf import settings

# Create your views here.
# https://docs.geoserver.org/stable/en/user/rest/index.html  -> learning

@require_GET
@ajax_required
def layers(request):

    BASE_HEADERS = {
        'Content-Type': 'application/json',
    }
    base_url = settings.GEOSERVER['SERVER'] + 'layers'

    rsp = requests.get(
        base_url,
        request.GET,
        headers={**BASE_HEADERS},
        auth=HTTPBasicAuth(settings.GEOSERVER['USERNAME'], settings.GEOSERVER['PASSWORD'])
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