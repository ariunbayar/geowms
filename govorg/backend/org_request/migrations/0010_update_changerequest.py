from django.db import migrations, models
from django.core import serializers
from django.db import connections
import json


def update_changerequest(apps, schema_editor):
    ChangeRequest = apps.get_model('org_request', 'ChangeRequest')

    for i in ChangeRequest.objects.all():
        form_values = []
        kind = i.kind
        if i.form_json:
            data = i.form_json
            data = data.replace("\'", "\"")
            data = data.replace("True", "true")
            data = data.replace("False", "false")
            data = json.loads(data)
            if isinstance(data, dict): 
                for propert in data['form_values']:
                    form_values.append({
                        'pk':propert.get('building_id') or propert.get('pk') or '',
                        'property_name': propert.get('property_name') or '',
                        'property_id': propert.get('property_id'),
                        'property_code': propert.get('property_code') or '',
                        'property_definition': propert.get('property_definition') or '',
                        'value_type_id': propert.get('value_type_id') or '',
                        'value_type': propert.get('value_type') or '',
                        'data': propert.get('data') or '',
                        'data_list': propert.get('data_list') or '',
                    })
            else:
                form_values = i.form_json
        else:
            form_values = i.form_json

        if i.kind == 2:
            kind = 3
        elif i.kind == 3:
            kind = 2
        i.kind = kind
        i.form_json = form_values
        i.save()

class Migration(migrations.Migration):

    dependencies = [
        ('org_request', '0009_auto_20201204_1600'),
    ]

    operations = [
        migrations.RunPython(update_changerequest),
    ]

