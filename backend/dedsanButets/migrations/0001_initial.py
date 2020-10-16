# Generated by Django 3.0.7 on 2020-10-16 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LFeatures',
            fields=[
                ('feature_id', models.IntegerField(primary_key=True, serialize=False)),
                ('feature_code', models.CharField(max_length=255)),
                ('feature_name', models.CharField(max_length=255)),
                ('feature_name_eng', models.CharField(max_length=255)),
                ('package_id', models.IntegerField()),
                ('order_no', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.IntegerField()),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('modified_by', models.IntegerField()),
            ],
            options={
                'db_table': 'l_features',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='LPackages',
            fields=[
                ('package_id', models.IntegerField(primary_key=True, serialize=False)),
                ('package_code', models.CharField(max_length=255)),
                ('package_name', models.CharField(max_length=255)),
                ('package_name_eng', models.CharField(max_length=255)),
                ('theme_id', models.IntegerField()),
                ('order_no', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.IntegerField()),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('modified_by', models.IntegerField()),
            ],
            options={
                'db_table': 'l_packages',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='LThemes',
            fields=[
                ('theme_id', models.IntegerField(primary_key=True, serialize=False)),
                ('theme_code', models.CharField(max_length=255)),
                ('theme_name', models.CharField(max_length=255)),
                ('theme_name_eng', models.CharField(max_length=255)),
                ('top_theme_id', models.IntegerField()),
                ('order_no', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.IntegerField()),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('modified_by', models.IntegerField()),
            ],
            options={
                'db_table': 'l_themes',
                'managed': False,
            },
        ),
    ]
