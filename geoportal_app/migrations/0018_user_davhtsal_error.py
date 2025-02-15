# Generated by Django 3.0.6 on 2020-07-08 10:33

from django.db import migrations, models
from django.core import serializers

def user_davhtsal(apps, schema_editor):

    User = apps.get_model('geoportal_app', 'User')
    for user in User.objects.all():
        if not user.email:
            continue
        user_ids = User.objects.filter(email=user.email).values_list('id')
        if len(user_ids) > 1:
            raise Exception('Дараах хэрэглэгчийн email хаяг давхцаж байана.\n'
            'E-Mail хаягаа солих юмуу тухайн хэрэглйигчийнг устга.' + str(user_ids) +
            '\ndelete FROM public.geoportal_app_user where id = \n'
            'delete FROM public.backend_org_employee where user_id = \n'
            'delete FROM public.geoportal_app_user_roles where user_id = \n'
            )


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0017_remove_450_user'),
    ]

    operations = [
        migrations.RunPython(user_davhtsal),
    ]
