import os
import datetime
import uuid
import glob
import requests
from django.db import connections
from django.db.utils import InternalError
from django.forms.models import model_to_dict
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse, Http404

from .models import ViewNames, ViewProperties
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBoundary, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists, MGeoDatas, MDatasBuilding

from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required

from django.core.management import call_command
from django.core.files.uploadedfile import UploadedFile
from django.core.files.storage import FileSystemStorage

from django.contrib.gis.geos import Polygon, MultiPolygon, MultiPoint, MultiLineString
from django.contrib.gis.geos import WKBWriter, WKBReader
from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import fromstr
from django.contrib.gis.gdal import OGRGeometry
from django.contrib.gis.geos.error import GEOSException
from django.contrib.gis.gdal.error import GDALException
from django.contrib.gis.geos.collections import GeometryCollection
from django.contrib.auth.decorators import user_passes_test
from backend.bundle.models import Bundle
from geoportal_app.models import User
from backend.config.models import Config

from backend.bundle.models import BundleLayer, Bundle
from backend.wmslayer.models import WMSLayer
from backend.wms.models import WMS
from geoportal_app.models import User
from main.utils import (
    dict_fetchall,
    slugifyWord
)
import main.geoserver as geoserver

# Create your views here.
def _get_features(package_id):
    feature_data = []
    for feature in LFeatures.objects.filter(package_id=package_id):
        feature_data.append({
                'id': feature.feature_id,
                'code': feature.feature_code,
                'name': feature.feature_name,
                'view':[ViewNames.objects.filter(feature_id=feature.feature_id).values('id', 'view_name', 'feature_id').first()][0]
            })
    return feature_data


def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': _get_features(package.package_id)
            })
    return package_data


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all(): 
        bundle = Bundle.objects.filter(ltheme_id=themes.theme_id)
        if bundle:
            data.append({
                    'id': themes.theme_id,
                    'code': themes.theme_code,
                    'name': themes.theme_name,
                    'package': _get_package(themes.theme_id),
                })
        else:
            themes.delete()
    rsp = {
        'success': True,
        'data': data,
    }
    return JsonResponse(rsp)


def _lfeatureconfig(feature_id):
    feature_configs_name = []
    datatypes = []
    f_configs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    for f_config in f_configs:
        data_type_id = f_config.data_type_id
        connect_feature_id = f_config.connect_feature_id
        if data_type_id is not None:
            feature_configs_name.append({
                'data_type_id': data_type_id,
                'feature_config_id': f_config.feature_config_id,
                'feature_id': f_config.feature_id,
                'data_type_display_name': f_config.data_type_display_name,
                'data_types': _datatypes(data_type_id)
            })
        else:
            connect_features = LFeatureConfigs.objects.filter(feature_id=connect_feature_id)
            for connect_feature in connect_features:
                connected_feature_id = connect_feature.connect_feature_id
                fc_data_type_id = connect_feature.data_type_id
                if fc_data_type_id is not None:
                    datatypes = _datatypes(fc_data_type_id)
                if connect_feature.feature_id == connect_feature_id:
                    if connected_feature_id is None:
                        feature_configs_name.append({
                            'data_type_id': fc_data_type_id,
                            'feature_config_id': connect_feature.feature_config_id,
                            'feature_id': connect_feature.feature_id,
                            'data_type_display_name': connect_feature.data_type_display_name,
                            'data_types': datatypes
                        })
        if data_type_id is None and connect_feature_id is None:
            feature_configs_name.append({
                'data_type_id': data_type_id,
                'feature_config_id': f_config.feature_config_id,
                'feature_id': f_config.feature_id,
                'data_type_display_name': f_config.data_type_display_name,
                'data_types': _datatypes(data_type_id)
            })
    return feature_configs_name


def _datatypes(data_type_id):
    data_type_names = []
    data_types = LDataTypes.objects.filter(data_type_id=data_type_id)
    for data_type in data_types:
        if data_type:
            data_type_names.append({
                'data_type_id': data_type.data_type_id,
                'data_type_name': data_type.data_type_name,
                'data_type_code': data_type.data_type_code,
                'data_type_definition': data_type.data_type_definition,
                'is_active': data_type.is_active,
                'is_read_only': data_type.is_read_only,
                'data_type_configs': _data_type_configs(data_type.data_type_id)
            })
    return data_type_names


def _data_type_configs(data_type_id):
    property_names = []
    data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id)
    if data_type_configs:
        for data_type_config in data_type_configs:
            property_id = data_type_config.property_id
            properties = LProperties.objects.filter(property_id=property_id)
            if properties:
                for prop in properties:
                    property_names.append({
                        'data_type_config_id': data_type_config.data_type_config_id,
                        'data_type_id': data_type_config.data_type_id,
                        'property_id': property_id,
                        'property_code': prop.property_code,
                        'property_name': prop.property_name,
                        'property_definition': prop.property_definition,
                        'value_type_id': prop.value_type_id,
                        'value_types': _value_types(prop.value_type_id, property_id),
                        'is_read_only': prop.is_read_only,
                    })
    return property_names


def _value_types(value_type_id, property_id):
    value_type_names = []
    codelists = []
    value_types = LValueTypes.objects.filter(value_type_id=value_type_id)
    if value_types:
        for value_type in value_types:
            if value_type.value_type_id == 'single-select':
                codelists = _code_list(property_id)
            value_type_names.append({
                'value_type_id': value_type.value_type_id,
                'value_type_name': value_type.value_type_name,
                'code_lists': codelists,
            })
    return value_type_names


def _code_list(property_id):
    code_list_values = []
    code_list_configs = LCodeListConfigs.objects.filter(property_id=property_id)
    if code_list_configs:
        for code_list_config in code_list_configs:
            property_id = code_list_config.property_id
            to_property_id = code_list_config.to_property_id
            if property_id == to_property_id:
                to_property_id += 1
            x_range = range(property_id, to_property_id)
            for property_id_up in x_range:
                code_lists = LCodeLists.objects.filter(property_id=property_id_up)
                if code_lists:
                    for code_list in code_lists:
                        code_list_values.append({
                            'code_list_id': code_list.code_list_id,
                            'property_id': code_list.property_id,
                            'code_list_code': code_list.code_list_code,
                            'code_list_name': code_list.code_list_name,
                            'code_list_definition': code_list.code_list_definition,
                        })
    return code_list_values


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Property(request, code):
    feature_lists = []
    features = LFeatures.objects.filter(feature_code=code)
    for feature in features:
        feature_lists.append({
            'feature_id': feature.feature_id,
            'feature_code': feature.feature_code,
            'feature_name': feature.feature_name,
            'f_configs' : _lfeatureconfig(feature.feature_id)
        })
    if len(feature_lists) > 0:
        check = 'байгаа'
    else:
        check = 'байхгүй'
    rsp = {
        'success': True,
        'feature_lists': feature_lists,
        'check': check,
    }
    return JsonResponse(rsp)



@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Edit_name(request, payload):
    id = payload.get('id')
    property_name = payload.get('name')
    try:
        properties = LProperties.objects.filter(property_id=id)
        properties.update(
            property_name=property_name
        )
        rsp = {
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        }
    except Exception:
        sp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def getFields(request, payload):
    model_name = payload.get('name')
    savename = payload.get('name')
    id = payload.get('id')
    edit_name = payload.get('edit_name')
    try:
        model_name = getModel(model_name)
        fields = []
        for i in model_name._meta.get_fields():
            name = i.name
            type_name = i.get_internal_type()
            if not i.name == 'created_on' and not i.name == 'created_by' and not i.name == 'modified_on' and not i.name == 'modified_by' and not type_name == 'AutoField' and i.name != 'bundle':
                if type_name == "CharField":
                    type_name = 'text'
                if type_name == "IntegerField" or type_name == "BigIntegerField":
                    type_name = 'number'
                if type_name == "BooleanField":
                    type_name = 'radio'
                if edit_name == '':
                    if 'id' in i.name and not 'connect' in i.name:
                        if '_' in savename:
                            if savename == 'data_type_config' and i.name == 'data_type_id':
                                fields.append({
                                    'field_name': i.name,
                                    'field_type': type_name,
                                    'data': id
                                })
                            else:
                                out = savename.split('_')
                                if not str(out[0]) in i.name:
                                    fields.append({
                                        'field_name': i.name,
                                        'field_type': type_name,
                                        'data': id
                                    })
                                else:
                                    fields.append({
                                        'field_name': i.name,
                                        'field_type': type_name,
                                        'data': ''
                                    })
                        else:
                            fields.append({
                                'field_name': i.name,
                                'field_type': type_name,
                                'data': id
                            })         
                    else:
                        fields.append({
                            'field_name': i.name,
                            'field_type': type_name,
                            'data': ''
                        })
                if edit_name != '':
                    if savename == 'theme' and i.name == 'bundle':
                        pass
                    else:
                        datas = model_name.objects.filter(pk=id)
                        for data in datas:
                            data_obj = model_to_dict(data)
                            dat = data_obj[i.name]
                            if dat == True and not 1:
                                dat = 'true'
                            if dat == False and not 0:
                                dat = 'false'
                            else:
                                dat = dat
                            fields.append({
                                'field_name': i.name,
                                'field_type': type_name,
                                'data': dat if dat else ""
                            })
        rsp = {
            'success': True,
            'fields': fields
        }
    except Exception as e:
        rsp = {
            'success': False,
            'fields': 'Алдаа гарсан байна' + str(e)
        }
    return JsonResponse(rsp)


def get_rows(fid):
    cursor = connections['default'].cursor()
    sql = """
        select datas.property_id, l.property_code
        from l_properties l
        inner join (select l_feature_configs.feature_id, l_feature_configs.data_type_id,l_data_type_configs.property_id
        from l_feature_configs
        inner join l_data_type_configs on l_data_type_configs.data_type_id = l_feature_configs.data_type_id
        where l_feature_configs.feature_id = {fid}
        ) datas
        on datas.property_id = l.property_id
    """.format(
        fid=fid
    )
    cursor.execute(sql)
    rows = dict_fetchall(cursor)
    rows = list(rows)
    return rows


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFields(request, fid):
    fields = get_rows(fid)
    view_name = ViewNames.objects.filter(feature_id=fid).first()
    if not view_name == None:
        id_list = [data.property_id for data in ViewProperties.objects.filter(view=view_name)]
        rsp = {
            'success': True,
            'fields': fields,
            'id_list': id_list,
            'view_name': view_name.view_name
        }
    else:
        rsp = {
            'success': True,
            'fields': fields,
            'id_list': [],
            'view_name': ''
        }
    return JsonResponse(rsp)


def _get_model_name(name):

    if name == 'hg':
        return 'm_datas_hydrography'
    elif name == 'au':
        return 'm_datas_boundary'
    elif name =='bu':
        return 'm_datas_building'
    elif name=='gn':
        return 'm_datas_geographical'
    elif name=='cp':
        return 'm_datas_cadastral'


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFieldsSave(request, payload):
    id_list = payload.get('fields')
    fid = payload.get('fid')
    tid = payload.get('tid')
    user = User.objects.filter(username=request.user).first()
    if not id_list:
        rsp = {
            'success': False,
            'info': 'Утга сонгоно уу.'
        }
        return JsonResponse(rsp)
    theme = LThemes.objects.filter(theme_id=tid).first()
    if not theme:
        rsp = {
            'success': False,
            'info': 'Тухайн хүснэгтийн мэдээлэл алга байна.'
        }
        return JsonResponse(rsp)

    feature = LFeatures.objects.filter(feature_id=fid).first()

    if not feature:
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
        return JsonResponse(rsp)

    check_name = ViewNames.objects.filter(feature_id=fid).first()
    model_name = _get_model_name(theme.theme_code)
    if not theme:
        rsp = {
            'success': False,
            'info': 'Тухайн хүснэгт алга байна.'
        }
        return JsonResponse(rsp)

    feature = LFeatures.objects.filter(feature_id=fid).first()

    if check_name:
        table_name = check_name.view_name
        removeView(table_name)
        ViewProperties.objects.filter(view=check_name).delete()
        check_name.delete()

    table_name = slugifyWord(feature.feature_name_eng) + '_view'
    check = createView(id_list, table_name, model_name)
    if check:
        rsp = _create_geoserver_detail(table_name, model_name, theme, user.id)
        if rsp['success']:
            new_view = ViewNames.objects.create(view_name=table_name, feature_id=fid)
            for idx in id_list:
                ViewProperties.objects.create(view=new_view, property_id=idx)

    else:
        rsp = {
            'success': False,
            'info': 'Амжилтгүй хадгаллаа view үүсхэд алдаа гарлаа.'
        }
    return JsonResponse(rsp)


def getModel(model_name):
    if model_name == 'theme':
        model_name = LThemes
    if model_name == 'package':
        model_name = LPackages
    if model_name == 'feature':
        model_name = LFeatures
    if model_name == 'property':
        model_name = LProperties
    if model_name == 'feature_config':
        model_name = LFeatureConfigs
    if model_name == 'data_type_config':
        model_name = LDataTypeConfigs
    if model_name == 'code_list_config':
        model_name = LCodeListConfigs
    if model_name == 'data_type':
        model_name = LDataTypes
    if model_name == 'value_type':
        model_name = LValueTypes
    if model_name == 'code_list':
        model_name = LCodeLists
    return model_name


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save(request, payload):
    model_name = payload.get("model_name")
    model_id = payload.get("model_id")
    edit_name = payload.get("edit_name")
    json = payload.get("form_values")
    model_name_old = model_name
    model_name = getModel(model_name)
    json = json['form_values']
    fields = []
    for i in model_name._meta.get_fields():
        type_name = i.get_internal_type()
        if not i.name == 'created_on' and not i.name == 'created_by' and not i.name == 'modified_on' and not i.name == 'modified_by' and not type_name == 'AutoField':
            if type_name == "CharField":
                type_name = 'text'
            if type_name == "IntegerField" or type_name == "BigIntegerField":
                type_name = 'number'
            if type_name == "BooleanField":
                type_name = 'radio'
            fields.append(i.name)

    check = True
    datas = {}
    for data in json:
        if data['field_name'] in fields:
            if not data['data']:
               data['data'] = None
            if data['field_type'] == 'radio':
                if data['data'] == 'true':
                    datas[data['field_name']] = True
                else:
                    datas[data['field_name']] = False
            # if data['field_type'] == 'order_no':
            #     order_no = len(model_name.objects.all()) + 1
            #     datas[data['field_name']] = order_no
            else:
                datas[data['field_name']] = data['data']
        else:
            check = False
    if check:
        if edit_name == '':
            datas['created_by'] = request.user.id
            datas['modified_by'] = request.user.id
            if model_name_old == 'theme':

                theme_code = datas['theme_code']
                theme_name = datas['theme_name']
                theme_name_eng = datas['theme_name_eng']
                top_theme_id = datas['top_theme_id']
                order_no = datas['order_no']
                is_active = datas['is_active']
                modified_by = datas['modified_by']
                created_by = datas['created_by']
                cb_bundle = User.objects.filter(id=created_by).first()

                last_order_n = Bundle.objects.all().order_by('sort_order').last().sort_order
                order_no = order_no if order_no else last_order_n+1
                is_active = is_active if is_active else False
                theme_model = model_name.objects.create(
                                    theme_code=theme_code,
                                    theme_name=theme_name,
                                    theme_name_eng=theme_name_eng,
                                    top_theme_id=top_theme_id,
                                    order_no=order_no,
                                    is_active=is_active,
                                    created_by=created_by,
                                    modified_by=modified_by,
                                )

                Bundle.objects.create(
                    is_removeable=is_active,
                    created_by=cb_bundle,
                    sort_order=order_no,
                    ltheme=theme_model,
                )
            else:
                sain = model_name.objects.create(**datas)
        else:
            datas['modified_by'] = request.user.id
            sain = model_name.objects.filter(pk=model_id).update(**datas)
        rsp = {
            'success': True,
            'info': 'Амжилттай'
        }
    else:
        rsp = {
            'success': True,
            'info': 'Алдаа гарлаа'
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Get_Datas(request, name):
    types = []
    model_name = getModel(name)
    datas = model_name.objects.all()
    if name == 'data_type':
        for data in datas:
            types.append({
                'id': data.data_type_id,
                'name': data.data_type_name,
            })
    if name == 'value_type':
        for data in datas:
            types.append({
                'id': data.value_type_id,
                'name': data.value_type_name,
            })
    if name == 'property':
        for data in datas:
            types.append({
                'id': data.property_id,
                'name': data.property_name,
            })
    if name == 'feature':
        for data in datas:
            types.append({
                'id': data.feature_id,
                'name': data.feature_name,
            })
    rsp = {
        'success': True,
        'datas': types
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove(request, payload):
    model_name = payload.get('model_name')
    model_id = payload.get('model_id')
    model_name = getModel(model_name)
    try:
        data = model_name.objects.filter(pk=model_id)
        if data:
            data.delete()
            rsp = {
                'success': True,
                'info': 'Амжилттай устгалаа'
            }
        else:
            rsp = {
                'success': False,
                'info': 'Хоосон байна'
            }
    except Exception as e:
        rsp = {
            'success': False,
            'info': 'Алдаа гарсан байна: ' + str(e)
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def erese(request, payload):
    model_name = payload.get('model_name')
    top_id = payload.get('top_id')
    model_id = payload.get('model_id')
    if model_name == 'property':
        field_name = 'property_id'
        model_name = 'data_type_config'
    if model_name == 'data_type':
        field_name = 'data_type_id'
        model_name = 'feature_config'
    model_name = getModel(model_name)
    try:
        savename = payload.get('model_name')
        updateData = {}
        data = model_name.objects.filter(pk=top_id)
        for i in model_name._meta.get_fields():
            if str(field_name) == str(i.name):
                updateData[field_name] = None
        if updateData != {}:
            data.update(**updateData)
            rsp = {
                'success': True,
                'info': 'Амжилттай устгалаа'
            }
        else:
            rsp = {
                'success': False,
                'info': 'Хоосон байна'
            }
    except Exception as e:
        rsp = {
            'success': False,
            'info': 'Алдаа гарсан байна: ' + str(e)
        }
    return JsonResponse(rsp)

def get_colName_type(view_name, data):
    cursor = connections['default'].cursor()
    query_index = '''
        select
            ST_GeometryType(geo_data),
            Find_SRID('public', '{view_name}', '{data}'),
            ST_Extent(geo_data)
        from
            {view_name} group by geo_data limit 1
            '''.format(
                view_name=view_name,
                data=data
                )

    sql = '''
        SELECT
        attname AS column_name, format_type(atttypid, atttypmod) AS data_type
        FROM
        pg_attribute
        WHERE
        attrelid = 'public.{view_name}'::regclass AND    attnum > 0
        ORDER  BY attnum
        '''.format(view_name=view_name)

    cursor.execute(sql)
    geom_att = dict_fetchall(cursor)
    geom_att = list(geom_att)
    cursor.execute(query_index)
    some_attributes = dict_fetchall(cursor)
    some_attributes = list(some_attributes)

    return geom_att, some_attributes


def _create_geoserver_detail(table_name, model_name, theme, user_id):
    
    theme_code = theme.theme_code
    ws_name = 'gp_'+theme_code
    ds_name = ws_name
    wms_url = geoserver.get_wms_url(ws_name)

    check_workspace = geoserver.getWorkspace(ws_name)
    theme_name = theme.theme_name
    wms = WMS.objects.filter(name=theme_name).first()
    if not wms:
        wms = WMS.objects.create(
                name=theme_name,
                url = wms_url,
                created_by_id=user_id
            )
    if check_workspace.status_code == 404:

        geoserver.create_space(ws_name)
        check_ds_name = geoserver.getDataStore(ws_name, ds_name)
        if check_ds_name.status_code == 404:
            create_ds = geoserver.create_store(
                ws_name,
                ds_name,
                ds_name,
                )
            if create_ds.status_code == 201:

                layer_name = 'gp_layer_' + table_name

                check_layer = geoserver.getDataStoreLayer(
                    ws_name,
                    ds_name,
                    layer_name
                )

                geom_att, extends = get_colName_type(table_name, 'geo_data')
                if extends:
                    srs = extends[0]['find_srid']
                else:
                    srs = 4326
                layer_check = geoserver.getDataStoreLayer(ws_name, ds_name, layer_name)
                if layer_check.status_code == 404:

                    layer_create = geoserver.create_layer(
                                        ws_name,
                                        ds_name,
                                        layer_name,
                                        layer_name,
                                        table_name,
                                        srs,
                                        geom_att,
                                        extends
                                    )

                else:
                    update_layer = geoserver.deleteLayerName(ws_name, ds_name, layer_name)
                    if update_layer.status_code == 200:
                        geom_att, extends = get_colName_type(table_name, 'geo_data')

                        if extends:
                            srs = extends[0]['find_srid']
                        else:
                            srs = 4326

                        layer_create = geoserver.create_layer(
                                        ws_name,
                                        ds_name,
                                        layer_name,
                                        layer_name,
                                        table_name,
                                        srs,
                                        geom_att,
                                        extends
                                    )
                        if layer_create.status_code == 500:
                            return {
                                "success": False,
                                'info': 'layer_create'
                            }

                    else:
                        return {"success": False, 'info': 'layer_remove'}

    else:
        check_ds_name = geoserver.getDataStore(ws_name, ds_name)
        if check_ds_name.status_code == 404:
            create_ds = geoserver.create_store(
                ws_name,
                ds_name,
                ds_name,
                )
            if create_ds.status_code == 201:

                layer_name = 'gp_layer_' + table_name

                check_layer = geoserver.getDataStoreLayer(
                    ws_name,
                    ds_name,
                    layer_name
                )

                geom_att, extends = get_colName_type(table_name, 'geo_data')

                if extends:
                    srs = extends[0]['find_srid']
                else:
                    srs = 4326

                layer_check = geoserver.getDataStoreLayer(ws_name, ds_name, layer_name)
                if layer_check.status_code == 404:

                    layer_create = geoserver.create_layer(
                                        ws_name,
                                        ds_name,
                                        layer_name,
                                        layer_name,
                                        table_name,
                                        srs,
                                        geom_att,
                                        extends
                                    )

                else:
                    update_layer = geoserver.deleteLayerName(ws_name, ds_name, layer_name)
                    if update_layer.status_code == 200:
                        geom_att, extends = get_colName_type(table_name, 'geo_data')
                        srs = extends[0]['find_srid']
                        layer_create = geoserver.create_layer(
                                        ws_name,
                                        ds_name,
                                        layer_name,
                                        layer_name,
                                        table_name,
                                        srs,
                                        geom_att,
                                        extends
                                    )
                        if layer_create.status_code == 500:
                            return {
                                "success": False,
                                'info': 'layer_create'
                            }

                    else:
                        return {"success": False, 'info': 'layer_remove'}

        else:
            layer_name = 'gp_layer_' + table_name

            geom_att, extends = get_colName_type(table_name, 'geo_data')
            if extends:
                srs = extends[0]['find_srid']
            else:
                srs = 4326
            layer_check = geoserver.getDataStoreLayer(ws_name, ds_name, layer_name)
            if layer_check.status_code == 404:

                layer_create = geoserver.create_layer(
                                    ws_name,
                                    ds_name,
                                    layer_name,
                                    layer_name,
                                    table_name,
                                    srs,
                                    geom_att,
                                    extends
                                )
            else:
                update_layer = geoserver.deleteLayerName(ws_name, ds_name, layer_name)
                if update_layer.status_code == 200:
                    geom_att, extends = get_colName_type(table_name, 'geo_data')

                    if extends:
                        srs = extends[0]['find_srid']
                    else:
                        srs = 4326
                    layer_create = geoserver.create_layer(
                                    ws_name,
                                    ds_name,
                                    layer_name,
                                    layer_name,
                                    table_name,
                                    srs,
                                    geom_att,
                                    extends
                                )
                    if layer_create.status_code == 500:
                        return {
                            "success": False,
                            'info': 'layer_create'
                        }

                else:
                    return {'info': 'layer_remove'}

        wms_id = wms.id
        wms_layer = wms.wmslayer_set.filter(code=layer_name).first()
        if not wms_layer:
            legend_url = geoserver.get_legend_url(wms_id, layer_name)
            wms_layer = WMSLayer.objects.create(
                            name=layer_name,
                            code=layer_name,
                            wms=wms,
                            title=layer_name,
                            feature_price=0,
                            legend_url=legend_url
                        )

        bundle_layer = BundleLayer.objects.filter(layer_id=wms_layer.id).first()
        bundle_id = theme.bundle.id
        if not  bundle_layer:
            BundleLayer.objects.create( 
                bundle_id=bundle_id,
                layer_id=wms_layer.id
            )

    return {'success': True, 'info': 'Амжилттай үүсгэлээ'}

def createView(ids, table_name, model_name):
    data = LProperties.objects.filter(property_id__in=ids)
    removeView(table_name)
    fields = [row.property_code for row in data]

    try:
        query = '''
            CREATE MATERIALIZED VIEW public.{table_name}
                AS
            SELECT d.geo_id, d.geo_data, {columns}, d.feature_id, d.created_on, d.created_by, d.modified_on, d.modified_by
            FROM crosstab('select b.geo_id, b.property_id, b.value_text from {model_name} b where property_id in ({properties}) order by 1,2'::text)
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text
        '''.format(
                table_name = table_name,
                model_name = model_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in ids]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]))
        query_index = ''' CREATE UNIQUE INDEX {table_name}_index ON {table_name}(geo_id) '''.format(table_name=table_name)

        with connections['default'].cursor() as cursor:
                cursor.execute(query)
                cursor.execute(query_index)
        return True
    
    except Exception:
        return False



def removeView(table_name):
    try:
        query = '''
            DROP MATERIALIZED VIEW IF EXISTS {table_name};
        '''.format(table_name = table_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(query)
        return True
    except Exception:
        return False
