from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.db import transaction

from main.decorators import ajax_required
from backend.org.models import Org
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpRole,
    EmpRoleInspire,
)

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display
)


def _get_role_data_display(role):
    return {
        'gov_perm_id': role.gov_perm.id,
        'role_id': role.id,
        'role_name': role.name,
        'role_description': role.description,
    }


@require_GET
@ajax_required
def list(request):

    org = get_object_or_404(Org, employee__user=request.user)
    gov_perm = get_object_or_404(GovPerm, org=org)
    emp_roles = EmpRole.objects.filter(gov_perm=gov_perm)

    roles = [
        _get_role_data_display(role)
        for role in emp_roles
    ]

    rsp = {
        'success': True,
        'roles': roles,
    }

    return JsonResponse(rsp)


def _set_emp_role_data(emp_role, name, description):

    print('_set_emp_role_data')
    emp_role.name = name
    emp_role.description = description
    emp_role.save()
    return True

def _convert_perm_kind(kind):

    if kind == 'PERM_VIEW':
        return EmpRoleInspire.PERM_VIEW

    if kind == 'PERM_CREATE':
        return EmpRoleInspire.PERM_CREATE

    if kind == 'PERM_REMOVE':
        return EmpRoleInspire.PERM_REMOVE

    if kind == 'PERM_UPDATE':
        return EmpRoleInspire.PERM_UPDATE

    if kind == 'PERM_REVOKE':
        return EmpRoleInspire.PERM_REVOKE

    if kind == 'PERM_APPROVE':
        return EmpRoleInspire.PERM_APPROVE


def _set_emp_role_inspire_data(emp_role_inspire,role):

    print('_set_emp_role_inspire_data')
    emp_role_inspire.feature_id = role.get('feature_id')
    emp_role_inspire.property_id = role.get('property_id')
    emp_role_inspire.perm_kind = _convert_perm_kind(role.get('perm_kind'))
    emp_role_inspire.gov_perm_inspire = get_object_or_404(EmpRoleInspire, pk=role.get('gov_perm_ins_id'))
    emp_role_inspire.save()
    return True

def _delete_emp_role_inspire_data(emp_role, gov_perm, roles):

    for role in roles:
        EmpRoleInspire.objects.filter()


@require_POST
@ajax_required
def create(request, payload):
    print(payload)

    name = payload.get('role_name')
    description = payload.get('role_description')
    roles = payload.get('roles')
    gov_perm = get_object_or_404(GovPerm, pk=payload.get('gov_perm_id'))


    emp_role = EmpRole()
    emp_role.gov_perm = gov_perm
    emp_role.save()
    _set_emp_role_data(emp_role, name, description)

    for role in roles:
        emp_role_inspire = EmpRoleInspire()
        emp_role_inspire.emp_role = emp_role
        _set_emp_role_inspire_data(emp_role_inspire, role)

    return JsonResponse({'success': True})




@require_POST
@ajax_required
def update(request, payload, pk):

    name = get_object_or_404(GovPerm, pk=payload.get('role_name'))
    description = get_object_or_404(GovPerm, pk=payload.get('role_description'))
    remove_roles = payload.get('remove_roles')
    add_roles = payload.get('add_roles')

    emp_role = get_object_or_404(EmpRole, pk=pk)

    if not _set_emp_role_data(emp_role, name, description):
        return JsonResponse({'success': False})

    if not _delete_emp_role_inspire_data(emp_role, emp_role.gov_perm.gov_, emp, remove_roles):
        return JsonResponse({'success': False})

    if _set_emp_role_inspire_data(emp_role_inspire, add_roles):
        return JsonResponse({'success': True})


def _get_theme_data_display(EmpRoleInspire):

        feature_ids = list(EmpRoleInspire.objects.filter(pk=EmpRoleInspire.pk).distinct('feature_id').exclude(feature_id__isnull=True).values_list('feature_id', flat=True))
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


def _get_emp_roles_data_display(EmpRole):

    EmpRoleInspire = get_object_or_404(EmpRoleInspire, emp_role=EmpRole)
    return{
        'gov_perm_id':EmpRoleInspire.gov_perm_inspire.id,
        'emp_role_id':EmpRoleInspire.emp_role.id,
        'themes': _get_theme_data_display(EmpRoleInspire),
        'package_features': _get_package_features_data_display(EmpRoleInspire),
        'property': _get_property_data_display(EmpRoleInspire)
    }


@require_GET
@ajax_required
def detail(request, pk):

    EmpRole = get_object_or_404(EmpRole, pk=pk)

    rsp = {
        'role_id': EmpRole.id,
        'role_name': EmpRole.name,
        'role_description': EmpRole.description,
        'roles': _get_emp_roles_data_display(EmpRole),
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request):

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)
