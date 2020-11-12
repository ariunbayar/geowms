import re
from xml.etree import ElementTree


re_layer = re.compile(r'^(.*?<Layer[^>]*>)(.*)(</Layer>.*)$', re.S)


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
            if layer_name.text in allowed_layers:
                content_mid_clean += '\n' + layer_raw

        content = '{}\n{}\n{}'.format(
                content_start.strip(),
                content_mid_clean.strip(),
                content_end.strip(),
            )

    return content.encode()


def replace_src_url(content, old_url, new_url):
    if isinstance(content, bytes):
        content = content.decode()
    content = content.replace(old_url, new_url)
    return content.encode()


import requests


#file_store = open(settings.MEDIA_ROOT + '/layer.xml', 'r')
BASE_URL = 'http://localhost:8080/geoserver/'

url = 'rest/workspaces/acme/datastores/acme_store04/featuretypes'

payload = '''
    <featureType>
    <name>deegi_layer04</name>
    <nativeName>geoserver_view</nativeName>
    <title>deegi_layer03</title>
    <srs>EPSG:2908</srs>
    <nativeBoundingBox>
        <minx>983797.5</minx>
        <maxx>991899.0625</maxx>
        <miny>207443</miny>
        <maxy>218850.828125</maxy>
        <crs>EPSG:2908</crs>
    </nativeBoundingBox>
    <latLonBoundingBox>
        <minx>-74.00163357035443</minx>
        <maxx>40.73605641629197</maxx>
        <miny>-73.97238611861502</miny>
        <maxy>40.76737131396996</maxy>
        <crs>EPSG:2908</crs>
    </latLonBoundingBox>
    <attributes>
        <attribute>
            <name>the_geom</name>
                <nillable>true</nillable>
            <binding>org.locationtech.jts.geom.MultiPolygon</binding>
        </attribute>
    </attributes>
</featureType>
        '''

HEADERS = {
        'Content-type': 'text/xml',
        'Accept':'text/xml'
        }


AUTH = requests.auth.HTTPBasicAuth('admin', 'geoserver')
rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)

print(rsp.status_code)