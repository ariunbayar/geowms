# Generated by Django 3.0.7 on 2020-09-01 07:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_govorg', '0005_govorg_org'),
        ('backend_wms', '0003_wms_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='WMSLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qs_all', models.TextField(null=True)),
                ('qs_request', models.CharField(db_index=True, max_length=50)),
                ('rsp_status', models.PositiveIntegerField()),
                ('rsp_size', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('system', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='backend_govorg.GovOrg')),
                ('wms', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='backend_wms.WMS')),
            ],
            options={
                'db_table': 'api_wms_log',
                'ordering': ('-created_at',),
            },
        ),
    ]
