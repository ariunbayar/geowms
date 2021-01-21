# Generated by Django 3.0.7 on 2020-11-28 01:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0011_auto_20210105_0111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changerequest',
            name='kind',
            field=models.PositiveIntegerField(choices=[(1, 'ҮҮССЭН'), (2, 'ЗАССАН'), (3, 'УСТГАСАН'), (4, 'ШУУД'), (5, 'ЦУЦЛАСАН')], db_index=True, null=True),
        ),
    ]
