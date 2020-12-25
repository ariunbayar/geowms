from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.db import transaction

from geoportal_app.models import User
from backend.org.models import Org, Employee
from main.decorators import ajax_required
from main.utils import send_approve_email, is_email
from backend.inspire.models import (
    GovPerm,
    GovPermInspire,
    EmpRole,
    EmpPerm,
    EmpRoleInspire,
    EmpPermInspire,
    LFeatures,
    LPackages,
)

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display,
    get_convert_perm_kind,
)



def _get_employee_display_data(employee):

    user = employee.user

    return {
        'id': employee.id,
        'position': employee.position,
        'is_admin': employee.is_admin,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
    }


@require_GET
@ajax_required
def list(request):

    org = get_object_or_404(Org, employee__user=request.user)
    employees = Employee.objects.filter(org=org)

    employee_list = [
        _get_employee_display_data(employee)
        for employee in employees
    ]

    rsp = {
        'success': True,
        'employees': employee_list,
    }

    return JsonResponse(rsp)


def _set_user_data(user, first_name, last_name, email):

    user.first_name = first_name
    user.last_name = last_name
    user.username = email
    user.email = email
    user.save()


def _set_employee_data(employee, position, is_admin):

    employee.position = position
    employee.is_admin = is_admin
    employee.save()


def _set_emp_perm_ins_data(emp_perm, perm, user):

    emp_perm_inspire = EmpPermInspire()

    gov_perm_inspire = get_object_or_404(GovPermInspire, pk=perm.get('gov_perm_ins_id'))

    if perm.get('emp_role_ins_id'):
        emp_role_inspire = get_object_or_404(EmpRoleInspire, pk=perm.get('emp_role_ins_id'))
        emp_perm_inspire.emp_role_inspire = emp_role_inspire

    emp_perm_inspire.emp_perm = emp_perm
    emp_perm_inspire.gov_perm_inspire = gov_perm_inspire
    emp_perm_inspire.created_by = user
    emp_perm_inspire.feature_id = perm.get('feature_id')
    if perm.get('property_id') == 'geom':
        emp_perm_inspire.geom = True
    else:
        emp_perm_inspire.property_id = perm.get('property_id')
    emp_perm_inspire.perm_kind = get_convert_perm_kind(EmpPermInspire, perm.get('perm_kind'))
    emp_perm_inspire.save()


def _employee_validation(payload, user):
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    errors = {}
    if not position:
        errors['position'] = 'Хоосон байна утга оруулна уу.'
    elif len(position) > 250:
        errors['position'] = '250-с илүүгүй урттай утга оруулна уу!'
    if not first_name:
        errors['first_name'] = 'Хоосон байна утга оруулна уу.'
    elif len(first_name) > 30:
        errors['first_name'] = '30-с илүүгүй урттай утга оруулна уу!'
    if not last_name:
        errors['last_name'] = 'Хоосон байна утга оруулна уу.'
    elif len(last_name) > 150:
        errors['last_name'] = '150-с илүүгүй урттай утга оруулна уу!'
    if not email:
        errors['email'] = 'Хоосон байна утга оруулна уу.'
    elif len(email) > 254:
        errors['email'] = '254-с илүүгүй урттай утга оруулна уу!'
    if user:
        if user.email != email:
            if User.objects.filter(email=email).first():
                errors['email'] = 'Email хаяг бүртгэлтэй байна.'
    else:
        if User.objects.filter(email=email).first():
            errors['email'] = 'Email хаяг бүртгэлтэй байна.'
    if not is_email(email):
        errors['email'] = 'Email хаяг алдаатай байна.'
    return errors


@require_POST
@ajax_required
def create(request, payload):

    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    position = payload.get('position')
    is_admin = payload.get('is_admin')
    roles = payload.get('roles')

    org = get_object_or_404(Org, employee__user=request.user)
    emp_role = EmpRole.objects.filter(pk=payload.get('emp_role_id')).first()
    errors = _employee_validation(payload, None)
    if errors:
        return JsonResponse({'success': False, 'errors': errors})
    emp_role = EmpRole.objects.filter(pk=payload.get('emp_role_id')).first()

    with transaction.atomic():

        user = User()
        _set_user_data(user, first_name, last_name, email)

        employee = Employee()
        employee.org = org
        employee.user = user
        _set_employee_data(employee, position, is_admin)

        emp_perm = EmpPerm()
        emp_perm.employee = employee

        if emp_role:
            emp_perm.emp_role = emp_role

        emp_perm.save()

        if roles:
            for role in roles:
                _set_emp_perm_ins_data(emp_perm, role, request.user)

        send_approve_email(user)

        return JsonResponse({'success': True, 'errors': {}})

    return JsonResponse({'success': False, 'errors': {}})


def _delete_old_emp_role(old_emp_role):

    emp_role_inspire_list = EmpRoleInspire.objects.filter(emp_role=old_emp_role)
    EmpPermInspire.objects.filter(emp_role_inspire__in=emp_role_inspire_list).delete()


def _delete_remove_perm(remove_perms):
    EmpPermInspire.objects.filter(pk__in=remove_perms).delete()


@require_POST
@ajax_required
def update(request, payload, pk):

    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    position = payload.get('position')
    is_admin = payload.get('is_admin')
    emp_role_id = payload.get('emp_role_id')
    add_perms = payload.get('add_perm')
    remove_perms = payload.get('remove_perm')

    employee = get_object_or_404(Employee, pk=pk)
    errors = _employee_validation(payload, employee.user)
    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    emp_perm = get_object_or_404(EmpPerm, employee=employee)
    new_emp_role = get_object_or_404(EmpRole, pk=emp_role_id)
    old_emp_role = emp_perm.emp_role

    with transaction.atomic():
        if new_emp_role != old_emp_role:
            _delete_old_emp_role(old_emp_role)
            emp_perm.emp_role = new_emp_role
            emp_perm.save()

        if remove_perms:
            _delete_remove_perm(remove_perms)

        if add_perms:
            for perm in add_perms:
                _set_emp_perm_ins_data(emp_perm, perm, request.user)

        user = employee.user
        _set_user_data(user, first_name, last_name, email)

        employee = employee
        _set_employee_data(employee, position, is_admin)

        return JsonResponse({'success': True})

    return JsonResponse({'success': False})


def _get_emp_perm_data_display(emp_perm):

    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)

    properties = []
    property_of_feature = {}

    for feature_id in feature_ids:
        property_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True)

        property_of_feature[feature_id] = property_ids
        properties.append(get_property_data_display(None, feature_id, emp_perm, EmpPermInspire, True))
        for property_id in property_ids:
            properties.append(get_property_data_display(property_id, feature_id, emp_perm, EmpPermInspire, False))

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

    employee = get_object_or_404(Employee, pk=pk)
    emp_perm = get_object_or_404(EmpPerm, employee=employee)
    emp_role = emp_perm.emp_role

    employee_detail = _get_employee_display_data(employee)

    rsp = {
        'form_values': employee_detail,
        'role_name': emp_role.name,
        'role_id': emp_role.id,
        'perms': _get_emp_perm_data_display(emp_perm),
        'success': True,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def delete(request, pk):

    employee = get_object_or_404(Employee, pk=pk)
    emp_perm = get_object_or_404(EmpPerm, employee=employee)

    with transaction.atomic():
        EmpPermInspire.objects.filter(emp_perm=emp_perm).delete()
        emp_perm.delete()
        employee.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'success': True})
