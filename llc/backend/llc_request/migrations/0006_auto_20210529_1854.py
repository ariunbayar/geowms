# Generated by Django 3.0.7 on 2021-05-29 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0005_auto_20210528_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='requestfiles',
            name='kind',
            field=models.PositiveIntegerField(choices=[(1, 'ШИЙДВЭРЛЭГДСЭН'), (2, 'ХҮЛЭЭГДЭЖ БУЙ'), (3, 'БУЦААГДСАН'), (4, 'ЦУЦЛАСАН'), (5, 'ШИНЭ')], db_index=True, null=True),
        ),
    ]