from django.db import connections
from django.forms.models import model_to_dict
from django.forms.utils import flatatt
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import user_passes_test
from django.urls import reverse
from django.shortcuts import get_object_or_404

from .models import ViewNames, ViewProperties, FeatureOverlaps
from backend.inspire.models import LThemes
from backend.inspire.models import LPackages
from backend.inspire.models import LFeatures
from backend.inspire.models import LDataTypeConfigs
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LDataTypes
from backend.inspire.models import LProperties
from backend.inspire.models import LValueTypes
from backend.inspire.models import LCodeListConfigs
from backend.inspire.models import LCodeLists
from backend.inspire.models import MGeoDatas
from backend.wms.models import WMS
from backend.wmslayer.models import WMSLayer
from backend.bundle.models import BundleLayer
from backend.bundle.models import Bundle
from geoportal_app.models import User
from backend.geoserver.models import WmtsCacheConfig

from main.decorators import ajax_required
import main.geoserver as geoserver
from main import utils


# Create your views here.
def _get_features(package_id):
    feature_data = []
    for feature in LFeatures.objects.filter(package_id=package_id):
        view_name = utils.make_view_name(feature)
        has_mat_view = utils.has_materialized_view(view_name)
        feature_data.append({
            'id': feature.feature_id,
            'code': feature.feature_code,
            'name': feature.feature_name,
            'view': { "view_name": view_name if has_mat_view else "" }
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

    utils.check_gp_design()
    geoserver_style = geoserver.get_styles()
    for style in geoserver_style:
        style_names.append(style.get('name'))

    url = reverse('api:service:geo_design_proxy', args=['geoserver_design_view'])
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
    feature = get_object_or_404(LFeatures, feature_id=fid)
    view_name = utils.make_view_name(feature)
    has_mat_view = utils.has_materialized_view(view_name)
    geom = MGeoDatas.objects.filter(feature_id=fid).first()

    geom_type = ''
    if geom:
        geom_type = geom.geo_data.geom_type

    if not has_mat_view:
        return JsonResponse({
            'success': False,
            'geom_type': geom_type,
        })

    view = ViewNames.objects.filter(feature_id=fid).values('id', 'view_name').first()
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
    if view:
        id_list = [data.property_id for data in ViewProperties.objects.filter(view_id=view['id'])]
        url = reverse('api:service:geo_design_proxy', args=['geoserver_design_view'])
        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': id_list,
            'view': view,
            'url': request.build_absolute_uri(url),
            'style_name': geoserver.get_layer_style('gp_layer_' + view_name),
            'geom_type': geom_type,
            'cache_values': cache_values,
        }
    else:
        rsp = {
            'success': True,
            'fields': _lfeatureconfig(fid),
            'id_list': [],
            'view': '',
            'geom_type': geom_type,
            'cache_values': cache_values,
            'style_name': geoserver.get_layer_style('gp_layer_' + view_name),
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def make_view(request, payload):
    fid = payload.get('fid')
    theme = get_object_or_404(LThemes, theme_id=payload.get('tid'))
    feature = get_object_or_404(LFeatures, feature_id=fid)
    property_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(fid, False)

    feature_config_ids = list(l_feature_c_qs.values_list("feature_config_id", flat=True))
    data_type_ids = list(data_type_c_qs.values_list("data_type_id", flat=True))

    property_qs = property_qs.exclude(property_code__iexact='localid')
    property_qs = property_qs.exclude(value_type_id='data_type')
    property_ids = list(property_qs.values_list("property_id", flat=True))

    view_name = utils.make_view_name(feature)
    check = _create_view(list(property_ids), view_name, list(data_type_ids), list(feature_config_ids), fid)
    if check:
        rsp = _create_geoserver_detail(view_name, theme, request.user.id, feature, payload.get('values'))
    rsp = {
        "success": check,
        "data": check
    }
    if not check:
        rsp["error"] = "View үүсэхэд алдаа гарсан байна."
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def propertyFieldsSave(request, payload):
    id_list = payload.get('id_list')
    tid = payload.get('tid')
    fid = payload.get('fid')
    view_id = payload.get('view_id')
    values = payload.get('values')

    if not id_list:
        rsp = {
            'success': False,
            'msg': 'Утга сонгоно уу.'
        }
        return JsonResponse(rsp)

    theme = get_object_or_404(LThemes, theme_id=tid)
    feature = get_object_or_404(LFeatures, feature_id=fid)

    table_name = utils.make_view_name(feature)
    has_mat_view = utils.has_materialized_view(table_name)
    if not has_mat_view:
        return JsonResponse({
            "success": False,
            "msg": "View үүсээгүй байна view ийг үүсгэнэ үү",
        })

    view = ViewNames.objects.update_or_create(
        id=view_id,
        defaults={
            'view_name': table_name,
            'feature_id': fid,
        }
    )[0]

    view_prop_qs = ViewProperties.objects
    view_prop_qs.filter(view=view).delete()

    for prop_id in id_list:
        view_prop_qs.create(view=view, property_id=prop_id)

    is_created = _check_geoserver_detail(table_name, theme)
    if values or not is_created:
        rsp = _create_geoserver_detail(table_name, theme, request.user.id, feature, payload.get('values'))
    else:
        rsp = {
            "success": True,
            "msg": 'Амжилттай хадгаллаа'
        }

    return JsonResponse(rsp)

def _check_geoserver_detail(table_name, theme):
    theme_code = theme.theme_code
    ws_name = 'gp_' + theme_code
    layer_name = 'gp_layer_' + table_name

    rsp = geoserver.getWorkspace(ws_name)
    if rsp.status_code == 200:
        ds_rsp = geoserver.getDataStore(ws_name, ws_name)
        if ds_rsp.status_code == 200:
            ds_layer_rsp = geoserver.getDataStoreLayer(ws_name, ws_name, layer_name)
            if ds_layer_rsp.status_code == 200:
                return True
    return False


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



def _create_geoserver_layer_detail(check_layer, table_name, ws_name, ds_name, layer_name, feature, values, wms):
    print(";lhoh")
    print(";lhoh")
    print(";lhoh")
    print(";lhoh", values)
    geom_att, extends = utils.get_colName_type(table_name, 'geo_data')
    if extends:
        srs = extends[0]['find_srid']
    else:
        srs = 4326

    tile_cache_check = values.get('tile_cache_check')
    cache_details = values.get('cache_values')
    geom_type = values.get('geom_type')
    style_name = values.get('style_name')
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
            geoserver.update_layer_style(layer_name, style_name)
            if not style_name:
                return {"success": False, "error": 'Style-ийн нэр хоосон байна.'}
            if tile_cache_check:
                cache_type = cache_details.get('cache_type')
                zoom_stop = cache_details.get('zoom_stop')
                zoom_start = cache_details.get('zoom_start')
                image_format = cache_details.get('image_format')
                number_of_cache = cache_details.get('number_of_cache')
                if int(zoom_start) > 21 or int(zoom_stop) > 21 or int(number_of_cache) > 100:
                    return {
                        'success': False,
                        'error': 'TileCache-ийн max утга хэтэрсэн байна'
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

        return {"success": True, 'data': 'Амжилттай үүслээ'}
    else:
        return {"success": False, 'error': 'Давхарга үүсгэхэд алдаа гарлаа'}


def _create_geoserver_detail(table_name, theme, user_id, feature, values):
    layer_responce = []
    theme_code = theme.theme_code
    ws_name = 'gp_' + theme_code
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
                'error': 'DataStore үүсгэхэд алдаа гарлаа'
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
    data = LProperties.objects.filter(property_id__in=ids).order_by('property_id')
    removeView(table_name)
    fields = list()
    for row in data:
        if row.property_code == 'end':
            fields.append('end_')
        else:
            fields.append(row.property_code)
    cols = list()
    for item in data:
        col = 'Max(Case When a.property_id = {property_id} Then value_text End) As {property_code}'.format(property_id=item.property_id, property_code=item.property_code)
        cols.append(col)
    try:
        query = '''
            create MATERIALIZED VIEW public.{table_name} as
                select
                    a.geo_id,
                    a.geo_data,
                    a.geo_id as inspire_id,
                    a.geo_id as localid,
                    {cols},
                    a.feature_id,
                    a.created_on,
                    a.modified_on
                from
                (
                    select
                        a.geo_id,
                        a.property_id,
                        mg.geo_data,
                        mg.feature_id,
                        mg.created_on,
                        mg.modified_on,
                        COALESCE(
                                a.value_text::character varying(1000),
                                a.value_number::character varying(1000),
                                a.value_date::character varying(1000),
                                case when a.code_list_id is null then null
                                else (
                                    select code_list_name
                                    from l_code_lists
                                    where code_list_id=a.code_list_id
                                ) end
                            ) as value_text
                    from
                        public.m_datas a
                    inner join
                        m_geo_datas mg
                    on
                        mg.geo_id = a.geo_id
                    where
                        a.property_id in ({properties}) and a.feature_config_id in ({feature_config_ids})
                ) a
                group by
                    a.geo_id,
                    a.geo_data,
                    a.feature_id,
                    a.created_on,
                    a.modified_on

        '''.format(
                table_name = table_name,
                columns=', '.join(['ct.{}'.format(f) for f in fields]),
                properties=', '.join(['{}'.format(f) for f in ids]),
                data_type_ids=', '.join(['{}'.format(f) for f in data_type_ids]),
                feature_config_ids=', '.join(['{}'.format(f) for f in feature_config_id]),
                create_columns=', '.join(['{} character varying(100)'.format(f) for f in fields]),
                feature_id=feature_id,
                cols=',\n'.join(cols)
            )
        query_index = ''' CREATE UNIQUE INDEX {table_name}_index ON {table_name}(geo_id) '''.format(table_name=table_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(query)
            cursor.execute(query_index)
        return True
    except Exception as e:
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
