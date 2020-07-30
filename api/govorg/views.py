import re
from xml.etree import ElementTree
import requests

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_GET

from backend.govorg.models import GovOrg
from backend.wms.models import WMS


def _filter_layers(content, allowed_layers):

    if isinstance(content, bytes):
        content = content.decode()

    def _el(root, tag_name, get_all=False):
        items = [
                el for el in root
                if el.tag.lower().endswith(tag_name.lower())
            ]
        if get_all:
            return items
        else:
            if len(items):
                return items[0]

    matches = re.compile(r'^(.*?<Layer[^>]*>)(.*)(</Layer>.*)$', re.S).findall(content)

    for content_start, content_mid, content_end in matches:

        content_mid_clean = re.sub('<Layer[^>]*>.*?</Layer>', '', content_mid.strip(), flags=re.S)

        layer_matches = re.compile(r'(<Layer[^>]*>.*?</Layer>)', re.S).findall(content_mid)

        for layer_raw in layer_matches:
            layer_root = ElementTree.fromstring(layer_raw)
            layer_name = _el(layer_root, 'Name')
            if layer_name.text in allowed_layers:
                content_mid_clean += '\n' + layer_raw

        content = '{}\n{}\n{}'.format(
                content_start.strip(),
                content_mid_clean.strip(),
                content_end.strip(),
            )

    return content.encode()


@require_GET
def proxy(request, token, pk):

    BASE_HEADERS = {
        'User-Agent': 'geo 1.0',
    }

    govorg = get_object_or_404(GovOrg, token=token)
    wms = get_object_or_404(WMS, pk=pk)
    base_url = wms.url
    is_active = wms.is_active
    if is_active:
        queryargs = request.GET
        headers = {**BASE_HEADERS}
        rsp = requests.get(base_url, queryargs, headers=headers)

        content = rsp.content

        allowed_layers = [layer.code for layer in govorg.wms_layers.filter(wms=wms)]

        if request.GET.get('REQUEST') == 'GetCapabilities':

            content = _filter_layers(content, allowed_layers)

        content_type = rsp.headers.get('content-type')

        return HttpResponse(content, content_type=content_type)
    else:
        return render(request, "backend/404.html", {})
