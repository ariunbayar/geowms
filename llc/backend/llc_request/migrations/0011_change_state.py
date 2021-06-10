from django.db import migrations, models


def fix_kind(apps, schema_editor):

    ChangeRequest = apps.get_model('org_request', 'ChangeRequest')

    KIND_UPDATE = 2
    KIND_DELETE = 3

    change_requests = ChangeRequest.objects.filter(
        kind__in=[
            KIND_UPDATE,
            KIND_DELETE,
        ],
    )

    for change_request in change_requests:



        if change_request.form_json:
            if change_request.kind != KIND_UPDATE:
                change_request.kind = KIND_UPDATE
                change_request.save()
        else:
            if change_request.kind != KIND_DELETE:
                change_request.kind = KIND_DELETE
                change_request.save()


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0012_auto_20201128_0917'),
    ]

    operations = [
        migrations.AlterField(
            model_name='changerequest',
            name='kind',
            field=models.PositiveIntegerField(choices=[(1, 'ҮҮССЭН'), (3, 'УСТГАСАН'), (2, 'ЗАССАН'), (4, 'ШУУД'), (5, 'ЦУЦЛАСАН')], db_index=True, null=True),
        ),
        migrations.RunPython(fix_kind),
    ]
