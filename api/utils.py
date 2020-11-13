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


# import requests


# # # file_store = open(settings.MEDIA_ROOT + '/layer.xml', 'r')
# BASE_URL = 'http://localhost:8080/geoserver/'

# url = 'rest/workspaces/acme/datastores/acme_store04/featuretypes'

# payload = '''
#     <featureType>
#     <name>deegi_layer</name>
#     <nativeName>administrative_unit_view</nativeName>
#     <title>deegi_layer</title>
#     <srs>EPSG:32648</srs>
#     <nativeBoundingBox>
#         <minx>-775021.5</minx>
#         <maxx>1652101.875</maxx>
#         <miny>4597390.5</miny>
#         <maxy>5800999.5</maxy>
#         <crs>EPSG:32648</crs>
#     </nativeBoundingBox>
#     <latLonBoundingBox>
#         <minx>86.79183671813367</minx>
#         <maxx>121.53460495691678</maxx>
#         <miny>40.536698947344</miny>
#         <maxy>52.35583356992716</maxy>
#         <crs>EPSG:32648</crs>
#     </latLonBoundingBox>
#     <attributes>
#         <attribute>
#             <name>feature_id</name>
#                 <nillable>true</nillable>
#                 <binding>java.lang.Integer</binding>
#         </attribute>
#         <attribute>
#             <name>geo_data</name>
#                 <nillable>true</nillable>
#                 <binding>org.locationtech.jts.geom.Polygon</binding>
#         </attribute>
#     </attributes>
# </featureType>
#         '''

# HEADERS = {
#         'Content-type': 'text/xml',
#         'Accept':'text/xml'
#         }


# AUTH = requests.auth.HTTPBasicAuth('admin', 'geoserver')
# rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)

# print(rsp.text)
# print(rsp.status_code)

# attribute_name = ['geo_data', 'feature_id']
# binding=['org.locationtech.jts.geom.Polygon','java.lang.String']
# attributes = []
# for i in range(len(attribute_name)):
#         attributes.append( '''

#             <attribute>
#                 <name>{attribute_name}</name>
#                     <nillable>true</nillable>
#                     <binding>{binding}</binding>
#             </attribute>

#             '''.format(
#                 attribute_name=attribute_name[i],
#                 binding=binding[i]
#             )
#             )
# print(attributes) 