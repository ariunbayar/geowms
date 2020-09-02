from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
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

