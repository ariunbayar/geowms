# Generated by Django 3.0.7 on 2021-04-26 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_another_database', '0003_auto_20210413_1046'),
    ]

    operations = [
        migrations.AddField(
            model_name='anotherdatabase',
            name='is_export',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='anotherdatabase',
            name='db_type',
            field=models.PositiveIntegerField(choices=[(1, 'MSSQL'), (2, 'MONGODB'), (3, 'PgDB')], db_index=True, null=True, verbose_name='Төлөв'),
        ),
    ]