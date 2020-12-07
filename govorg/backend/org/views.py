from django.shortcuts import render, get_object_or_404
from backend.org.models import Org, OrgRole, Employee, InspirePerm
from backend.bundle.models import Bundle
from django.shortcuts import get_object_or_404
from backend.inspire.models import LThemes, LPackages, LFeatures, MGeoDatas

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display
)

from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpPerm,
    EmpPermInspire
)



def _emp_role(org, user, is_superuser):
    properties = []
    property_of_feature = {}
    gov_perm = []
    perm_kind = False
    feature_ids = []
    feature_ids_list = []
    package_features = []
    themes = []
    gov_perm = get_object_or_404(GovPerm, org=org)
    if is_superuser:

        feature_ids_list = list(GovPermInspire.objects.filter(gov_perm=gov_perm).distinct('feature_id', 'perm_kind').exclude(feature_id__isnull=True).values_list('feature_id', 'perm_kind'))
        
        if feature_ids_list:
            for i in range(len(feature_ids_list)):
                if feature_ids_list[i][1] == 6 or feature_ids_list[i][1] == 1:
                    perm_kind = True
                    feature_ids.append(feature_ids_list[i][0])
        package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
        theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))
        if feature_ids:
            for feature_id in feature_ids:
                property_ids = list(GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))

                property_of_feature[feature_id] = property_ids
                for property_id in property_ids:
                    properties.append(get_property_data_display(property_id, feature_id, gov_perm, GovPermInspire))
    else:

        employee = Employee.objects.filter(org_id=org.id, user__username=user).first()
        emp_perm = get_object_or_404(EmpPerm, employee_id=employee.id)

        feature_ids_list = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id).distinct('feature_id', 'perm_kind').exclude(feature_id__isnull=True).values_list('feature_id', 'perm_kind'))
       
        if feature_ids_list:
            for i in range(len(feature_ids_list)):
                if feature_ids_list[i][1] == 6 or feature_ids_list[i][1] == 1:
                    perm_kind = True
                    feature_ids.append(feature_ids_list[i][0])
        
        if feature_ids:
            package_ids = list(LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True))
            theme_ids = list(LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True))
            for feature_id in feature_ids:
                property_ids = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True))
                property_of_feature[feature_id] = property_ids
                for property_id in property_ids:
                    properties.append(get_property_data_display(property_id, feature_id, emp_perm, EmpPermInspire))
    if feature_ids:
        package_features = [
            get_package_features_data_display(package_id, list(LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True)), property_of_feature)
            for package_id in package_ids
        ]

        themes = [
            get_theme_data_display(theme_id, list(LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True)))
            for theme_id in theme_ids
        ]

    return {
        'gov_perm_id': gov_perm.id,
        'themes': themes,
        'package_features': package_features,
        'property': properties,
    }


def _countFeature(org, feature_id):
    org_features = InspirePerm.objects.filter(org=org, perm_view=True, module_id=feature_id, module=3)
    if org_features:
        for feature in org_features:
            count = MGeoDatas.objects.filter(feature_id=feature.module_id).count()
    else:
        count = 0
        return count
    return count


def _get_features(org, package_id):
    features = []
    inspire_features = LFeatures.objects.filter(package_id=package_id).values('feature_id', 'feature_name')
    if inspire_features:
        for org_feature in inspire_features:
            org_features = InspirePerm.objects.filter(org=org, perm_view=True, module_root_id = package_id, module_id=org_feature['feature_id'])
            if org_features:
                for feature in org_features:
                    features.append({
                        'id': org_feature['feature_id'],
                        'name': org_feature['feature_name'],
                        'count': _countFeature(org, org_feature['feature_id'])
                    })
    return features


def _get_packages(org, theme_id):
    packages = []
    org_packages = InspirePerm.objects.filter(org=org, perm_view=True, module_root_id = theme_id)
    if org_packages:
        for org_package in org_packages:
            inspire_packages = LPackages.objects.filter(package_id=org_package.module_id).values('package_id', 'package_name')
            if inspire_packages:
                for package in inspire_packages:
                    packages.append({
                        'id':package['package_id'],
                        'name':package['package_name'],
                        'features':_get_features(org, package['package_id'])
                    })
    return packages


def frontend(request):
    org = get_object_or_404(Org, employee__user=request.user)
    is_superuser = request.user.is_superuser
    perms = []
    org_inspire = []
    roles_inspire = InspirePerm.objects.filter(org=org, perm_view=True)
    if roles_inspire:
        for i in roles_inspire:
            if i.module == 1:
                themes = LThemes.objects.filter(theme_id=i.module_id).values('theme_name', 'theme_id')
                for theme in themes:
                    org_inspire.append({
                        'id':theme['theme_id'],
                        'name':theme['theme_name'],
                        'packages': _get_packages(org, theme['theme_id'],)
                    })

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
            'org_inspire':org_inspire,
            'org_role':_emp_role(org, request.user, is_superuser),
        },
    }
    return render(request, 'org/index.html', context)
