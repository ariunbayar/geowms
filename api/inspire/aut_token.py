from django.shortcuts import get_object_or_404
from django.apps import apps

def my_jwt_response_handler(token, user=None, request=None):
    Employee = apps.get_model('backend_org', 'Employee')
    employee = get_object_or_404(Employee, user=user)
    if employee.is_admin:
        return {
            'success': True,
            'token': token,
            'info': "24 цагын хугацаатай."
        }
    else:
        return {
            'success': False,
            'info': 'Байгууллагын админ эрх алга байна.'
        }
