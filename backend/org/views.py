from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime, now
from django.views.decorators.http import require_GET, require_POST
from django.core.paginator import Paginator
import json

from main.decorators import ajax_required
from .models import Org, OrgRole, Employee, OrgInspireRoles
from backend.bundle.models import Bundle
from geoportal_app.models import User
from backend.govorg.models import GovOrg
from .models import OrgInspireRoles
from django.contrib.postgres.search import SearchVector
from backend.inspire.models import LThemes, LPackages, LFeatures, MDatasBoundary, LDataTypeConfigs, LFeatureConfigs, LDataTypes, LProperties, LValueTypes, LCodeListConfigs, LCodeLists


def _get_property(org_id, feature_id):
    properties_list = []
    data_type_ids = LFeatureConfigs.objects.filter(feature_id=feature_id).values("data_type_id")
    property_ids = LDataTypeConfigs.objects.filter(data_type_id__in=[data_type_ids]).values("property_id")
    properties = LProperties.objects.filter(property_id__in=[property_ids]).values('property_id', "property_code", "property_name")
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
    module = OrgInspireRoles.objects.filter(org_id=org_id, module_id=module_id, module = module, module_root_id=module_root_id ).first()
    if module:
        roles = [module.perm_view,module.perm_create, module.perm_remove, module.perm_update, module.perm_revoke, module.perm_review, module.perm_approve]
    else:
        roles = [False,False,False,False,False,False,False]
    return roles


@require_GET
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def Inspireroles(request, level, pk):

    roles = []
    data = []
    org = get_object_or_404(Org, pk=pk, level=level)

    for themes in LThemes.objects.all():
        data.append({
                'id': themes.theme_id,
                'code': themes.theme_code,
                'name': themes.theme_name,
                'packages': _get_package(1, themes.theme_id),
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
            'name': bundle.name,
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
def employee_more(request, level, pk, emp):

    org = get_object_or_404(Org, pk=pk, level=level)
    employees_display = []

    for employe in User.objects.filter(employee__org=org, pk=emp):
        employees_display.append({
            'id': employe.id,
            'last_name': employe.last_name,
            'username': employe.username,
            'first_name': employe.first_name,
            'email': employe.email,
            'register': employe.register,
            'gender': employe.gender,
            'is_active': employe.is_active,
            'is_sso': employe.is_sso,
            'position': Employee.objects.filter(user=employe).values('position')[0]['position'],
            'created_at': Employee.objects.filter(user=employe).values('created_at')[0]['created_at'].strftime('%Y-%m-%d'),
            'updated_at': Employee.objects.filter(user=employe).values('updated_at')[0]['updated_at'].strftime('%Y-%m-%d'),
        })
    return JsonResponse({'employee': employees_display})    


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_update(request, payload, level, pk):
    user_id = payload.get('id')
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    gender = payload.get('gender')
    register = payload.get('register')

    get_object_or_404(User, pk=user_id)

    User.objects.filter(pk=user_id).update(
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            gender=gender,
                            register=register
                        )

    Employee.objects.filter(user_id=user_id).update(position=position)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_add(request, payload, level, pk):

    username = payload.get('username')
    position = payload.get('position')
    first_name = payload.get('first_name')
    last_name = payload.get('last_name')
    email = payload.get('email')
    gender = payload.get('gender')
    register = payload.get('register')
    password = payload.get('password')

    user = User.objects.filter(username=username).first()
    if user:
        return JsonResponse({'user_name': True})

    else:
        if level == 4:
            is_superuser = True
        else:
            is_superuser = False

        user = User.objects.create(
            is_superuser=is_superuser, username=username,
            first_name=first_name, last_name=last_name,
            email=email, gender=gender, register=register
        )
        user.roles.add(2)
        user.set_password(password)
        user.save()

        Employee.objects.create(position=position, org_id=pk, user_id=user.id)

        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employee_remove(request, payload, level, pk):

    user_id = payload.get('user_id')
    get_object_or_404(User, pk=user_id)

    user = User.objects.filter(pk=user_id)
    employee = Employee.objects.filter(user_id=user_id)
    employee.delete()
    user.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_add(request, payload, level):

    org_name = payload.get('org_name')
    upadte_level = payload.get('upadte_level')
    org_id = payload.get('id')
    if org_id:
        Org.objects.filter(id=org_id).update(name=org_name, level=upadte_level)
        return JsonResponse({'success': True})
    else:
        Org.objects.create(name=org_name, level=level)
        return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def org_remove(request, payload, level):

    org_id = payload.get('org_id')
    org = get_object_or_404(Org, pk=org_id, level=level)
    org_users = Employee.objects.filter(org=org_id)
    for org_user in org_users:
        user = User.objects.filter(pk=org_user.user_id)
        org_user.delete()
        user.delete()
    org_govorgs = GovOrg.objects.filter(org=org)
    for org_govorg in org_govorgs:
        org_govorg.delete()
    org.orgrole_set.all().delete()
    org.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def orgList(request, payload, level):

    page = payload.get('page')
    query = payload.get('query')
    per_page = payload.get('perpage')
    level = payload.get('org_level')
    orgs_display = []

    orgs = Org.objects.filter(level=level).annotate(search=SearchVector(
        'name')).filter(search__contains=query).order_by('id')
    total_items = Paginator(orgs, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list
    for org in page_items:
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
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
def OrgAll(request, level, pk):
    orgs_display = []
    for org in Org.objects.filter(level=level, pk=pk):
        orgs_display.append({
            'id': org.id,
            'name': org.name,
            'level': org.level,
            'level_display': org.get_level_display(),
        })
    org = get_object_or_404(Org, pk=pk, level=level)
    return JsonResponse({
        'orgs': orgs_display,
        'count': User.objects.filter(employee__org=org).count()
    })


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def employeeList(request,payload, level, pk):
    org = get_object_or_404(Org, pk=pk, level=level)
    employees_display = []
    page = payload.get('page')
    query = payload.get('query')
    per_page = payload.get('perpage')

    emp_list = User.objects.filter(employee__org=org).annotate(search=SearchVector(
        'last_name', 
        'first_name', 
        'email')
    ).filter(search__contains=query)

    total_items = Paginator(emp_list, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list
    for employe in page_items:
        employees_display.append({
            'id': employe.id,
            'last_name': employe.last_name,
            'first_name': employe.first_name,
            'email': employe.email,
            'is_active': employe.is_active,
            'is_sso': employe.is_sso,
            'position': Employee.objects.filter(user=employe).values('position')[0]['position'],
            'created_at': Employee.objects.filter(user=employe).values('created_at')[0]['created_at'].strftime('%Y-%m-%d'),
            'updated_at': Employee.objects.filter(user=employe).values('updated_at')[0]['updated_at'].strftime('%Y-%m-%d'),
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
def rolesAdd(request, payload, level, pk):
    form_datas = payload.get("form_values")
    org = get_object_or_404(Org, pk=pk)
    def role_update(roles, table_name, root_id, id):
        if root_id:
            org_check = OrgInspireRoles.objects.filter(module_root_id=root_id , module_id=id, module=table_name)
        else:
            org_check = OrgInspireRoles.objects.filter(module_id=id, module=table_name)
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
            orgRole = OrgInspireRoles.objects.create(
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