import uuid
from django.db import migrations

def _generate_emp_token():
    return uuid.uuid4().hex[:32]

def employee_token_create(apps, schema_editor):
    Employee = apps.get_model('backend_org', 'Employee')

    for employee in Employee.objects.all():
        employee.token = _generate_emp_token()
        employee.save()

class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0012_employee_token'),
    ]

    operations = [
        migrations.RunPython(employee_token_create),
    ]
