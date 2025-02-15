# Generated by Django 3.0.7 on 2021-06-04 02:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0008_auto_20210604_1017'),
        ('org_request', '0018_auto_20210521_1736'),
    ]

    operations = [
        migrations.AddField(
            model_name='changerequest',
            name='llc_request',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='llc_request.LLCRequest'),
        ),
        migrations.AlterField(
            model_name='changerequest',
            name='kind',
            field=models.PositiveIntegerField(choices=[(1, 'ҮҮССЭН'), (2, 'ЗАССАН'), (3, 'УСТГАСАН'), (4, 'ШУУД'), (5, 'ЦУЦЛАСАН'), (6, 'БУЦААГДСАН')], db_index=True, null=True),
        ),
    ]
