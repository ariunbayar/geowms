from govorg.backend.role import employee
import os
import io
from django.http.response import Http404
from geojson import FeatureCollection
import PIL.Image as Image
import datetime
from collections import Counter

from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.forms.models import model_to_dict

from backend.govorg.models import GovOrg
from backend.inspire.models import LDataTypeConfigs
from backend.inspire.models import LDataTypes
from backend.inspire.models import LFeatureConfigs
from backend.inspire.models import LFeatures
from backend.inspire.models import LPackages
from backend.inspire.models import LProperties
from backend.inspire.models import LThemes
from backend.inspire.models import GovRole
from backend.inspire.models import GovPerm
from backend.inspire.models import EmpPerm
from backend.inspire.models import GovRoleInspire
from backend.inspire.models import GovPermInspire
from backend.inspire.models import EmpPermInspire
from backend.payment.models import Payment
from backend.token.utils import TokenGeneratorEmployee
from geoportal_app.models import User
from .models import Org, Employee, EmployeeAddress, EmployeeErguul, ErguulTailbar, Position
from govorg.backend.org_request.models import ChangeRequest
from .forms import EmployeeAddressForm
from main.components import Datatable
from geoportal_app.forms import UserForm
from .forms import EmployeeForm

from main.decorators import ajax_required
from main import utils


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def all(request, payload, level):
    last = payload.get("lastIndex")
    first = payload.get("firstIndex")
    orgs_display = []
    for org in Org.objects.filter(level=level)[first:last]:
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
        })
    return JsonResponse({
        'orgs': orgs_display,
        'len': Org.objects.filter(level=level).count()
    })


def _get_address_state_db_value(address_state):
    if address_state == EmployeeAddress.STATE_REGULER_CODE:
        address_state = True
    else:
        address_state = False
    return address_state


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_detail(request, pk):

    user = get_object_or_404(User, pk=pk)

    employee = Employee.objects
    employee = employee.filter(user=user)
    employee = employee.first()

    address = EmployeeAddress.objects
    address = address.filter(employee=employee)
    address = address.first()

    employees_display = {
        'id': user.id,
        'last_name': user.last_name,
        'username': user.username,
        'first_name': user.first_name,
        'email': user.email,
        'register': user.register,
        'gender': user.gender,
        'is_super': user.is_superuser,
        'is_active': user.is_active,
        'is_sso': user.is_sso,
        'is_user': user.is_user,

        'token': employee.token,
        'position': employee.position.name,
        'position_id': employee.position.id,
        'state': employee.get_state_display(),
        'state_id': employee.state,
        'pro_class_id': employee.pro_class,
        'pro_class': employee.get_pro_class_display(),
        'is_admin': employee.is_admin,
        'created_at': employee.created_at.strftime('%Y-%m-%d'),
        'updated_at': employee.updated_at.strftime('%Y-%m-%d'),
        'phone_number': employee.phone_number,

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

    return JsonResponse({'success': True, 'employee': employees_display})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_token_refresh(request, pk):
    employee = get_object_or_404(Employee, user_id=pk)
    employee.token = TokenGeneratorEmployee().get()
    employee.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


def _get_address_state_code(address_state):
    if address_state:
        address_state = EmployeeAddress.STATE_REGULER_CODE
    elif not address_state:
        address_state = EmployeeAddress.STATE_SHORT_CODE
    return address_state


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_update(request, payload, pk, level):
    payload = payload.get("payload")
    values = payload.get('values')
    password = values.get('password')
    is_user = values.get('is_user')

    qs_user = User.objects
    qs_user = qs_user.filter(id=pk)
    if not qs_user:
        raise Http404

    user = qs_user.first()
    user_detail = _make_user_detail(values)

    employee_detail = _make_employee_detail(values)
    qs_employee = Employee.objects
    qs_employee = qs_employee.filter(user_id=pk)
    if not qs_employee:
        raise Http404

    employee = qs_employee.first()

    employee_add = _make_employee_add(payload)
    qs_address = EmployeeAddress.objects
    qs_address = qs_address.filter(employee=employee)
    if not qs_address:
        raise Http404

    employee_address = qs_address.first()
    errors = _user_validition(user_detail, user)
    errors.update(_employee_validition(employee_detail, employee))
    errors.update(_employee_add_validator(employee_add, employee_address))

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():
        if password:
            password = user.set_password(password)
            user_detail['password'] = password

        qs_user.update(**user_detail)
        qs_employee.update(**employee_detail)
        if qs_address:
            qs_address.update(**employee_add)
        else:
            employee_add['employee'] = employee
            qs_address.create(**employee_add)

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


def _get_point_for_db(coordinate):
    if not coordinate:
        return ''

    if isinstance(coordinate, str):
        coordinate = coordinate.split(",")

    point = utils.get_geom_for_filter_from_coordinate(coordinate, 'Point')
    return point


def _make_user_detail(values):
    keys = ['id', 'is_super', 'position', 'is_admin', 'phone_number', 'state', 'pro_class']
    user_detail = utils.key_remove_of_dict(values, keys)

    user_detail['is_superuser'] = values.get('is_super') if values.get('is_super') else False
    user_detail['is_active'] = values.get('is_user')
    user_detail['register'] = values.get('register').upper()

    return user_detail


def _user_validition(user_detail, user=None):
    if user:
        form = UserForm(user_detail, instance=user)
    else:
        form = UserForm(user_detail)

    if not form.is_valid():
        return form.errors

    return {}


def _make_employee_detail(values):
    keys = [
        'id', 'username',  'first_name', 'last_name', 'email',
        'position', 'gender', 'is_super', 'is_user', 'register',
    ]
    employee_detail = utils.key_remove_of_dict(values, keys)
    employee_detail['position_id'] = values.get('position')
    employee_detail['token'] = TokenGeneratorEmployee().get()
    employee_detail['pro_class'] = int(values.get('pro_class')) if values.get('pro_class') else None

    return employee_detail


def _employee_validition(employee_detail, employee=None):
    if employee:
        form = EmployeeForm(employee_detail, instance=employee)
    else:
        form = EmployeeForm(employee_detail)
    if not form.is_valid():
        return form.errors

    return {}


def _make_employee_add(payload):
    address = payload.get('address')
    point_coordinate = address.get('point')
    point = _get_point_for_db(point_coordinate)
    address_state = address.get('address_state')

    address['point'] = point
    address['address_state'] = _get_address_state_code(address_state)

    return address


def _employee_add_validator(employee_add, employee_address=None):
    if employee_address:
        form = EmployeeAddressForm(employee_add, instance=employee_address)
    else:
        form = EmployeeAddressForm(employee_add)

    if not form.is_valid():
        return form.errors

    return {}


def _is_fired_employee(username, qs_user, qs_employee):
    qs_user = qs_user.filter(username=username)
    user = qs_user.first()

    if not user:
        return False, None, None

    qs_employee = qs_employee.filter(user=user)
    employee = qs_employee.first()
    if not employee:
        return False, None, None

    if employee.state == 3:
        return True, user, employee

    return False, None, None


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):
    payload = payload.get('payload')
    values = payload.get('values')
    is_user = values.get('is_user')
    username = values.get('username')

    org = get_object_or_404(Org, pk=pk, level=level)
    qs_user = User.objects
    qs_employee = Employee.objects
    qs_employee_address = EmployeeAddress.objects

    user_detail = _make_user_detail(values)
    employee_detail = _make_employee_detail(values)
    employee_add_detail = _make_employee_add(payload)
    is_fired_employee, user, employee = _is_fired_employee(username, qs_user, qs_employee)

    if is_fired_employee:
        errors = _user_validition(user_detail, user)
        errors.update(_employee_validition(employee_detail, employee))
        employee_address = qs_employee_address.filter(employee=employee).first()
        errors.update(_employee_add_validator(employee_add_detail, employee_address))
    else:
        errors = _user_validition(user_detail)
        errors.update(_employee_validition(employee_detail))
        errors.update(_employee_add_validator(employee_add_detail))

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():
        if is_fired_employee:
            state = int(employee_detail.get('state'))
            if state == 3:
                rsp = {
                    "success": False,
                    "errors": {
                        "state": 'Энэ хэрэглэгч нь нь бүртгэлтэй байна. "ЧӨЛӨӨЛӨГДСӨН"-өөс бусад төлөвт шинээр үүсгэх боломжтой!'
                    }
                }
                return JsonResponse(rsp)

            user.is_superuser = user_detail.get('is_superuser')
            user.first_name = user_detail.get('first_name')
            user.last_name = user_detail.get('last_name')
            user.gender = user_detail.get('gender')
            user.register = user_detail.get('register')
            user.save()
        else:
            user = qs_user.create(**user_detail)

        employee_detail['org'] = org
        employee_detail['user'] = user
        employee = qs_employee.create(**employee_detail)

        employee_add_detail['employee'] = employee
        qs_employee_address.create(**employee_add_detail)

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


def _set_state(employee):
    employee.state = 3
    employee.save()

    return True


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, pk):
    user = get_object_or_404(User, id=pk)
    employee = get_object_or_404(Employee, user=user)
    user_log = Payment.objects.filter(user=user)
    if user_log:
        return JsonResponse({'success': False})

    check = _set_state(employee)
    return JsonResponse({'success': check})


def _remove_user(user, employee):
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

        return True


def _org_validation(org_name, org_id):
    org = Org.objects.filter(pk=org_id).first()
    errors = {}

    if not org_name:
        errors['org_name'] = 'Хоосон байна утга оруулна уу.'
    elif org_name.isspace():
        errors['org_name'] = 'Хоосон байна утга оруулна уу.'
    elif len(org_name) > 150:
        errors['org_name'] = '150-с илүүгүй урттай утга оруулна уу!'

    if org:
        if org.name != org_name:
            if Org.objects.filter(name=org_name).first():
                errors['org_name'] = 'Ийм нэр бүртгэлтэй байна.'
    else:
        if Org.objects.filter(name=org_name).first():
            errors['org_name'] = 'Ийм нэр бүртгэлтэй байна.'

    return errors


def _delete_perms(perms_inspire):
    perms_inspire.delete()
    return


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_add(request, payload, level):
    org_name = payload.get('org_name')
    org_level = payload.get('org_level')
    role_id = payload.get('role_id')
    org_role_filter = GovRole.objects.filter(pk=role_id).first()
    org_id = payload.get('id')
    geo_id = payload.get('geo_id')
    objs = []

    errors = _org_validation(org_name, org_id)
    if errors:
        return JsonResponse({'success': False, 'errors': errors})
    # Байгууллага засах хэсэг
    if org_id:
        org = get_object_or_404(Org, pk=org_id)
        org.name = org_name
        org.level = org_level
        org.geo_id = geo_id
        org.save()
        if int(role_id) > -1:
            with transaction.atomic():
                objs = list()
                gov_role = org_role_filter
                all_gov_role_perms = gov_role.govroleinspire_set.all()
                gov_perm_qs = GovPerm.objects.filter(org=org_id)
                gov_perm = gov_perm_qs.first()
                has_role = gov_perm.gov_role
                gov_perms_inspire = gov_perm.govperminspire_set
                gov_perm_qs.update(gov_role_id=role_id)
                if has_role:
                    delete_ids = list()
                    for role_perm in has_role.govroleinspire_set.all():
                        gov_perm_role = role_perm.govperminspire_set.all()
                        if gov_perm_role:
                            for perm in gov_perm_role:
                                delete_ids.append(perm.id)
                        gov_perms_inspire.filter(id__in=delete_ids).delete()

                for gov_role_inspire in all_gov_role_perms:
                    has_perm = False
                    if gov_perms_inspire:
                        has_perm = gov_perms_inspire.filter(
                            feature_id=gov_role_inspire.feature_id,
                            perm_kind=gov_role_inspire.perm_kind,
                            property_id=gov_role_inspire.property_id,
                            data_type_id=gov_role_inspire.data_type_id,
                            geom=gov_role_inspire.geom,
                        )

                    if not has_perm:
                        objs.append(GovPermInspire(
                            gov_role_inspire=gov_role_inspire,
                            gov_perm=gov_perm,
                            perm_kind=gov_role_inspire.perm_kind,
                            feature_id=gov_role_inspire.feature_id,
                            property_id=gov_role_inspire.property_id,
                            data_type_id=gov_role_inspire.data_type_id,
                            geom=gov_role_inspire.geom,
                            created_by=gov_role_inspire.created_by,
                            updated_by=gov_role_inspire.updated_by,
                        ))
                GovPermInspire.objects.bulk_create(objs)
            return JsonResponse({'success': True})
    # # Байгууллага шинээр үүсгэх
    else:
        gov_role_inspire_all = GovRoleInspire.objects.filter(gov_role=org_role_filter)
        org = Org.objects.create(name=org_name, level=level, geo_id=geo_id)

        gov_perm = GovPerm.objects.create(
                org=org,
                created_by=request.user,
                updated_by=request.user
            )
        if org_role_filter:
            gov_perm.gov_role = org_role_filter
            gov_perm.save()

        if gov_role_inspire_all:
            for gov_role_inspire in gov_role_inspire_all:
                objs.append(GovPermInspire(
                    gov_role_inspire=gov_role_inspire,
                    gov_perm=gov_perm,
                    perm_kind=gov_role_inspire.perm_kind,
                    feature_id=gov_role_inspire.feature_id,
                    property_id=gov_role_inspire.property_id,
                    data_type_id=gov_role_inspire.data_type_id,
                    geom=gov_role_inspire.geom,
                    created_by=gov_role_inspire.created_by,
                    updated_by=gov_role_inspire.updated_by,
                ))
            GovPermInspire.objects.bulk_create(objs)

        def_pos = [
            "Байхгүй",
            "Сайд",
            "Дэд сайд",
            "Төрийн нарийн бичгийн дарга",
            "Дарга",
            "Орлогч дарга",
            "Тэргүүн дэд",
            "Газрын дарга",
            "Хэлтсийн дарга",
            "Ахлах шинжээч",
            "Шинжээч",
            "Ахлах мэргэжилтэн",
            "Мэргэжилтэн",
            "Зөвлөх"
        ]

        for pos in def_pos:
            Position.objects.create(
                name=pos,
                org=org
            )

        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_remove(request, payload, level):
    org_id = payload.get('org_id')
    org = get_object_or_404(Org, pk=org_id, level=level)
    org_users = Employee.objects.filter(org=org_id)
    gov_perm = GovPerm.objects.filter(org=org)
    with transaction.atomic():
        gov_perm.delete()
        for org_user in org_users:
            user = User.objects.filter(pk=org_user.user_id).first()
            if user:
                _remove_user(user, org_user)
        org_govorgs = GovOrg.objects.filter(org=org)
        for org_govorg in org_govorgs:
            org_govorg.org = None
            org_govorg.deleted_by = request.user
            org_govorg.deleted_at = localtime(now())
            org_govorg.save()

        org.orgrole_set.all().delete()
        org.position_set.all().delete()
        org.delete()
        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_list(request, payload, level):

    оруулах_талбарууд = ['id', 'name', 'level', 'num_employees', 'num_systems']
    items = []
    total_page = 1
    start_index = 1
    qs = Org.objects.filter(level=level)
    if qs:
        qs = qs.annotate(num_employees=Count('employee', distinct=True))
        qs = qs.annotate(num_systems=Count('govorg', distinct=True))

        datatable = Datatable(
            model=Org,
            initial_qs=qs,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд
        )
        items, total_page, start_index = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
        'start_index': start_index
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def detail(request, level, pk):
    org = get_object_or_404(Org, pk=pk, level=level)
    org_roles = GovPerm.objects.filter(org=org).first()
    org_role = -1
    geo_id = org.geo_id
    if org_roles:
        if org_roles.gov_role:
            org_role = org_roles.gov_role.id
    geom = utils.get_geom(org.geo_id, 'MultiPolygon')
    orgs_display = [{
        'id': org.id,
        'name': org.name,
        'level': org.level,
        'level_display': org.get_level_display(),
        'allowed_geom': geom.json if geom else None,
        'org_role': org_role,
        'geo_id': geo_id,
    }]

    return JsonResponse({
        'orgs': orgs_display,
        'count': org.employee_set.count(),
        'pos_count': org.position_set.count(),
    })


def _get_employee(employee, filter_from_user):
    if filter_from_user:
        emp_obj = Employee.objects.filter(user=employee).first()
        id = employee.id
        last_name = employee.last_name
        first_name = employee.last_name[0].upper() + '.' + employee.first_name.upper()
        email = employee.email
        is_active = employee.is_active
        is_sso = employee.is_sso
        is_admin = emp_obj.is_admin
        position = emp_obj.position.name
        created_at = emp_obj.created_at.strftime('%Y-%m-%d')
        updated_at = emp_obj.updated_at.strftime('%Y-%m-%d')
        is_user = employee.is_user
    else:
        user = User.objects.filter(pk=employee.user_id).first()
        id = user.id
        last_name = user.last_name
        first_name = user.last_name[0].upper() + '.' + user.first_name.upper()
        email = user.email
        is_active = user.is_active
        is_sso = user.is_sso
        is_admin = employee.is_admin
        position = employee.position.name
        created_at = employee.created_at.strftime('%Y-%m-%d')
        updated_at = employee.updated_at.strftime('%Y-%m-%d')
        is_user = user.is_user

    employee_detail = {
        'id': id,
        'last_name': last_name,
        'first_name': first_name,
        'email': email,
        'is_active': is_active,
        'is_sso': is_sso,
        'is_admin': is_admin,
        'position': position,
        'created_at': created_at,
        'updated_at': updated_at,
        "is_user": is_user
    }

    return employee_detail


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_list(request, payload, level, pk):
    org = get_object_or_404(Org, pk=pk, level=level)
    employees_display = []
    page = payload.get('page')
    query = payload.get('query') or ''
    per_page = payload.get('perpage')
    sort_name = payload.get('sort_name') or 'first_name'
    is_user = payload.get('is_user')

    if sort_name == 'first_name' or sort_name == '-first_name' or sort_name == 'email' or sort_name == '-email':
        qs = User.objects
        if is_user:
            qs = qs.filter(employee__org=org, is_user=is_user)
        else:
            qs = qs.filter(employee__org=org)
        qs = qs.annotate(search=SearchVector(
                'last_name',
                'first_name',
                'email'
            )
        )

    else:
        qs = Employee.objects
        qs = qs.filter(org=org)
        qs = qs.annotate(search=SearchVector(
                'is_admin',
                'created_at',
                'updated_at'
            )
        )

    if query:
        qs = qs.filter(search__contains=query)
    qs = qs.order_by(sort_name)
    emp_list = qs

    total_items = Paginator(emp_list, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list

    for employee in page_items:
        if sort_name == 'first_name' or sort_name == '-first_name' or sort_name == 'email' or sort_name == '-email':
            filter_from_user = True
        else:
            filter_from_user = False

        employee_detail = _get_employee(employee, filter_from_user)
        employees_display.append(employee_detail)

    total_page = total_items.num_pages
    rsp = {
        'items': employees_display,
        'page': page,
        'total_page': total_page,
        'start_index': utils.get_start_index(per_page, page),
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def count_org(request):
    rsp = {
        'gov_count': {
            'level1': Org.objects.filter(level=1).count(),
            'level2': Org.objects.filter(level=2).count(),
            'level3': Org.objects.filter(level=3).count(),
            'level4': Org.objects.filter(level=4).count(),
        }
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def perm_get_list(request, payload):

    def _get_user_name(event, item):
        user = User.objects.filter(pk=event).first()
        return user.username if user else 'Хоосон'

    оруулах_талбарууд = ['id', 'name', 'description', 'created_by_id']
    хувьсах_талбарууд = [
        {"field": "created_by_id", "action": _get_user_name, "new_field": "created_by"},
    ]
    datatable = Datatable(
        model=GovRole,
        payload=payload,
        хувьсах_талбарууд=хувьсах_талбарууд,
        оруулах_талбарууд=оруулах_талбарууд
    )

    items, total_page, start_index = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page,
        'start_index': start_index
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_perm(request, payload):
    values = payload.get('values')
    name_check = GovRole.objects.filter(name=values['name'])
    errors = {}
    if name_check:
        errors['name'] = 'Нэр давхцаж байна'
        rsp = {
            'success': False,
            'errors': errors,
        }
    elif values['name'].isspace():
        errors['name'] = 'Хоосон байна утга оруулна уу!'
        rsp = {
            'success': False,
            'errors': errors,
        }
    else:
        GovRole.objects.create(name=values['name'], description=values['description'], created_by=request.user, updated_by=request.user)
        rsp = {
            'success': True,
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_inspire_roles(request, pk):
    roles = []
    data = []
    roles = []
    govRole = get_object_or_404(GovRole, pk=pk)
    for themes in LThemes.objects.order_by('theme_id'):
        package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke = _get_theme_packages_gov(themes.theme_id, govRole)
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'packages': package_data,
                'perm_all': t_perm_all,
                'perm_view': t_perm_view,
                'perm_create': t_perm_create,
                'perm_remove': t_perm_remove,
                'perm_update': t_perm_update,
                'perm_approve': t_perm_approve,
                'perm_revoke': t_perm_revoke,
            })

    for datas in GovRoleInspire.objects.filter(gov_role=govRole):
        roles.append({
                'perm_kind': datas.perm_kind,
                'feature_id': datas.feature_id,
                'data_type_id': datas.data_type_id,
                'property_id': datas.property_id,
                'geom': datas.geom,
            })

    return JsonResponse({
        'data': data,
        'roles': roles,
        'success': True
    })


def _get_theme_packages_gov(theme_id, govRole):
    package_data = []
    t_perm_all = 0
    t_perm_view = 0
    t_perm_create = 0
    t_perm_remove = 0
    t_perm_update = 0
    t_perm_approve = 0
    t_perm_revoke = 0
    for package in LPackages.objects.filter(theme_id=theme_id):
        t_perm_all = t_perm_all + 1
        features_all, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke = _get_package_features_gove(package.package_id, govRole)
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'features': features_all,
                'perm_all': p_perm_all,
                'perm_view': p_perm_view,
                'perm_create': p_perm_create,
                'perm_remove': p_perm_remove,
                'perm_update': p_perm_update,
                'perm_approve': p_perm_approve,
                'perm_revoke': p_perm_revoke,
            })
        if p_perm_all == p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 1
        elif 0 < p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 0.5

        if p_perm_all == p_perm_create  and p_perm_all != 0:
            t_perm_create = t_perm_create + 1
        elif 0 < p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 0.5

        if p_perm_all == p_perm_remove  and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 1
        elif 0 < p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 0.5

        if p_perm_all == p_perm_update  and p_perm_all != 0:
            t_perm_update = t_perm_update + 1
        elif 0 < p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 0.5

        if p_perm_all == p_perm_approve  and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 1
        elif 0 < p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 0.5

        if p_perm_all == p_perm_revoke  and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 1
        elif 0 < p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 0.5

        if p_perm_all == 0:
            t_perm_all = t_perm_all - 1
    return package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke


def _get_package_features_gove(package_id, govRole):
    feat_values = []
    p_perm_all = 0
    p_perm_view = 0
    p_perm_create = 0
    p_perm_remove = 0
    p_perm_update = 0
    p_perm_approve = 0
    p_perm_revoke = 0
    for feat in LFeatures.objects.filter(package_id=package_id):
        data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke = _get_feature_property_gov(feat.feature_id, govRole)
        if not perm_all == 1:
            p_perm_all = p_perm_all + 1
            feat_values.append({
                'id':feat.feature_id,
                'code':feat.feature_code,
                'name':feat.feature_name,
                'data_types': data_type_list,
                'perm_all': perm_all,
                'perm_view': perm_view,
                'perm_create': perm_create,
                'perm_remove': perm_remove,
                'perm_update': perm_update,
                'perm_approve': perm_approve,
                'perm_revoke': perm_revoke,
            })
            if perm_all == perm_view and perm_all != 0:
                p_perm_view = p_perm_view + 1
            elif 0 < perm_view and perm_all != 0 and perm_view < perm_all:
                p_perm_view = p_perm_view + 0.5
            if perm_all == perm_create and perm_all != 0:
                p_perm_create = p_perm_create + 1
            elif 0 < perm_create and perm_all != 0 and perm_create < perm_all:
                p_perm_create = p_perm_create + 0.5
            if perm_all == perm_remove and perm_all != 0:
                p_perm_remove = p_perm_remove + 1
            elif 0 < perm_remove and perm_all != 0 and perm_remove < perm_all:
                p_perm_remove = p_perm_remove + 0.5
            if perm_all == perm_update and perm_all != 0:
                p_perm_update = p_perm_update + 1
            elif 0 < perm_update and perm_all != 0 and perm_update < perm_all:
                p_perm_update = p_perm_update + 0.5
            if perm_all == perm_approve and perm_all != 0:
                p_perm_approve = p_perm_approve + 1
            elif 0 < perm_approve and perm_all != 0 and perm_approve < perm_all:
                p_perm_approve = p_perm_approve + 0.5
            if perm_all == perm_revoke and perm_all != 0:
                p_perm_revoke = p_perm_revoke + 1
            elif 0 < perm_revoke and perm_all != 0 and perm_revoke < perm_all:
                p_perm_revoke = p_perm_revoke + 0.5
            if perm_all == 0:
                p_perm_all = p_perm_all - 1

    return feat_values, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke


def _get_feature_property_gov(feature_id, govRole):
    data_type_list = []
    data_types_ids = LFeatureConfigs.objects.filter(feature_id=feature_id)
    perm_all = 1
    perm_view = 0
    perm_create = 0
    perm_remove = 0
    perm_update = 0
    perm_approve = 0
    perm_revoke = 0
    for data_type_idx in data_types_ids:
        data_type = LDataTypes.objects.filter(data_type_id=data_type_idx.data_type_id).first()
        if data_type:
            data_type_obj = {
                'id': data_type.data_type_id,
                'code': data_type.data_type_code,
                'name': data_type.data_type_name,
                'definition': data_type.data_type_definition,
                'properties': [],
            }
            property_ids = LDataTypeConfigs.objects.filter(data_type_id=data_type.data_type_id).values_list('property_id', flat=True)
            properties = LProperties.objects.filter(property_id__in=property_ids).values('property_id', "property_code", "property_name")
            for prop in properties:
                perm_all = perm_all + 1
                property_obj = {
                    'id':prop['property_id'],
                    'code':prop['property_code'],
                    'name':prop['property_name'],
                    'perm_all': 6,
                    'perm_view': 0,
                    'perm_create': 0,
                    'perm_remove': 0,
                    'perm_update': 0,
                    'perm_approve': 0,
                    'perm_revoke': 0,
                }
                for gov_role_inspire in GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, data_type_id=data_type.data_type_id):
                    if (prop['property_id'] == gov_role_inspire.property_id) and feature_id == gov_role_inspire.feature_id:
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_VIEW:
                            perm_view = perm_view + 1
                            property_obj['perm_view'] = property_obj['perm_view'] + 1
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_CREATE:
                            perm_create = perm_create + 1
                            property_obj['perm_create'] = property_obj['perm_create'] + 1
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_REMOVE:
                            perm_remove = perm_remove + 1
                            property_obj['perm_remove'] = property_obj['perm_remove'] + 1
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_UPDATE:
                            perm_update = perm_update + 1
                            property_obj['perm_update'] = property_obj['perm_update'] + 1
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_APPROVE:
                            perm_approve = perm_approve + 1
                            property_obj['perm_approve'] = property_obj['perm_approve'] + 1
                        if gov_role_inspire.perm_kind == GovRoleInspire.PERM_REVOKE:
                            perm_revoke = perm_revoke + 1
                            property_obj['perm_revoke'] = property_obj['perm_revoke'] + 1
                data_type_obj['properties'].append(property_obj)
            data_type_list.append(data_type_obj)

    perm_view = perm_view + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_VIEW).count()
    perm_create = perm_create + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_CREATE).count()
    perm_remove = perm_remove + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_REMOVE).count()
    perm_update = perm_update + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_UPDATE).count()
    perm_approve = perm_approve + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_APPROVE).count()
    perm_revoke = perm_revoke + GovRoleInspire.objects.filter(gov_role=govRole, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovRoleInspire.PERM_REVOKE).count()
    return data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_inspire_roles(request, payload, pk):

    values = payload.get('values')
    govRole = get_object_or_404(GovRole, pk=pk)
    objs = []
    gov_role_inspire_all = GovRoleInspire.objects.filter(gov_role=govRole)
    govPerm = GovPerm.objects.filter(gov_role=govRole)
    if gov_role_inspire_all:
        for gov_role_inspire in gov_role_inspire_all:
            check = True
            for data in values:
                if gov_role_inspire.perm_kind == data['perm_kind'] and gov_role_inspire.feature_id == data['feature_id'] and gov_role_inspire.data_type_id == data['data_type_id'] and gov_role_inspire.property_id == data['property_id']:
                    check = False
            if check:
                GovRoleInspire.objects.filter(perm_kind=gov_role_inspire.perm_kind, feature_id=gov_role_inspire.feature_id, data_type_id=gov_role_inspire.data_type_id, property_id=gov_role_inspire.property_id).delete()
    for data in values:
        if gov_role_inspire_all:
            check = True
            for gov_role_inspire in gov_role_inspire_all:
                if gov_role_inspire.perm_kind == data['perm_kind'] and gov_role_inspire.feature_id == data['feature_id'] and gov_role_inspire.data_type_id == data['data_type_id'] and gov_role_inspire.property_id == data['property_id']:
                    check = False
            if check:
                govRoleInspire = GovRoleInspire.objects.create(
                    gov_role=govRole,
                    perm_kind=data['perm_kind'],
                    feature_id=data['feature_id'],
                    data_type_id=data['data_type_id'],
                    property_id=data['property_id'],
                    geom=data['geom'],
                    created_by=request.user,
                    updated_by=request.user,
                )
                if govPerm:
                    for gov_perm in govPerm:
                        GovPermInspire.objects.create(
                            gov_role_inspire=govRoleInspire,
                            gov_perm=gov_perm,
                            perm_kind=data['perm_kind'],
                            feature_id=data['feature_id'],
                            data_type_id=data['data_type_id'],
                            property_id=data['property_id'],
                            geom=data['geom'],
                            created_by=request.user,
                            updated_by=request.user,
                        )
        else:
            objs.append(GovRoleInspire(
                gov_role=govRole,
                perm_kind=data['perm_kind'],
                feature_id=data['feature_id'],
                data_type_id=data['data_type_id'],
                property_id=data['property_id'],
                geom=data['geom'],
                created_by=request.user,
                updated_by=request.user,
            ))
    GovRoleInspire.objects.bulk_create(objs)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


# baiguulgaa govperm
@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_gov_roles(request, level, pk):

    data = list()
    roles = list()

    org = get_object_or_404(Org, pk=pk, level=level)
    gov_perm = GovPerm.objects.filter(org=org).first()

    for themes in LThemes.objects.order_by('theme_id'):
        package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke = _get_theme_packages(themes.theme_id, gov_perm)
        data.append({
            'id': themes.theme_id,
            'code': themes.theme_code,
            'name': themes.theme_name,
            'packages': package_data,
            'perm_all': t_perm_all,
            'perm_view': t_perm_view,
            'perm_create': t_perm_create,
            'perm_remove': t_perm_remove,
            'perm_update': t_perm_update,
            'perm_approve': t_perm_approve,
            'perm_revoke': t_perm_revoke,
        })

    gov_perm_inspire_all = gov_perm.govperminspire_set.all()
    for datas in gov_perm_inspire_all:
        disable = False
        if datas.gov_role_inspire:
            disable = True

        roles.append({
            'perm_kind': datas.perm_kind,
            'feature_id': datas.feature_id,
            'data_type_id': datas.data_type_id,
            'property_id': datas.property_id,
            'geom': datas.geom,
            'disable': disable,
        })

    return JsonResponse({
        'data': data,
        'roles': roles,
        'success': True
    })


def _get_theme_packages(theme_id, gov_perm):
    package_data = []
    t_perm_all = 0
    t_perm_view = 0
    t_perm_create = 0
    t_perm_remove = 0
    t_perm_update = 0
    t_perm_approve = 0
    t_perm_revoke = 0
    for package in LPackages.objects.filter(theme_id=theme_id):
        t_perm_all = t_perm_all + 1
        features_all, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke = _get_package_features(package.package_id, gov_perm)
        package_data.append({
            'id': package.package_id,
            'code': package.package_code,
            'name': package.package_name,
            'features': features_all,
            'perm_all': p_perm_all,
            'perm_view': p_perm_view,
            'perm_create': p_perm_create,
            'perm_remove': p_perm_remove,
            'perm_update': p_perm_update,
            'perm_approve': p_perm_approve,
            'perm_revoke': p_perm_revoke,
        })
        if p_perm_all == p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 1
        elif 0 < p_perm_view and p_perm_all != 0:
            t_perm_view = t_perm_view + 0.5

        if p_perm_all == p_perm_create  and p_perm_all != 0:
            t_perm_create = t_perm_create + 1
        elif 0 < p_perm_create and p_perm_all != 0:
            t_perm_create = t_perm_create + 0.5

        if p_perm_all == p_perm_remove  and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 1
        elif 0 < p_perm_remove and p_perm_all != 0:
            t_perm_remove = t_perm_remove + 0.5

        if p_perm_all == p_perm_update  and p_perm_all != 0:
            t_perm_update = t_perm_update + 1
        elif 0 < p_perm_update and p_perm_all != 0:
            t_perm_update = t_perm_update + 0.5

        if p_perm_all == p_perm_approve  and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 1
        elif 0 < p_perm_approve and p_perm_all != 0:
            t_perm_approve = t_perm_approve + 0.5

        if p_perm_all == p_perm_revoke  and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 1
        elif 0 < p_perm_revoke and p_perm_all != 0:
            t_perm_revoke = t_perm_revoke + 0.5

        if p_perm_all == 0:
            t_perm_all = t_perm_all - 1
    return package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke


def _get_package_features(package_id, gov_perm):
    feat_values = []
    p_perm_all = 0
    p_perm_view = 0
    p_perm_create = 0
    p_perm_remove = 0
    p_perm_update = 0
    p_perm_approve = 0
    p_perm_revoke = 0

    for feat in LFeatures.objects.filter(package_id=package_id):
        data_type_list, perm_all, perms = _get_feature_property(feat.feature_id, gov_perm)
        if not perm_all == 1:
            p_perm_all = p_perm_all + 1
            feat_values.append({
                'id':feat.feature_id,
                'code':feat.feature_code,
                'name':feat.feature_name,
                'data_types': data_type_list,
                'perm_all': perm_all,
                'perm_view': perms['perm_view'],
                'perm_create': perms['perm_create'],
                'perm_remove': perms['perm_remove'],
                'perm_update': perms['perm_update'],
                'perm_approve': perms['perm_approve'],
                'perm_revoke': perms['perm_revoke'],
            })
            perm_view = perms['perm_view']
            perm_create = perms['perm_create']
            perm_remove = perms['perm_remove']
            perm_update = perms['perm_update']
            perm_approve = perms['perm_approve']
            perm_revoke = perms['perm_revoke']

            if perm_all == perm_view and perm_all != 0:
                p_perm_view = p_perm_view + 1

            elif 0 < perm_view and perm_all != 0 and perm_view < perm_all:
                p_perm_view = p_perm_view + 0.5
            if perm_all == perm_create and perm_all != 0:
                p_perm_create = p_perm_create + 1
            elif 0 < perm_create and perm_all != 0 and perm_create < perm_all:
                p_perm_create = p_perm_create + 0.5
            if perm_all == perm_remove and perm_all != 0:
                p_perm_remove = p_perm_remove + 1
            elif 0 < perm_remove and perm_all != 0 and perm_remove < perm_all:
                p_perm_remove = p_perm_remove + 0.5
            if perm_all == perm_update and perm_all != 0:
                p_perm_update = p_perm_update + 1
            elif 0 < perm_update and perm_all != 0 and perm_update < perm_all:
                p_perm_update = p_perm_update + 0.5
            if perm_all == perm_approve and perm_all != 0:
                p_perm_approve = p_perm_approve + 1
            elif 0 < perm_approve and perm_all != 0 and perm_approve < perm_all:
                p_perm_approve = p_perm_approve + 0.5
            if perm_all == perm_revoke and perm_all != 0:
                p_perm_revoke = p_perm_revoke + 1
            elif 0 < perm_revoke and perm_all != 0 and perm_revoke < perm_all:
                p_perm_revoke = p_perm_revoke + 0.5
            if perm_all == 0:
                p_perm_all = p_perm_all - 1

    return feat_values, p_perm_all, p_perm_view, p_perm_create, p_perm_remove, p_perm_update, p_perm_approve, p_perm_revoke


def _get_feature_property(feature_id, gov_perm):
    data_type_list = []
    perm_all = 1

    perms = {
        'perm_view': 0,
        'perm_create': 0,
        'perm_remove': 0,
        'perm_update': 0,
        'perm_approve': 0,
        'perm_revoke': 0,
    }

    perms_obj = {
        GovPermInspire.PERM_VIEW: 'perm_view',
        GovPermInspire.PERM_CREATE: 'perm_create',
        GovPermInspire.PERM_REMOVE: 'perm_remove',
        GovPermInspire.PERM_UPDATE: 'perm_update',
        GovPermInspire.PERM_APPROVE: 'perm_approve',
        GovPermInspire.PERM_REVOKE: 'perm_revoke',
    }

    feature_c_qs = LFeatureConfigs.objects.filter(feature_id=feature_id)
    feature_c_qs = feature_c_qs.values('data_type_id', 'data_type_display_name')
    inspire_perms = gov_perm.govperminspire_set.filter(feature_id=feature_id)

    for feature_c in feature_c_qs:
        ldata_type_c_qs = LDataTypeConfigs.objects
        ldata_type_c_qs = ldata_type_c_qs.filter(data_type_id=feature_c['data_type_id'])
        if ldata_type_c_qs:
            gov_data_type_qs = inspire_perms.filter(data_type_id=feature_c['data_type_id'])

            data_type_obj = {
                'id': feature_c['data_type_id'],
                'name': feature_c['data_type_display_name'],
                # 'code': feature_c['data_type_display_name'],
                # 'definition': data_type.data_type_definition,
                'properties': [],
            }

            property_ids = ldata_type_c_qs.values_list('property_id', flat=True)

            qs_properties = LProperties.objects
            qs_properties = qs_properties.filter(property_id__in=property_ids)
            properties = qs_properties.values('property_id', 'property_code', 'property_name', 'value_type_id')

            for prop in properties:
                if prop['property_code'].lower() != 'localid':
                    if prop['value_type_id'] != 'data-type':
                        perm_all = perm_all + 1
                        property_obj = {
                            'id': prop['property_id'],
                            'code': prop['property_code'],
                            'name': prop['property_name'],
                            'perm_all': 6,
                            'perm_view': 0,
                            'perm_create': 0,
                            'perm_remove': 0,
                            'perm_update': 0,
                            'perm_approve': 0,
                            'perm_revoke': 0,
                        }

                        if gov_perm:
                            for gov_role_inspire in gov_data_type_qs:
                                if (prop['property_id'] == gov_role_inspire.property_id) and feature_id == gov_role_inspire.feature_id:
                                    for perm_kind, perm_name in perms_obj.items():
                                        if perm_kind == gov_role_inspire.perm_kind:
                                            perms[perm_name] = perms[perm_name] + 1
                                            property_obj[perm_name] = property_obj[perm_name] + 1

                            data_type_obj['properties'].append(property_obj)
            data_type_list.append(data_type_obj)

    inspire_perms = inspire_perms.filter(geom=True, property_id=None)
    if inspire_perms:
        inspire_perms = inspire_perms.values('perm_kind')
        inspire_perms = inspire_perms.annotate(perm_count=Count('perm_kind'))

        if gov_perm:
            for inspire_perm in inspire_perms.values():
                kind_name = perms_obj[inspire_perm['perm_kind']]
                perms[kind_name] = perms[kind_name] + inspire_perm['perm_count']

    return data_type_list, perm_all, perms


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_gov_roles(request, payload, level, pk):
    values = payload.get('values')
    org = get_object_or_404(Org, pk=pk, level=level)
    gov_perm = GovPerm.objects.filter(org=org).first()
    objs = []
    gov_perm_inspire_all = GovPermInspire.objects.filter(gov_perm=gov_perm)

    if gov_perm_inspire_all:
        for gov_role_inspire in gov_perm_inspire_all:
            check = True
            for data in values:
                if gov_role_inspire.perm_kind == data['perm_kind'] and gov_role_inspire.feature_id == data['feature_id'] and gov_role_inspire.data_type_id == data['data_type_id'] and gov_role_inspire.property_id == data['property_id']:
                    check = False
            if check:
                GovPermInspire.objects.filter(perm_kind=gov_role_inspire.perm_kind, feature_id=gov_role_inspire.feature_id, data_type_id=gov_role_inspire.data_type_id, property_id=gov_role_inspire.property_id).delete()
    for data in values:
        if gov_perm_inspire_all:
            check = True
            for gov_role_inspire in gov_perm_inspire_all:
                if gov_role_inspire.perm_kind == data['perm_kind'] and gov_role_inspire.feature_id == data['feature_id'] and gov_role_inspire.data_type_id == data['data_type_id'] and gov_role_inspire.property_id == data['property_id']:
                    check = False
            if check:
                objs.append(GovPermInspire(
                    gov_perm=gov_perm,
                    perm_kind=data['perm_kind'],
                    feature_id=data['feature_id'],
                    data_type_id=data['data_type_id'],
                    property_id=data['property_id'],
                    geom=data['geom'],
                    created_by=request.user,
                    updated_by=request.user,
                ))
        else:
            objs.append(GovPermInspire(
                gov_perm=gov_perm,
                perm_kind=data['perm_kind'],
                feature_id=data['feature_id'],
                data_type_id=data['data_type_id'],
                property_id=data['property_id'],
                geom=data['geom'],
                created_by=request.user,
                updated_by=request.user,
            ))

    GovPermInspire.objects.bulk_create(objs)
    rsp = {
        'success': True,
    }
    return JsonResponse(rsp)


def _get_roles_display():

    return [
        {
            'id': gov_role.id,
            'name': gov_role.name,
        }
        for gov_role in GovRole.objects.all()
    ]


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def form_options(request, option):

    admin_levels = utils.get_administrative_levels()
    roles = _get_roles_display()

    if option == 'second':
        rsp = {
            'success': True,
            'secondOrders': admin_levels,
            'firstOrder_geom': utils.get_1stOrder_geo_id(),
        }
    else:
        rsp = {
            'success': True,
            'secondOrders': admin_levels,
            'roles': roles,
            'firstOrder_geom': utils.get_1stOrder_geo_id(),
        }

    return JsonResponse(rsp)


def _is_cloned_feature(address_qs):
    is_cloned = False
    erguul_id = address_qs.employeeerguul_set.values_list('id', flat=True).first()
    if erguul_id:
        is_cloned = True
    return is_cloned


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_addresses(request, level, pk):
    points = list()
    org = get_object_or_404(Org, pk=pk, level=level)
    employees = Employee.objects
    employees = employees.filter(org=org)

    for employee in employees:
        addresses = EmployeeAddress.objects
        addresses = addresses.filter(employee=employee)
        addresses = addresses.first()
        if addresses:
            point_info = dict()
            point = addresses.point
            point_info['id'] = addresses.employee.id
            point_info['first_name'] = addresses.employee.user.first_name # etseg
            point_info['last_name'] = addresses.employee.user.last_name # onooj ogson ner
            point_info['is_cloned'] = _is_cloned_feature(addresses)
            feature = utils.get_feature_from_geojson(point.json, properties=point_info)
            points.append(feature)

        erguul = EmployeeErguul.objects
        erguul = erguul.filter(address=addresses)
        erguul = erguul.first()
        if erguul:
            erguul_info = dict()
            point = erguul.point
            erguul_info['id'] = employee.id
            erguul_info['is_erguul'] = True
            erguul_info['first_name'] = employee.user.first_name # etseg
            erguul_info['last_name'] = employee.user.last_name # onooj ogson ner

            feature = utils.get_feature_from_geojson(point.json, properties=erguul_info)
            points.append(feature)

    feature_collection = FeatureCollection(points)

    rsp = {
        'success': True,
        'points': feature_collection,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_address(request, pk):
    points = list()

    user = get_object_or_404(User, pk=pk)

    employee = Employee.objects
    employee = employee.filter(user=user)
    employee = employee.first()

    addresses = EmployeeAddress.objects
    addresses = addresses.filter(employee=employee)
    addresses = addresses.first()

    if addresses:
        point_info = dict()
        point = addresses.point
        point_info['id'] = addresses.employee.id
        point_info['first_name'] = addresses.employee.user.first_name  # etseg
        point_info['last_name'] = addresses.employee.user.last_name  # onooj ogson ner
        point_info['is_cloned'] = _is_cloned_feature(addresses)
        feature = utils.get_feature_from_geojson(point.json, properties=point_info)
        points.append(feature)

    erguul = EmployeeErguul.objects.filter(address=addresses).first()
    if erguul:
        erguul_info = dict()
        point = erguul.point
        erguul_info['id'] = employee.id
        erguul_info['is_erguul'] = True
        erguul_info['first_name'] = employee.user.first_name # etseg
        erguul_info['last_name'] = employee.user.last_name # onooj ogson ner

        feature = utils.get_feature_from_geojson(point.json, properties=erguul_info)
        points.append(feature)

    feature_collection = FeatureCollection(points)

    if not addresses:
        rsp = {
            'points': [],
        }
    else:
        rsp = {
            'success': True,
            'points': feature_collection,
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_emp_info(request, payload, pk):
    employee = get_object_or_404(Employee, pk=pk)
    is_erguul = payload.get("is_erguul")
    info = dict()
    title = ''

    info['org_name'] = employee.org.name
    info['last_name'] = employee.user.last_name # ovog
    info['first_name'] = employee.user.first_name
    info['phone_number'] = employee.phone_number or ''

    if not is_erguul:
        info['level_1'] = employee.employeeaddress_set.values_list('level_1', flat=True).first()
        info['level_2'] = employee.employeeaddress_set.values_list('level_2', flat=True).first()
        info['level_3'] = employee.employeeaddress_set.values_list('level_3', flat=True).first()
        info['street'] = employee.employeeaddress_set.values_list('street', flat=True).first()
        info['apartment'] = employee.employeeaddress_set.values_list('apartment', flat=True).first()
        info['door_number'] = employee.employeeaddress_set.values_list('door_number', flat=True).first()
        title = 'Ажилтаны мэдээлэл'

    else:
        address_id = employee.employeeaddress_set.values_list('id', flat=True).first()
        erguul_qs = EmployeeErguul.objects
        erguul_qs = erguul_qs.filter(address=address_id)
        erguul = erguul_qs.first()
        erguul_address = erguul.level_3 + ", " + erguul.street  + " гудамж " + erguul.apartment + " байр"

        info['erguul_address'] = erguul_address
        info['part_time'] = erguul.get_part_time_display()
        info['date_start'] = utils.datetime_to_string(erguul.date_start)
        info['date_end'] = utils.datetime_to_string(erguul.date_end)
        title = 'Эргүүлийн мэдээлэл'

    rsp = {
        'success': True,
        'info': info,
        'title': title
    }
    return JsonResponse(rsp)


def _get_erguul_qs(employee):
    address_id = employee.employeeaddress_set.values_list('id', flat=True).first()
    erguul_qs = EmployeeErguul.objects
    erguul_qs = erguul_qs.filter(address_id=address_id)
    erguul_qs = erguul_qs.filter(is_over=False)
    erguul = erguul_qs.values().first()
    return erguul


def _get_erguul(erguul, field):
    value = ''
    if erguul:
        value = erguul[field]
    return value


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_erguuleg_fields(request, pk):
    erguul_id = ''
    send_fields = list()

    employee = get_object_or_404(Employee, pk=pk)
    erguul = _get_erguul_qs(employee)

    if erguul:
        erguul_id = erguul['id']

    for f in EmployeeErguul._meta.get_fields():
        type_name = f.get_internal_type()
        not_list = ['ForeignKey', 'AutoField', 'BooleanField', 'PointField']
        if type_name not in not_list:
            not_field = ['created_at']
            if f.name not in not_field:
                if hasattr(f, 'verbose_name') and hasattr(f, 'max_length'):
                    value = _get_erguul(erguul, f.name)
                    field_type = ''
                    if 'date' in f.name:
                        field_type = 'date'
                        value = utils.datetime_to_string(value)
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
        'info': send_fields,
        'erguul_id': erguul_id,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def save_erguul(request, payload):
    hour = ''

    emp_id = payload.get('emp_id')
    erguul_id = payload.get('erguul_id')
    values = payload.get('values')
    photo = payload.get('photo')

    employee = get_object_or_404(Employee, id=emp_id)

    point = _get_point_for_db(payload.get('point'))
    values['point'] = point

    if 'date_start' in values:
        date_start = utils.date_to_timezone(values['date_start'])
        values['date_start'] = date_start

    if 'date_end' in values:
        date_end = utils.date_to_timezone(values['date_end'])
        values['date_end'] = date_end

    with transaction.atomic():
        erguul_qs = EmployeeErguul.objects
        if not erguul_id:
            address_qs = EmployeeAddress.objects
            address_qs = address_qs.filter(employee=employee)
            address_qs = address_qs.first()
            address_id = address_qs.id

            erguul_qs = erguul_qs.create(address_id=address_id, **values)
            erguul_id = erguul_qs.id
            subject = 'Эргүүлд гарах мэдээлэл'
            update_msg = ''
            info = 'Амжилттай хадгалсан'
        else:
            erguul_qs = erguul_qs.filter(pk=erguul_id)
            erguul_qs.update(
                **values
            )
            erguul_qs = erguul_qs.first()
            subject = 'Шинэчилсэн эргүүлд гарах мэдээлэл'
            update_msg = '<h4>Таны эргүүлд гарах мэдээллийг шинэчилсэн байна</h4>'
            info = 'Амжилттай зассан'

        def _get_mail_info(item):
            if item in values:
                value = values[item]
            else:
                erguul_dict = model_to_dict(erguul_qs)
                value = erguul_dict[item]

            return value

        part_time = _get_mail_info('part_time')
        date_start = _get_mail_info('date_start')
        date_end = _get_mail_info('date_end')

        if int(part_time) == EmployeeErguul.DAY_TIME:
            hour = EmployeeErguul.DAY_HOUR
        if int(part_time) == EmployeeErguul.NIGHT_TIME:
            hour = EmployeeErguul.NIGHT_HOUR

        photo = photo.split(',')
        photo = photo[len(photo) - 1]
        file_name = str(erguul_id) + '.png'
        folder_name = 'covid_map'
        path = os.path.join(settings.MEDIA_ROOT, folder_name, file_name)
        if photo:
            [image_x2] = utils.resize_b64_to_sizes(photo, [(720, 720)])
            img_byte = bytearray(image_x2)
            image = Image.open(io.BytesIO(img_byte))
            image.save(path)

        msg = 'Та энэ заасан газарт ' + utils.datetime_to_string(date_start) + " - " + utils.datetime_to_string(date_end) + " хүртэлх хугацаанд " + hour + " цагийн хооронд эргүүл хийнэ"
        host_name = utils.get_config('EMAIL_HOST_NAME')
        linked_path = 'https://' + host_name + "/media/" + folder_name + "/" + file_name
        to_email = [employee.user.email]
        attach = '''
            <body>
                {update_msg}
                <dd>
                    {msg}
                </dd>
                <img src={linked_path} alt='erguul'/>
                <p>
                    <b>Ногоон цэг</b> нь таны эргүүл хийх газар
                    <br />
                    <b>Улаан цэг</b> нь таны гэрийн байршил
                </p>
            </body>
        '''.format(msg=msg, linked_path=linked_path, update_msg=update_msg)

        utils.send_email(subject, msg, to_email, attach)

    rsp = {
        'success': True,
        'info': info,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_erguuls(request):

    points = list()
    erguuls = EmployeeErguul.objects.all()
    for erguul in erguuls:
        tailbar = ErguulTailbar.objects
        tailbar = tailbar.filter(erguul=erguul)
        tailbar = tailbar.first()
        if not tailbar:
            data = dict()
            employee = erguul.address.employee
            point = erguul.point
            data['id'] = employee.id
            data['first_name'] = employee.user.first_name # etseg
            data['last_name'] = employee.user.last_name # onooj ogson ner
            feature = utils.get_feature_from_geojson(point.json, properties=data)
            points.append(feature)

    feature_collection = FeatureCollection(points)

    rsp = {
        'feature_collection': feature_collection,
    }
    return JsonResponse(rsp)


def _get_choices(Model, field_name):
    choices = list()
    for f in Model._meta.get_fields():
        if f.name == field_name:
            choices = f.choices
    return choices


@require_POST
@ajax_required
@login_required
def get_select_values(request, payload):
    org_id = payload.get('org_id')
    if not org_id:
        employee = get_object_or_404(Employee, user=request.user)
        org_id = employee.org_id

    qs = Position.objects
    qs = qs.filter(org_id=org_id)
    positions = list(qs.values())

    states = _get_choices(Employee, 'state')
    pro_classes = _get_choices(Employee, 'pro_class')

    rsp = {
        'success': True,
        'positions': positions,
        'states': states,
        'pro_classes': pro_classes,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_all_org(request):

    qs = Org.objects
    org_qs = qs.all()
    org_list = list(org_qs.values())

    levels_qs = qs.values('level').annotate(Count('level')).order_by('level')
    levels_qs = list(levels_qs)
    levels = [level['level'] for level in levels_qs]

    rsp = {
        'success': True,
        'org_list': org_list,
        'levels': levels,
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def emp_gender_count(request, pk):

    qs = Org.objects
    qs = qs.filter(id=pk)

    qs = qs.annotate(
        male_count=Count('employee', filter=Q(employee__user__gender='Эрэгтэй'))
    )
    qs = qs.annotate(
        female_count=Count('employee', filter=Q(employee__user__gender='Эмэгтэй'))
    )
    item = qs.first()
    male_count = item.male_count
    female_count = item.female_count

    rsp = {
        'count_male': male_count,
        'count_female': female_count
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def emp_age_count(request, pk):

    date_now = datetime.datetime.now()
    year = date_now.year
    year_cut = str(date_now.year)[2:4]

    emp_reg = []
    emp_age = []
    qs = Employee.objects.filter(org_id=pk)

    for employee in qs:
        emp_reg.append(employee.user.register)

        register = employee.user.register
        register_cut = register[2:4]
        if -1 < int(register_cut) and int(register_cut) < int(year_cut):
            age = int(year_cut) - int(register_cut)
            emp_age.append(age)
        else:
            birth_year = str(19) + register_cut
            age = int(year) - int(birth_year)
            emp_age.append(age)

    sorted_age = sorted(emp_age)
    count_age = Counter(sorted_age)
    emp_ages = list(count_age.keys())
    count_emps_age = list(count_age.values())

    rsp = {
        'count_emps_age': count_emps_age,
        'emp_age': emp_ages,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def send_mail(request, pk):
    subject = 'Геопортал нууц үг солих'
    text = 'Дараах холбоос дээр дарж нууц үгээ солино уу!'

    user = get_object_or_404(User, pk=pk)
    utils.send_approve_email(user, subject, text)

    return JsonResponse({'success': True, 'info': 'Амжилттай илгээлээ.'})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def position_list(request, payload, pk):
    items = []
    page = 1
    total_page = 1
    start_index = 1
    оруулах_талбарууд = ['id', 'name', 'org_id']

    qs = Position.objects.filter(org_id=pk)
    if qs:
        datatable = Datatable(
            model=Position,
            initial_qs=qs,
            payload=payload,
            оруулах_талбарууд=оруулах_талбарууд
        )
        items, total_page, start_index = datatable.get()
        page = payload.get('page')

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
        "start_index": start_index
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_remove(request, pk):
    position = get_object_or_404(Position, id=pk)
    has_emp_pos = position.employee_set.all()

    if has_emp_pos:
        rsp = {
            'success': False,
            'error': '"{position}" албан тушаалыг хэрэглэгчид оноосон байна!!!'.format(position=position.name),
        }
    else:
        position.delete()
        rsp = {
            'success': True,
            'data': "Амжилттай устгалаа"
        }

    return JsonResponse(rsp)


def _pos_name_or_id_check(qs_pos, name, pos_id=None):
    has_pos_name = False
    qs_pos = qs_pos.filter(name=name)
    if qs_pos:
        if pos_id:
            if qs_pos.first().id != pos_id:
                has_pos_name = True
        else:
            has_pos_name = True
    return has_pos_name


def _make_pos_data(datas, pk):
    datas['org_id'] = pk
    return datas


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_create(request, payload, pk):
    name = payload.get("name")
    datas = _make_pos_data(payload, pk)
    qs = Position.objects
    qs_pos = qs.filter(org_id=pk)
    has_pos_name = _pos_name_or_id_check(qs_pos, name)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        qs.create(**datas)
        rsp = {
            'success': True,
            'data': '"{name}" нэртэй албан тушаалыг амжилттай нэмлээ.'.format(name=name)
        }

    return JsonResponse(rsp)


def _del_unneed_keys(obj):
    del_keys = ['pos_id']
    for key in del_keys:
        del obj[key]

    return obj


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_update(request, payload, pk):
    name = payload.get("name")
    pos_id = int(payload.get("pos_id"))
    qs = Position.objects
    qs_pos = qs.filter(org_id=pk)
    has_pos_name = _pos_name_or_id_check(qs_pos, name, pos_id)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        payload = _del_unneed_keys(payload)
        qs_pos.filter(
            id=pos_id
        ).update(**payload)
        rsp = {
            'success': True,
            'data': 'Албан тушаалыг амжилттай шинэчлэлээ.'.format(name=name)
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_detail(request, pk):
    position = Position.objects.filter(id=pk)
    if not position:
        raise Http404
    datas = position.values('id', 'name').first()
    rsp = {
        'success': True,
        'datas': datas
    }

    return JsonResponse(rsp)
