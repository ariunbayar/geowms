from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test

from main.decorators import ajax_required
from .models import Org


def _get_org_options():

    form_options = []

    for wms in WMS.objects.filter():
        layers = list(WMSLayer.objects.filter(wms=wms).values('id', 'name').order_by('sort_order'))
        wms_display = {
            'name': wms.name,
            'is_active': wms.is_active,
            'layers': layers,
        }
        form_options.append(wms_display)

    return form_options


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request, level):
    level_display = dict((
        (1, '1-р түвшин'),
        (2, '2-р түвшин'),
        (3, '3-р түвшин'),
        (4, '4-р түвшин'),
    ))[int(level)]
    orgs_display = []

    for org in Org.objects.filter(level=level):
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': level_display
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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles(request, level, pk):

    org = get_object_or_404(Org, pk=pk)

    org_roles = org.orgrole_set.all()

    org_roles_display = [
        _get_org_role_display(org_role)
        for org_role in org_roles
    ]

    return JsonResponse({'org_roles': org_roles_display})


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
    org_check = Org.objects.filter(name=org_name)
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
    org_check = Org.objects.filter(pk=org_id, level=level)
    org_check.delete()

    return JsonResponse({'success': True})
