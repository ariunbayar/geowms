# Generated by Django 3.0.7 on 2020-09-02 08:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0002_auto_20200901_1820'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='aimag_name',
        ),
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='sum_name',
        ),
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='tesgiin_ner',
        ),
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='toviin_dugaar',
        ),
        migrations.RemoveField(
            model_name='tsegpersonal',
            name='trapetsiin_dugaar',
        ),
    ]
