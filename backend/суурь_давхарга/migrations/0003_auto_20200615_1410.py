# Generated by Django 3.0.6 on 2020-06-15 06:10

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend_суурь_давхарга', '0002_auto_20200615_1330'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='суурьдавхарга',
            options={'ordering': ('created_at',)},
        ),
        migrations.AddField(
            model_name='суурьдавхарга',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
