from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET
from main.decorators import ajax_required
from django.http import JsonResponse
from django.core.paginator import Paginator


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

    org = Org.objects.filter(employee__user=request.user).first()

    context = {
        'org': {"org_name": org.name},
    }

    return render(request, 'org/index.html', context)
