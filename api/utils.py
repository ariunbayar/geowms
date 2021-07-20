import re

from frontend.page.views import service

from xml.etree import ElementTree

from main import utils

from django.contrib.gis import geos


re_layer = re.compile(r'^(.*?<Layer[^>]*>)(.*)(</Layer>.*)$', re.S)
re_layer_wfs = re.compile(r'^(.*?<FeatureTypeList[^>]*>)(.*)(</FeatureTypeList>.*)$', re.S)
re_f_type = re.compile(r'^(.*?<xsd:sequence[^>]*>)(.*)(</xsd:sequence>.*)$', re.S)

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


def filter_layers_wfs(content, allowed_layers, access_attributes=[]):

    def _check_item_in_arr(arr, item):
        for i in arr:
            if i and i.lower() == item:
                return True
        return False

    def _get_content(content_start, content_mid, content_end):
        return '{}\n{}\n{}'.format(
                content_start.strip(),
                content_mid.strip(),
                content_end.strip(),
            )

    if isinstance(content, bytes):
        content = content.decode()

    descripe_type = re_f_type.findall(content)
    for content_start, content_mid, content_end in descripe_type:
        content_mid_for_xml = content_mid.replace('<xsd:', '<')
        atts = re.compile(r'(<element.*?/>)', re.S).findall(content_mid_for_xml)
        right_content_mid = ''
        for att in atts:
            att_root = ElementTree.fromstring(att)
            has_item = _check_item_in_arr(access_attributes, att_root.attrib['name'])
            if has_item:
                att = att.replace("<", "<xsd:")
                right_content_mid += '\n' + att

        content = _get_content(content_start, right_content_mid, content_end)

    matches = re_layer_wfs.findall(content)
    for content_start, content_mid, content_end in matches:
        content_mid_clean = re.sub('<FeatureType[^>]*>.*?</FeatureType>', '', content_mid.strip(), flags=re.S)
        layer_matches = re.compile(r'(<FeatureType[^>]*>.*?</FeatureType>)', re.S).findall(content_mid)

        for layer_raw in layer_matches:
            for allowed_layer in allowed_layers:
                if allowed_layer in layer_raw:
                    content_mid_clean += '\n' + layer_raw

        content = _get_content(content_start, content_mid_clean, content_end)

    return content.encode()


def replace_src_url(content, old_url, new_url, service_type):

    if isinstance(content, bytes):
        content = content.decode()
    if service_type:
        service_type = service_type.lower()

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
        elif 'ows' in old_url:
            old_url = old_url.replace('ows', service_type)

    content = content.replace(old_url, new_url)
    return content.encode()


def get_cql_filter(geo_id, srid=4326, cql_data=[]):
    if not cql_data and geo_id:
        cql_data = utils.get_2d_data(geo_id, srid=srid)
    cql_filter = 'WITHIN(geo_data, {cql_data})'.format(cql_data=cql_data)
    return cql_filter if cql_data else ''


# openlayer аас ирж байгаа scale аас radius бодох
def calc_radius(scale):
    scale = int(scale)
    radius = scale / 10000
    return radius


# point ийн coordiantes аас buffer radius тай хамт үүсгэж авах
def get_buffer_of_point(coordinates, radius):
    coordinates = [float(i) for i in coordinates]
    center = geos.Point(coordinates)
    buffer = center.buffer(radius)
    return buffer
