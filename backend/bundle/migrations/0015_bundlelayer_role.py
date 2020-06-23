# Generated by Django 3.0.7 on 2020-06-21 10:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0006_auto_20200614_1338'),
        ('backend_bundle', '0014_bundlelayer_defaultcheck'),
    ]

    operations = [
        migrations.AddField(
            model_name='bundlelayer',
            name='role',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.PROTECT, to='geoportal_app.Role'),
            preserve_default=False,
        ),
    ]
