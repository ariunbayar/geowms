from django.shortcuts import get_object_or_404
from django.db.models import F

from backend.inspire.models import (
    GovPermInspire,
    EmpRoleInspire,
    EmpPermInspire,
    EmpPerm,
    LFeatures,
    LFeatureConfigs,
    LDataTypeConfigs,
    LPackages,
    LThemes,
    MGeoDatas,
)

def get_convert_perm_kind(model, kind):

    if kind == 'PERM_VIEW':
        return model.PERM_VIEW

    if kind == 'PERM_CREATE':
        return model.PERM_CREATE

    if kind == 'PERM_REMOVE':
        return model.PERM_REMOVE

    if kind == 'PERM_UPDATE':
        return model.PERM_UPDATE

    if kind == 'PERM_REVOKE':
        return model.PERM_REVOKE

    if kind == 'PERM_APPROVE':
        return model.PERM_APPROVE


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


def get_property_data_display(prop, feature_id, role_model, inspire_model, geom):

    perm_list = []

    qs = inspire_model.objects.filter(feature_id=feature_id)

    if role_model.__class__.__name__ == 'EmpRole':
        qs = qs.filter(emp_role=role_model)
    if role_model.__class__.__name__ == 'GovPerm':
        qs = qs.filter(gov_perm=role_model)
    if role_model.__class__.__name__ == 'EmpPerm':
        qs = qs.filter(emp_perm=role_model)

    if geom:
        qs = qs.filter(geom=geom)
    else:
        qs = qs.filter(property_id=prop.property_id)

    perm_list = list(qs.values(ins_id=F('id'), kind=F('perm_kind')))

    return get_property_data_display2(perm_list, prop, feature_id, geom), perm_list


def get_property_data_display2(perm_list, prop, feature_id, geom):

    roles = get_convert_display_name(perm_list)

    if geom:
        return {
            'id': 'geom',
            'name': 'geom',
            'parent_id': feature_id,
            'roles': roles
            }
    else:
        return {
            'id': prop.property_id,
            'name': prop.property_name,
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


def _get_feature_data_display(feature_id, property_of_feature):

    feature = get_object_or_404(LFeatures, feature_id=feature_id)
    all_child = get_all_child_feature(feature_id)
    geom_count = 1
    all_child = all_child + geom_count
    return {
        'id': feature.feature_id,
        'name': feature.feature_name,
        'parent_id': feature.package_id,
        'perm_child_ids': property_of_feature,
        'all_child': all_child,
    },count_child_of_parent(all_child, property_of_feature)


def get_package_features_data_display(package_id, feature_ids, property_of_feature):

    package = get_object_or_404(LPackages, package_id=package_id)
    features = []
    package_count = get_perm_kind_count_obj()

    for feature_id in feature_ids:
        feature_data_display, feature_count = _get_feature_data_display(feature_id, property_of_feature[feature_id])
        features.append(feature_data_display)
        for perm_kind in GovPermInspire.PERM_KIND_CHOICES:
            package_count[perm_kind[1]] = package_count[perm_kind[1]] + feature_count[perm_kind[1]]

    all_child = len(feature_ids)
    return {
        'id': package.package_id,
        'name': package.package_name,
        'parent_id': package.theme_id,
        'all_child': all_child,
        'perm_child_ids': package_count,
        'features': features,
    }


def get_theme_data_display(theme_id, package_ids, package_features):

    theme = get_object_or_404(LThemes, theme_id=theme_id)
    all_child = len(package_ids)
    theme_count = get_perm_kind_count_obj()
    for package_feature in package_features:
        if package_feature['id'] in package_ids:
            theme_packages = count_child_of_parent(package_feature['all_child'], package_feature['perm_child_ids'])
            for perm_kind in GovPermInspire.PERM_KIND_CHOICES:
                theme_count[perm_kind[1]] = theme_count[perm_kind[1]] + theme_packages[perm_kind[1]]

    return {
        'id': theme.theme_id,
        'name': theme.theme_name,
        'perm_child_ids': theme_count,
        'all_child': all_child,
    }


def count_property_of_feature(props):
    obj = get_perm_kind_count_obj()
    for prop in props:
        perm_kind_name = get_perm_kind_name(prop['perm_kind'])
        obj[perm_kind_name] = obj[perm_kind_name] + 1

    return obj


def count_child_of_parent(all_child_total, child_obj):
    obj = get_perm_kind_count_obj()
    for perm_kind in GovPermInspire.PERM_KIND_CHOICES:
        if child_obj[perm_kind[1]] == all_child_total:
            obj[perm_kind[1]] = obj[perm_kind[1]] + 1

        elif child_obj[perm_kind[1]] > 0:
            obj[perm_kind[1]] = obj[perm_kind[1]] + 0.5

    return obj


def get_perm_kind_name(idx):
    perms = {1: 'ХАРАХ', 2: 'НЭМЭХ', 3: 'ХАСАХ', 4: 'ЗАСАХ', 5: 'БАТЛАХ', 6: 'ЦУЦЛАХ'}
    return perms[idx]


def get_perm_kind_count_obj():
    return {'ХАРАХ': 0, 'НЭМЭХ': 0, 'ЗАСАХ': 0, 'ЦУЦЛАХ': 0, 'БАТЛАХ': 0, 'ХАСАХ': 0}


def get_perm_list(feature_id, property_id, geom, perm_list_all):
    perm_list_filtered = []

    for item in perm_list_all:
        if item['feature_id'] == feature_id:
            if geom is True:
                if item['geom'] is True:
                    perm_list_filtered.append({
                        'ins_id': item['ins_id'],
                        'kind': item['kind'],
                    })
            else:
                if item['property_id'] == property_id:
                    perm_list_filtered.append({
                        'ins_id': item['ins_id'],
                        'kind': item['kind'],
                    })

    return perm_list_filtered
