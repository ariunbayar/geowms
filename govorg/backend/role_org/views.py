from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse

from backend.org.models import Org
from backend.inspire.models import (
    GovRole,
    GovPerm,
    GovRoleInspire,
    GovPermInspire,
    LProperties,
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


@require_GET
@ajax_required
def views(request):

    org = get_object_or_404(Org, employee__user=request.user)
    gov_perm = get_object_or_404(GovPerm, org=org)

    feature_ids = GovPermInspire.objects.filter(gov_perm=gov_perm).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True)

    properties = []
    for feature_id in feature_ids:
        property_ids = GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True)

        for property_id in property_ids:
            properties.append(_get_property_data_display(property_id, feature_id, gov_perm))

    return JsonResponse({'success': True, 'property': properties})
