
from django.db import migrations, models
from django.core import serializers
from django.db import connections
import json


def _convert_text_json(data):
    data = data.replace("\'", "\"")
    data = data.replace("True", "true")
    data = data.replace("False", "false")
    data = json.loads(data)
    return data


def update_change_req_forms_and_geom_json_dumps(apps, schema_editor):

    ChangeRequest = apps.get_model('org_request', 'ChangeRequest')
    for change_request in ChangeRequest.objects.all():
        geo_json_jsonloads = _convert_text_json(change_request.geo_json)
        froms_json_jsonloads = _convert_text_json(change_request.form_json)
        change_request.geo_json = json.dumps(geo_json_jsonloads, ensure_ascii=False)
        change_request.form_json = json.dumps(froms_json_jsonloads, ensure_ascii=False)
        change_request.save()


class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0012_auto_20201128_0917'),
    ]

    operations = [
        migrations.RunPython(update_change_req_forms_and_geom_json_dumps),
    ]
