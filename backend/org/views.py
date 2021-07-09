import os
import io
from django.http.response import Http404
from geojson import FeatureCollection
import PIL.Image as Image
import datetime
from collections import Counter

from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.postgres.search import SearchVector
from django.db.models import Count, Q
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.forms.models import model_to_dict

from backend.govorg.models import GovOrg
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
from main.components import Datatable

from main.decorators import ajax_required
from main import utils
from backend.org import utils as backend_org_utils


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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_detail(request, pk):

    employee = get_object_or_404(Employee, pk=pk)
    user = get_object_or_404(User, pk=employee.user_id)
    address = get_object_or_404(EmployeeAddress, employee=employee)

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
        'address_state': backend_org_utils.get_address_state_db_value(address.address_state) if hasattr(address, 'address_state') else '',
        'address_state_display': address.get_address_state_display() if hasattr(address, 'address_state') else '',
    }

    return JsonResponse({'success': True, 'employee': employees_display})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_token_refresh(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    employee.token = TokenGeneratorEmployee().get()
    employee.save()

    rsp = {
        'success': True,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_update(request, payload, pk, level):
    payload = payload.get("payload")
    values = payload.get('values')
    password = values.get('password')
    is_user = values.get('is_user')
    errors = dict()

    qs_user = User.objects
    qs_employee = Employee.objects
    qs_address = EmployeeAddress.objects

    qs_update_employee = qs_employee.filter(id=pk)  # TODO нэг албан хаагчийн query set
    employee = qs_update_employee.first()
    user_id = employee.user_id
    qs_employee = qs_employee.filter(~Q(id=pk), user_id=user_id)
    qs_user = backend_org_utils.check_qs(qs_user, {"id": user_id})
    user = qs_user.first()
    qs_address = backend_org_utils.check_qs(qs_address, {"employee": employee})
    employee_address = qs_address.first()

    user_detail = backend_org_utils.make_user_detail(values)
    employee_detail = backend_org_utils.make_employee_detail(values, employee)
    employee_address_detail = backend_org_utils.make_employee_add(payload)
    is_fired_employee = backend_org_utils.is_fired_employee(user, qs_employee)

    errors = backend_org_utils.user_validition(user_detail, user)
    errors.update(backend_org_utils.employee_validition(employee_detail, employee))
    errors.update(backend_org_utils.employee_add_validator(employee_address_detail, employee_address))

    if not is_fired_employee:
        error = {"username": 'Хэрэглэгч бүртгэлтэй байна!'}
        errors.update(error)

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():
        if password:
            password = user.set_password(password)
            user_detail['password'] = password

        qs_user.update(**user_detail)
        qs_update_employee.update(**employee_detail)    # TODO тухайн албан хаагчаа update хийнэ
        if employee_address:
            qs_address.update(**employee_address_detail)
        else:
            employee_address_detail['employee'] = employee
            qs_address.create(**employee_address_detail)

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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):
    payload = payload.get('payload')
    values = payload.get('values')
    is_user = values.get('is_user')
    username = values.get('username')
    errors = dict()

    org = get_object_or_404(Org, pk=pk, level=level)
    qs_user = User.objects
    qs_employee = Employee.objects
    qs_employee_address = EmployeeAddress.objects

    qs_user = qs_user.filter(username=username)
    user = qs_user.first()

    user_detail = backend_org_utils.make_user_detail(values)
    employee_detail = backend_org_utils.make_employee_detail(values)
    employee_add_detail = backend_org_utils.make_employee_add(payload)

    if int(employee_detail.get('state')) == 3:  # TODO халагдсан төлөвт ажилтан нэмэхгүй байгаа өөрчилж магадгүй
        error = {"state": '"ЧӨЛӨӨЛӨГДСӨН"-өөс бусад төлөвт шинээр албан хаагч үүсгэх боломжтой!'}
        errors.update(error)

    if user:
        is_fired_employee = backend_org_utils.is_fired_employee(user, qs_employee)
        if is_fired_employee:
            errors.update(backend_org_utils.user_validition(user_detail, user))
        else:
            errors.update(backend_org_utils.user_validition(user_detail))
    else:
        errors.update(backend_org_utils.user_validition(user_detail))

    errors.update(backend_org_utils.employee_validition(employee_detail))
    errors.update(backend_org_utils.employee_add_validator(employee_add_detail))

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    with transaction.atomic():
        user, created = qs_user.update_or_create(username=username, defaults=user_detail)

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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, pk):

    employee = get_object_or_404(Employee, pk=pk)

    is_success = backend_org_utils.set_state(employee)
    return JsonResponse({'success': is_success})


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

    errors = backend_org_utils.org_validation(org_name, org_id)
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

        for pos in Position.DEFAULT_POSITIONS:
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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_list(request, payload, level, pk):
    org = get_object_or_404(Org, pk=pk, level=level)
    is_user = payload.get('is_user')

    qs = Employee.objects
    qs = qs.filter(org=org)
    qs = qs.annotate(search=SearchVector(
        "user__email",
        "user__first_name",
        "user__last_name"
    ))

    if is_user:
        qs = qs.filter(user__is_user=True)

    qs = qs.filter(search__icontains=payload.get('query'))
    if not qs:
        rsp = {
            'items': [],
            'page': payload.get('page'),
            'total_page': 1,
        }
        return JsonResponse(rsp)

    оруулах_талбарууд = ['id', 'position_id', 'is_admin', 'user_id', 'token', 'created_at', 'updated_at']
    хувьсах_талбарууд = [
        {"field": "user_id", "action": backend_org_utils.get_name, "new_field": "user__first_name"},
        {"field": "user_id", "action": backend_org_utils.get_email, "new_field": "user__email"},
        {"field": "position_id", "action": backend_org_utils.get_position_name, "new_field": "position"},
    ]
    нэмэлт_талбарууд = [
        {"field": "role_name", "action": backend_org_utils.get_role_name},
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
    role_id = payload.get('pk')
    if role_id:
        gov_role = get_object_or_404(GovRole, pk=role_id)
        errors = backend_org_utils.perm_name_validation(payload, gov_role)
    else:
        errors = backend_org_utils.perm_name_validation(payload, None)
    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    if role_id:
        GovRole.objects.filter(id=role_id).update(name=values['name'], description=values['description'])
    else:
        GovRole.objects.create(name=values['name'], description=values['description'], created_by=request.user, updated_by=request.user)

    return JsonResponse({'success': True, 'errors': errors})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def role_detail(request, pk):
    role = GovRole.objects.filter(id=pk).first()

    rsp = {
        'success': True,
        'name': role.name,
        'description': role.description
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def remove_role(request, pk):
    role = GovRole.objects.filter(id=pk).first()
    role.delete()

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
        package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke = backend_org_utils.get_theme_packages_gov(themes.theme_id, govRole)
        data.append(
            {
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
            }
        )

    for datas in GovRoleInspire.objects.filter(gov_role=govRole):
        roles.append(
            {
                'perm_kind': datas.perm_kind,
                'feature_id': datas.feature_id,
                'data_type_id': datas.data_type_id,
                'property_id': datas.property_id,
                'geom': datas.geom,
            }
        )

    return JsonResponse({
        'data': data,
        'roles': roles,
        'success': True
    })


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
        package_data, t_perm_all, t_perm_view, t_perm_create, t_perm_remove, t_perm_update, t_perm_approve, t_perm_revoke = backend_org_utils.get_theme_packages(themes.theme_id, gov_perm)
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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def form_options(request, option):

    admin_levels = utils.get_administrative_levels()
    roles = backend_org_utils.get_roles_display()

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
            point_info['first_name'] = addresses.employee.user.first_name   # etseg
            point_info['last_name'] = addresses.employee.user.last_name     # onooj ogson ner
            point_info['is_cloned'] = backend_org_utils.is_cloned_feature(addresses)
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
            erguul_info['first_name'] = employee.user.first_name    # etseg
            erguul_info['last_name'] = employee.user.last_name  # onooj ogson ner

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

    employee = get_object_or_404(Employee, pk=pk)
    addresses = get_object_or_404(EmployeeAddress, employee=employee)

    if addresses:
        point_info = dict()
        point = addresses.point
        point_info['id'] = addresses.employee.id
        point_info['first_name'] = addresses.employee.user.first_name  # etseg
        point_info['last_name'] = addresses.employee.user.last_name  # onooj ogson ner
        point_info['is_cloned'] = backend_org_utils.is_cloned_feature(addresses)
        feature = utils.get_feature_from_geojson(point.json, properties=point_info)
        points.append(feature)

    erguul = EmployeeErguul.objects.filter(address=addresses).first()
    if erguul:
        erguul_info = dict()
        point = erguul.point
        erguul_info['id'] = employee.id
        erguul_info['is_erguul'] = True
        erguul_info['first_name'] = employee.user.first_name    # etseg
        erguul_info['last_name'] = employee.user.last_name  # onooj ogson ner

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
    info['last_name'] = employee.user.last_name     # ovog
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
        erguul_address = erguul.level_3 + ", " + erguul.street + " гудамж " + erguul.apartment + " байр"

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


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def get_erguuleg_fields(request, pk):
    erguul_id = ''
    send_fields = list()

    employee = get_object_or_404(Employee, pk=pk)
    erguul = backend_org_utils.get_erguul_qs(employee)

    if erguul:
        erguul_id = erguul['id']

    for f in EmployeeErguul._meta.get_fields():
        type_name = f.get_internal_type()
        not_list = ['ForeignKey', 'AutoField', 'BooleanField', 'PointField']
        if type_name not in not_list:
            not_field = ['created_at']
            if f.name not in not_field:
                if hasattr(f, 'verbose_name') and hasattr(f, 'max_length'):
                    value = backend_org_utils.get_erguul(erguul, f.name)
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

    point = backend_org_utils.get_point_for_db(payload.get('point'))
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
            data['first_name'] = employee.user.first_name  # etseg
            data['last_name'] = employee.user.last_name  # onooj ogson ner
            feature = utils.get_feature_from_geojson(point.json, properties=data)
            points.append(feature)

    feature_collection = FeatureCollection(points)

    rsp = {
        'feature_collection': feature_collection,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required
def get_select_values(request, payload):
    org_id = payload.get('org_id')

    if not org_id:
        employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
        org_id = employee.org_id

    qs = Position.objects
    qs = qs.filter(org_id=org_id)
    positions = list(qs.values())

    states = backend_org_utils.get_choices(Employee, 'state')
    pro_classes = backend_org_utils.get_choices(Employee, 'pro_class')

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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_create(request, payload, pk):
    name = payload.get("name")
    payload['org_id'] = pk
    qs = Position.objects
    qs_pos = qs.filter(org_id=pk)
    has_pos_name = backend_org_utils.pos_name_or_id_check(qs_pos, name)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        qs.create(**payload)
        rsp = {
            'success': True,
            'data': '"{name}" нэртэй албан тушаалыг амжилттай нэмлээ.'.format(name=name)
        }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def pos_update(request, payload, pk):
    name = payload.get("name")
    pos_id = int(payload.get("pos_id"))
    qs = Position.objects
    qs_pos = qs.filter(org_id=pk)
    has_pos_name = backend_org_utils.pos_name_or_id_check(qs_pos, name, pos_id)

    if has_pos_name:
        rsp = {
            'success': False,
            'error': '"{name}" нэртэй албан тушаал байна!!!'.format(name=name)
        }
    else:
        keys = ['pos_id']
        payload = utils.key_remove_of_dict(payload, keys)

        qs_pos.filter(
            id=pos_id
        ).update(**payload)
        rsp = {
            'success': True,
            'data': 'Албан тушаалыг амжилттай шинэчлэлээ.'
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
