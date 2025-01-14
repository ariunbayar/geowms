# Generated by Django 3.0.7 on 2020-12-14 08:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0007_auto_20201127_1158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='empperm',
            name='emp_role',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend_inspire.EmpRole'),
        ),
        migrations.AlterField(
            model_name='emprole',
            name='gov_perm',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend_inspire.GovPerm'),
        ),
    ]
