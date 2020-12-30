# Generated by Django 3.0.7 on 2020-11-15 15:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0005_auto_20201117_1056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='empperminspire',
            name='perm_kind',
            field=models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (6, 'ЦУЦЛАХ'), (5, 'БАТЛАХ')], db_index=True),
        ),
        migrations.AlterField(
            model_name='emproleinspire',
            name='perm_kind',
            field=models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (6, 'ЦУЦЛАХ'), (5, 'БАТЛАХ')], db_index=True),
        ),
        migrations.AlterField(
            model_name='govperminspire',
            name='perm_kind',
            field=models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (6, 'ЦУЦЛАХ'), (5, 'БАТЛАХ')], db_index=True),
        ),
        migrations.AlterField(
            model_name='govroleinspire',
            name='perm_kind',
            field=models.PositiveIntegerField(choices=[(1, 'ХАРАХ'), (2, 'НЭМЭХ'), (3, 'ХАСАХ'), (4, 'ЗАСАХ'), (6, 'ЦУЦЛАХ'), (5, 'БАТЛАХ')], db_index=True),
        ),
    ]