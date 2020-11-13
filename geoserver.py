import requests



def getWorkspace(BASE_URL, AUTH, space_name):
    url = 'workspaces/{space_name}'.format(space_name=space_name)

    HEADERS = {
        'Content-type': 'text/xml'
        }
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp

def getDataStore(BASE_URL, AUTH, space_name, store_name):
    url = 'workspaces/{space_name}/datastores/{store_name}'.format(space_name=space_name, store_name=store_name)

    HEADERS = {
        'Content-type': 'text/xml'
        }
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)

    return rsp

def getDataStoreLayer(BASE_URL, AUTH, space_name, store_name, layer_name):
    url = 'workspaces/{space_name}/datastores/{store_name}/featuretypes/{layer_name}'.format(space_name=space_name, store_name=store_name, layer_name=layer_name)

    HEADERS = {
        'Content-type': 'text/xml'
        }
    rsp = requests.get(BASE_URL + url, headers=HEADERS, auth=AUTH)

    return rsp

def deleteWorkSpace(BASE_URL, AUTH, space_name):
    

    url = 'workspaces/{space_name}?recurse=true'.format(space_name=space_name)

    HEADERS = {
        'Content-type': 'text/xml'
        }


    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def deleteLayerName(BASE_URL, AUTH, space_name, store_name, layer_name):
    

    url = 'workspaces/{space_name}/datastores/{store_name}/featuretypes/{layer_name}?recurse=true'.format(space_name=space_name, store_name=store_name, layer_name=layer_name)

    HEADERS = {
        'Content-type': 'text/xml'
        }


    rsp = requests.delete(BASE_URL + url, headers=HEADERS, auth=AUTH)
    return rsp


def create_space(BASE_URL, AUTH, space_name):
    url = 'workspaces'
    payload = '''<workspace><name>{thema_name}</name></workspace> '''.format(thema_name=space_name)

    HEADERS = {
        'Content-type': 'text/xml'}
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp


def create_store(BASE_URL, AUTH, space_name, ds_name, ds_desc, host, db, password):

    url = 'workspaces/{space_name}/datastores'.format(space_name=space_name)
    

    payload = '''
        <dataStore>
            <name>{ds_name}</name>
            <description>{ds_desc}</description>
            <type>PostGIS</type>
            <enabled>true</enabled>
            <connectionParameters>
            <entry key="host">{host}</entry>
            <entry key="port">5432</entry>
            <entry key="database"> {db}</entry>
            <entry key="schema">public</entry>
            <entry key="user">postgres</entry>
            <entry key="passwd"> {password} </entry>
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
    print(BASE_URL, url)
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp

def create_layer(BASE_URL, AUTH, space_name, store_name, layer_name, layer_title, view_name, srs, attribute_name, binding):
    url = 'workspaces/{space_name}/datastores/{store_name}/featuretypes'.format(space_name=space_name, store_name = store_name)
    attributes_hoho = []
    for i in range(len(attribute_name)):
            attributes =  '''

                <attribute>
                    <name>{attribute_name}</name>
                        <nillable>true</nillable>
                        <binding>{binding}</binding>
                </attribute>

                '''.format(
                    attribute_name=attribute_name[i],
                    binding=binding[i]
                )
            attributes_hoho.insert(i, attributes)

    payload = '''
            <featureType>
            <name>{layer_name}</name>
            <nativeName>{view_name}</nativeName>
            <title>{layer_title}</title>
            <srs>{srs}</srs>
            <nativeBoundingBox>
                <minx>-775021.5</minx>
                <maxx>1652101.875</maxx>
                <miny>4597390.5</miny>
                <maxy>5800999.5</maxy>
                <crs>{srs}</crs>
            </nativeBoundingBox>
            <latLonBoundingBox>
                <minx>86.79183671813367</minx>
                <maxx>121.53460495691678</maxx>
                <miny>40.536698947344</miny>
                <maxy>52.35583356992716</maxy>
                <crs>{srs}</crs>
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
    

    HEADERS = {
        'Content-type': 'application/xml',
    }
    print(BASE_URL, url)
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp


    # import requests
    # BASE_URL = 'http://localhost:8080/geoserver/rest/'
        
    # AUTH =requests.auth.HTTPBasicAuth('admin', 'geoserver')
    # ws_name='acme'
    # ds_name='acme_store04'
    # layer_name='deegi_layer05'
    # layer_title='deegi_layer05'
    # view_name='administrative_unit_view'
    # srs='EPSG:32648'
    # attribute_name = ['geo_data', 'feature_id']
    # binding=['org.locationtech.jts.geom.Polygon','java.lang.String']
    # code =create_layer(BASE_URL, AUTH, ws_name, ds_name, layer_name, layer_title, view_name, srs, attribute_name, binding)


    # print(code.text, code.status_code)
