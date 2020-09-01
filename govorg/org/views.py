from django.shortcuts import render
from backend.org.models import Org, OrgRole, Employee
from geoportal_app.models import User
from django.shortcuts import get_object_or_404


def all(request):
    User.objects.filter(username="bolormaa")
    employees_display = []
    user_id = get_object_or_404(User,username="bolormaa").id
    org_id = get_object_or_404(Employee, user_id=user_id).org_id
    level = get_object_or_404(Org, id=org_id).level
    org_name = get_object_or_404(Org, id=org_id).name
    org = get_object_or_404(Org, pk=org_id, level=level)
    for employe in User.objects.filter(employee__org=org):
        employees_display.append({
            'org_name': org_name,
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

    return render(request, 'org/index.html')

def system(request):
    return render(request, 'page/service.html', {"org": "govorg"})

def employees(request):

    return render(request, 'org/index.html', {"employees_display": "employees_display"})

