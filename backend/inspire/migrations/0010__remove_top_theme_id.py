
from django.db import migrations, models
from django.core import serializers
from django.db import connections


def _check_column():
    has_column = False
    cursor = connections['default'].cursor()
    sql = """
        SELECT *
        FROM information_schema.columns
        WHERE table_schema  = 'public'
        AND table_name      = 'l_themes'
        AND column_name     = 'theme_id'
    ;
    """
    cursor.execute(sql)
    value = cursor.fetchone()
    if value:
        has_column = True

    return has_column


def remove_top_theme_id(apps, schema_editor):
    cursor = connections['default'].cursor()
    has_column = _check_column()
    if has_column:
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
