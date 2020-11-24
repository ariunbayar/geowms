from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse

from backend.org.models import Org
from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display
)
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    LFeatures,
    LPackages,
)


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
            properties.append(get_property_data_display(property_id, feature_id, gov_perm))

    package_features = [
        get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
        for package_id in package_ids
    ]

    themes = [
        get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
        for theme_id in theme_ids
    ]

    rsp = {
        'success': True,
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }

    return JsonResponse(rsp)
