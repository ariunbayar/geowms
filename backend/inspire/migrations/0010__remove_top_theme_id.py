
from django.db import migrations, models
from django.core import serializers
from django.db import connections



def remove_top_theme_id(apps, schema_editor):
    cursor = connections['default'].cursor()
    sql = """
        ALTER TABLE
            l_themes
        DROP COLUMN
            top_theme_id;
    """
    cursor.execute(sql)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0009_mdatas'),
    ]

    operations = [
        migrations.RunPython(remove_top_theme_id),
    ]
