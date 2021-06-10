from django.db import migrations, models


def fix_kind(apps, schema_editor):

    LLCRequest = apps.get_model('llc_request', 'LLCRequest')
    RequestFiles = apps.get_model('llc_request', 'RequestFiles')

    KIND_APPROVED = 1
    KIND_REVOKE = 4
    STATE_SOLVED = 3

    llc_requests = LLCRequest.objects.filter(
        kind__in=[
            KIND_APPROVED,
            KIND_REVOKE,
        ],
    )

    for llc_request in llc_requests:
        llc_request.state = STATE_SOLVED
        llc_request.save()

    file_requests = RequestFiles.objects.filter(
        kind__in=[
            KIND_APPROVED,
            KIND_REVOKE,
        ],
    )

    for file_request in file_requests:
        file_request.state = STATE_SOLVED
        file_request.save()

class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0010_auto_20210610_0939'),
    ]

    operations = [
        migrations.RunPython(fix_kind),
    ]
