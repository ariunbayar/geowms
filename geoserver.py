import requests


BASE_URL = 'http://localhost:8080/geoserver/rest/'
AUTH = requests.auth.HTTPBasicAuth('admin', 'geoserver')


def create_space(BASE_URL, space_name, AUTH):
    url = 'workspaces'
    payload = '''<workspace><name>{thema_name}</name></workspace> '''.format(thema_name=space_name)

    HEADERS = {
        'Content-type': 'text/xml'}
    AUTH = requests.auth.HTTPBasicAuth('admin', 'geoserver')
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp

def create_store(BASE_URL, AUTH):

    url = 'workspaces/acme_ex/datastores'
    

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
            ds_name='asme_store', 
            ds_desc='asme store example',
            host='localhost',
            db='geo',
            password='Aguero16'
        )

    HEADERS = {
        'Content-type': 'text/xml'
    
    }
    print(BASE_URL, url)
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp

def create_layer(BASE_URL, AUTH):
    url = 'workspaces/ubspace/datastores/ub_store/featuretypes'
    
    payload = '''
        <featureType>
            <name>ub_layer1</name>
            <nativeName>administrative_unit_view</nativeName>
            <title>ub_layer1</title>
            <srs>EPSG:32648</srs>
            <nativeBoundingBox>
                <minx>-775021.5</minx>
                <maxx>-1652101.875</maxx>
                <miny>4597390.5</miny>
                <maxy>5800999.5</maxy>
                <crs>EPSG:32648</crs>
            </nativeBoundingBox>
            <latLonBoundingBox>
                <minx>86.79183671813367</minx>
                <maxx>121.53460495691678</maxx>
                <miny>40.536698947344</miny>
                <maxy>52.35583356992716</maxy>
                <crs>EPSG:32648</crs>
            </latLonBoundingBox>
            <attributes>
                <attribute>
                    <name>geo_data</name>
                     <nillable>false</nillable>
                    <binding>org.locationtech.jts.geom.LineString</binding>
                </attribute>
                <attribute>
                    <name>geo_id</name>
                     <nillable>false</nillable>
                    <binding>java.lang.String</binding>
                </attribute>
            </attributes>
        </featureType>

        '''

    # payload = '''
    #   <featureType>
    #     <name>{layer_name}</name>
    #     <nativeName>{view_name}</nativeName>
    #     <title>{layer_title}</title>
    #     <srs>EPSG:32648</srs>
    #     <nativeBoundingBox>
    #         <minx>-775,021.5</minx>
    #         <maxx>-1,652,101.875</maxx>
    #         <miny>4,597,390.5</miny>
    #         <maxy>5,800,999.5</maxy>
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
    #             <name>{geom}</name>
    #             <binding>org.locationtech.jts.geom.{shape}</binding>
    #         </attribute>
    #         <attribute>
    #             <name>{feature_id}</name>
    #             <binding>java.lang.{p1_type}</binding>
    #         </attribute>
    #         <attribute>
    #             <name>{geom_id}</name>
    #             <binding>java.lang.{p2_type}</binding>
    #         </attribute>
    #     </attributes>
    # </featureType>

    #     '''.format(
    #         layer_name='ub_layer1', 
    #         view_name='administrative_unit_view',
    #         layer_title='layer_veiw_1',
    #         geom='geo_data',
    #         shape='LineString',
    #         feature_id='feature_id',
    #         p1_type='String',
    #         geom_id='geo_id',
    #         p2_type='String'
    #     )
    print(payload)
    HEADERS = {
        'Content-type': 'application/xml',
    }
    print(BASE_URL, url)
    rsp = requests.post(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload)
    return rsp
    


code = create_store(BASE_URL, AUTH)
print(code.status_code)