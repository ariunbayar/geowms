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
    LFeatures,
    LPackages,
    LProperties,
)

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display,
    get_convert_perm_kind,
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
    emp_role.name = name
    emp_role.description = description
    emp_role.save()
    return True


def _set_emp_role_inspire_data(emp_role, role, user):

    gov_perm_inspire =  get_object_or_404(GovPermInspire, pk=role.get('gov_perm_inspire_id'))

    emp_role_inspire = EmpRoleInspire()
    emp_role_inspire.gov_perm_inspire = gov_perm_inspire
    emp_role_inspire.created_by = user
    emp_role_inspire.emp_role = emp_role
    emp_role_inspire.feature_id = role.get('feature_id')
    if role.get('property_id') == 'geom':
        emp_role_inspire.geom = True
    else:
        emp_role_inspire.property_id = role.get('property_id')
    emp_role_inspire.perm_kind = get_convert_perm_kind(EmpRoleInspire, role.get('perm_kind'))
    emp_role_inspire.save()

    return True


def _delete_emp_role_inspire_data(emp_role, roles):

    with transaction.atomic():
        for role in roles:
            EmpRoleInspire.objects.filter(pk=role).delete()
        return True
    return False


def _role_name_validation(payload, role):
    name = payload.get('role_name')
    errors = {}
    check_name = False
    gov_perm = payload.get('gov_perm_id')
    if not name:
        errors['role_name'] = 'Хоосон байна утга оруулна уу.'

    if role:
        if role.name != name:
            check_name = True

    if check_name or not role:
        role_by_name = EmpRole.objects.filter(name=name,gov_perm=gov_perm).first()
        if role_by_name:
            errors['role_name'] = 'Нэр давхцаж байна !.'
    return errors


@require_POST
@ajax_required
def create(request, payload):
    name = payload.get('role_name')
    description = payload.get('role_description')
    roles = payload.get('roles')
    errors = _role_name_validation(payload, None)
    if errors:
        return JsonResponse({'success': False, 'errors':errors})

    with transaction.atomic():

        gov_perm = get_object_or_404(GovPerm, pk=payload.get('gov_perm_id'))
        emp_role = EmpRole()
        emp_role.gov_perm = gov_perm
        emp_role.created_by = request.user
        emp_role.save()

        if _set_emp_role_data(emp_role, name, description):
            for role in roles:
                _set_emp_role_inspire_data(emp_role, role, request.user)

        return JsonResponse({'success': True, 'errors': errors})

    return JsonResponse({'success': False, 'errors': errors})


@require_POST
@ajax_required
def update(request, payload, pk):

    name = payload.get('role_name')
    description = payload.get('role_description')
    remove_roles = payload.get('remove_roles')
    add_roles = payload.get('add_roles')

    emp_role = get_object_or_404(EmpRole, pk=pk)

    errors = _role_name_validation(payload, emp_role)

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    emp_role.updated_by = request.user
    emp_role.save()

    with transaction.atomic():

        _set_emp_role_data(emp_role, name, description)

        if remove_roles:
            _delete_emp_role_inspire_data(emp_role, remove_roles)

        if add_roles:
            for role in add_roles:
                _set_emp_role_inspire_data(emp_role, role, request.user)

        return JsonResponse({'success': True, 'errors': errors})


def _get_emp_roles_data_display(emp_role):

    feature_ids = EmpRoleInspire.objects.filter(emp_role=emp_role).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)

    properties = []
    property_of_feature = {}

    for feature_id in feature_ids:
        property_ids = EmpRoleInspire.objects.filter(emp_role=emp_role, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True)
        property_of_feature[feature_id] = property_ids
        properties.append(get_property_data_display(None, feature_id, emp_role, EmpRoleInspire, True))
        for property_id in property_ids:
            prop = LProperties.objects.get(property_id=property_id)
            properties.append(get_property_data_display(prop, feature_id, emp_role, EmpRoleInspire, False))

    package_features = [
        get_package_features_data_display(package_id, LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True), property_of_feature)
        for package_id in package_ids
    ]

    themes = [
        get_theme_data_display(theme_id, LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True))
        for theme_id in theme_ids
    ]

    return {
        'themes': themes,
        'package_features': package_features,
        'property': properties
    }


@require_GET
@ajax_required
def detail(request, pk):

    emp_role = get_object_or_404(EmpRole, pk=pk)

    rsp = {
        'role_id': emp_role.id,
        'role_name': emp_role.name,
        'role_description': emp_role.description,
        'gov_perm_id': emp_role.gov_perm.id,
        'roles': _get_emp_roles_data_display(emp_role),
        'success': True,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request, pk):

    emp_role = get_object_or_404(EmpRole, pk=pk)
    with transaction.atomic():
        EmpRoleInspire.objects.filter(emp_role=emp_role).delete()
        emp_role.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False})
