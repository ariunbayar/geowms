# Generated by Django 3.0.7 on 2020-10-23 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0004_auto_20201023_1137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_approve',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_create',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_remove',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_review',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_revoke',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_update',
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name='orginspireroles',
            name='perm_view',
            field=models.BooleanField(db_index=True, default=False),
        ),
    ]
