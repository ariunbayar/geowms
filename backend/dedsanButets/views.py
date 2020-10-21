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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsGetFields(request, name, pk):
    if name == 'feature':
        name = LFeatures
    if name == 'package':
        name = LPackages
    if name == 'theme':
        name = LThemes
    datas = []
    values = name.objects.all()[:10]
    for value in values:
        datas.append({
            value
        })
    print(type(datas))
    rsp = {
        'success': True,
        'fields': [f.name for f in name._meta.get_fields()],
        # 'values': datas,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def bundleButetsGetProperty(request, payload, pk, name, code):
    print("HAHAHAHAHa")
    haha = payload.get('code')
    print("HAHAHAHAHa", haha)
    if name == 'feature':
        name = LFeatures
    if name == 'package':
        name = LPackages
    if name == 'theme':
        name = LThemes
    datas = []
    print(code)
    feat = LFeatures.objects.filter(feature_code=code)
    print(feat)
    values = name.objects.all()[:10]
    for value in values:
        datas.append({
            value
        })
    print(type(datas))
    rsp = {
        'success': True,
        'fields': [f.name for f in name._meta.get_fields()],
        # 'values': datas,
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
    print("Haha")
    print(id)
    properties = LProperties.objects.filter(property_id=id)
    properties.update(
        property_name=property_name
    )
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)