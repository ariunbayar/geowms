# Generated by Django 3.0.7 on 2020-10-29 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0002_auto_20201028_1417'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changerequest',
            name='state',
            field=models.PositiveIntegerField(choices=[(1, 'ТАТГАЛЗСАН'), (2, 'ЗӨВШӨӨРСӨН')], db_index=True, null=True),
        ),
    ]
