from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse, Http404
from django.db import transaction
from geojson import FeatureCollection
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchVector
from django.db.models import Count, Q

from geoportal_app.models import User
from backend.org.models import Org, Employee, EmployeeAddress, EmployeeErguul, ErguulTailbar, Position
from main.decorators import ajax_required
from backend.token.utils import TokenGeneratorEmployee
from backend.payment.models import Payment
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

from govorg.backend.role.employee import utils as employee_utils


def _get_address_state_db_value(address_state):
    if address_state == EmployeeAddress.STATE_REGULER_CODE:
        address_state = True
    else:
        address_state = False
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
        'position': employee.position.name if employee.position else '',
        'position_id': employee.position.id if employee.position else '',
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
        'is_active': user.is_active,

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
    position_name = ''
    position = Position.objects.filter(id=postition_id).first()
    if position:
        position_name = position.name
    return position_name


def _get_state_name(state_id, item):
    if state_id == Employee.STATE_WORKING_CODE:
        state = Employee.STATE_WORKING
    elif state_id == Employee.STATE_BREAK_CODE:
        state = Employee.STATE_BREAK
    elif state_id == Employee.STATE_FIRED_CODE:
        state = Employee.STATE_FIRED
    else:
        state = Employee.STATE_SICK
    return state


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def list(request, payload):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    org = get_object_or_404(Org, employee=employee)

    qs = Employee.objects
    qs = qs.filter(org=org)
    qs = qs.annotate(search=SearchVector(
        "user__email",
        "user__first_name",
        "user__last_name"
    ))

    custom_query = payload.get('custom_query')
    if custom_query:
        if 'user__is_user' in custom_query and custom_query['user__is_user'] is True:
            qs = qs.exclude(state=Employee.STATE_FIRED_CODE)
            qs = qs.filter(**custom_query)
        else:
            qs = qs.filter(**custom_query)

    qs = qs.filter(search__icontains=payload.get('query'))
    if not qs:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1,
        }
        return JsonResponse(rsp)

    оруулах_талбарууд = ['id', 'state', 'position_id', 'is_admin', 'user_id', 'token']
    хувьсах_талбарууд = [
        {"field": "user_id", "action": _get_name, "new_field": "user__first_name"},
        {"field": "user_id", "action": _get_email, "new_field": "user__email"},
        {"field": "state", "action": _get_state_name, "new_field": "user_state"},
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
        хувьсах_талбарууд=хувьсах_талбарууд,
        has_search=False,
    )
    items, total_page, start_index = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
        'start_index': start_index
    }

    return JsonResponse(rsp)


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


def _check_local_id(emp_perm, user):
    emp_local_perms = []
    emp_perm_inspire = emp_perm.empperminspire_set
    geom_perm_inspire = emp_perm_inspire.filter(geom=True)
    has_geom_qs = geom_perm_inspire.filter(perm_kind__in=[EmpPermInspire.PERM_UPDATE, EmpPermInspire.PERM_REMOVE])
    if has_geom_qs:
        property_local = LProperties.objects.filter(property_code__iexact='localId').first()
        if property_local:
            create_local_perms = [EmpPermInspire.PERM_VIEW, EmpPermInspire.PERM_UPDATE, EmpPermInspire.PERM_REMOVE]
            has_geom_qs = has_geom_qs.annotate(f_count=Count('feature_id'))
            property_id = property_local.property_id
            for emp_perm_qs in has_geom_qs:
                feature_id = emp_perm_qs.feature_id
                gov_perm_inspire_id = emp_perm_qs.gov_perm_inspire.id
                data_type_id = emp_perm_qs.data_type_id
                emp_perm_inspire = emp_perm_inspire.filter(geom=False)
                emp_perm_inspire = emp_perm_inspire.filter(property_id=property_id)
                emp_perm_inspire = emp_perm_inspire.filter(feature_id=feature_id)
                emp_perm_inspire = emp_perm_inspire.filter(data_type_id=data_type_id)
                if not emp_perm_inspire:
                    for perm_kind in create_local_perms:
                        emp_perm_inspire_dict = dict()
                        emp_perm_inspire_dict['gov_perm_inspire_id'] = gov_perm_inspire_id
                        emp_perm_inspire_dict['emp_perm'] = emp_perm
                        emp_perm_inspire_dict['perm_kind'] = perm_kind
                        emp_perm_inspire_dict['feature_id'] = feature_id
                        emp_perm_inspire_dict['data_type_id'] = data_type_id
                        emp_perm_inspire_dict['property_id'] = property_id
                        emp_perm_inspire_dict['geom'] = False
                        emp_perm_inspire_dict['created_by'] = user
                        emp_perm_inspire_dict['updated_by'] = user
                        obj = EmpPermInspire(**emp_perm_inspire_dict)
                        emp_local_perms.append(obj)
    if emp_local_perms:
        EmpPermInspire.objects.bulk_create(emp_local_perms)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def create(request, payload):
    values = payload.get('user_detail')
    username = values.get('username')
    roles = payload.get('roles')
    emp_role_id = payload.get('emp_role_id') or None
    is_user = values.get('is_user')
    errors = dict()

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user, is_admin=True)
    org = get_object_or_404(Org, employee=employee)

    qs_user = User.objects
    qs_employee = Employee.objects
    qs_employee_address = EmployeeAddress.objects

    qs_user = qs_user.filter(username=username)
    user = qs_user.first()

    user_detail = employee_utils.make_user_detail(payload)
    employee_detail = employee_utils.make_employee_detail(payload)
    employee_address_detail = employee_utils.make_employee_address(payload)

    if int(employee_detail.get('state')) == 3:  # TODO халагдсан төлөвт ажилтан нэмэхгүй байгаа өөрчилж магадгүй
        error = {"state": '"{}"-өөс бусад төлөвт шинээр албан хаагч үүсгэх боломжтой!'.format(Employee.STATE_FIRED.upper())}
        errors.update(error)

    if user:
        is_fired_employee = employee_utils.is_fired_employee(user, qs_employee)
        if is_fired_employee:
            errors.update(employee_utils.user_validition(user_detail, user))
        else:
            errors.update(employee_utils.user_validition(user_detail))
    else:
        errors.update(employee_utils.user_validition(user_detail))

    errors.update(employee_utils.employee_validition(employee_detail))
    errors.update(employee_utils.employee_add_validator(employee_address_detail))

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():
        user, created = qs_user.update_or_create(username=username, defaults=user_detail)

        employee_detail['org'] = org
        employee_detail['user'] = user
        employee = qs_employee.create(**employee_detail)

        employee_address_detail['employee'] = employee
        qs_employee_address.create(**employee_address_detail)

        emp_perm = EmpPerm()
        emp_perm.emp_role_id = emp_role_id
        emp_perm.employee_id = employee.id
        emp_perm.created_by = request.user
        emp_perm.updated_by = request.user
        emp_perm.save()

        obj_array = []
        for role in roles:
            emp_perm_inspire = _set_emp_perm_ins(emp_perm, role, request.user)
            obj_array.append(emp_perm_inspire)

        EmpPermInspire.objects.bulk_create(obj_array)

        if is_user:
            utils.send_approve_email(user)

        rsp = {
            'success': True,
            'employee': {
                'id': employee.id,
                'user_id': employee.user_id,
            }
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
    role_id = payload.get('role_id') or None
    add_perms = payload.get('add_perm')
    remove_perms = payload.get('remove_perm')
    values = payload.get('user_detail')
    is_user = values.get('is_user')
    errors = dict()

    get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user, is_admin=True)  # TODO бйагууллагын админ засах эрхтэй

    qs_user = User.objects
    qs_employee = Employee.objects
    qs_address = EmployeeAddress.objects

    employee_qs = qs_employee.filter(~Q(state=Employee.STATE_FIRED_CODE))  # TODO update хийх ажилтны query_set
    employee_qs = employee_utils.check_qs(qs_employee, {"pk": pk})
    employee = employee_qs.first()

    qs_user = employee_utils.check_qs(qs_user, {"pk": employee.user_id})
    qs_address = employee_utils.check_qs(qs_address, {"employee": employee})
    employee_address = qs_address.first()

    user = qs_user.first()
    emp_perm = EmpPerm.objects.filter(employee=employee).first()
    new_emp_role = EmpRole.objects.filter(id=role_id).first()

    user_detail = employee_utils.make_user_detail(payload)
    employee_detail = employee_utils.make_employee_detail(payload, employee)
    employee_address_detail = employee_utils.make_employee_address(payload)

    qs_employee = qs_employee.filter(~Q(pk=pk), user=user)
    is_fired_employee = employee_utils.is_fired_employee(user, qs_employee)

    if not is_fired_employee:
        error = {"username": 'Хэрэглэгч бүртгэлтэй байна!'}
        errors.update(error)

    errors.update(employee_utils.user_validition(user_detail, user))
    errors.update(employee_utils.employee_validition(employee_detail, employee))
    errors.update(employee_utils.employee_add_validator(employee_address_detail, employee_address))

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():

        old_is_user = user.is_user

        qs_user.update(**user_detail)
        employee_qs.update(**employee_detail)    # TODO тухайн албан хаагчаа update хийнэ

        if employee_address:
            qs_address.update(**employee_address_detail)
        else:
            employee_address_detail['employee'] = employee
            qs_address.create(**employee_address_detail)

        if emp_perm:
            old_emp_role = emp_perm.emp_role
            if new_emp_role != old_emp_role:
                _delete_old_emp_role(emp_perm)
                emp_perm.emp_role = new_emp_role
                emp_perm.save()
        else:
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

            emp_inspire_perms = EmpPermInspire.objects.filter(emp_perm=emp_perm)
            if emp_inspire_perms:
                emp_inspire_perms.delete()

            EmpPermInspire.objects.bulk_create(obj_array)

        _check_local_id(emp_perm, user)

        if not old_is_user and is_user:
            utils.send_approve_email(user)

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай хадгаллаа'
        })


def _get_emp_perm_display(emp_perm):

    gov_perm = emp_perm.employee.org.govperm_set.first()
    gov_perm_inspire_qs = gov_perm.govperminspire_set
    feature_ids = EmpPermInspire.objects.filter(emp_perm=emp_perm).distinct('feature_id').values_list('feature_id', flat=True)
    package_ids = LFeatures.objects.filter(feature_id__in=feature_ids).distinct('package_id').exclude(package_id__isnull=True).values_list('package_id', flat=True)
    theme_ids = LPackages.objects.filter(package_id__in=package_ids).distinct('theme_id').exclude(theme_id__isnull=True).values_list('theme_id', flat=True)

    properties = []
    property_of_feature = {}

    for feature_id in feature_ids:
        emp_perm_properties = EmpPermInspire.objects.filter(emp_perm=emp_perm, feature_id=feature_id).exclude(property_id__isnull=True)
        emp_perm_properties = emp_perm_properties.exclude(property_id=1)
        emp_perm_properties = emp_perm_properties.values('property_id', 'perm_kind')
        property_data, perm_list = get_property_data_display(None, feature_id, emp_perm, EmpPermInspire, True)
        properties.append(property_data)

        property_perm_count = count_property_of_feature(emp_perm_properties)
        for perm in perm_list:
            kind_name = get_perm_kind_name(perm['kind'])
            property_perm_count[kind_name] = property_perm_count[kind_name] + 1

        property_of_feature[feature_id] = property_perm_count
        emp_perm_properties = emp_perm_properties.distinct('property_id')
        for property_id in emp_perm_properties:
            prop = LProperties.objects.filter(property_id=property_id['property_id']).first()
            if prop:
                property_data, perm_list = get_property_data_display(prop, feature_id, emp_perm, EmpPermInspire, False)
                properties.append(property_data)

    package_features = [
        get_package_features_data_display(package_id, LFeatures.objects.filter(package_id=package_id, feature_id__in=feature_ids).values_list('feature_id', flat=True), property_of_feature, gov_perm_inspire_qs)
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
    user = request.user
    qs = Employee.objects

    logged_in_employee = qs.filter(user=user).first()
    allowed_org_id = logged_in_employee.org_id

    employee = get_object_or_404(qs, pk=pk)
    org_id = employee.org_id

    if allowed_org_id == org_id:
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
    else:
        raise Http404


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def delete(request, pk):
    get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user, is_admin=True)
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), pk=pk)
    user_log = Payment.objects.filter(user=employee.user)
    if user_log:
        return JsonResponse({'success': False})
    else:
        employee.state = 3
        employee.save()
        return JsonResponse({'success': True})


# -----------TODO Хэрэглэгчийг баазаас устгах үед ашиглана -------------
# @require_GET
# @ajax_required
# @login_required(login_url='/gov/secure/login/')
# def delete(request, pk):
#     get_object_or_404(Employee, user=request.user, is_admin=True)
#     employee = get_object_or_404(Employee, pk=pk)
#     user = User.objects.filter(pk=employee.user_id).first()
#     emp_perm = EmpPerm.objects.filter(employee=employee).first()
#     change_requests = ChangeRequest.objects.filter(employee=employee)

#     with transaction.atomic():
#         for change_request in change_requests:
#             change_request.employee = None
#             change_request.save()
#         if emp_perm:
#             EmpPermInspire.objects.filter(emp_perm=emp_perm).delete()
#             emp_perm.delete()
#         employee.delete()
#         user.delete()

#         return JsonResponse({'success': True})

#     return JsonResponse({'success': False})


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def refresh_token(request, pk):

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), pk=pk)
    req_employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
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
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
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
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
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
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
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

    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
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
        оруулах_талбарууд = ['id', 'address_id', 'apartment', 'date_start', 'date_end', 'part_time']
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
        items, total_page, start_index = datatable.get()

        rsp = {
            'items': items,
            'page': payload.get("page"),
            'total_page': total_page,
            'start_index': start_index
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
    erguul = get_object_or_404(EmployeeErguul, pk=pk)
    location = erguul.address
    status = ErguulTailbar.objects.filter(erguul=erguul).first()
    user = location.employee.user
    erguul_date_starttime = utils.datetime_to_string(erguul.date_start)
    erguul_date_endtime = utils.datetime_to_string(erguul.date_end)

    desc = 'Хоосон'
    if status:
        desc = status.description
        status = status.state
        if status == ErguulTailbar.DONE:
            status = "Гарсан",

        elif status == ErguulTailbar.NOT_DONE:
            status = "Гараагүй",

    else:
        status = "Гарч байгаа",

    rsp = {
        'success': True,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'desc': desc,
        'local_lvl1': location.level_1,
        'local_lvl2': location.level_2,
        'local_lvl3': location.level_3,
        'local_street': location.street,
        'local_apart': location.apartment,
        'local_dn': location.door_number,
        'status': status,
        'date_start': erguul_date_starttime,
        'date_end': erguul_date_endtime,
        'erguul_level3': erguul.level_3,
        'erguul_street': erguul.street,
        'erguul_apart': erguul.apartment,
    }
    return JsonResponse(rsp)
