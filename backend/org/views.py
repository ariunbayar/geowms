from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST

from main.decorators import ajax_required
from .models import Org, OrgRole
from backend.bundle.models import Bundle


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request, level):

    orgs_display = []

    for org in Org.objects.filter(level=level):
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
        })

    return JsonResponse({'orgs': orgs_display})
def OrgAll(request,level,pk):
    orgs_display=[]
    for org in Org.objects.filter(level=level,pk=pk):
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
        })

    return JsonResponse({'orgs': orgs_display})

def _get_org_role_display(org_role):

    bundle = org_role.bundle

    return {
        'org_id': org_role.org_id,
        'bundle': {
            'id': bundle.id,
            'name': bundle.name,
            'icon_url': bundle.icon.url if bundle.icon else '',
        },
        'perm_view': org_role.perm_view,
        'perm_create': org_role.perm_create,
        'perm_remove': org_role.perm_remove,
        'perm_revoke': org_role.perm_revoke,
        'perm_review': org_role.perm_review,
        'perm_approve': org_role.perm_approve,
        'created_at': org_role.created_at.strftime('%Y-%m-%d'),
        'updated_at': org_role.updated_at.strftime('%Y-%m-%d'),
    }


def _get_default_org_role(org, bundle):
    org_role = OrgRole()
    org_role.org = org
    org_role.bundle = bundle
    org_role.perm_view = False
    org_role.perm_create = False
    org_role.perm_remove = False
    org_role.perm_revoke = False
    org_role.perm_review = False
    org_role.perm_approve = False
    org_role.created_at = localtime(now())
    org_role.updated_at = localtime(now())
    return org_role


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles(request, level, pk):

    org = get_object_or_404(Org, pk=pk)

    bundles = Bundle.objects.all()
    mapped_org_roles = dict([
        (org_role.bundle_id, org_role)
        for org_role in org.orgrole_set.all()
    ])

    org_roles_display = []
    for bundle in bundles:
        if bundle.id not in mapped_org_roles:
            org_role = _get_default_org_role(org, bundle)
        else:
            org_role = mapped_org_roles[bundle.id]
        org_roles_display.append(
            _get_org_role_display(org_role)
        )

    return JsonResponse({'org_roles': org_roles_display})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles_save(request, payload, level, pk):

    org = get_object_or_404(Org, pk=pk)

    org_roles_new = []
    org_roles_existing = org.orgrole_set.all()
    mapped_org_roles_existing = dict([
        (org_role.bundle_id, org_role)
        for org_role in org_roles_existing
    ])

    bundle_ids = [
        org_role['bundle']['id']
        for org_role in payload
    ]
    bundles_mapped = dict([
        (bundle.id, bundle)
        for bundle in Bundle.objects.filter(pk__in=bundle_ids)
    ])

    def _set_org_role_perms(org_role, bundle_permission):
        org_role.perm_view = bundle_permission.get('perm_view') is True
        org_role.perm_create = bundle_permission.get('perm_create') is True
        org_role.perm_remove = bundle_permission.get('perm_remove') is True
        org_role.perm_revoke = bundle_permission.get('perm_revoke') is True
        org_role.perm_review = bundle_permission.get('perm_review') is True
        org_role.perm_approve = bundle_permission.get('perm_approve') is True

    for bundle_permission in payload:

        bundle_id = bundle_permission.get('bundle', {}).get('id')

        if bundle_id not in bundles_mapped:
            continue

        if bundle_id in mapped_org_roles_existing:
            org_role = mapped_org_roles_existing[bundle_id]
            org_role.updated_at = localtime(now())
        else:
            org_role = OrgRole(org=org, bundle=bundles_mapped[bundle_id])
            org_roles_new.append(org_role)

        _set_org_role_perms(org_role, bundle_permission)

    OrgRole.objects.bulk_create(org_roles_new)

    OrgRole.objects.bulk_update(
        org_roles_existing,
        ['perm_view', 'perm_create', 'perm_remove', 'perm_revoke', 'perm_review', 'perm_approve', 'updated_at']
    )

    return JsonResponse({'success': True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employees(request, level, pk):

    # org = get_object_or_404(Org, pk=pk)

    employees_display = []

    from random import randint

    for i in range(100, randint(105, 120)):
        employees_display.append({
            'id': i,
            'last_name': 'Telmuun%s' % i,
            'first_name': 'Telmuun%s' % i,
            'email': 'user_%s@example.com' % i,
            'is_active': [True, False][randint(0, 1)],
            'is_sso': [True, False][randint(0, 1)],
            'position': 'Газар зохион байгуулалт, төлөвлөлт, газар өмчлөлийн асуудал хариуцсан ахлах мэргэжилтэн %s' % i,
            'created_at': '2020-01-01',
            'updated_at': '2020-04-17',
        })

    return JsonResponse({'employees': employees_display})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):

    user_id = payload.get('user_id')
    position = payload.get('position')

    # user = get_object_or_404(User, pk=user_id)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, payload, level, pk):

    user_id = payload.get('user_id')

    # user = get_object_or_404(User, pk=user_id)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_add(request, payload, level):

    org_name = payload.get('org_name')
    org_id=payload.get('id')
    org_check = Org.objects.filter(name=org_name)

    org_id_check=Org.objects.filter(id=org_id)
    if(org_id):
        if org_check:
            return JsonResponse({'success': False})
        else:
            Org.objects.filter(id=org_id).update(name=org_name)
            return JsonResponse({'success': True})
    else:
        if org_check:
            return JsonResponse({'success': False})
        else:
            Org.objects.create(name=org_name, level=level)

            return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_remove(request, payload, level):

    org_id = payload.get('org_id')
    org = get_object_or_404(Org, pk=org_id, level=level)
    org.orgrole_set.all().delete()
    org.delete()

    return JsonResponse({'success': True})
