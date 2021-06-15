# Generated by Django 3.0.7 on 2021-05-04 07:48

from django.db import migrations
from django.db.models import Count
from main.utils import json_load, json_dumps


def update_existing_connections(apps, schema_editor):
    AnotherDatabase = apps.get_model('backend_another_database', 'AnotherDatabase')
    AnotherDatabaseTable = apps.get_model('backend_another_database', 'AnotherDatabaseTable')

    ano_conns = AnotherDatabase.objects.all()
    if ano_conns:
        for ano_conn in ano_conns:
            ano_conn_tables = AnotherDatabaseTable.objects.filter(another_database=ano_conn)
            if ano_conn_tables:
                for ano_conn_table in ano_conn_tables:
                    field_config_index = {
                        "pk_field_name": '',
                        "pk_start_index": '',
                        "pk_field_type": ''
                    }
                    table_config = json_load(ano_conn_table.field_config_index)
                    if table_config:
                        field_config_index['pk_field_name'] = table_config.get('pk_field_name') or ''
                        field_config_index['pk_start_index'] = table_config.get('pk_start_index') or ''
                        field_config_index['pk_field_type'] = table_config.get('pk_field_type') or ''

                    ano_conn_table.field_config_index = json_dumps(field_config_index)
                    ano_conn_table.save()





class Migration(migrations.Migration):

    dependencies = [
        ('backend_another_database', '0005_anotherdatabasetable_field_config_index'),
    ]

    operations = [
        migrations.RunPython(update_existing_connections),
    ]
