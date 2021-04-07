from django.db import connections
from django.forms.models import model_to_dict
from django.conf import settings
from django.shortcuts import render, reverse
from django.http import JsonResponse, Http404

from .models import ViewNames, ViewProperties, FeatureOverlaps
from backend.inspire.models import LThemes, LPackages, LFeatures, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists, MGeoDatas

from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required

from django.contrib.auth.decorators import user_passes_test
from geojson import FeatureCollection
from backend.bundle.models import Bundle
from backend.geoserver.models import WmtsCacheConfig

from backend.bundle.models import BundleLayer, Bundle
from backend.wmslayer.models import WMSLayer
from backend.wms.models import WMS
from geoportal_app.models import User
from main.utils import (
    dict_fetchall,
    slugifyWord,
    get_geoJson,
    check_gp_design,
    get_colName_type
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


def _check_gp_design():
    ws_name = 'gp_design'
    ds_name = ws_name
    table_name = 'geoserver_desing_view'
    design_space = geoserver.getWorkspace(ws_name)
    _create_design_view()
    if design_space.status_code == 404:
        geoserver.create_space(ws_name)

    check_ds_name = geoserver.getDataStore(ws_name, ds_name)
    if check_ds_name.status_code == 404:
        geoserver.create_store(
            ws_name,
            ds_name,
            ds_name,
        )

    layer_name = 'gp_layer_' + table_name
    check_layer = geoserver.getDataStoreLayer(
        ws_name,
        ds_name,
        layer_name
    )
    layer_title = layer_name
    geom_att, extends = get_colName_type(table_name, 'geo_data')
    if extends:
        srs = extends[0]['find_srid']
    else:
        srs = 4326

    if check_layer.status_code == 404:
        layer_create = geoserver.create_layer(
                        ws_name,
                        ds_name,
                        layer_name,
                        layer_title,
                        table_name,
                        srs,
                        geom_att,
                        extends,
                        False
        )


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    style_names = []
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

    check_design = check_gp_design()
    geoserver_style = geoserver.get_styles()
    for style in geoserver_style:
        style_names.append(style.get('name'))
    url = reverse('api:service:geo_design_proxy', args=['geoserver_desing_view'])
    rsp = {
        'success': True,
        'data': data,
        'style_names': style_names,
        'defualt_url': request.build_absolute_uri(url),
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
                'data_type_name_eng': data_type.data_type_name_eng,
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
            properties = properties.exclude(value_type_id='data-type')
            properties = properties.exclude(property_code='localId')
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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFields(request, fid):
    view_name = ViewNames.objects.filter(feature_id=fid).first()
    geom = MGeoDatas.objects.filter(feature_id=fid).first()
    cache_values = []
    wmts = WmtsCacheConfig.objects.filter(feature_id=fid).first()
    if wmts:
        cache_values.append({
            'image_format': wmts.img_format,
            'zoom_start': wmts.zoom_start,
            'zoom_stop': wmts.zoom_stop,
            'cache_type': wmts.type_of_operation,
            'number_of_cache': wmts.number_of_tasks_to_use,
        })
    if not view_name == None:
        id_list = [data.property_id for data in ViewProperties.objects.filter(view=view_name)]
        url = reverse('api:service:geo_design_proxy', args=[view_name.view_name])
        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': id_list,
            'view_name': view_name.view_name,
            'url': request.build_absolute_uri(url),
            'style_name': geoserver.get_layer_style('gp_layer_'+view_name.view_name),
            'geom_type': geom.geo_data.geom_type if  geom else '',
            'cache_values': cache_values
        }

    else:
        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': [],
            'view_name': '',
            'geom_type': geom.geo_data.geom_type if  geom else '',
            'cache_values': cache_values

        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFieldsSave(request, payload):
    id_list = payload.get('fields')
    fid = payload.get('fid')
    tid = payload.get('tid')
    values = payload.get('values')
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
    data_type_ids = [i['data_type_id'] for i in LFeatureConfigs.objects.filter(feature_id=fid).values("data_type_id") if i['data_type_id']]
    feature_config_id = [i['feature_config_id'] for i in LFeatureConfigs.objects.filter(feature_id=fid).values("feature_config_id") if i['feature_config_id']]
    check = _create_view(id_list, table_name, data_type_ids, feature_config_id, fid)
    if check:
        rsp = _create_geoserver_detail(table_name, theme, user.id, feature, values)
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



def _create_geoserver_layer_detail(check_layer, table_name, ws_name, ds_name, layer_name, feature, values, wms):

    geom_att, extends = get_colName_type(table_name, 'geo_data')
    if extends:
        srs = extends[0]['find_srid']
    else:
        srs = 4326

    style_name = values.get('style_name')
    style_state = values.get('style_state')
    tile_cache_check = values.get('tile_cache_check')
    cache_details = values.get('cache_values')
    geom_type = values.get('geom_type')
    layer_title = feature.feature_name

    if check_layer.status_code != 200:
        layer_create = geoserver.create_layer(
                            ws_name,
                            ds_name,
                            layer_name,
                            layer_title,
                            table_name,
                            srs,
                            geom_att,
                            extends,
                            False
        )

    else:
        layer_create = geoserver.create_layer(
                            ws_name,
                            ds_name,
                            layer_name,
                            layer_title,
                            table_name,
                            srs,
                            geom_att,
                            extends,
                            True
        )

    if layer_create.status_code == 201 or layer_create.status_code == 200:
        if geom_type:
            cache_values = values.get('cache_values')
            if style_state == 'create_style':
                style_name = values.get('style_name')
                if not style_name:
                    return {
                        'success': False,
                        'info': 'Style-ийн нэр хоосон байна'
                    }
                check_style_name = geoserver.check_geoserver_style(style_name)
                if check_style_name.status_code == 200:
                    return {
                        'success': False,
                        'info': 'Style-ийн нэр давхцаж байна'
                    }
                else:
                    geoserver.create_style(values)
            geoserver.update_layer_style(layer_name, style_name)
            if tile_cache_check:
                cache_type = cache_details.get('cache_type')
                zoom_stop = cache_details.get('zoom_stop')
                zoom_start = cache_details.get('zoom_start')
                image_format = cache_details.get('image_format')
                number_of_cache = cache_details.get('number_of_cache')
                if int(zoom_start) >21 or int(zoom_stop)>21 or int(number_of_cache)>100:
                    return {
                        'success': False,
                        'info': 'TileCache-ийн max утга хэтэрсэн байна'
                    }
                feature_id = feature.feature_id
                cache_layer = geoserver.create_tilelayers_cache(ws_name, layer_name, srs, image_format, zoom_start, zoom_stop, cache_type, number_of_cache)
                wmts_url = ''
                if cache_layer.status_code == 200:
                    cache_field = WmtsCacheConfig.objects.filter(feature_id=feature_id).first()
                    if cache_field:
                        WmtsCacheConfig.objects.filter(id=cache_field.id).update(
                            img_format=image_format,
                            zoom_start=zoom_start,
                            zoom_stop=zoom_stop,
                            type_of_operation=cache_type,
                            number_of_tasks_to_use=number_of_cache
                        )
                    else:
                        WmtsCacheConfig.objects.create(
                            feature_id=feature_id,
                            img_format=image_format,
                            zoom_start=zoom_start,
                            zoom_stop=zoom_stop,
                            type_of_operation=cache_type,
                            number_of_tasks_to_use=number_of_cache
                        )

                    wmts_url = geoserver.get_wmts_url(ws_name)
                    wms.cache_url = wmts_url
                    wms.save()

        return {"success": True, 'info': 'Амжилттай үүслээ'}
    else:
        return {"success": False, 'info': 'Давхарга үүсгэхэд алдаа гарлаа'}


def _create_geoserver_detail(table_name, theme, user_id, feature, values):
    layer_responce = []
    theme_code = theme.theme_code
    ws_name = 'gp_'+theme_code
    layer_name = 'gp_layer_' + table_name
    ds_name = ws_name
    layer_title = feature.feature_name
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
        data_store  = geoserver.create_store(
                        ws_name,
                        ds_name,
                        ds_name,
        )
        if  data_store.status_code != 201:

            return {
                'success': False,
                'info': 'DataStore үүсгэхэд алдаа гарлаа'
            }
    check_layer = geoserver.getDataStoreLayer(
        ws_name,
        ds_name,
        layer_name
    )
    layer_responce = _create_geoserver_layer_detail(check_layer, table_name, ws_name, ds_name, layer_name, feature, values, wms)
    wms_id = wms.id
    wms_layer = wms.wmslayer_set.filter(code=layer_name).first()
    if not wms_layer:
        wms_layer = WMSLayer.objects.create(
                        name=layer_title,
                        code=layer_name,
                        wms=wms,
                        title=layer_title,
                        feature_price=0,
                    )

    bundle_layer = BundleLayer.objects.filter(layer_id=wms_layer.id).first()
    bundle_id = theme.bundle.id
    if not  bundle_layer:
        BundleLayer.objects.create(
            bundle_id=bundle_id,
            layer_id=wms_layer.id
        )

    return layer_responce


def _create_view(ids, table_name, data_type_ids, feature_config_id, feature_id):
    ids.sort()
    data = LProperties.objects.filter(property_id__in=ids)
    removeView(table_name)
    fields = [row.property_code for row in data]
    try:
        query = '''
            CREATE MATERIALIZED VIEW public.{table_name}
                AS
            SELECT
                d.geo_id,
                d.geo_data,
                d.geo_id as inspire_id,
                d.geo_id as localid,
                {columns},
                d.feature_id,
                d.created_on,
                d.created_by,
                d.modified_on,
                d.modified_by
            FROM
                crosstab('
                    select
                        b.geo_id,
                        b.property_id,
                        COALESCE(
                            b.code_list_id::character varying(1000),
                            b.value_text::character varying(1000),
                            b.value_number::character varying(1000),
                            b.value_date::character varying(1000)
                        ) as value_text
                    from
                        public.m_datas b
                    inner join
                        m_geo_datas mg
                    on
                        mg.geo_id = b.geo_id
                    and
                        mg.feature_id = {feature_id}
                    where
                        property_id in ({properties})
                    and
                        data_type_id in ({data_type_ids})
                    and
                        feature_config_id in ({feature_config_id})
                    order by 1,2'::text
                )
            ct(geo_id character varying(100), {create_columns})
            JOIN m_geo_datas d ON ct.geo_id::text = d.geo_id::text
        '''.format(
                table_name = table_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in ids]),
                data_type_ids=', '.join(['{}'.format(f) for f in data_type_ids]),
                feature_config_id=', '.join(['{}'.format(f) for f in feature_config_id]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]),
                feature_id=feature_id,
            )
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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_style_data(request, payload):

    geom_type = payload.get('geom_type')
    if geom_type == 'PointSymbolizer':
        geom_type = 'Point'
    elif geom_type == 'PolygonSymbolizer':
        geom_type = 'Polygon'
    else:
        geom_type = 'LineString'
    heck_design = check_gp_design()
    cursor = connections['default'].cursor()
    sql = '''
            SELECT
                ST_AsGeoJSON(ST_Transform(geo_data,4326)) as geom
            FROM
                geoserver_desing_view
            where
                ST_GeometryType(geo_data) like '%{geom_type}%'
            limit 1000
            '''.format(geom_type=geom_type)

    cursor.execute(sql)
    some_attributes = dict_fetchall(cursor)
    some_attributes = list(some_attributes)
    features = []
    for i in some_attributes:
        data = get_geoJson(i.get('geom'))
        features.append(data)
    return JsonResponse({
        'data': FeatureCollection(features)
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def check_styles_name(request, payload):
    style_name = payload.get('style_name')
    success = False
    check_name = geoserver.check_geoserver_style(style_name)
    if check_name.status_code != 200:
        success = True
    return JsonResponse({
        'success': success,
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def feature_overlaps_set(request, payload):
    feature_id = payload.get('feature_id')
    overlap_feature_id = payload.get('overlap_feature_id')
    state = payload.get('state')
    qs = FeatureOverlaps.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.filter(overlap_feature_id=overlap_feature_id)
    if state == 'remove':
        qs.delete()
        rsp = {
            'success': True,
            'info': 'Амжилттай хаслаа'
        }

    else:
        qs = qs.first()
        if not qs:
            FeatureOverlaps.objects.create(
                feature_id=feature_id,
                overlap_feature_id=overlap_feature_id
            )
        rsp = {
            'success': True,
            'info': 'Амжилттай нэмлээ'
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def feature_overlaps_get(request, feature_id):
    qs = FeatureOverlaps.objects
    qs = qs.filter(feature_id=feature_id)
    qs = qs.values_list('overlap_feature_id', flat=True)
    feature_ids = [i for i in qs]
    rsp = {
        'success': True,
        'feature_ids': feature_ids
    }

    return JsonResponse(rsp)
