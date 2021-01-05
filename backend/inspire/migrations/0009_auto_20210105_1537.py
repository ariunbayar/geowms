# Generated by Django 3.0.7 on 2021-01-05 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0008_auto_20201214_1651'),
    ]

    operations = [
        migrations.CreateModel(
            name='MDatas',
            fields=[
                ('transport_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('geo_id', models.CharField(max_length=100)),
                ('feature_config_id', models.IntegerField()),
                ('data_type_id', models.IntegerField()),
                ('property_id', models.IntegerField()),
                ('code_list_id', models.IntegerField()),
                ('value_text', models.CharField(max_length=4000)),
                ('value_number', models.FloatField()),
                ('value_date', models.DateTimeField()),
                ('value_connected_geo_id', models.CharField(max_length=100)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.IntegerField()),
                ('modified_on', models.DateTimeField(auto_now=True)),
                ('modified_by', models.IntegerField()),
            ],
            options={
                'db_table': 'm_datas',
                'managed': False,
            },
        ),
        migrations.DeleteModel(
            name='MDatasBoundary',
        ),
        migrations.DeleteModel(
            name='MDatasBuilding',
        ),
        migrations.DeleteModel(
            name='MDatasCadastral',
        ),
        migrations.DeleteModel(
            name='MDatasGeographical',
        ),
        migrations.DeleteModel(
            name='MDatasHydrography',
        ),
    ]
