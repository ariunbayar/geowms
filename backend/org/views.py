from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import get_list_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST

from backend.bundle.models import Bundle
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
from backend.inspire.models import GovRoleInspire
from backend.inspire.models import GovPermInspire
from backend.inspire.models import MDatas
from backend.inspire.models import LCodeLists
from backend.token.utils import TokenGeneratorEmployee
from geoportal_app.models import User

from main.decorators import ajax_required
from main import utils

from .models import Org, OrgRole, Employee, InspirePerm


def _get_property(org_id, feature_id):
    properties_list = []
    data_type_ids = LFeatureConfigs.objects.filter(feature_id=feature_id).values("data_type_id")
    property_ids = LDataTypeConfigs.objects.filter(data_type_id__in=[data_type_ids]).values_list('property_id', flat=True)
    properties = LProperties.objects.filter(property_id__in=property_ids).values('property_id', "property_code", "property_name")
    for prop in properties:
        properties_list.append({
            'id':prop['property_id'],
            'code':prop['property_code'],
            'name':prop['property_name'],
            'roles': _get_roles(org_id, prop['property_id'], 4, feature_id)
        })

    return properties_list


def _get_features(org_id, package_id,):
    feat_values = []
    features = LFeatures.objects.filter(package_id=package_id   )

    for feat in features:
        feat_values.append({
            'id':feat.feature_id,
            'code':feat.feature_code,
            'name':feat.feature_name,
            'roles': _get_roles(org_id, feat.feature_id, 3, package_id),
            'properties': _get_property(org_id, feat.feature_id)
        })

    return feat_values


def _get_package(org_id, theme_id):

    package_data = []
    roles = []
    for package in LPackages.objects.filter(theme_id=theme_id):
        roles = _get_roles(org_id, package.package_id, 2, theme_id)
        package_data.append({
                'id': package.package_id,
                'code': package.package_code,
                'name': package.package_name,
                'roles':roles,
                'features': _get_features(org_id, package.package_id)
            })

    return package_data


def _get_roles(org_id, module_id, module, module_root_id):
    roles = []
    module = InspirePerm.objects.filter(org_id=org_id, module_id=module_id, module = module, module_root_id=module_root_id ).first()
    if module:
        roles = [module.perm_view,module.perm_create, module.perm_remove, module.perm_update, module.perm_revoke, module.perm_review, module.perm_approve]
    else:
        roles = [False,False,False,False,False,False,False]
    return roles


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def inspire_roles(request, level, pk):

    data = []
    org = get_object_or_404(Org, pk=pk, level=level)
    for themes in LThemes.objects.all():
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'packages': _get_package(org.id, themes.theme_id),
                'roles': _get_roles(org.id, themes.theme_id, 1, None)
            })

    return JsonResponse({
        'data': data,
        'success': True
    })

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


def _get_org_role_display(org_role):

    bundle = org_role.bundle
    return {
        'org_id': org_role.org_id,
        'bundle': {
            'id': bundle.id,
            'name': bundle.ltheme.theme_name if bundle.ltheme else '',
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


def _get_default_org_role(org, bundle):
    org_role = OrgRole()
    org_role.org = org
    org_role.bundle = bundle
    org_role.perm_view = False
    org_role.perm_create = False
    org_role.perm_remove = False
    org_role.perm_revoke = False
    org_role.perm_review = False
    org_role.perm_approve = False
    org_role.created_at = localtime(now())
    org_role.updated_at = localtime(now())
    return org_role


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles(request, level, pk):

    org = get_object_or_404(Org, pk=pk)

    bundles = Bundle.objects.all()
    mapped_org_roles = dict([
        (org_role.bundle_id, org_role)
        for org_role in org.orgrole_set.all()
    ])

    org_roles_display = []
    for bundle in bundles:
        if bundle.id not in mapped_org_roles:
            org_role = _get_default_org_role(org, bundle)
        else:
            org_role = mapped_org_roles[bundle.id]
        org_roles_display.append(
            _get_org_role_display(org_role)
        )

    return JsonResponse({'org_roles': org_roles_display})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles_save(request, payload, level, pk):

    org = get_object_or_404(Org, pk=pk)

    org_roles_new = []
    org_roles_existing = org.orgrole_set.all()
    mapped_org_roles_existing = dict([
        (org_role.bundle_id, org_role)
        for org_role in org_roles_existing
    ])

    bundle_ids = [
        org_role['bundle']['id']
        for org_role in payload
    ]
    bundles_mapped = dict([
        (bundle.id, bundle)
        for bundle in Bundle.objects.filter(pk__in=bundle_ids)
    ])

    def _set_org_role_perms(org_role, bundle_permission):
        org_role.perm_view = bundle_permission.get('perm_view') is True
        org_role.perm_create = bundle_permission.get('perm_create') is True
        org_role.perm_remove = bundle_permission.get('perm_remove') is True
        org_role.perm_revoke = bundle_permission.get('perm_revoke') is True
        org_role.perm_review = bundle_permission.get('perm_review') is True
        org_role.perm_approve = bundle_permission.get('perm_approve') is True

    for bundle_permission in payload:

        bundle_id = bundle_permission.get('bundle', {}).get('id')

        if bundle_id not in bundles_mapped:
            continue

        if bundle_id in mapped_org_roles_existing:
            org_role = mapped_org_roles_existing[bundle_id]
            org_role.updated_at = localtime(now())
        else:
            org_role = OrgRole(org=org, bundle=bundles_mapped[bundle_id])
            org_roles_new.append(org_role)

        _set_org_role_perms(org_role, bundle_permission)

    OrgRole.objects.bulk_create(org_roles_new)

    OrgRole.objects.bulk_update(
        org_roles_existing,
        ['perm_view', 'perm_create', 'perm_remove', 'perm_revoke', 'perm_review', 'perm_approve', 'updated_at']
    )

    return JsonResponse({'success': True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_detail(request, pk):

    user = get_object_or_404(User, pk=pk)
    employee = Employee.objects.filter(user=user).first()
    employees_display = {
        'id': user.id,
        'last_name': user.last_name,
        'username': user.username,
        'first_name': user.first_name,
        'email': user.email,
        'register': user.register,
        'gender': user.gender,
        'is_active': user.is_active,
        'is_sso': user.is_sso,
        'position': employee.position,
        'is_admin': employee.is_admin,
        'is_super': user.is_superuser,
        'created_at': employee.created_at.strftime('%Y-%m-%d'),
        'updated_at': employee.updated_at.strftime('%Y-%m-%d'),
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
    if not gender:
        errors['gender'] = 'Хоосон байна утга оруулна уу.'
    elif len(gender) > 100:
        errors['gender'] = '100-с илүүгүй урттай утга оруулна уу!'
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
@user_passes_test(lambda u: u.is_superuser)
def employee_update(request, payload, pk, level):
    username = payload.get('username')
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    gender = payload.get('gender')
    register = payload.get('register')
    is_admin = payload.get('is_admin')
    password = payload.get('password')
    is_super = payload.get('is_super')
    re_password_mail = payload.get('re_password_mail')
    user = get_object_or_404(User, pk=pk)
    errors = _employee_validation(payload, user)
    if errors:
        return JsonResponse({'success': False, 'errors': errors})

    if level == 4:
        is_super = is_super
    else:
        is_super = False

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
    Employee.objects.filter(user_id=pk).update(position=position, is_admin=is_admin)

    return JsonResponse({'success': True, 'errors': errors})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):

    org = get_object_or_404(Org, pk=pk, level=level)

    username = payload.get('username')
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    gender = payload.get('gender')
    register = payload.get('register')
    is_admin = payload.get('is_admin')
    is_super = payload.get('is_super')

    errors = {}
    errors = _employee_validation(payload, None)

    if errors:
        return JsonResponse({'success': False, 'errors': errors})

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
        employee.position = position
        employee.org = org
        employee.user_id = user.id
        employee.is_admin = is_admin
        employee.token = TokenGeneratorEmployee().get()
        employee.save()

        utils.send_approve_email(user)

    return JsonResponse({'success': True, 'errors': errors})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, pk):

    user = get_object_or_404(User, id=pk)
    Employee.objects.filter(user=user).first().delete()
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_add(request, payload, level):
    org_name = payload.get('org_name')
    upadte_level = payload.get('upadte_level')
    role_id = payload.get('role_id')
    org_role_filter = GovRole.objects.filter(pk=role_id).first()
    org_id = payload.get('id')
    geo_id = payload.get('geo_id')
    objs = []
    if org_id:
        org = get_object_or_404(Org, pk=org_id)
        org.name = org_name
        org.level = upadte_level
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
    else:
        gov_role_inspire_all = GovRoleInspire.objects.filter(gov_role=org_role_filter)
        org = Org.objects.create(name=org_name, level=level, geo_id=geo_id)
        if org_role_filter:
            gov_perm = GovPerm.objects.create(
                org=org,
                gov_role=org_role_filter,
                created_by=request.user,
                updated_by=request.user
            )
        else:
            gov_perm = GovPerm.objects.create(
                org=org,
                created_by=request.user,
                updated_by=request.user
            )
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
    inspire_perm = InspirePerm.objects.filter(org=org)
    for org_user in org_users:
        user = User.objects.filter(pk=org_user.user_id)
        org_user.delete()
        user.delete()
    org_govorgs = GovOrg.objects.filter(org=org)
    for org_govorg in org_govorgs:
        org_govorg.org = None
        org_govorg.deleted_by = request.user
        org_govorg.deleted_at = localtime(now())
        org_govorg.save()
    inspire_perm.delete()
    org.orgrole_set.all().delete()
    gov_perm = GovPerm.objects.filter(org=org)
    gov_perm.delete()
    org.delete()
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_list(request, payload, level):

    page = payload.get('page')
    query = payload.get('query') or ''
    per_page = payload.get('perpage')
    level = payload.get('org_level')
    orgs_display = []
    sort_name = payload.get('sort_name')

    if not sort_name:
        sort_name = 'id'

    qs = Org.objects.filter(level=level)
    qs = qs.annotate(num_employees=Count('employee'))
    qs = qs.annotate(num_systems=Count('govorg'))
    if query:
        qs = qs.annotate(search=SearchVector('name'))
        qs = qs.filter(Q(search__contains=query) | Q(employee__user__email=query))
    qs = qs.order_by(sort_name)

    total_items = Paginator(qs, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list

    for org in page_items:
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
            'num_employees': org.num_employees,
            'num_systems': org.num_systems,
        })

    total_page = total_items.num_pages

    rsp = {
        'items': orgs_display,
        'page': page,
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


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_list(request,payload, level, pk):
    org = get_object_or_404(Org, pk=pk, level=level)
    employees_display = []
    page = payload.get('page')
    query = payload.get('query') or ''
    per_page = payload.get('perpage')
    sort_name = payload.get('sort_name')

    if not sort_name:
        sort_name = 'last_name'

    qs = User.objects
    qs = qs.filter(employee__org=org)
    qs = qs.annotate(search=SearchVector(
        'last_name',
        'first_name',
        'email')
        )
    if query:
        qs = qs.filter(search__contains=query)
    qs = qs.order_by(sort_name)
    emp_list = qs

    total_items = Paginator(emp_list, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list
    for employe in page_items:
        emp_obj = Employee.objects.filter(user=employe).first()
        employees_display.append({
            'id': employe.id,
            'last_name': employe.last_name,
            'first_name': employe.first_name,
            'email': employe.email,
            'is_active': employe.is_active,
            'is_sso': employe.is_sso,
            'is_admin': emp_obj.is_admin,
            'position': emp_obj.position,
            'created_at': emp_obj.created_at.strftime('%Y-%m-%d'),
            'updated_at': emp_obj.updated_at.strftime('%Y-%m-%d'),
        })
    total_page = total_items.num_pages
    rsp = {
        'items': employees_display,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)

@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def roles_add(request, payload, level, pk):
    form_datas = payload.get("form_values")
    org = get_object_or_404(Org, pk=pk, level=level)
    def role_update(roles, table_name, root_id, id):
        if root_id:
            org_check = InspirePerm.objects.filter(module_root_id=root_id , module_id=id, module=table_name, org=org)
        else:
            org_check = InspirePerm.objects.filter(module_id=id, module=table_name, org=org)
        if org_check:
            org_check.update(
                perm_view=roles[0],
                perm_create=roles[1],
                perm_remove=roles[2],
                perm_update=roles[3],
                perm_revoke=roles[4],
                perm_review=roles[5],
                perm_approve=roles[6]
            )
        else:
            orgRole = InspirePerm.objects.create(
                org=org,
                module_id=id,
                module=table_name,
                perm_view=roles[0],
                perm_create=roles[1],
                perm_remove=roles[2],
                perm_update=roles[3],
                perm_revoke=roles[4],
                perm_review=roles[5],
                perm_approve=roles[6]
            )
            if orgRole and root_id:
                orgRole.module_root_id = root_id
                orgRole.save()


    for themes in form_datas:
        role_update(themes['roles'], 1, None, themes['id'])
        for packages in themes['packages']:
            role_update(packages['roles'], 2, themes['id'], packages['id'])
            for features in packages['features']:
                role_update(features['roles'], 3, packages['id'], features['id'])
                for properties in features['properties']:
                    role_update(properties['roles'], 4, features['id'], properties['id'])

    return JsonResponse({'success': True})


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def count_org(request):
    rsp = {
        'gov_count':{
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
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    list_datas = []
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    gove_roles = GovRole.objects.annotate(search=SearchVector(
        'id',
        'name',
        'description',
        'created_by'
    ) + SearchVector('name'),).filter(search__icontains=query).order_by(sort_name)

    total_items = Paginator(gove_roles, per_page)
    items_page = total_items.page(page)

    for list_data in items_page.object_list:
        list_datas.append({
            'id': list_data.id,
            'name': list_data.name,
            'description': list_data.description,
            'created_by': list_data.created_by.username
        })

    total_page = total_items.num_pages

    rsp = {
        'items': list_datas,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def create_perm(request, payload):
    values = payload.get('values')
    name_check = GovRole.objects.filter(name=values['name'])
    if name_check:
        rsp = {
            'success': False,
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
def form_options(request):

    admin_levels = utils.get_administrative_levels()
    roles = _get_roles_display()
    feature_id = get_object_or_404(LFeatures, feature_code='au-au-au').feature_id
    property_id = get_object_or_404(LProperties, property_code='NationalLevel').property_id
    code_list_id = get_object_or_404(LCodeLists, code_list_code='1stOrder\n').code_list_id
    feature_config_ids = LFeatureConfigs.objects.filter(feature_id=feature_id)

    firstOrder_geom = get_object_or_404(MDatas, property_id=property_id, code_list_id=code_list_id, feature_config_id__in=feature_config_ids).geo_id
    rsp = {
        'success': True,
        'secondOrders': admin_levels,
        'roles': roles,
        'firstOrder_geom': firstOrder_geom,
    }

    return JsonResponse(rsp)
