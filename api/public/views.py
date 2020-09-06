import requests

from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET

from api.utils import filter_layers
from backend.bundle.models import Bundle
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role


def _get_user_roles(user):
    roles = {1}
    if user.is_authenticated:
        roles |= set(user.roles.all().values_list('id', flat=True))
    return roles


@require_GET
def proxy(request, bundle_id, wms_id):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    bundle = get_object_or_404(Bundle, pk=bundle_id)
    wms = get_object_or_404(WMS, pk=wms_id)

    if wms.is_active:

        queryargs = request.GET
        headers = {**BASE_HEADERS}
        rsp = requests.get(wms.url, queryargs, headers=headers)
        content = rsp.content

        user_roles = _get_user_roles(request.user)
        wms_layers = wms.wmslayer_set.filter(
                bundlelayer__bundle=bundle,
                bundlelayer__role_id__in=user_roles,
            )
        allowed_layers = set([layer.code for layer in wms_layers])
        if request.GET.get('REQUEST') == 'GetCapabilities':
            content = filter_layers(content, allowed_layers)

        content_type = rsp.headers.get('content-type')

        return HttpResponse(rsp.content, content_type=content_type)

    else:

        raise Http404
