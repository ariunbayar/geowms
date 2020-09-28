from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from backend.bundle.models import Bundle
from django.shortcuts import get_object_or_404


def all(request):
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
            'perms':perms
        },
    }
    return render(request, 'org/index.html', context)