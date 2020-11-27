# Generated by Django 3.0.7 on 2020-10-16 06:33

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LFeatures',
            fields=[
                ('feature_id', models.AutoField(auto_created=settings.IS_TESTING, primary_key=True, serialize=False)),
                ('feature_code', models.CharField(max_length=255, null=True)),
                ('feature_name', models.CharField(max_length=255, null=True)),
                ('feature_name_eng', models.CharField(max_length=255, null=True)),
                ('package_id', models.IntegerField(null=True)),
                ('order_no', models.IntegerField(null=True)),
                ('is_active', models.BooleanField(default=True, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.IntegerField(null=True)),
                ('modified_on', models.DateTimeField(auto_now=True, null=True)),
                ('modified_by', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'l_features',
                'managed': settings.IS_TESTING,
            },
        ),
        migrations.CreateModel(
            name='LPackages',
            fields=[
                ('package_id', models.AutoField(auto_created=settings.IS_TESTING, primary_key=True, serialize=False)),
                ('package_code', models.CharField(max_length=255, null=True)),
                ('package_name', models.CharField(max_length=255, null=True)),
                ('package_name_eng', models.CharField(max_length=255, null=True)),
                ('theme_id', models.IntegerField(null=True)),
                ('order_no', models.IntegerField(null=True)),
                ('is_active', models.BooleanField(default=True, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.IntegerField(null=True)),
                ('modified_on', models.DateTimeField(auto_now=True, null=True)),
                ('modified_by', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'l_packages',
                'managed': settings.IS_TESTING,
            },
        ),
        migrations.CreateModel(
            name='LThemes',
            fields=[
                ('theme_id', models.AutoField(auto_created=settings.IS_TESTING, primary_key=True, serialize=False)),
                ('theme_code', models.CharField(max_length=255, null=True)),
                ('theme_name', models.CharField(max_length=255, null=True)),
                ('theme_name_eng', models.CharField(max_length=255, null=True)),
                ('top_theme_id', models.IntegerField(null=True)),
                ('order_no', models.IntegerField(null=True)),
                ('is_active', models.BooleanField(default=True, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_by', models.IntegerField(null=True)),
                ('modified_on', models.DateTimeField(auto_now=True, null=True)),
                ('modified_by', models.IntegerField(null=True)),
            ],
            options={
                'db_table': 'l_themes',
                'managed': settings.IS_TESTING,
            },
        ),
    ]
