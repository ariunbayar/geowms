# Generated by Django 3.0.7 on 2021-06-08 12:15

from django.db import migrations
from django.db import connections
from main import geoserver
import requests


def _get_f_code(feature_code):
    splited = feature_code.split("-")
    feature_code = splited[len(splited) - 1]
    return feature_code


def _get_to_view_name(feature, view_name):
    split_str = '_view'
    feature_code = _get_f_code(feature.feature_code)
    feature_name = view_name.split(split_str)[0]
    to_view_name = feature_name + "_" + feature_code + split_str
    return to_view_name


def _rename_geoserver_layer_name(feature, apps, to_view_name, view_name):
    LPackages = apps.get_model('backend_inspire', 'LPackages')
    LThemes = apps.get_model('backend_inspire', 'LThemes')
    BASE_URL, AUTH = geoserver.getHeader()
    HEADERS = geoserver.HEADERS

    layer_name = 'gp_layer_' + view_name

    pack = LPackages.objects.filter(package_id=feature.package_id).first()
    theme = LThemes.objects.filter(theme_id=pack.theme_id).first()

    to_layer_name = 'gp_layer_' + to_view_name

    payload = '''
        <featureType>
            <name>{to_layer_name}</name>
            <nativeName>{to_view_name}</nativeName>
        </featureType>
    '''.format(to_view_name=to_view_name, to_layer_name=to_layer_name)

    wk_name = 'gp_' + theme.theme_code

    url = 'workspaces/{workspace_name}/datastores/{datastore_name}/featuretypes/{layer_name}'.format(workspace_name=wk_name, datastore_name=wk_name, layer_name=layer_name)
    rsp = requests.put(BASE_URL + url, headers=HEADERS, auth=AUTH, data=payload.encode('utf-8'))
    return rsp


def _rename_views(apps, schema_editor):
    ViewNames = apps.get_model('dedsanbutets', 'ViewNames')
    LFeatures = apps.get_model('backend_inspire', 'LFeatures')
    WMSLayer = apps.get_model('backend_wmslayer', 'WMSLayer')
    views = ViewNames.objects.all()
    for view in views:
        feature_id = view.feature_id
        view_name = view.view_name
        feature = LFeatures.objects.filter(feature_id=feature_id).first()

        to_view_name = _get_to_view_name(feature, view_name)

        sql = """
            ALTER MATERIALIZED VIEW IF EXISTS
                {view_name}
            RENAME to
                {to_view_name};
        """.format(view_name=view_name, to_view_name=to_view_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
        gp_layer = 'gp_layer_' + view_name
        WMSLayer.objects.filter(code=gp_layer).update(
            code='gp_layer_' + to_view_name
        )
        _rename_geoserver_layer_name(feature, apps, to_view_name, view_name)
        view.view_name = to_view_name
        view.save()


class Migration(migrations.Migration):

    dependencies = [
        ('dedsanbutets', '0003_featureoverlaps'),
    ]

    operations = [
        migrations.RunPython(_rename_views),
    ]
