from django.db import migrations
from main.utils import create_index


def create_index_id(apps, schema_editor):

    create_index('backend_bundle_bundle', 'id')


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0018_remove_bundle_module'),
    ]

    operations = [
        migrations.RunPython(create_index_id),
    ]
