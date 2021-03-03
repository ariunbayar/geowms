# Generated by Django 3.0.7 on 2021-02-24 03:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0019_auto_20210303_1553'),
    ]

    operations = [

        migrations.AddField(
            model_name='employeeerguul',
            name='is_over',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='erguultailbar',
            name='erguul',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='backend_org.EmployeeErguul'),
        ),
    ]
