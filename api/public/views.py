import requests
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from backend.wms.models import WMS
from django.shortcuts import reverse, get_object_or_404, render
from django.views.decorators.http import require_POST, require_GET
# Create your views here.

@require_GET
def proxy(request, wms_id):
    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }
    is_active = get_object_or_404(WMS, pk=wms_id).is_active
    if is_active:

        base_url = get_object_or_404(WMS, pk=wms_id).url
        queryargs = request.GET
        headers = {**BASE_HEADERS}
        rsp = requests.get(base_url, queryargs, headers=headers)

        content_type = rsp.headers.get('content-type')

        return HttpResponse(rsp.content, content_type=content_type)

    else:
        
        return render(request, "backend/404.html", {})