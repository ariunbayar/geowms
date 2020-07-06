import requests

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_GET

from backend.govorg.models import GovOrg
from backend.wms.models import WMS


@require_GET
def proxy(request, token, pk):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    govorg = get_object_or_404(GovOrg, token=token)
    wms = get_object_or_404(WMS, pk=pk)
    base_url = wms.url

    queryargs = request.GET
    headers = {**BASE_HEADERS}
    rsp = requests.get(base_url, queryargs, headers=headers)

    content_type = rsp.headers.get('content-type')

    return HttpResponse(rsp.content, content_type=content_type)
