from django.db import migrations, models


def fix_perm_emp_perm(apps, schema_editor):

    EmpPerm = apps.get_model('backend_inspire', 'EmpPerm')
    Employee = apps.get_model('backend_org', 'Employee')

    employees = Employee.objects.all()

    for emp in employees:

        emp_perm = emp.empperm_set.all().first()

        if emp_perm:
            continue

        emp_perm = EmpPerm()
        emp_perm.employee = emp
        emp_perm.save()

        print('Created %r for %r' % (emp_perm, emp))


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0012_employee_token'),
        ('backend_inspire', '0008_auto_20201214_1651'),
    ]

    operations = [
        migrations.RunPython(fix_perm_emp_perm),
    ]
