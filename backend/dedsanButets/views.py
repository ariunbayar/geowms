from django.shortcuts import render
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBoundary, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists
from main.decorators import ajax_required
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse, Http404
from django.contrib.auth.decorators import user_passes_test

# Create your views here.
def _get_package(theme_id):
    package_data = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': list(LFeatures.objects.filter(package_id=package.package_id).extra(select={'id': 'feature_id', 'code': 'feature_code', 'name': 'feature_name'}).values('id', 'code', 'name'))
            })
    return package_data


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsAll(request):
    data = []
    for themes in LThemes.objects.all():
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'package': _get_package(themes.theme_id),
            })
    rsp = {
        'success': True,
        'data': data,
    }
    return JsonResponse(rsp)


def _lfeatureconfig(feature_id):
    feature_configs_name = []
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
                        'data_type_id': data_type_config.data_type_id,
                        'property_id': property_id,
                        'property_code': prop.property_code,
                        'property_name': prop.property_name,
                        'property_definition': prop.property_definition,
                        'value_type_id': prop.value_type_id,
                        'value_types': _value_types(prop.value_type_id, property_id),
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
        'check': check
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
    try:
        if model_name == 'theme':
            model_name = LThemes
        if model_name == 'package':
            model_name = LPackages
        if model_name == 'feature':
            model_name = LFeatures
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
                fields.append({
                    'field_name': i.name,
                    'field_type': type_name,
                    'data': None
                })
        rsp = {
            'success': True,
            'fields': fields
        }
    except Exception:
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
    return JsonResponse(rsp)


def _saveData(id, datas, model_name):
    name = model_name._meta.object_name
    order_no = len(model_name.objects.all()) + 1
    if id:
        if name == 'LPackages':
            data = model_name(
                package_code='datas.package_code',
                package_name='datas.package_name',
                package_name_eng='datas.package_name_eng',
                theme_id=id,
                order_no=order_no
            )
        if name == 'LFeatures':
            data = model_name(
                feature_code='datas.feature_code',
                feature_name='datas.feature_name',
                feature_name_eng='datas.feature_name_eng',
                package_id=id,
                order_no=order_no
            )
        rsp = {
            'success': True,
            'info': 'Амжилттай хадгалсан'
        }
    else:
        if name == 'LThemes':
            data = model_name(
                theme_code='datas.theme_code',
                theme_name='datas.theme_name',
                theme_name_eng='datas.theme_name_eng',
                order_no=order_no,
            )
        rsp = {
            'success': True,
            'info': 'Амжилттай хадгалсан'
        }
    # data.save()
    return (rsp)

@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_data(request, payload):
    id = payload.get('id')
    model_name = payload.get('name')
    datas = payload.get('data')
    try:
        if model_name == 'theme':
            model_name = LThemes
            rsp = _saveData(id, datas, model_name)
        if model_name == 'package':
            model_name = LPackages
            rsp = _saveData(id, datas, model_name)
        if model_name == 'feature':
            model_name == LFeatures
            rsp = _saveData(id, datas, model_name)
    except Exception:
        rsp = {
            'success': False,
            'info': 'Алдаа гарлаа'
        }
    return JsonResponse(rsp)