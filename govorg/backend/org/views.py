from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee,OrgInspireRoles
from backend.bundle.models import Bundle
from django.shortcuts import get_object_or_404
from backend.inspire.models import LThemes, LPackages, LFeatures


def _get_features(org, package_id):
    features = []
    inspire_features = LFeatures.objects.filter(package_id=package_id).values('feature_id', 'feature_name')
    if inspire_features:
        for org_feature in inspire_features:
            org_features = OrgInspireRoles.objects.filter(org=org, perm_view=True, module_root_id = package_id, module_id=org_feature['feature_id'])
            if org_features:
                for feature in org_features:
                    features.append({
                        'id':org_feature['feature_id'],
                        'name':org_feature['feature_name'],
                    })
    return features


def _get_packages(org, theme_id):
    packages = []
    org_packages = OrgInspireRoles.objects.filter(org=org, perm_view=True, module_root_id = theme_id)
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
    perms = []
    org_inspire = []
    roles_inspire = OrgInspireRoles.objects.filter(org=org, perm_view=True)
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
        },
    }
    return render(request, 'org/index.html', context)