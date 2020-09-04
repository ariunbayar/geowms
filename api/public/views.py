import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET

from backend.wms.models import WMS


@require_GET
def proxy(request, wms_id):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    wms = get_object_or_404(WMS, pk=wms_id)
    if wms.is_active:

        queryargs = request.GET
        headers = {**BASE_HEADERS}
        rsp = requests.get(wms.url, queryargs, headers=headers)

        content_type = rsp.headers.get('content-type')

        return HttpResponse(rsp.content, content_type=content_type)

    else:

        raise Http404
