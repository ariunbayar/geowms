# Generated by Django 3.0.7 on 2021-05-26 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0002_auto_20210525_1145'),
    ]

    operations = [
        migrations.AlterField(
            model_name='requestfilesshape',
            name='feature_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='requestfilesshape',
            name='package_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='requestfilesshape',
            name='theme_id',
            field=models.IntegerField(null=True),
        ),
    ]
