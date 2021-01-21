import json

from django.db import migrations


def _convert_text_json(data):
    data = data.replace("\'", "\"")
    data = data.replace("True", "true")
    data = data.replace("False", "false")
    data = json.loads(data)
    return data


def update_change_req_forms_and_geom_json_dumps(apps, schema_editor):

    ChangeRequest = apps.get_model('org_request', 'ChangeRequest')
    for change_request in ChangeRequest.objects.all():
        if change_request.geo_json:
            geo_json_jsonloads = _convert_text_json(change_request.geo_json)
            change_request.geo_json = json.dumps(geo_json_jsonloads, ensure_ascii=False)
        if change_request.form_json:
            froms_json_jsonloads = _convert_text_json(change_request.form_json)
            change_request.form_json = json.dumps(froms_json_jsonloads, ensure_ascii=False)
        change_request.save()


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0013_fix_kind_update_and_kind_delete'),
    ]

    operations = [
        migrations.RunPython(update_change_req_forms_and_geom_json_dumps),
    ]
