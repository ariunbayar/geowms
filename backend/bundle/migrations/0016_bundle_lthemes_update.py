from backend.bundle.models import Bundle
from backend.inspire.models import LThemes
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
        SERIAL PRIMARY KEY (theme_id);
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
        _create_pk()


def _change_name(qs, from_name, to_name):
    print(qs.name)
    if qs.name == from_name:
        qs.name = to_name
        qs.save()
    return


def update_bundles(apps, schema_editor):
    bundles = apps.get_model('backend_bundle', 'Bundle')
    themes = apps.get_model('backend_inspire', 'LThemes')
    _check_column()
    _check_pk()

    for bundle in bundles.objects.all():
        names = [
            [
                'Геодезийн тулгуур сүлжээ', 'Геодезийн цэг тэмдэгт'
            ],
            [
                'Ус зүй', 'Ус зүйн мэдээлэл'
            ],
            [
                'Нэгж талбар', 'Газрын нэгж талбар'
            ],
            [
                'Түүх, соёлын өв', 'Түүх соёл, археологийн өв'
            ],
            [
                'Хил, зааг', 'Хил зааг'
            ],
            [
                'Газрын бүрхэвч, газар ашиглалт', 'Газрын бүрхэвч'
            ],
            [
                'Орто зураг', 'Ортозураг'
            ],
            [
                'Геологи, хөрс', 'Геологи'
            ],
        ]

        for from_name, to_name in names:
            _change_name(bundle, from_name, to_name)

        theme = themes.objects.filter(theme_name=bundle.name).first()
        if theme:
            bundles.objects.filter(id=bundle.id).update(ltheme=theme)
    for item in LThemes.objects.all():
        qs = Bundle.objects
        qs = qs.filter(name=item.theme_name)
        if not qs:
            Bundle.objects.create(
                name=item.theme_name,
                is_removeable=True,
                created_by_id=1,
                sort_order=Bundle.objects.all().count() + 1,
                ltheme=item,
            )


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0015_bundle_ltheme'),
        ('backend_inspire', '0006_auto_20201115_2352'),
    ]

    operations = [
        migrations.RunPython(update_bundles),
    ]
