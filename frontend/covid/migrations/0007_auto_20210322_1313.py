# Generated by Django 3.0.7 on 2021-03-22 05:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend_covid', '0006_auto_20210321_2122'),
    ]

    operations = [
        migrations.AddField(
            model_name='coviddashboard',
            name='vaccine_hiisen_too',
            field=models.PositiveIntegerField(default=0, null=True, verbose_name='Вакцин хийсэн тоо'),
        ),
        migrations.AddField(
            model_name='coviddashboardlog',
            name='vaccine_hiisen_too',
            field=models.PositiveIntegerField(default=0, null=True, verbose_name='Вакцин хийсэн тоо'),
        ),
    ]