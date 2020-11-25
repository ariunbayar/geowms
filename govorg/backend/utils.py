from django.shortcuts import get_object_or_404
from django.db.models import F

from backend.inspire.models import (
    GovPermInspire,
    LProperties,
    LFeatures,
    LFeatureConfigs,
    LDataTypeConfigs,
    LPackages,
    LThemes,
)


def get_convert_display_name(perm_list):

    roles = {
        'PERM_VIEW': False,
        'view_id': None,

        'PERM_CREATE': False,
        'create_id': None,

        'PERM_REMOVE': False,
        'remove_id': None,

        'PERM_UPDATE': False,
        'update_id': None,

        'PERM_APPROVE': False,
        'approve_id': None,

        'PERM_REVOKE': False,
        'revoke_id': None,
    }

    for perm in perm_list:
        if perm.get('kind') == 1:
            roles['PERM_VIEW'] = True
            roles['view_id'] = perm.get('ins_id')

        if perm.get('kind') == 2:
            roles['PERM_CREATE'] = True
            roles['create_id'] = perm.get('ins_id')

        if perm.get('kind') == 3:
            roles['PERM_REMOVE'] = True
            roles['remove_id'] = perm.get('ins_id')

        if perm.get('kind') == 4:
            roles['PERM_UPDATE'] = True
            roles['update_id'] = perm.get('ins_id')

        if perm.get('kind') == 5:
            roles['PERM_APPROVE'] = True
            roles['approve_id'] = perm.get('ins_id')

        if perm.get('kind') == 6:
            roles['PERM_REVOKE'] = True
            roles['revoke_id'] = perm.get('ins_id')

    return roles


def get_property_data_display(property_id, feature_id, role_model, inspire_model):

    if role_model.__class__.__name__ == 'EmpRole':
        perm_list = list(inspire_model.objects.filter(emp_role=role_model, feature_id=feature_id, property_id=property_id).values(ins_id=F('id'), kind=F('perm_kind')))

    if role_model.__class__.__name__ == 'GovPerm':
        perm_list = list(inspire_model.objects.filter(gov_perm=role_model, feature_id=feature_id, property_id=property_id).values(ins_id=F('id'), kind=F('perm_kind')))

    property = get_object_or_404(LProperties, property_id=property_id)


    roles = get_convert_display_name(perm_list)

    return {
          'id': property.property_id,
          'name': property.property_name,
          'name': property.property_name,
          'parent_id': feature_id,
          'roles': roles
        }


def get_all_child_feature(feature_id):

    data_type_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).exclude(data_type_id__isnull=True).values_list('data_type_id', flat=True))

    properties = []
    for data_type_id in data_type_ids:
        l_data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id).values_list('property_id', flat=True)

        for l_data_type_config in l_data_type_configs:
            properties.append(l_data_type_config)

    return len(properties)


def get_feature_data_display(feature_id, property_of_feature):

    feature = get_object_or_404(LFeatures, feature_id=feature_id)
    all_child = get_all_child_feature(feature_id)

    return {
        'id': feature.feature_id,
        'name': feature.feature_name,
        'parent_id': feature.package_id,
        'perm_child_ids': list(property_of_feature),
        'all_child':all_child
    }


def get_package_features_data_display(package_id, feature_ids, property_of_feature):

    package = get_object_or_404(LPackages, package_id=package_id)
    all_child = LFeatures.objects.filter(package_id=package_id).count()

    features = [
        get_feature_data_display(feature_id, property_of_feature[feature_id])
        for feature_id in feature_ids
    ]

    return {
        'id': package.package_id,
        'name': package.package_name,
        'parent_id': package.theme_id,
        'all_child':all_child,
        'features': features,
    }


def get_theme_data_display(theme_id, package_ids):

    theme = get_object_or_404(LThemes, theme_id=theme_id)
    all_child = LPackages.objects.filter(theme_id=theme_id).count()

    return {
        'id': theme.theme_id,
        'name': theme.theme_name,
        'perm_child_ids': list(package_ids),
        'all_child': all_child,
    }
