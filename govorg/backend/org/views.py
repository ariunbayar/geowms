from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from backend.org.models import Org, OrgRole, Employee, InspirePerm
from backend.bundle.models import Bundle
from backend.inspire.models import LThemes, LPackages, LFeatures, MGeoDatas
from django.contrib.auth.decorators import login_required

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display
)

from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpPerm,
    EmpPermInspire,
)

def _gov_role(org, user):

    properties = []
    property_of_feature = {}
    gov_perm = GovPerm.objects.filter(org=org).first().id

    feature_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))

    package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
    theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))
    
    for feature_id in feature_ids:
        property_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))
        property_of_feature[feature_id] = property_ids
        properties.append(get_property_data_display(None, feature_id, gov_perm, GovPermInspire, True))
        for property_id in property_ids:
            properties.append(get_property_data_display(property_id, feature_id, gov_perm, GovPermInspire, False))

    package_features = [
        get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
        for package_id in package_ids
    ]   

    themes = [
        get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
        for theme_id in theme_ids
    ]
        
    return {
        'gov_perm_id': gov_perm,
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }

    
def _emp_role(org, user):
    properties = []
    property_of_feature = {}
    feature_ids = []
    package_features = []
    themes = []

    employee = Employee.objects.filter(org_id=org.id, user__username=user).first()
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    if emp_perm:
        feature_ids = list(EmpPermInspire.objects.filter(Q(emp_perm_id=emp_perm.id, geom=True) and (Q(perm_kind=EmpPermInspire.PERM_APPROVE) or Q(perm_kind=EmpPermInspire.PERM_VIEW))).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))

        if feature_ids:
            package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
            theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))
            for feature_id in feature_ids:
                property_ids = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))
                property_of_feature[feature_id] = property_ids
                for property_id in property_ids:
                    properties.append(get_property_data_display(property_id, feature_id, emp_perm, EmpPermInspire))

            package_features = [
                get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
                for package_id in package_ids
            ]

            themes = [
                get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
                for theme_id in theme_ids
            ]
    return {
        'themes': themes,
        'package_features': package_features,
    }


@login_required(login_url='/gov/secure/login/')
def frontend(request):
    org = get_object_or_404(Org, employee__user=request.user)
    perms = []

    for module in Bundle.MODULE_CHOICES:
        roles = OrgRole.objects.filter(org=org, bundle__module=module[0]).distinct('bundle')

        for role in roles:
            perms.append({
                'module_id':module[0],
                'module_name':module[1],
                'perm_view':role.perm_view,
                'perm_create':role.perm_create,
                'perm_remove':role.perm_remove,
                'perm_revoke':role.perm_revoke,
                'perm_review':role.perm_review,
                'perm_approve':role.perm_approve,
            })
    context = {
        'org': {
            "org_name":org.name.upper(),
            "org_level":org.level,
            'perms':perms,
            'org_role':_gov_role(org, request.user),
            'emp_role':_emp_role(org, request.user),
        },
    }
    return render(request, 'org/index.html', context)
