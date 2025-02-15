# Generated by Django 3.0.6 on 2020-05-30 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.PositiveSmallIntegerField(choices=[(1, 'student'), (2, 'teacher'), (3, 'secretary'), (4, 'supervisor'), (5, 'admin')], primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='roles',
            field=models.ManyToManyField(to='geoportal_app.Role'),
        ),
    ]
