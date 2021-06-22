from frontend.page.views import service
import re
from xml.etree import ElementTree


re_layer = re.compile(r'^(.*?<Layer[^>]*>)(.*)(</Layer>.*)$', re.S)
re_layer_wfs = re.compile(r'^(.*?<FeatureTypeList[^>]*>)(.*)(</FeatureTypeList>.*)$', re.S)

def filter_layers(content, allowed_layers):
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

    matches = re_layer.findall(content)

    for content_start, content_mid, content_end in matches:

        content_mid_clean = re.sub('<Layer[^>]*>.*?</Layer>', '', content_mid.strip(), flags=re.S)

        layer_matches = re.compile(r'(<Layer[^>]*>.*?</Layer>)', re.S).findall(content_mid)

        for layer_raw in layer_matches:
            layer_root = ElementTree.fromstring(layer_raw)
            layer_name = _el(layer_root, 'Name')
            for allowed_layer in allowed_layers:
                if allowed_layer in layer_name.text:
                    content_mid_clean += '\n' + layer_raw

        content = '{}\n{}\n{}'.format(
                content_start.strip(),
                content_mid_clean.strip(),
                content_end.strip(),
            )

    return content.encode()


def filter_layers_wfs(content, allowed_layers):
    if isinstance(content, bytes):
        content = content.decode()

    matches = re_layer_wfs.findall(content)
    for content_start, content_mid, content_end in matches:
        content_mid_clean = re.sub('<FeatureType[^>]*>.*?</FeatureType>', '', content_mid.strip(), flags=re.S)
        layer_matches = re.compile(r'(<FeatureType[^>]*>.*?</FeatureType>)', re.S).findall(content_mid)

        for layer_raw in layer_matches:
            for allowed_layer in allowed_layers:
                if allowed_layer in layer_raw:
                    content_mid_clean += '\n' + layer_raw

        content = '{}\n{}\n{}'.format(
                content_start.strip(),
                content_mid_clean.strip(),
                content_end.strip(),
            )

    return content.encode()


def replace_src_url(content, old_url, new_url, service_type):

    if isinstance(content, bytes):
        content = content.decode()
    if service_type:
        service_type=service_type.lower()
        if '192.168.10.15' in old_url or 'geo.nsdi.gov.mn' in old_url:
            if service_type == 'wms':
                service_type = 'ows'
            datas = old_url.split('/')
            host = datas[2]
            if '8080' in host:
                host = host.split(':')[0]

            if len(datas) > 4:
                old_url = 'https://{host}/{ws_name}/{service_type}'.format(
                    service_type=service_type,
                    ws_name=datas[-2],
                    host=host
                )
            else:
                old_url = 'https://{host}/{service_type}'.format(
                    service_type=service_type,
                    host=host
                )

    content = content.replace(old_url, new_url)
    return content.encode()
