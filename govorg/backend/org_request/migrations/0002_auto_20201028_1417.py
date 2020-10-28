# Generated by Django 3.0.7 on 2020-10-28 06:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0006_auto_20201026_1020'),
        ('org_request', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChangeRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('old_geo_id', models.CharField(max_length=100, null=True)),
                ('new_geo_id', models.CharField(max_length=100, null=True)),
                ('theme_id', models.IntegerField()),
                ('package_id', models.IntegerField()),
                ('feature_id', models.IntegerField()),
                ('state', models.PositiveIntegerField(choices=[(1, 'Шинээр үүссэн'), (2, 'Цуцлах'), (3, 'Хянах'), (4, 'Батлах')], db_index=True, null=True)),
                ('kind', models.PositiveIntegerField(choices=[(1, 'Шинээр үүссэн'), (2, 'Зассан'), (3, 'Устгасан')], db_index=True, null=True)),
                ('form_json', models.TextField(null=True)),
                ('geo_json', models.TextField(null=True)),
                ('created_on', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_org.Employee')),
            ],
        ),
        migrations.DeleteModel(
            name='OrgRequest',
        ),
    ]