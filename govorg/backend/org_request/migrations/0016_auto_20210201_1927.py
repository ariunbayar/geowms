# Generated by Django 3.0.7 on 2021-02-01 11:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend_org', '0016_delete_inspireperm'),
        ('org_request', '0015_changerequest_group_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='changerequest',
            name='org',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='backend_org.Org'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='changerequest',
            name='employee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='backend_org.Employee'),
        ),
    ]