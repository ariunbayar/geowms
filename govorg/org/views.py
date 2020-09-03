from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from backend.bundle.models import Bundle
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator



def _get_employee_display(employe):

    return {
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
    }


@require_POST
@ajax_required
def employees(request, payload):
    
    page = payload.get('page')
    per_page = payload.get('per_page')
    User.objects.filter(username="bolormaa")
    user_id = get_object_or_404(User,username="bolormaa").id
    org_id = get_object_or_404(Employee, user_id=user_id).org_id
    level = get_object_or_404(Org, id=org_id).level
    org = get_object_or_404(Org, pk=org_id, level=level)
    Emp = User.objects.filter(employee__org=org).order_by('id')
    total_items = Paginator(Emp, per_page)
    items_page = total_items.page(page)
    items = [
        _get_employee_display(pay)
        for pay in items_page.object_list
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
    User.objects.filter(username="bolormaa")
    user_id = get_object_or_404(User,username="bolormaa").id
    org_id = get_object_or_404(Employee, user_id=user_id).org_id
    org_name = get_object_or_404(Org, id=org_id).name.upper()
    return render(request, 'org/index.html', {"org_name": org_name})
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

    User.objects.filter(username="bolormaa")
    user_id = get_object_or_404(User,username="bolormaa").id
    org_id = get_object_or_404(Employee, user_id=user_id).org_id
    org = get_object_or_404(Org, pk=org_id)

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

