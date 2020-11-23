from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse

from backend.org.models import Org
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    LProperties,
    LFeatures,
    LFeatureConfigs,
    LDataTypeConfigs,
    LPackages,
    LThemes,
)


def _get_convert_display_name(perm_list):

    roles = {
        'PERM_VIEW': False,
        'PERM_CREATE': False,
        'PERM_REMOVE': False,
        'PERM_UPDATE': False,
        'PERM_APPROVE': False,
        'PERM_REVOKE': False,
    }

    for perm in perm_list:
        if perm == 1:
            roles['PERM_VIEW'] = True

        if perm == 2:
            roles['PERM_CREATE'] = True

        if perm == 3:
            roles['PERM_REMOVE'] = True

        if perm == 4:
            roles['PERM_UPDATE'] = True

        if perm == 5:
            roles['PERM_APPROVE'] = True

        if perm == 6:
            roles['PERM_REVOKE'] = True

    return roles


def _get_property_data_display(property_id, feature_id, gov_perm):

    property = get_object_or_404(LProperties, property_id=property_id)

    perm_list = list(GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, property_id=property_id).values_list('perm_kind', flat=True))

    roles = _get_convert_display_name(perm_list)

    return{
          'id': property.property_id,
          'name': property.property_name,
          'parent_id': feature_id,
          'roles': roles
        }


def _get_all_child_feature(feature_id):

    data_type_ids = list(LFeatureConfigs.objects.filter(feature_id=feature_id).exclude(data_type_id__isnull=True).values_list('data_type_id', flat=True))

    properties = []
    for data_type_id in data_type_ids:
        l_data_type_configs = LDataTypeConfigs.objects.filter(data_type_id=data_type_id).values_list('property_id', flat=True)

        for l_data_type_config in l_data_type_configs:
            properties.append(l_data_type_config)

    return len(properties)


def _get_feature_data_display(feature_id, property_of_feature):

    feature = get_object_or_404(LFeatures, feature_id=feature_id)
    all_child = _get_all_child_feature(feature_id)

    return {
        'id': feature.feature_id,
        'name': feature.feature_name,
        'parent_id': feature.package_id,
        'perm_child_ids': property_of_feature,
        'all_child':all_child
    }


def _get_package_features_data_display(package_id, feature_ids, property_of_feature):

    package = get_object_or_404(LPackages, package_id=package_id)
    all_child = LFeatures.objects.filter(package_id=package_id).count()

    features = [
        _get_feature_data_display(feature_id, property_of_feature[feature_id])
        for feature_id in feature_ids
    ]

    return {
        'id': package.package_id,
        'name': package.package_name,
        'parent_id': package.theme_id,
        'all_child':all_child,
        'features': features,
    }


def _get_theme_data_display(theme_id, package_ids):

    theme = get_object_or_404(LThemes, theme_id=theme_id)
    all_child = LPackages.objects.filter(theme_id=theme_id).count()

    return {
        'id': theme.theme_id,
        'name': theme.theme_name,
        'perm_child_ids': package_ids,
        'all_child': all_child,
    }


@require_GET
@ajax_required
def org_role(request):

    org = get_object_or_404(Org, employee__user=request.user)
    gov_perm = get_object_or_404(GovPerm, org=org)

    feature_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))
    package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
    theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))

    properties = []
    property_of_feature = {}

    for feature_id in feature_ids:
        property_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))

        property_of_feature[feature_id] = property_ids
        for property_id in property_ids:
            properties.append(_get_property_data_display(property_id, feature_id, gov_perm))

    package_features = [
        _get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
        for package_id in package_ids
    ]

    themes = [
        _get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
        for theme_id in theme_ids
    ]

    rsp = {
        'success': True,
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }

    return JsonResponse(rsp)
