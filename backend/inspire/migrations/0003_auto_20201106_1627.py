# Generated by Django 3.0.7 on 2020-11-06 08:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend_org', '0007_auto_20201104_1041'),
        ('inspire', '0002_lcodelistconfigs_lcodelists_ldatatypeconfigs_ldatatypes_lfeatureconfigs_lproperties_lvaluetypes_mdat'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmpPerm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_emp_perm',
            },
        ),
        migrations.CreateModel(
            name='EmpRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=1000)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_emp_role',
            },
        ),
        migrations.CreateModel(
            name='GovPerm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geo_id', models.CharField(max_length=100)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_gov_perm',
            },
        ),
        migrations.CreateModel(
            name='GovRole',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=1000)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_gov_role',
            },
        ),
        migrations.CreateModel(
            name='GovRoleInspire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perm_kind', models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (5, 'ЦУЦЛАХ'), (6, 'БАТЛАХ')], db_index=True)),
                ('feature_id', models.IntegerField()),
                ('property_id', models.IntegerField()),
                ('geom', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('gov_role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovRole')),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_gov_role_inspire',
            },
        ),
        migrations.CreateModel(
            name='GovPermInspire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perm_kind', models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (5, 'ЦУЦЛАХ'), (6, 'БАТЛАХ')], db_index=True)),
                ('feature_id', models.IntegerField()),
                ('property_id', models.IntegerField()),
                ('geom', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('gov_perm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovPerm')),
                ('gov_role_inspire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovRoleInspire')),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_gov_perm_inspire',
            },
        ),
        migrations.AddField(
            model_name='govperm',
            name='gov_role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovRole'),
        ),
        migrations.AddField(
            model_name='govperm',
            name='org',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_org.Org'),
        ),
        migrations.AddField(
            model_name='govperm',
            name='updated_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='EmpRoleInspire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perm_kind', models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (5, 'ЦУЦЛАХ'), (6, 'БАТЛАХ')], db_index=True)),
                ('feature_id', models.IntegerField()),
                ('property_id', models.IntegerField()),
                ('geom', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('emp_role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.EmpRole')),
                ('gov_perm_inspire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovPermInspire')),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_emp_role_inspire',
            },
        ),
        migrations.AddField(
            model_name='emprole',
            name='gov_perm',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovPerm'),
        ),
        migrations.AddField(
            model_name='emprole',
            name='updated_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='EmpPermInspire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perm_kind', models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (5, 'ЦУЦЛАХ'), (6, 'БАТЛАХ')], db_index=True)),
                ('feature_id', models.IntegerField()),
                ('property_id', models.IntegerField()),
                ('geom', models.BooleanField(default=False)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('emp_perm', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.EmpPerm')),
                ('emp_role_inspire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.EmpRoleInspire')),
                ('gov_perm_inspire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.GovPermInspire')),
                ('updated_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'perm_emp_perm_inspire',
            },
        ),
        migrations.AddField(
            model_name='empperm',
            name='emp_role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inspire.EmpRole'),
        ),
        migrations.AddField(
            model_name='empperm',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_org.Employee'),
        ),
        migrations.AddField(
            model_name='empperm',
            name='updated_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
    ]
