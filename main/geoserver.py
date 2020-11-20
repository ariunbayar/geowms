import requests
from backend.config.models import Config

HEADERS = {
    'Content-type': 'application/xml',
}
AUTH = requests.auth.HTTPBasicAuth('admin', 'geoserver')

def getHeader():
    config = Config.objects.filter(name__in = ['geoserver_host', 'geoserver_port', 'geoserver_user', 'geoserver_pass']).values('name','value')
    for con in config:
        if con['name'] == 'geoserver_host':
            host = con['value']
        if con['name'] == 'geoserver_port':
            port = con['value']
        if con['name'] == 'geoserver_user':
            admin = con['value']
        if con['name'] == 'geoserver_pass':
            geoserver = con['value']
    AUTH = requests.auth.HTTPBasicAuth(admin, geoserver)
    BASE_URL = 'http://{host}:{port}/geoserver/rest/'.format(host=host, port=port)
    return BASE_URL, AUTH

def getWorkspace(space_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}'''.format(space_name=space_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp

def getDataStore(space_name, store_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}/datastores/{store_name}'''.format(space_name=space_name, store_name=store_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp

def getDataStoreLayer(space_name, store_name, layer_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}/datastores/{store_name}/featuretypes/{layer_name}'''.format(space_name=space_name, store_name=store_name, layer_name=layer_name)
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp

def deleteWorkSpace(space_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}?recurse=true'''.format(space_name=space_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def deleteLayerName(space_name, store_name, layer_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}/datastores/{store_name}/featuretypes/{layer_name}?recurse=true'''.format(space_name=space_name, store_name=store_name, layer_name=layer_name)
    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def create_space(space_name):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces'''
    payload = '''<workspace><name>{thema_name}</name></workspace> '''.format(thema_name=space_name)
    HEADERS = {
        'Content-type': 'text/xml'}
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp


def create_store(space_name, ds_name, ds_desc, host, db, password):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}/datastores'''.format(space_name=space_name)
    payload = '''
        <dataStore>
            <name>{ds_name}</name>
            <description>{ds_desc}</description>
            <type>PostGIS</type>
            <enabled>true</enabled>
            <connectionParameters>
            <entry key="host">{host}</entry>
            <entry key="port">5432</entry>
            <entry key="database">{db}</entry>
            <entry key="schema">public</entry>
            <entry key="user">postgres</entry>
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
            host=host,
            db=db,
            password=password
        )
    HEADERS = {
        'Content-type': 'text/xml'
    }
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp

def create_layer(space_name, store_name, layer_name, layer_title, view_name, srs, attribute_name, some_attributes):
    BASE_URL, AUTH = getHeader()
    url = '''workspaces/{space_name}/datastores/{store_name}/featuretypes'''.format(space_name=space_name, store_name = store_name)
    attributes_hoho = []
    geom_type = ''
    for i in range(len(attribute_name)):
        if attribute_name[i]['column_name'] != 'geo_id':
            if attribute_name[i]['data_type'][:4] == 'char':
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
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp

def getGeoserverVersion():
    BASE_URL, AUTH = getHeader()
    url = BASE_URL + 'about/version.json'
    rsp = requests.get(url, auth=AUTH)
    return rsp