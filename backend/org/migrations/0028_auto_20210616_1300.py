# Generated by Django 3.0.7 on 2021-07-23 02:11

from django.db import migrations
from django.db import transaction


def def_pos_remove(orgs, qs_pos, def_org_id):
    has_org = orgs.filter(id=def_org_id).first()
    if not has_org:
        qs_pos.filter(org_id=def_org_id).delete()


def empower_emp(qs_pos, qs_emp):
    for emp in qs_emp.all():
        pos_name = emp.position.name
        org_id = emp.org_id
        position = qs_pos.filter(name=pos_name, org_id=org_id).first()
        if position:
            emp.position_id = position.id
            emp.save()


def authorize_org(apps, schema_editor):
    print('\nУншиж байна ...')
    Position = apps.get_model('backend_org', 'Position')
    Org = apps.get_model('backend_org', 'Org')
    Employee = apps.get_model('backend_org', 'Employee')

    qs_pos = Position.objects
    qs_org = Org.objects
    qs_emp = Employee.objects

    def_pos = [
        "Байхгүй",
        "Сайд",
        "Дэд сайд",
        "Төрийн нарийн бичгийн дарга",
        "Дарга",
        "Орлогч дарга",
        "Тэргүүн дэд",
        "Газрын дарга",
        "Хэлтсийн дарга",
        "Ахлах шинжээч",
        "Шинжээч",
        "Ахлах мэргэжилтэн",
        "Мэргэжилтэн",
        "Зөвлөх"
    ]

    qs = Position.objects.first()
    if qs:
        def_org_id = qs.org_id
        orgs = qs_org.all()
        with transaction.atomic():
            for org in orgs:
                if org.id != def_org_id:
                    for pos in def_pos:
                        qs_pos.create(
                            name=pos,
                            org=org
                        )
            empower_emp(qs_pos, qs_emp)

        def_pos_remove(orgs, qs_pos, def_org_id)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0027_auto_20210616_1138'),
    ]

    operations = [
        migrations.RunPython(authorize_org)
    ]
