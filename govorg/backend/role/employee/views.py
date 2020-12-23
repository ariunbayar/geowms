from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.db import transaction

from geoportal_app.models import User
from backend.org.models import Org, Employee
from main.decorators import ajax_required
from main import utils
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


def _get_employee_display(employee):

    user = employee.user

    return {
        'username': user.username,
        'id': employee.id,
        'position': employee.position,
        'is_admin': employee.is_admin,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
        'gender': user.gender,
        'register': user.register,
    }


@require_GET
@ajax_required
def list(request):

    org = get_object_or_404(Org, employee__user=request.user)
    employees = Employee.objects.filter(org=org)

    employee_list = [
        _get_employee_display(employee)
        for employee in employees
    ]

    rsp = {
        'success': True,
        'employees': employee_list,
    }

    return JsonResponse(rsp)


def _set_user(user, user_detail):

    user.username = user_detail['username']
    user.first_name = user_detail['first_name']
    user.last_name = user_detail['first_name']
    user.email = user_detail['email']
    user.gender = user_detail['gender']
    user.register = user_detail['register']
    user.save()

def _set_employee(employee, user_detail):

    employee.position = user_detail['position']
    employee.is_admin = user_detail['is_admin']
    employee.save()


def _set_emp_perm_ins(emp_perm, perm, user):

    feature_id = perm.get('feature_id')
    property_id = perm.get('property_id')
    perm_kind = get_convert_perm_kind(EmpPermInspire, perm.get('perm_kind'))

    emp_perm_inspire = EmpPermInspire()

    gov_perm_inspire = get_object_or_404(
        GovPermInspire,
        feature_id = feature_id,
        property_id = property_id,
        perm_kind = perm_kind
    )

    if perm.get('emp_role_ins_id'):
        emp_role_inspire = get_object_or_404(EmpRoleInspire, pk=perm.get('emp_role_ins_id'))
        emp_perm_inspire.emp_role_inspire = emp_role_inspire

    emp_perm_inspire.emp_perm = emp_perm
    emp_perm_inspire.perm_kind = perm_kind
    emp_perm_inspire.feature_id = feature_id
    emp_perm_inspire.property_id = property_id
    emp_perm_inspire.created_by = user
    emp_perm_inspire.updated_by = user
    emp_perm_inspire.gov_perm_inspire = gov_perm_inspire
    emp_perm_inspire.save()


def _employee_validation(user, user_detail):
    errors = {}
    username = user_detail['username']
    last_name = user_detail['last_name']
    first_name = user_detail['first_name']
    position = user_detail['position']
    email = user_detail['email']
    register = user_detail['register']
    if not username:
        errors['username'] = 'Хоосон байна утга оруулна уу.'
    elif len(username) > 150:
        errors['username'] = '150-с илүүгүй урттай утга оруулна уу!'
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
    if not register:
        errors['register'] = 'Хоосон байна утга оруулна уу.'
    if user:
        if user.email != email:
            if User.objects.filter(email=email).first():
                errors['email'] = 'Email хаяг бүртгэлтэй байна.'
        if user.username != username:
            if User.objects.filter(username=username).first():
                errors['username'] = 'Ийм нэр бүртгэлтэй байна.'
    else:
        if User.objects.filter(email=email).first():
            errors['email'] = 'Email хаяг бүртгэлтэй байна.'
        if User.objects.filter(username=username).first():
            errors['username'] = 'Ийм нэр бүртгэлтэй байна.'
    if not utils.is_email(email):
        errors['email'] = 'Email хаяг алдаатай байна.'
    if len(register) ==  10:
        if not utils.is_register(register):
            errors['register'] = 'Регистер дугаараа зөв оруулна уу.'
    else:
        errors['register'] = 'Регистер дугаараа зөв оруулна уу.'
    return errors

@require_POST
@ajax_required
def create(request, payload):

    user_detail = payload.get('user_detail')
    roles = payload.get('roles')
    emp_role_id = payload.get('emp_role_id')
    org = get_object_or_404(Org, employee__user=request.user)
    user = get_object_or_404(User, employee__user=request.user)

    errors = _employee_validation(user, user_detail)
    if errors:
        return JsonResponse({
            'success': False,
            'errors': errors
        })

    with transaction.atomic():

        user = User()
        _set_user(user, user_detail)

        employee = Employee()
        employee.org = org
        employee.user = user
        _set_employee(employee, user_detail)

        if emp_role_id:
            emp_perm = EmpPerm()
            emp_perm.created_by = user
            emp_perm.emp_role_id = emp_role_id
            emp_perm.employee_id = employee.id
            emp_perm.updated_by = user
            emp_perm.save()

            for role in roles:
                _set_emp_perm_ins(emp_perm, role, request.user)
        utils.send_approve_email(user)

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        })
    return JsonResponse({
        'success': False,
        'info': 'Хадгалахад алдаа гарлаа'
    })


def _delete_old_emp_role(old_emp_role):

    emp_role_inspire_list = EmpRoleInspire.objects.filter(emp_role=old_emp_role)
    EmpPermInspire.objects.filter(emp_role_inspire__in=emp_role_inspire_list).delete()


def _delete_remove_perm(remove_perms):
    EmpPermInspire.objects.filter(pk__in=remove_perms).delete()


@require_POST
@ajax_required
def update(request, payload, pk):

    role_id = payload.get('role_id')
    add_perms = payload.get('add_perm')
    remove_perms = payload.get('remove_perm')

    employee = get_object_or_404(Employee, pk=pk)
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    if role_id:
        new_emp_role = get_object_or_404(EmpRole, pk=role_id)

    with transaction.atomic():
        if emp_perm:
            old_emp_role = emp_perm.emp_role
            if new_emp_role != old_emp_role:
                _delete_old_emp_role(old_emp_role)
                emp_perm.emp_role = new_emp_role
                emp_perm.save()
        else:
            user = get_object_or_404(User, employee=employee)
            emp_perm = EmpPerm()
            emp_perm.created_by = user
            emp_perm.emp_role_id = role_id
            emp_perm.employee_id = employee.id
            emp_perm.updated_by = user
            emp_perm.save()


        if remove_perms:
            _delete_remove_perm(remove_perms)

        if add_perms:
            for perm in add_perms:
                _set_emp_perm_ins(emp_perm, perm, request.user)

        user = employee.user
        _set_user(user, payload)

        employee = employee
        _set_employee(employee, payload)

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        })
    return JsonResponse({
        'success': False,
        'info': 'Хадгалахад алдаа гарлаа'
    })


def _get_emp_perm_display(emp_perm):

    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)

    properties = []
    property_of_feature = {}

    for feature_id in feature_ids:
        property_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values_list('property_id', flat=True)

        property_of_feature[feature_id] = property_ids
        for property_id in property_ids:
            properties.append(get_property_data_display(property_id, feature_id, emp_perm, EmpPermInspire))

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
    employee_detail = _get_employee_display(employee)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
    if emp_perm:
        emp_role = emp_perm.emp_role
        role_id = emp_role.id
        perms = _get_emp_perm_display(emp_perm)
    else:
        role_id = ''
        perms = None

    rsp = {
        'success': True,
        'employee_detail': employee_detail,
        'role_id': role_id,
        'perms': perms,

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
