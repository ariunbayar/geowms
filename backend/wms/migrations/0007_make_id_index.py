from django.db import migrations
from main.utils import create_index


def create_index_id(apps, schema_editor):

    create_index('wms', 'id')


class Migration(migrations.Migration):

    dependencies = [
        ('backend_wms', '0006_wms_cache_url'),
    ]

    operations = [
        migrations.RunPython(create_index_id),
    ]
