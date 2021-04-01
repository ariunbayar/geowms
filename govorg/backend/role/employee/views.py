from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, Http404
from django.db import transaction
from geojson import FeatureCollection
from django.contrib.auth.decorators import login_required
from django.db.models import CharField, Value
from geoportal_app.models import User
from backend.org.models import Org, Employee, EmployeeAddress, EmployeeErguul, ErguulTailbar, DefaultPosition
from main.decorators import ajax_required
from backend.token.utils import TokenGeneratorEmployee
from govorg.backend.org_request.models import ChangeRequest
from main import utils
from main.components import Datatable
from backend.inspire.models import (
    EmpRole,
    EmpPerm,
    EmpRoleInspire,
    EmpPermInspire,
    LFeatures,
    LPackages,
    LProperties,
)

from govorg.backend.utils import (
    get_package_features_data_display,
    get_theme_data_display,
    get_property_data_display,
    get_convert_perm_kind,
    count_property_of_feature,
    get_perm_kind_name
)

from backend.org.forms import EmployeeAddressForm

from backend.org.models import Employee, Org
from backend.dedsanbutets.models import ViewNames
from govorg.backend.org_request.models import ChangeRequest
from govorg.backend.org_request.views import _get_geom


def _get_address_state_db_value(address_state):
    if address_state == EmployeeAddress.STATE_REGULER_CODE:
        address_state = True
    else:
        address_state = False
    return address_state


def _get_address_state_code(address_state):
    if address_state:
        address_state = EmployeeAddress.STATE_REGULER_CODE
    elif not address_state:
        address_state = EmployeeAddress.STATE_SHORT_CODE
    return address_state


def _get_employee_display(employee):

    user = employee.user
    role = EmpPerm.objects.filter(employee=employee).first()

    address = EmployeeAddress.objects.filter(employee=employee).first()

    if role and role.emp_role:
        role = role.emp_role.name
    else:
        role = None

    return {
        'username': user.username,
        'id': employee.id,
        'is_admin': employee.is_admin,
        'phone_number': employee.phone_number,

        'token': employee.token,
        'created_at': employee.created_at.strftime('%Y-%m-%d'),
        'updated_at': employee.updated_at.strftime('%Y-%m-%d'),
        'position': employee.position.name,
        'position_id': employee.position.id,
        'state': employee.get_state_display(),
        'state_id': employee.state,
        'pro_class_id': employee.pro_class,
        'pro_class': employee.get_pro_class_display(),

        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
        'gender': user.gender,
        'register': user.register,
        'is_user': user.is_user,

        'role_name': role,

        'level_1': address.level_1 if hasattr(address, 'level_1') else '',
        'level_2': address.level_2 if hasattr(address, 'level_2') else '',
        'level_3': address.level_3 if hasattr(address, 'level_3') else '',
        'street': address.street if hasattr(address, 'street') else '',
        'apartment': address.apartment if hasattr(address, 'apartment') else '',
        'door_number': address.door_number if hasattr(address, 'door_number') else '',
        'point': address.point.json if hasattr(address, 'point') else '',
        'address_state': _get_address_state_db_value(address.address_state) if hasattr(address, 'address_state') else '',
        'address_state_display': address.get_address_state_display() if hasattr(address, 'address_state') else '',
    }


def _get_name(user_id, item):
    user = User.objects.filter(pk=user_id).first()
    full_name = user.last_name[0].upper() + '.' + user.first_name.upper()
    return full_name


def _get_email(user_id, item):
    user = User.objects.filter(pk=user_id).first()
    return user.email


def _get_role_name(item):
    role_name = ''
    role = EmpPerm.objects.filter(employee=item['id']).first()
    if role and role.emp_role:
        role_name = role.emp_role.name
    return role_name


def _get_position_name(postition_id, item):
    position = DefaultPosition.objects.filter(id=postition_id).first()
    position_name = position.name
    return position_name


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def list(request, payload):
    is_user = payload.get('is_user')

    org = get_object_or_404(Org, employee__user=request.user)
    if is_user:
        qs = Employee.objects.filter(org=org)
        qs = qs.filter(user__is_user=True)
    else:
        qs = Employee.objects.filter(org=org)
    if not qs:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1,
        }
        return JsonResponse(rsp)

    оруулах_талбарууд = ['id', 'position_id', 'is_admin', 'user_id', 'token']
    хувьсах_талбарууд = [
        {"field": "user_id", "action": _get_name, "new_field": "user__first_name"},
        {"field": "user_id", "action": _get_email, "new_field": "user__email"},
        {"field": "position_id", "action": _get_position_name, "new_field": "position"},
    ]
    нэмэлт_талбарууд = [
        {"field": "role_name", "action": _get_role_name},
    ]

    datatable = Datatable(
        model=Employee,
        payload=payload,
        initial_qs=qs,
        оруулах_талбарууд=оруулах_талбарууд,
        нэмэлт_талбарууд=нэмэлт_талбарууд,
        хувьсах_талбарууд=хувьсах_талбарууд
    )
    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
    }

    return JsonResponse(rsp)


def _set_user(user, user_detail):

    user.username = user_detail['username']
    user.first_name = user_detail['first_name']
    user.last_name = user_detail['last_name']
    user.email = user_detail['email']
    user.gender = user_detail['gender']
    user.register = user_detail['register']
    user.phone_number = user_detail['phone_number']
    user.is_user = user_detail['is_user']

    is_user = user_detail['is_user']
    if is_user:
        user.is_active = True
    else:
        user.is_active = False

    user.save()


def _set_employee(employee, user_detail):
    employee.position_id = int(user_detail['position'])
    employee.state = int(user_detail['state']) if user_detail['state'] else None
    employee.pro_class = int(user_detail['pro_class']) if user_detail['pro_class'] else None
    employee.is_admin = user_detail['is_admin']
    employee.phone_number = user_detail['phone_number']

    employee.save()


def _set_emp_perm_ins(emp_perm, perm, user):

    feature_id = perm.get('feature_id')
    property_id = perm.get('property_id')
    perm_kind = get_convert_perm_kind(EmpPermInspire, perm.get('perm_kind'))

    emp_perm_inspire = EmpPermInspire()

    gov_perm_ins_id = perm.get("gov_perm_ins_id")
    if gov_perm_ins_id:
        emp_perm_inspire.emp_role_inspire = None
        emp_perm_inspire.gov_perm_inspire_id = gov_perm_ins_id
    else:
        emp_role_ins_id = perm.get("emp_role_ins_id")
        emp_role_inspire = EmpRoleInspire.objects.filter(pk=emp_role_ins_id).first()
        gov_perm_inspire = emp_role_inspire.gov_perm_inspire
        emp_perm_inspire.emp_role_inspire = emp_role_inspire
        emp_perm_inspire.gov_perm_inspire = gov_perm_inspire

    if property_id == 'geom':
        emp_perm_inspire.geom = True
    else:
        emp_perm_inspire.property_id = property_id

    emp_perm_inspire.emp_perm = emp_perm
    emp_perm_inspire.feature_id = feature_id
    emp_perm_inspire.created_by = user
    emp_perm_inspire.updated_by = user
    emp_perm_inspire.perm_kind = perm_kind
    return emp_perm_inspire


def _employee_validation(user, user_detail):
    errors = {}
    username = user_detail['username']
    last_name = user_detail['last_name']
    first_name = user_detail['first_name']
    position = user_detail['position']
    email = user_detail['email']
    register = user_detail['register']
    phone_number = user_detail['phone_number']
    if not username:
        errors['username'] = 'Хоосон байна утга оруулна уу.'
    elif len(username) > 150:
        errors['username'] = '150-с илүүгүй урттай утга оруулна уу!'
    if not position:
        errors['position'] = 'Хоосон байна утга оруулна уу.'
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
    if not phone_number:
        errors['phone_number'] = 'Хоосон байна утга оруулна уу.'
    elif len(phone_number) > 8:
        errors['phone_number'] = '8-с илүүгүй урттай утга оруулна уу!'
    elif len(phone_number) < 8:
        errors['phone_number'] = '8 урттай утга оруулна уу!'
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
    if len(register) == 10:
        if not utils.is_register(register):
            errors['register'] = 'Регистер дугаараа зөв оруулна уу.'
    else:
        errors['register'] = 'Регистер дугаараа зөв оруулна уу.'
    return errors


def _get_point_for_db(coordinate):
    if not coordinate:
        return ''

    if isinstance(coordinate, str):
        coordinate = coordinate.split(",")

    point = utils.get_geom_for_filter_from_coordinate(coordinate, 'Point')
    return point


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def create(request, payload):

    user_detail = payload.get('user_detail')
    roles = payload.get('roles')

    address = payload.get('address')
    level_1 = address.get('level_1')
    level_2 = address.get('level_2')
    level_3 = address.get('level_3')
    street = address.get('street')
    apartment = address.get('apartment')
    door_number = address.get('door_number')
    point_coordinate = address.get('point_coordinate')
    address_state = address.get('address_state')
    point = _get_point_for_db(point_coordinate)
    address['point'] = point
    is_user = user_detail['is_user'] or False

    emp_role_id = payload.get('emp_role_id') or None
    org = get_object_or_404(Org, employee__user=request.user)
    user = get_object_or_404(User, employee__user=request.user)
    get_object_or_404(Employee, user=request.user, is_admin=True)

    errors = _employee_validation(None, user_detail)
    if errors:
        return JsonResponse({
            'success': False,
            'errors': errors
        })

    form = EmployeeAddressForm(address)

    if form.is_valid() and not errors:
        with transaction.atomic():
            user = User()
            _set_user(user, user_detail)

            employee = Employee()
            employee.org = org
            employee.user = user
            employee.token = TokenGeneratorEmployee().get()
            _set_employee(employee, user_detail)

            emp_perm = EmpPerm()
            emp_perm.created_by = user
            emp_perm.emp_role_id = emp_role_id
            emp_perm.employee_id = employee.id
            emp_perm.updated_by = user
            emp_perm.save()

            employee_address = EmployeeAddress()
            employee_address.employee = employee
            employee_address.level_1 = level_1
            employee_address.level_2 = level_2
            employee_address.level_3 = level_3
            employee_address.street = street
            employee_address.apartment = apartment
            employee_address.door_number = door_number
            employee_address.point = point
            employee_address.address_state = _get_address_state_code(address_state)
            employee_address.save()

            obj_array = []
            for role in roles:
                emp_perm_inspire = _set_emp_perm_ins(emp_perm, role, request.user)
                obj_array.append(emp_perm_inspire)
            EmpPermInspire.objects.bulk_create(obj_array)

            if is_user:
                utils.send_approve_email(user)

        rsp = {
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        }
    else:
        rsp = {
                'success': False,
                'errors': {**form.errors, **errors},
            }

    return JsonResponse(rsp)


def _delete_old_emp_role(emp_perm):
    EmpPermInspire.objects.filter(emp_perm=emp_perm).delete()


def _delete_remove_perm(remove_perms):
    EmpPermInspire.objects.filter(pk__in=remove_perms).delete()


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def update(request, payload, pk):
    user_detail = payload.get('user_detail')
    can_update = False
    role_id = payload.get('role_id') or None
    add_perms = payload.get('add_perm')
    remove_perms = payload.get('remove_perm')
    employee = get_object_or_404(Employee, pk=pk)
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    new_emp_role = EmpRole.objects.filter(id=role_id).first()

    address = payload.get('address')
    point_coordinate = address.get('point')
    point = _get_point_for_db(point_coordinate)
    address['point'] = point

    address_state = address.get('address_state')
    address_state = _get_address_state_code(address_state)
    address['address_state'] = address_state
    is_user = user_detail['is_user'] or False

    if employee.user == request.user:
        can_update = True
    else:
        get_object_or_404(Employee, user=request.user, is_admin=True)
        can_update = True

    if can_update:
        errors = _employee_validation(employee.user, user_detail)
        if errors:
            return JsonResponse({
                'success': False,
                'errors': errors
            })

        form = EmployeeAddressForm(address)
        if form.is_valid() and not errors:
            with transaction.atomic():
                if emp_perm:
                    old_emp_role = emp_perm.emp_role
                    if new_emp_role != old_emp_role:
                        _delete_old_emp_role(emp_perm)
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
                    obj_array = []
                    for perm in add_perms:
                        emp_perm_inspire = _set_emp_perm_ins(emp_perm, perm, request.user)
                        obj_array.append(emp_perm_inspire)
                    EmpPermInspire.objects.bulk_create(obj_array)

                address_qs = EmployeeAddress.objects
                address_qs = address_qs.filter(employee=employee)
                if address_qs:
                    address_qs.update(
                        **address
                    )
                else:
                    address_qs.create(employee=employee, **address)

                user = employee.user
                _set_user(user, user_detail)

                employee = employee
                _set_employee(employee, user_detail)

                if is_user:
                    utils.send_approve_email(user)

            return JsonResponse({
                'success': True,
                'info': 'Амжилттай хадгаллаа'
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': {**form.errors, **errors},
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
        emp_perm_properties = EmpPermInspire.objects.filter(emp_perm=emp_perm, feature_id=feature_id).distinct('property_id').exclude(property_id__isnull=True).values('property_id', 'perm_kind')
        property_data, perm_list = get_property_data_display(None, feature_id, emp_perm, EmpPermInspire, True)
        properties.append(property_data)
        property_perm_count = count_property_of_feature(emp_perm_properties)
        for perm in perm_list:
            kind_name = get_perm_kind_name(perm['kind'])
            property_perm_count[kind_name] = property_perm_count[kind_name] + 1
        property_of_feature[feature_id] = property_perm_count

        for property_id in emp_perm_properties:
            prop = LProperties.objects.get(property_id=property_id['property_id'])
            property_data, perm_list = get_property_data_display(prop, feature_id, emp_perm, EmpPermInspire, False)
            properties.append(property_data)

    package_features = [
        get_package_features_data_display(package_id, LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True), property_of_feature)
        for package_id in package_ids
    ]

    themes = [
        get_theme_data_display(theme_id, LPackages.objects.filter(theme_id=theme_id, package_id__in=package_ids).values_list('package_id', flat=True), package_features)
        for theme_id in theme_ids
    ]

    return {
        'themes': themes,
        'package_features': package_features,
        'property': properties
    }


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def detail(request, pk):

    employee = get_object_or_404(Employee, pk=pk)
    employee_detail = _get_employee_display(employee)
    emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()

    role_id = ''
    role_name = ''
    perms = None
    if emp_perm:
        if emp_perm.emp_role:
            emp_role = emp_perm.emp_role
            role_id = emp_role.id
            role_name = emp_role.name
        perms = _get_emp_perm_display(emp_perm)

    rsp = {
        'success': True,
        'employee_detail': employee_detail,
        'role_id': role_id,
        'role_name': role_name,
        'perms': perms,

    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def delete(request, pk):
    get_object_or_404(Employee, user=request.user, is_admin=True)
    employee = get_object_or_404(Employee, pk=pk)
    user = User.objects.filter(pk=employee.user_id).first()
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    change_requests = ChangeRequest.objects.filter(employee=employee)

    with transaction.atomic():
        for change_request in change_requests:
            change_request.employee = None
            change_request.save()
        if emp_perm:
            EmpPermInspire.objects.filter(emp_perm=emp_perm).delete()
            emp_perm.delete()
        employee.delete()
        user.delete()

        return JsonResponse({'success': True})

    return JsonResponse({'success': False})


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def refresh_token(request, pk):

    employee = get_object_or_404(Employee, pk=pk)
    req_employee = get_object_or_404(Employee, user=request.user)
    if req_employee.is_admin:

        employee.token = TokenGeneratorEmployee().get()
        employee.save()

        rsp = {
            'success': True,
            'info': 'Токенийг амжилттай шинэчиллээ!'
        }

    else:
        rsp = {
            'success': False,
            'info': 'Та байгууллагын админ биш байна.'
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def send_mail(request, payload):
    subject = 'Геопортал нууц үг солих'
    text = 'Дараах холбоос дээр дарж нууц үгээ солино уу!'
    username = payload.get('username')

    user = get_object_or_404(User, username=username)

    utils.send_approve_email(user, subject, text)

    return JsonResponse({'success': True, 'info': 'Амжилттай илгээлээ.'})


def _is_cloned_feature(address_qs):
    is_cloned = False
    erguul_id = address_qs.employeeerguul_set.filter(is_over=False)
    if erguul_id:
        is_cloned = True
    return is_cloned


def _get_feature_collection(employees):
    points = []
    for employee in employees:
        addresses = EmployeeAddress.objects
        addresses = addresses.filter(employee=employee)
        addresses = addresses.first()
        if addresses:
            point_info = dict()
            point = addresses.point
            point_info['id'] = addresses.employee.id
            point_info['first_name'] = addresses.employee.user.first_name   # etseg
            point_info['last_name'] = addresses.employee.user.last_name     # onooj ogson ner
            point_info['is_cloned'] = _is_cloned_feature(addresses)
            if point:
                feature = utils.get_feature_from_geojson(point.json, properties=point_info)
                points.append(feature)

        erguul = EmployeeErguul.objects
        erguul = erguul.filter(address=addresses)
        erguul = erguul.filter(is_over=False)
        erguul = erguul.first()
        if erguul:
            erguul_info = dict()
            point = erguul.point
            erguul_info['id'] = employee.id
            erguul_info['is_erguul'] = True
            erguul_info['first_name'] = employee.user.first_name    # etseg
            erguul_info['last_name'] = employee.user.last_name  # onooj ogson ner

            if point:
                feature = utils.get_feature_from_geojson(point.json, properties=erguul_info)
                points.append(feature)

    feature_collection = FeatureCollection(points)
    return feature_collection


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_addresses(request, payload):
    value = payload.get('value')
    choose = payload.get('choose')
    employee = get_object_or_404(Employee, user=request.user)
    if employee.is_admin:
        if choose == 'all':
            employees = Employee.objects.all()
        elif choose == 'level':
            org = Org.objects.filter(level=value)
            employees = Employee.objects.filter(org_id__in=org)
        elif choose == 'org':
            org = get_object_or_404(Org, id=value)
            employees = Employee.objects.filter(org=org)
        else:
            org = employee.org
            employees = Employee.objects
            employees = employees.filter(org=org)
    else:
        raise Http404

    feature_collection = _get_feature_collection(employees)

    rsp = {
        'success': True,
        'points': feature_collection,
    }
    return JsonResponse(rsp)


def _get_erguul_qs(employee):
    tailbar = {}

    address_id = employee.employeeaddress_set.values_list('id', flat=True).first()

    erguul_qs = EmployeeErguul.objects
    erguul_qs = erguul_qs.filter(address_id=address_id)
    erguul_qs = erguul_qs.filter(is_over=False)

    if erguul_qs:
        erguul = erguul_qs.first()
        tailbar = ErguulTailbar.objects
        tailbar = tailbar.filter(erguul=erguul).values().first()

    return tailbar


def _get_tailbar(tailbar, field):
    value = ''
    if tailbar:
        value = tailbar[field]
    return value


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_field_tailbar(request):
    tailbar_id = ''
    employee = get_object_or_404(Employee, user=request.user)
    send_fields = []
    tailbar = _get_erguul_qs(employee)
    if tailbar:
        tailbar_id = tailbar['id']
    for f in ErguulTailbar._meta.get_fields():
        type_name = f.get_internal_type()
        not_list = ['OneToOneField', 'AutoField']
        if type_name not in not_list:
            not_field = ['created_at']
            if f.name not in not_field:
                if hasattr(f, 'verbose_name') and hasattr(f, 'max_length'):
                    field_type = ''
                    value = _get_tailbar(tailbar, f.name)
                    if 'date' in f.name:
                        field_type = 'date'
                    send_fields.append({
                        'origin_name': f.name,
                        'name': f.verbose_name,
                        'length': f.max_length,
                        'choices': f.choices,
                        'disabled': False,
                        'type': field_type,
                        'value': value,
                    })

    rsp = {
        'success': True,
        'fields': send_fields,
        'id': tailbar_id,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def save_field_tailbar(request, payload):

    values = payload.get('values')
    pk = payload.get('id')

    with transaction.atomic():
        if pk:
            erguul_qs = ErguulTailbar.objects
            erguul_qs = erguul_qs.filter(pk=pk)
            erguul_qs.update(**values)

        else:
            address_id = request.user.employee_set.values_list('employeeaddress', flat=True).first()
            if address_id:
                address = get_object_or_404(EmployeeAddress, id=address_id)

                erguul_qs = EmployeeErguul.objects
                erguul_qs = erguul_qs.filter(address=address)
                erguul_qs = erguul_qs.filter(is_over=False)
                erguul = erguul_qs.first()

                erguul_qs.update(is_over=True)

                values['erguul_id'] = erguul.id

                ErguulTailbar.objects.create(**values)

    rsp = {
        'success': True,
        'info': 'Амжилттай хадгаллаа'
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_erguul(request):
    employee = get_object_or_404(Employee, user=request.user)
    feature_collection = _get_feature_collection([employee])

    rsp = {
        'success': True,
        'points': feature_collection,
    }
    return JsonResponse(rsp)


def _get_part_time(part_time, item):
    return "Үдээс хойш" if part_time == 1 else "Үдээс өмнө"


def _get_state(state, item):
    user = ErguulTailbar.objects.filter(erguul=item['id']).first()
    if user is not None:
        state = user.state
        if state == 1:
            state = "Гарсан"
        elif state == 2:
            state = "Гараагүй"
    else:
        state = "Гарч байгаа"
    return state


def _get_fullname(address_id, item):
    address = EmployeeAddress.objects.filter(id=address_id).first()
    user = address.employee.user
    fullname = user.last_name[0].upper() + '.' + user.first_name.upper()
    return fullname


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def erguul_list(request, payload):

    employee = get_object_or_404(Employee, user=request.user)
    is_admin = employee.is_admin

    if is_admin:
        org_id = employee.org.id
        emp_ids = Employee.objects.filter(org_id=org_id).values_list('id', flat=True)
        emps_address = EmployeeAddress.objects.filter(employee_id__in=emp_ids).values_list('id', flat=True)
        qs = EmployeeErguul.objects.filter(address_id__in=emps_address)
    else:
        employee_address = EmployeeAddress.objects.filter(employee=employee).first()
        qs = EmployeeErguul.objects.filter(address=employee_address)

    if qs:
        оруулах_талбарууд = ['address_id', 'apartment', 'date_start', 'date_end', 'part_time']
        хувьсах_талбарууд = [
            {"field": "part_time", "action": _get_part_time, "new_field": "part_time"},
            {"field": "apartment", "action": _get_state, "new_field": "state"},
            {"field": "address_id", "action": _get_fullname, "new_field": "fullname"},
        ]

        datatable = Datatable(
            model=EmployeeErguul,
            payload=payload,
            initial_qs=qs,
            оруулах_талбарууд=оруулах_талбарууд,
            хувьсах_талбарууд=хувьсах_талбарууд,
        )
        items, total_page = datatable.get()

        rsp = {
            'items': items,
            'page': payload.get("page"),
            'total_page': total_page,
        }
    else:
        rsp = {
            'items': [],
            'page': payload.get("page"),
            'total_page': 1,

        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_erguul_info(request, pk):
    location = EmployeeAddress.objects.filter(id=pk).first()
    erguul = EmployeeErguul.objects.filter(address_id=pk).first()
    status = ErguulTailbar.objects.filter(erguul_id=erguul.id).first()
    name = get_object_or_404(Employee, id=location.employee_id)
    name = name.user
    erguul_level_3 = erguul.level_3
    erguul_street = erguul.street
    erguul_date_starttime = erguul.date_start.strftime('%Y-%m-%d')
    erguul_date_endtime = erguul.date_end.strftime('%Y-%m-%d')

    if status:
        desc = status.description
        status = status.state
        if status == ErguulTailbar.DONE:
            status = "Гарсан",
            indicate = 'text-success',

        elif status == ErguulTailbar.NOT_DONE:
            status = "Гараагүй",
            indicate = 'text-danger',

    else:
        status = "Гарч байгаа",
        indicate = 'text-warning',


    rsp = {
        'success': True,
        'first_name': name.first_name,
        'last_name': name.last_name,
        'desc': desc,
        'local_lvl1': location.level_1,
        'local_lvl2': location.level_2,
        'status': status,
        'date_start': erguul_date_starttime,
        'date_end': erguul_date_endtime,
        'erguul_level3': erguul_level_3,
        'erguul_street': erguul_street,
        'indicate':indicate,
    }
    return JsonResponse(rsp)
