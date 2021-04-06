from django.db import migrations, models
from django.core import serializers
from django.db import connections


def _add_column():
    cursor = connections['default'].cursor()
    sql = """
        alter table l_themes
        add column top_theme_id integer
    ;
    """
    cursor.execute(sql)


def _check_column():
    cursor = connections['default'].cursor()
    sql = """
        SELECT *
        FROM information_schema.columns
        WHERE table_schema  = 'public'
        AND table_name      = 'l_themes'
        AND column_name     = 'top_theme_id'
    ;
    """
    cursor.execute(sql)
    value = cursor.fetchone()
    if not value:
        _add_column()


def _create_pk():
    cursor = connections['default'].cursor()
    sql = """
        ALTER TABLE l_themes
        ADD CONSTRAINT l_themes_pkey
        PRIMARY KEY (theme_id);
    """
    cursor.execute(sql)


def _check_pk():
    has_pk = False
    cursor = connections['default'].cursor()
    sql = """
        SELECT c.column_name, c.data_type
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage AS ccu USING (constraint_schema, constraint_name)
        JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
        AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
        WHERE constraint_type = 'PRIMARY KEY' and tc.table_name = 'l_themes';
    """
    cursor.execute(sql)
    value = cursor.fetchone()
    if not value:
        _create_pk


def update_bundles(apps, schema_editor):
    bundles = apps.get_model('backend_bundle', 'Bundle')
    themes = apps.get_model('backend_inspire', 'LThemes')
    _check_column()
    _check_pk

    for i in bundles.objects.all():
        print(i.name)
        if i.name == 'Геодезийн тулгуур сүлжээ':
            i.name = 'Геодезийн цэг тэмдэгт'
            i.save()
        if i.name == 'Геологи, хөрс':
            i.name = 'Геологи'
            i.save()
        if i.name == 'Ус зүй':
            i.name = 'Ус зүйн мэдээлэл'
            i.save()
        if i.name == 'Нэгж талбар':
            i.name = 'Газрын нэгж талбар'
            i.save()
        theme = themes.objects.filter(theme_name=i.name).first()
        if theme:
            bundles.objects.filter(id=i.id).update(ltheme=theme)
        else:
            theme = themes.objects.filter(theme_name__istartswith=i.name[:3], theme_name__endswith= i.name[-4:]).first()
            if theme:
                bundles.objects.filter(id=i.id).update(ltheme=theme)
            else:
                cursor = connections['default'].cursor()
                sql = """
                INSERT INTO
                    public.l_themes(
                        theme_name,
                        order_no,
                        is_active
                        )
                VALUES (
                    '{theme_name}',
                    {order_no},
                    {is_active}
                    )

                """.format(
                    theme_name=i.name,
                    order_no=i.sort_order,
                    is_active=True
                )
                cursor.execute(sql)
                theme = themes.objects.filter(theme_name=i.name).first()
                bundles.objects.filter(id=i.id).update(ltheme=theme)



class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0015_bundle_ltheme'),
        ('backend_inspire', '0006_auto_20201115_2352'),
    ]

    operations = [
        migrations.RunPython(update_bundles),
    ]
