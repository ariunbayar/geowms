# Generated by Django 3.0.6 on 2020-06-28 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_суурь_давхарга', '0006_auto_20200620_1638'),
    ]

    operations = [
        migrations.AddField(
            model_name='baselayer',
            name='tilename',
            field=models.CharField(choices=[('wms', 'wms'), ('xyz', 'xyz')], default='xyz', max_length=10),
            preserve_default=False,
        ),
    ]