# Generated by Django 3.0.7 on 2020-10-30 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0004_auto_20201030_0932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changerequest',
            name='kind',
            field=models.PositiveIntegerField(choices=[(1, 'ҮҮССЭН'), (2, 'ЗАССАН'), (3, 'УСТГАСАН'), (4, 'ШУУД')], db_index=True, null=True),
        ),
    ]
