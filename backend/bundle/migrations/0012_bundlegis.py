# Generated by Django 3.0.7 on 2020-10-05 02:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0011_auto_20200928_1847'),
    ]

    operations = [
        migrations.CreateModel(
            name='BundleGIS',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('oid', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bundle', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_bundle.Bundle')),
            ],
        ),
    ]
