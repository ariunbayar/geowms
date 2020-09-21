from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from backend.bundle.models import Bundle
from backend.wmslayer.models import WMSLayer
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db import connections


def _get_employee_display(employee):

    return {
        'id': employee.id,
        'last_name': employee.user.last_name,
        'username': employee.user.username,
        'first_name': employee.user.first_name,
        'email': employee.user.email,
        'register': employee.user.register,
        'gender': employee.user.gender,
        'is_active': employee.user.is_active,
        'is_sso': employee.user.is_sso,
        'position': employee.position,
        'created_at': employee.created_at.strftime('%Y-%m-%d'),
        'updated_at': employee.updated_at.strftime('%Y-%m-%d'),
    }


@require_POST
@ajax_required
def employees(request, payload):

    page = payload.get('page')
    per_page = payload.get('per_page')

    employee = get_object_or_404(Employee, user=request.user)
    employees = Employee.objects.filter(org=employee.org).order_by('id')
    total_items = Paginator(employees, per_page)
    items_page = total_items.page(page)

    items = [
        _get_employee_display(emp)
        for emp in employees
    ]
    total_page = total_items.num_pages

    rsp = {
        'items': items,
        'page': page,
        'total_page': total_page,
    }

    return JsonResponse(rsp)


def system(request):
    return render(request, 'page/service.html', {"org": "govorg"})

def all(request):
    org = get_object_or_404(Org, employee__user=request.user)
    perms = []
    for module in Bundle.MODULE_CHOICES:
        roles = OrgRole.objects.filter(org=org, bundle__module=module[0]).distinct('bundle')
        for role in roles:
            perms.append({
                'module_id':module[0],
                'module_name':module[1],
                'perm_view':role.perm_view,
                'perm_create':role.perm_create,
                'perm_remove':role.perm_remove,
                'perm_revoke':role.perm_revoke,
                'perm_review':role.perm_review,
                'perm_approve':role.perm_approve,
            })
    context = {
        'org': {
            "org_name":org.name,
            "org_level":org.level,
            'perms':perms
        },
    }
    return render(request, 'org/index.html', context)


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
    return org_role


@require_GET
@ajax_required
def bundle(request):

    org = Org.objects.filter(employee__user=request.user).first()

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

    org = Org.objects.filter(employee__user=request.user).first()

    context = {
        'org': {"org_name": org.name},
    }

    return render(request, 'org/index.html', context)


@require_POST
@ajax_required
def aimag(request):
    try:
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT  code, name, area_m2 FROM public."AU_AimagUnit" ORDER BY name ASC ''')
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)



@require_POST
@ajax_required
def sum(request, payload):
    try:
        code = payload.get('code')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT code, name FROM public."AU_SumUnit" where au1_code = %s ORDER BY name  ASC ''', [code])
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)

@require_POST
@ajax_required
def bagaHoroo(request, payload):
    try:
        code = payload.get('code')
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT code, name FROM public."AU_BagUnit" where au2_code = %s ORDER BY name ASC ''', [code])
        data = find_cursor.fetchall()
        if(data):
            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_GET
@ajax_required
def wmsLayer(request):
    layers = []
    zip_layers = WMSLayer.objects.filter(geodb_table='zip_code')
    for zip_layer in zip_layers:
        layers.append({
            'name':zip_layer.name,
            'code':zip_layer.code
        })
        wms_id = zip_layer.wms_id
    wms_list = [{
        'name': 'Зипкод',
        'url': '/back/wms/WMS/' + str(wms_id) + '/',
        'layers':layers
    }]
    print(wms_list)
    rsp = {
        'wms_list': wms_list,
        'success': True,
    }
    return JsonResponse(rsp)