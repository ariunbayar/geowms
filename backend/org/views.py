import os
import io
import json
from geojson import FeatureCollection
import PIL.Image as Image

from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from django.db.models import Count, F, Func
from django.db import transaction
from django.http import JsonResponse, Http404
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
from backend.token.utils import TokenGeneratorEmployee
from geoportal_app.models import User
from .models import Org, Employee, EmployeeAddress, EmployeeErguul, ErguulTailbar, DefaultPosition
from govorg.backend.org_request.models import ChangeRequest
from .forms import EmployeeAddressForm
from main.components import Datatable

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


def _employee_validation(payload, user):
    username = payload.get('username')
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    gender = payload.get('gender')
    register = payload.get('register')
    errors = {}
    if not username:
        errors['username'] = 'Хоосон байна утга оруулна уу!'
    elif len(username) > 150:
        errors['username'] = '150-с илүүгүй урттай утга оруулна уу!'
    if not position:
        errors['position'] = 'Хоосон байна утга оруулна уу!'
    if not first_name:
        errors['first_name'] = 'Хоосон байна утга оруулна уу!'
    elif len(first_name) > 30:
        errors['first_name'] = '30-с илүүгүй урттай утга оруулна уу!'
    if not last_name:
        errors['last_name'] = 'Хоосон байна утга оруулна уу!'
    elif len(last_name) > 150:
        errors['last_name'] = '150-с илүүгүй урттай утга оруулна уу!'
    if not email:
        errors['email'] = 'Хоосон байна утга оруулна уу!'
    elif len(email) > 254:
        errors['email'] = '254-с илүүгүй урттай утга оруулна уу!'
    if not gender:
        errors['gender'] = 'Хоосон байна утга оруулна уу!'
    elif len(gender) > 100:
        errors['gender'] = '100-с илүүгүй урттай утга оруулна уу!'
    if not register:
        errors['register'] = 'Хоосон байна утга оруулна уу!'
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
    username = values.get('username')
    position = int(values.get('position'))
    state = int(values.get('state'))
    first_name = values.get('first_name')
    last_name = values.get('last_name')
    email = values.get('email')
    gender = values.get('gender')
    register = values.get('register')
    is_admin = values.get('is_admin')
    password = values.get('password')
    is_super = values.get('is_super')
    pro_class = int(values.get('pro_class'))
    phone_number = values.get('phone_number')
    re_password_mail = values.get('re_password_mail')

    address = payload.get('address')
    level_1 = address.get('level_1')
    level_2 = address.get('level_2')
    level_3 = address.get('level_3')
    street = address.get('street')
    apartment = address.get('apartment')
    door_number = address.get('door_number')
    point_coordinate = address.get('point')
    address_state = address.get('address_state')
    point = _get_point_for_db(point_coordinate)
    address['point'] = point

    user = get_object_or_404(User, pk=pk)
    errors = _employee_validation(values, user)
    form = EmployeeAddressForm(address)

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    if level == 4:
        is_super = is_super
    else:
        is_super = False

    if form.is_valid() and not errors:
        with transaction.atomic():
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.gender = gender
            user.register = register.upper()
            user.username = username
            user.is_superuser = is_super
            if password:
                user.set_password(password)
            user.save()

            if re_password_mail:
                subject = 'Геопортал нууц үг солих'
                text = 'Дараах холбоос дээр дарж нууц үгээ солино уу!'
                utils.send_approve_email(user, subject, text)

            employee = Employee.objects
            employee = employee.filter(user_id=pk)
            employee.update(
                position=position,
                is_admin=is_admin,
                phone_number=phone_number,
                state=state,
                pro_class=pro_class,
            )
            employee = employee.first()

            address = EmployeeAddress.objects
            address = address.filter(employee=employee)
            address_state = _get_address_state_code(address_state)
            if address:
                address.update(
                    point=point,
                    level_1=level_1,
                    level_2=level_2,
                    level_3=level_3,
                    street=street,
                    apartment=apartment,
                    door_number=door_number,
                    address_state=address_state,
                )
            else:
                address.create(
                    employee=employee,
                    point=point,
                    level_1=level_1,
                    level_2=level_2,
                    level_3=level_3,
                    street=street,
                    apartment=apartment,
                    door_number=door_number,
                    address_state=address_state,
                )
        rsp = {
            'success': True, 'errors': errors
        }

    else:
        rsp = {
            'success': False,
            'errors': {**form.errors, **errors},
        }

    return JsonResponse(rsp)


def _get_point_for_db(coordinate):
    if not coordinate:
        return ''

    if isinstance(coordinate, str):
        coordinate = coordinate.split(",")

    point = utils.get_geom_for_filter_from_coordinate(coordinate, 'Point')
    return point


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):
    payload = payload.get('payload')

    org = get_object_or_404(Org, pk=pk, level=level)

    values = payload.get('values')
    username = values.get('username')
    position = int(values.get('position'))
    state = int(values.get('state'))
    first_name = values.get('first_name')
    last_name = values.get('last_name')
    email = values.get('email')
    gender = values.get('gender')
    pro_class = int(values.get('pro_class'))
    register = values.get('register')
    is_admin = values.get('is_admin')
    is_super = values.get('is_super')
    phone_number = values.get('phone_number')

    address = payload.get('address')
    level_1 = address.get('level_1')
    level_2 = address.get('level_2')
    level_3 = address.get('level_3')
    street = address.get('street')
    apartment = address.get('apartment')
    address_state = address.get('address_state')
    door_number = address.get('door_number')
    point_coordinate = address.get('point')
    point = _get_point_for_db(point_coordinate)

    address['point'] = point

    errors = {}
    errors = _employee_validation(values, None)
    form = EmployeeAddressForm(address)

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    if form.is_valid() and not errors:
        with transaction.atomic():

            user = User()
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.gender = gender
            user.is_superuser = is_super if org.level == 4 else False
            user.register = register.upper()
            user.save()
            user.roles.add(2)
            user.save()

            employee = Employee()
            employee.position_id = position
            employee.state = state
            employee.org = org
            employee.user_id = user.id
            employee.is_admin = is_admin
            employee.token = TokenGeneratorEmployee().get()
            employee.phone_number = phone_number
            employee.pro_class = pro_class
            employee.save()

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

            utils.send_approve_email(user)

        rsp = {
            'success': True,
            'employee': {
                'id': employee.id,
                'user_id': employee.user_id,
            }
        }

    else:
        rsp = {
            'success': False,
            'errors': {**form.errors, **errors},
        }

    return JsonResponse(rsp)


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, pk):

    user = get_object_or_404(User, id=pk)
    employee = get_object_or_404(Employee, user=user)
    check = _remove_user(user, employee)
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
    return False


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
            gov_perm_role_check = GovPerm.objects.filter(org=org).first()
            if gov_perm_role_check.gov_role_id != role_id or not gov_perm_role_check.gov_role.id:
                gov_role_inspire_all = GovRoleInspire.objects.filter(gov_role=org_role_filter)
                GovPerm.objects.filter(org_id=org_id).update(gov_role=org_role_filter)
                gov_perm = GovPerm.objects.filter(org_id=org_id).first()
                GovPermInspire.objects.filter(gov_perm=gov_perm).delete()
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
            return JsonResponse({'success': True})
        else:
            gov_perm = GovPerm.objects.filter(org=org).first()
            if gov_perm:
                GovPermInspire.objects.filter(gov_perm=gov_perm).delete()
                GovPerm.objects.filter(org_id=org_id).update(gov_role=None)
            return JsonResponse({'success': True})
    # Байгууллага шинээр үүсгэх
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
        org.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_list(request, payload, level):

    оруулах_талбарууд = ['id', 'name', 'level', 'num_employees', 'num_systems']
    items = []
    total_page = 1
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
        items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page
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
        'count': User.objects.filter(employee__org=org).count()
    })


def _get_employee(employee, filter_from_user):
    if filter_from_user:
        emp_obj = Employee.objects.filter(user=employee).first()
        id = employee.id
        last_name = employee.last_name
        first_name = employee.first_name
        email = employee.email
        is_active = employee.is_active
        is_sso = employee.is_sso
        is_admin = emp_obj.is_admin
        position = emp_obj.position.name
        created_at = emp_obj.created_at.strftime('%Y-%m-%d')
        updated_at = emp_obj.updated_at.strftime('%Y-%m-%d')
    else:
        user = User.objects.filter(pk=employee.user_id).first()
        id = user.id,
        last_name = user.last_name,
        first_name = user.first_name,
        email = user.email,
        is_active = user.is_active,
        is_sso = user.is_sso,
        is_admin = employee.is_admin
        position = employee.position.name
        created_at = employee.created_at.strftime('%Y-%m-%d')
        updated_at = employee.updated_at.strftime('%Y-%m-%d')

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
        'updated_at': updated_at
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

    if sort_name == 'first_name' or sort_name == '-first_name' or sort_name == 'email' or sort_name == '-email':
        qs = User.objects
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

    items, total_page = datatable.get()

    rsp = {
        'items': items,
        'page': payload.get('page'),
        'total_page': total_page
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
    for themes in LThemes.objects.all():
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
    data = []
    roles = []
    org = get_object_or_404(Org, pk=pk, level=level)
    gov_perm = GovPerm.objects.filter(org=org).first()
    for themes in LThemes.objects.all():
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

    gov_perm_inspire_all = GovPermInspire.objects.filter(gov_perm=gov_perm)
    if gov_perm_inspire_all:
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
        data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke = _get_feature_property(feat.feature_id, gov_perm)
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


def _get_feature_property(feature_id, gov_perm):
    data_type_list = []
    perm_all = 1
    perm_view = 0
    perm_create = 0
    perm_remove = 0
    perm_update = 0
    perm_approve = 0
    perm_revoke = 0
    data_types_ids = LFeatureConfigs.objects.filter(feature_id=feature_id)

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

                if gov_perm:
                    for gov_role_inspire in GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, data_type_id=data_type.data_type_id):
                        if (prop['property_id'] == gov_role_inspire.property_id) and feature_id == gov_role_inspire.feature_id:
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_VIEW:
                                perm_view = perm_view + 1
                                property_obj['perm_view'] = property_obj['perm_view'] + 1
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_CREATE:
                                perm_create = perm_create + 1
                                property_obj['perm_create'] = property_obj['perm_create'] + 1
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_REMOVE:
                                perm_remove = perm_remove + 1
                                property_obj['perm_remove'] = property_obj['perm_remove'] + 1
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_UPDATE:
                                perm_update = perm_update + 1
                                property_obj['perm_update'] = property_obj['perm_update'] + 1
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_APPROVE:
                                perm_approve = perm_approve + 1
                                property_obj['perm_approve'] = property_obj['perm_approve'] + 1
                            if gov_role_inspire.perm_kind == GovPermInspire.PERM_REVOKE:
                                perm_revoke = perm_revoke + 1
                                property_obj['perm_revoke'] = property_obj['perm_revoke'] + 1
                    data_type_obj['properties'].append(property_obj)
            data_type_list.append(data_type_obj)

    if gov_perm:
        perm_view = perm_view + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_VIEW).count()
        perm_create = perm_create + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_CREATE).count()
        perm_remove = perm_remove + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_REMOVE).count()
        perm_update = perm_update + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_UPDATE).count()
        perm_approve = perm_approve + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_APPROVE).count()
        perm_revoke = perm_revoke + GovPermInspire.objects.filter(gov_perm=gov_perm, feature_id=feature_id, geom=True, property_id=None, perm_kind=GovPermInspire.PERM_REVOKE).count()

    return data_type_list, perm_all, perm_view, perm_create, perm_remove, perm_update, perm_approve, perm_revoke


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
            'secondOrders': admin_levels
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


@require_POST
@ajax_required
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


@require_GET
@ajax_required
def get_select_values(request):

    qs = DefaultPosition.objects
    qs = qs.all()
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
