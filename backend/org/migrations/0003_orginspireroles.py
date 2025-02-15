# Generated by Django 3.0.7 on 2020-10-22 06:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0002_auto_20200801_1059'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrgInspireRoles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('module_root_id', models.BigIntegerField()),
                ('module_id', models.BigIntegerField()),
                ('module', models.PositiveIntegerField(choices=[(1, 'Дэд сан'), (2, 'Багц'), (3, 'Давхрага'), (4, 'Талбар')], db_index=True, null=True)),
                ('perm_view', models.BooleanField(db_index=True)),
                ('perm_create', models.BooleanField(db_index=True)),
                ('perm_remove', models.BooleanField(db_index=True)),
                ('perm_update', models.BooleanField(db_index=True)),
                ('perm_revoke', models.BooleanField(db_index=True)),
                ('perm_review', models.BooleanField(db_index=True)),
                ('perm_approve', models.BooleanField(db_index=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_org.Org')),
            ],
        ),
    ]
