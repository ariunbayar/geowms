# Generated by Django 3.0.7 on 2021-06-13 10:02
import csv

from django.db import migrations
from django.db import connections
from django.db.models import Max, Value
from django.db.models.functions import Coalesce
from django.db import transaction

from main.settings.base import BASE_DIR


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


def _theme_name_change(old_theme):
    filter_names = [
        "Геодезийн цэг тэмдэгт",
        "Барилга, суурин газар",
        "Өндөржилт, гүн",
        "Газрын нэгж талбар",
        "Тээврийн сүлжээ",
        "Ус зүйн мэдээлэл",
        "Хүн ам зүйн мэдээлэл",
        "Түүх соёл, археологийн өв",
    ]

    replaceable_names = [
        "Геодезийн байнгын цэг тэмдэгт",
        "Барилга байгууламж",
        "Өндөр",
        "Кадастрын нэгж талбар",
        "Зам тээврийн сүлжээ",
        "Ус зүй",
        "Хүн ам, нийгэм",
        "Түүх, соёл, археологийн өв",
    ]

    count = 0
    for theme_name in filter_names:
        theme = old_theme.filter(theme_name=theme_name).first()
        if theme:
            theme.theme_name = replaceable_names[count]
            theme.save()
        count += 1

def make_bundle_same_as_theme(apps, schema_editor):
    print('\nУншиж байна ...')

    _check_column()

    Bundle = apps.get_model('backend_bundle', 'Bundle')
    LThemes = apps.get_model('backend_inspire', 'LThemes')

    file_path = BASE_DIR + '/backend/bundle/files/l_themes_20210613.csv'
    with open(file_path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count != 0:
                old_theme = LThemes.objects.filter(theme_id=int(row[0]))
                if not old_theme:
                    with transaction.atomic():
                        qs_bundle = Bundle.objects
                        LThemes.objects.create(
                            theme_id=int(row[0]),
                            theme_code=row[1],
                            theme_name=row[2],
                            theme_name_eng=row[3],
                            order_no=row[4],
                            is_active=True,
                            created_on=row[6],
                            created_by=row[7],
                            modified_on=row[8],
                            modified_by=row[9],
                        )
                        qs_bundle.create(
                            is_removeable=True,
                            created_by_id=2,
                            sort_order=qs_bundle.aggregate(max_rating=Coalesce(Max('sort_order'), Value(0)))['max_rating'],
                            ltheme_id=int(row[0]),
                        )
                else:
                    _theme_name_change(old_theme)
            line_count += 1


class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0019_make_id_index'),
    ]

    operations = [
        migrations.RunPython(make_bundle_same_as_theme),
    ]


