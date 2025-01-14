# Generated by Django 3.0.7 on 2020-09-08 11:09

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0015_auto_20200908_1251'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mpoint_view',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('objectid', models.CharField(max_length=4)),
                ('point_id', models.CharField(max_length=4)),
                ('ondor', models.IntegerField()),
                ('point_name', models.CharField(max_length=50)),
                ('pid', models.CharField(max_length=20)),
                ('point_class', models.BigIntegerField()),
                ('point_class_name', models.CharField(max_length=100)),
                ('point_type', models.CharField(max_length=100)),
                ('center_typ', models.CharField(max_length=10)),
                ('aimag', models.CharField(max_length=50)),
                ('sum', models.CharField(max_length=50)),
                ('sheet1', models.CharField(max_length=1)),
                ('sheet2', models.DecimalField(blank=True, decimal_places=10, max_digits=20)),
                ('sheet3', models.DecimalField(blank=True, decimal_places=10, max_digits=20)),
                ('geom', models.DecimalField(decimal_places=10, max_digits=300)),
                ('t_type', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'mpoint_view',
                'managed': settings.IS_TESTING,
            },
        ),
    ]
