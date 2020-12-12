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
    ]

    configs = Config.objects.filter(name__in=conf_names).values_list('name', 'value')

    conf_geoserver = {
        name: value
        for name, value in configs
    }

    return conf_geoserver


def getHeader():

    conf_geoserver =get_connection_conf()

    AUTH = requests.auth.HTTPBasicAuth(
        conf_geoserver['geoserver_user'],
        conf_geoserver['geoserver_pass'],
    )

    BASE_URL = 'http://{host}:{port}/geoserver/rest/'.format(
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

def create_layer(workspace_name, datastore_name, layer_name, layer_title, view_name, srs, attribute_name, some_attributes):
    BASE_URL, AUTH = getHeader()
    url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes'.format(workspace_name=workspace_name, datastore_name = datastore_name)
    attributes_hoho = []
    geom_type = ''
    for i in range(len(attribute_name)):
        if attribute_name[i]['data_type'][:4] == 'char' and attribute_name[i]['column_name'] != 'geo_id':
            attributes =  '''
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
        elif attribute_name[i]['data_type'][:4] == 'inte':
            attributes =  '''
                <attribute>
                    <name>{attribute_name}</name>
                    <nillable>true</nillable>
                    <binding>java.lang.Integer</binding>
                </attribute>
                '''.format(
                    attribute_name=attribute_name[i]['column_name']
                )
            attributes_hoho.insert(i, attributes)
        elif attribute_name[i]['data_type'][:4] == 'time':
            attributes =  '''
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
                attributes =  '''
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
                attributes =  '''
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
                attributes =  '''
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
                attributes =  '''
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
                attributes =  '''
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
                attributes =  '''
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
            <nativeBoundingBox>
                <minx>-775021.5</minx>
                <maxx>1652101.875</maxx>
                <miny>4597390.5</miny>
                <maxy>5800999.5</maxy>
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
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8') )

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

    wms_url = 'http://{host}:{port}/geoserver/{wms_name}/ows'.format(
        wms_name=wms_name,
        host=conf_geoserver['geoserver_host'],
        port=conf_geoserver['geoserver_port']
    )

    return wms_url
<<<<<<< HEAD


def get_legend_url(wms_id, layer_name):

    legend_url =  (
        'https://nsdi.gov.mn/back/wms/WMS/{wms_id}/?'
        'service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer={layer}'
    ).format(
        wms_id=wms_id,
        layer=layer_name,
    )
    return legend_url
=======
>>>>>>> e56ed4788f7c515f7536c6be11b7adc78c898b66
