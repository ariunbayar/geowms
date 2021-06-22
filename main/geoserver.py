import requests
from backend.config.models import Config
from django.conf import settings


HEADERS = {
    'Content-type': 'application/xml',
}


def get_connection_conf():

    conf_names = [
        'geoserver_host',
        'geoserver_port',
        'geoserver_user',
        'geoserver_pass',
        'geoserver_db_host',
        'geoserver_protocol'
    ]

    configs = Config.objects.filter(name__in=conf_names).values_list('name', 'value')

    conf_geoserver = {
        name: value
        for name, value in configs
    }

    return conf_geoserver


def getCacheHeader():

    conf_geoserver = get_connection_conf()

    AUTH = requests.auth.HTTPBasicAuth(
        conf_geoserver['geoserver_user'],
        conf_geoserver['geoserver_pass'],
    )
    if not conf_geoserver['geoserver_host'] == '192.168.10.15':
        BASE_URL = 'http://{host}:{port}/geoserver/gwc/rest/'.format(
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port'],
        )
    else:
        BASE_URL = 'http://{host}:{port}/gwc/rest/'.format(
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port'],
        )

    return BASE_URL, AUTH


def getHeader():
    BASE_URL = ''
    AUTH = ''
    conf_geoserver = get_connection_conf()
    if conf_geoserver['geoserver_user'] and conf_geoserver['geoserver_pass']:
        AUTH = requests.auth.HTTPBasicAuth(
            conf_geoserver['geoserver_user'],
            conf_geoserver['geoserver_pass'],
        )
    if conf_geoserver['geoserver_host'] and conf_geoserver['geoserver_port']:
        if not conf_geoserver['geoserver_host'] == '192.168.10.15':
            BASE_URL = 'http://{host}:{port}/geoserver/rest/'.format(
                host=conf_geoserver['geoserver_host'],
                port=conf_geoserver['geoserver_port'],
            )
        else:
            BASE_URL = 'http://{host}:{port}/rest/'.format(
                host=conf_geoserver['geoserver_host'],
                port=conf_geoserver['geoserver_port'],
            )

    return BASE_URL, AUTH


def getWorkspace(workspace_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}'.format(workspace_name=workspace_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def getDataStore(workspace_name, datastore_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}/datastores/{datastore_name}'.format(workspace_name=workspace_name, datastore_name=datastore_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def getDataStoreLayer(workspace_name, datastore_name, layer_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes/{layer_name}'.format(workspace_name=workspace_name, datastore_name=datastore_name, layer_name=layer_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def deleteWorkSpace(workspace_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}?recurse=true'.format(workspace_name=workspace_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def deleteLayerName(workspace_name, datastore_name, layer_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes/{layer_name}?recurse=true'.format(workspace_name=workspace_name, datastore_name=datastore_name, layer_name=layer_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def create_space(workspace_name):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces'
    payload = '<workspace><name>{thema_name}</name></workspace>'.format(thema_name=workspace_name)
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp


def create_store(workspace_name, ds_name, ds_desc):

    db_host = get_connection_conf()['geoserver_db_host']
    db = settings.DATABASES['default']['NAME']
    port = settings.DATABASES['default']['PORT']
    user = settings.DATABASES['default']['USER']
    password = settings.DATABASES['default']['PASSWORD']

    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{workspace_name}/datastores'''.format(workspace_name=workspace_name)
    payload = '''
        <dataStore>
            <name>{ds_name}</name>
            <description>{ds_desc}</description>
            <type>PostGIS</type>
            <enabled>true</enabled>
            <connectionParameters>
                <entry key="host">{db_host}</entry>
                <entry key="port">{port}</entry>
                <entry key="database">{db}</entry>
                <entry key="schema">public</entry>
                <entry key="user">{user}</entry>
                <entry key="passwd">{password}</entry>
                <entry key="dbtype">postgis</entry>
                <entry key="validate connections">true</entry>
                <entry key="Connection timeout">20</entry>
                <entry key="min connections">1</entry>
                <entry key="max connections">10</entry>
                <entry key="Loose bbox">true</entry>
                <entry key="fetch size">1000</entry>
                <entry key="Max open prepared statements">50</entry>
                <entry key="Estimated extends">true</entry>
            </connectionParameters>
            <__default>false</__default>
        </dataStore>
        '''.format(
            ds_name=ds_name,
            ds_desc=ds_desc,
            db_host=db_host,
            port=port,
            db=db,
            password=password,
            user=user
        )
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp


def create_layer(workspace_name, datastore_name, layer_name, layer_title, view_name, srs, attribute_name, some_attributes, layer_state):
    BASE_URL, AUTH = getHeader()
    attributes_hoho = []
    geom_type = ''
    for i in range(len(attribute_name)):
        if attribute_name[i]['data_type'][:4] == 'char' and attribute_name[i]['column_name'] != 'geo_id':
            attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <length>500</length>
                    <binding>java.lang.String</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'doub':
            attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>java.lang.Double</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'inte':
            attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>java.lang.Integer</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'text':
            attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>java.lang.String</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'time':
            attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>java.util.Date</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'geom':
            if some_attributes:
                geom_type = some_attributes[0]['st_geometrytype'][3:]
            if geom_type == 'Point':
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.Point</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)
            elif geom_type == 'LineString':
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.LineString</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)
            elif geom_type == 'Polygon':
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.Polygon</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)
            elif geom_type == 'MultiPoint':
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.MultiPoint</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)
            elif geom_type == 'MultiLineString':
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.MultiLineString</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)
            else:
                attributes = '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>org.locationtech.jts.geom.MultiPolygon</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
                attributes_hoho.insert(i, attributes)

    payload = '''
            <featureType>
            <name>{layer_name}</name>
            <nativeName>{view_name}</nativeName>
            <title>{layer_title}</title>
            <srs>EPSG:{srs}</srs>
            <projectionPolicy>NONE</projectionPolicy>
            <nativeBoundingBox>
                <minx>87.5879287719727</minx>
                <maxx>119.325157165527</maxx>
                <miny>42.4366416931152</miny>
                <maxy>51.6822853088379</maxy>
                <crs>EPSG:{srs}</crs>
            </nativeBoundingBox>
            <latLonBoundingBox>
                <minx>86.79183671813367</minx>
                <maxx>121.53460495691678</maxx>
                <miny>40.536698947344</miny>
                <maxy>52.35583356992716</maxy>
                <crs>EPSG:{srs}</crs>
            </latLonBoundingBox>
            <attributes>
            {attributes}
            </attributes>
        </featureType>
        '''.format(
                layer_name=layer_name,
                view_name=view_name,
                layer_title=layer_title,
                srs=srs,
                attributes=''.join(attributes_hoho),
            )
    if layer_state:
        url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes/{layer_name}'.format(workspace_name=workspace_name, datastore_name=datastore_name, layer_name=layer_name)
        rsp = requests.put(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8'))
    else:
        url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes'.format(workspace_name=workspace_name, datastore_name=datastore_name)
        rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8'))

    return rsp


def get_version():

    BASE_URL, AUTH = getHeader()

    url = BASE_URL + 'about/version.json'
    rsp = requests.get(url, auth=AUTH)

    try:
        assert rsp.status_code == 200
        resources = {
            res['@name']: res
            for res in rsp.json()['about']['resource']
        }
    except Exception:
        resources = {}

    version_info = {
        'version': '',
        'build_timestamp': '',
        'git_revision': '',
    }
    if 'GeoServer' in resources:
        resource = resources['GeoServer']
        version_info['version'] = resource['Version']
        version_info['build_timestamp'] = resource['Build-Timestamp']
        version_info['git_revision'] = resource['Git-Revision']

    return version_info


def get_wms_url(wms_name):

    conf_geoserver = get_connection_conf()
    if conf_geoserver['geoserver_host'] == '192.168.10.15':
        wms_url = 'http://{host}:{port}/{wms_name}/ows'.format(
            wms_name=wms_name,
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port']
        )
    else:
        wms_url = 'http://{host}:{port}/geoserver/{wms_name}/ows'.format(
            wms_name=wms_name,
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port']
        )
    return wms_url


def get_wmts_url(wms_name):

    conf_geoserver = get_connection_conf()
    if conf_geoserver['geoserver_host'] == '192.168.10.15':
        wmts_url = 'http://{host}:{port}/{wms_name}/gwc/service/wmts'.format(
            wms_name=wms_name,
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port']
        )

    else:
        wmts_url = 'http://{host}:{port}/geoserver/{wms_name}/gwc/service/wmts'.format(
            wms_name=wms_name,
            host=conf_geoserver['geoserver_host'],
            port=conf_geoserver['geoserver_port']
        )

    return wmts_url


def get_styles():

    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'styles'
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    styles = rsp.json()
    return styles.get('styles').get('style')


def get_layer_style(layer_name):
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'layers/{layer_name}'.format(layer_name=layer_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    if rsp.status_code == 200:
        features = rsp.json()
        return features.get('layer').get('defaultStyle').get('name')


def check_geoserver_style(style_name):
    BASE_URL, AUTH = getHeader()
    url = 'styles/' + style_name + '.sld'
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def update_layer_style(layer_name, style_name):
    BASE_URL, AUTH = getHeader()
    url = 'layers/' + layer_name
    payload = '''
                <layer>
                <defaultStyle><name>{style_name}</name></defaultStyle>
                </layer>
            '''.format(style_name=style_name)
    rsp = requests.put(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8'))
    return rsp


def create_style(values, style_name, style_title, style_abstract, old_style_name):
    BASE_URL, AUTH = getHeader()

    def _get_style_content(values):
        geom_type = values.get('shape_type')
        rule_name = values.get('rule_name')
        min_range = values.get('min_range')
        max_range = values.get('max_range')
        min_range_content = ''
        max_range_content = ''
        if min_range:
            min_range_content = '''
                <MinScaleDenominator>{min_range}</MinScaleDenominator>
            '''.format(min_range=float(min_range))

        if max_range:
            max_range_content = '''
                <MaxScaleDenominator>{max_range}</MaxScaleDenominator>
            '''.format(max_range=float(max_range))

        fill_content = '''
            <Fill>
                <CssParameter name="fill">{fill_color}</CssParameter>
                <CssParameter name="fill-opacity">{fill_opacity}</CssParameter>
            </Fill>
        '''.format(
            fill_color=values.get('fill_color'),
            fill_opacity=values.get('color_opacity'),
        )

        stroke_content = '''
            <Stroke>
                <CssParameter name="stroke">{stroke_color}</CssParameter>
                <CssParameter name="stroke-width">{stroke_width}</CssParameter>
                <CssParameter name="stroke-dasharray">{dashed_line_length} {dashed_line_gap}</CssParameter>
            </Stroke>
        '''.format(
            stroke_color=values.get('style_color'),
            stroke_width=values.get('style_size'),
            dashed_line_length=values.get('dashed_line_length'),
            dashed_line_gap=values.get('dashed_line_gap')
        )

        if geom_type == 'PointSymbolizer':
            shape_content = '''
                            <{geom_type}>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>{wellknownname}</WellKnownName>
                                        {fill_content}
                                        {stroke_content}
                                    </Mark>
                                </Graphic>
                            </{geom_type}>
                '''.format(
                    geom_type=geom_type,
                    wellknownname=values.get('wellknownname'),
                    fill_content=fill_content,
                    stroke_content=stroke_content
                )
        else:
            shape_content = '''
                <{geom_type}>
                    {fill_content}
                    {stroke_content}
                </{geom_type}>
            '''.format(
                geom_type=geom_type,
                fill_content=fill_content,
                stroke_content=stroke_content
            )

        style_content = '''
                <Rule>
                    <Name>{name}</Name>
                    {min_range_content}
                    {max_range_content}
                    {shape_content}
                </Rule>
            '''.format(
                name=rule_name,
                shape_content=shape_content,
                min_range_content=min_range_content,
                max_range_content=max_range_content
            )
        return style_content

    s_rules = []
    payload = ''
    if values:
        if isinstance(values, str):
            values = values.replace(old_style_name, style_name)
            payload = values
        else:
            if isinstance(values, list):
                if len(values) > 0:
                    for i in range(len(values)):
                        datas = values[i]
                        rule = _get_style_content(datas)
                        s_rules.insert(i, rule)
                    style_content = ''.join(s_rules)
            else:
                style_content = _get_style_content(values)

            payload = """
                <StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
                    xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/.../StyledLayerDescriptor.xsd">
                    <NamedLayer>
                        <Name>{style_name}</Name>
                        <UserStyle>
                            <Name>{style_name}</Name>
                            <Title>{style_title}</Title>
                            <Abstract>{style_abstract}</Abstract>
                            <FeatureTypeStyle>
                                    {style_content}
                            </FeatureTypeStyle>
                        </UserStyle>
                    </NamedLayer>
                </StyledLayerDescriptor>
            """.format(
                style_name=style_name,
                style_title=style_title,
                style_abstract=style_abstract,
                style_content=style_content
            )
    url = 'styles'
    headers = {'Content-type': 'application/vnd.ogc.sld+xml'}
    rsp = requests.post(BASE_URL + url, headers=headers, auth=AUTH, data=payload.encode('utf-8'))
    return rsp


def create_tilelayers_cache(ws_name, layer_name, srs, image_format, zoom_start, zoom_stop, cache_type, number_of_cache):
    layer_name = layer_name
    if ws_name:
        layer_name = ws_name + ':' + layer_name
    payload = '''
        <seedRequest>
            <name>{layer_name}</name>
            <srs>
                <gridSetName>{srs}</gridSetName>
            </srs>
            <zoomStart>{zoom_start}</zoomStart>
            <zoomStop>{zoom_stop}</zoomStop>
            <format>image/{image_format}</format>
            <type>{type}</type>
            <threadCount>{number_of_cache}</threadCount>
        </seedRequest>
    '''.format(
        layer_name=layer_name,
        zoom_start=zoom_start,
        zoom_stop=zoom_stop,
        image_format=image_format,
        type=cache_type,
        number_of_cache=number_of_cache,
        srs=srs
    )

    BASE_URL, AUTH = getCacheHeader()

    headers = {'Content-type': 'text/xml'}
    url = BASE_URL + 'seed/' + '{layer_name}.xml'.format(layer_name=layer_name)
    rsp = requests.post(url, headers=headers, auth=AUTH, data=payload.encode('utf-8'))
    return rsp


def get_layer_groups():
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'layergroups'
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    if rsp.status_code == 200:
        features = rsp.json()
        if features.get('layerGroups'):
            return features.get('layerGroups').get('layerGroup')


def get_layer_group_detail(group_name):
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'layergroups' + '/' + group_name
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    if rsp.status_code == 200:
        features = rsp.json()
        return features.get('layerGroup')


def delete_layer_group(group_name):
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'layergroups/{group_name}?recurse=true'.format(group_name=group_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def create_layer_group(group_values, group_name, group_layers):
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'text/xml'
    }
    g_layers = []
    g_styles = []
    for i in range(len(group_layers)):
        style = '''
            <style>{style_name}</style>
            '''.format(
                style_name=group_layers[i]['style_name']
            )
        layer = '''
            <layer>{layer_name}</layer>
            '''.format(
                layer_name=group_layers[i]['layer_name']
            )
        g_layers.insert(i, layer)
        g_styles.insert(i, style)

    payload = '''
        <layerGroup>
            <name>{name}</name>
            <title>{title}</title>
            <abstractTxt>{abstract}</abstractTxt>
            <layers>
                {layers}
            </layers>
            <styles>
                {styles}
            </styles>
        </layerGroup>
    '''.format(
        name=group_name,
        title=group_values.get('title'),
        abstract=group_values.get('abstract') or '',
        layers=''.join(g_layers),
        styles=''.join(g_styles)
    )
    url = 'layergroups/'
    rsp = requests.post(BASE_URL+url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8'))
    return rsp


def get_layers():

    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'layers'
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    if rsp.status_code == 200:
        features = rsp.json()
        return features.get('layers').get('layer')
    return rsp


def delete_style(style_name):
    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'styles/{style_name}?recurse=true'.format(style_name=style_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def get_detail_geoserver(url):

    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'accept': 'application/json',
        'Content-type': 'application/json',
    }

    url = BASE_URL + url
    featuretypes = requests.get(url, headers=HEADERS, auth=AUTH)
    if featuretypes.status_code == 200:
        return featuretypes.json()



def get_ws_datastore(ws_url, ws_name):

    data_store_url = ws_url + '/' + ws_name + '/datastores'
    datastores = _get_detail_geoserver(data_store_url)
    if datastores and datastores['dataStores']:
        return datastores['dataStores']['dataStore']


def _get_ws_layers_in_wms(ws_name, ws_url):

    ws_detial = []
    datastores = get_ws_datastore(ws_url, ws_name)
    if datastores:
        for ds in datastores:
            layer_url = ws_url + '/' + ws_name + '/datastores' + '/' + str(ds['name']) + '/featuretypes'
            featuretypes = _get_detail_geoserver(layer_url)
            if featuretypes and featuretypes['featureTypes']:
                for layer in featuretypes['featureTypes']['featureType']:
                    ws_detial.append(layer['name'])
    return ws_detial


def get_ws_list():

    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'Content-type': 'application/json',
    }
    url = 'workspaces'
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    if rsp.status_code == 200:
        features = rsp.json()
        return features.get('workspaces').get('workspace')
    return rsp


def _get_detail_geoserver(url):

    BASE_URL, AUTH = getHeader()
    if BASE_URL and AUTH:
        HEADERS = {
            'accept': 'application/json',
            'Content-type': 'application/json',
        }
        url = BASE_URL + url
        rsp = requests.get(url, headers=HEADERS, auth=AUTH)
        if rsp.status_code ==200:
            return rsp.json()
