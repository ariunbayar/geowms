from django.db import migrations, models
from django.db import connections
import requests
from main.geoserver import getHeader, HEADERS


def _update_layer(layer_name, url):
    BASE_URL, AUTH = getHeader()
    payload = '''
            <featureType>
            <name>{layer_name}</name>
            <nativeBoundingBox>
               <minx>87.5879287719727</minx>
                <maxx>119.325157165527</maxx>
                <miny>42.4366416931152</miny>
                <maxy>51.6822853088379</maxy>
            </nativeBoundingBox>
            <latLonBoundingBox>
                <minx>86.79183671813367</minx>
                <maxx>121.53460495691678</maxx>
                <miny>40.536698947344</miny>
                <maxy>52.35583356992716</maxy>
            </latLonBoundingBox>
        </featureType>
        '''.format(
                layer_name=layer_name,
            )
    requests.put(BASE_URL+url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8') )


def _get_detail_geoserver(url):

    BASE_URL, AUTH = getHeader()
    HEADERS = {
        'accept': 'application/json',
        'Content-type': 'application/json',
    }
    url = BASE_URL + url
    rsp = requests.get(url, headers=HEADERS, auth=AUTH)
    if rsp.status_code ==200:
        return rsp.json()


def update_geoserver_layer_crs(apps, schema_editor):
    url = 'workspaces'
    workspaces = _get_detail_geoserver(url)
    if workspaces and workspaces['workspaces']:
        for ws in workspaces['workspaces']['workspace']:
            if 'gp_' in ws['name']:
                data_store_url = url + '/' + ws['name'] + '/datastores'
                datastores = _get_detail_geoserver(data_store_url)
                if datastores and datastores['dataStores']:
                    for ds in datastores['dataStores']['dataStore']:
                        layer_url = data_store_url + '/' + str(ds['name']) + '/featuretypes'
                        featuretypes = _get_detail_geoserver(layer_url)
                        if featuretypes and featuretypes['featureTypes']:
                            for layer in featuretypes['featureTypes']['featureType']:
                                put_url = layer_url + '/' + layer['name']
                                _update_layer(layer['name'], put_url)



class Migration(migrations.Migration):

    dependencies = [
        ('backend_govorg', '0008_auto_20201208_1234'),
    ]

    operations = [
        migrations.RunPython(update_geoserver_layer_crs),
    ]
