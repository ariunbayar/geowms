# Generated by Django 3.0.7 on 2021-03-18 09:43

from django.db import migrations

from main import utils


def _insert_datas(apps, schema):
    print("\nУншиж байна...")
    admin_levels = utils.get_administrative_levels()

    CovidDashboard = apps.get_model('frontend_covid', 'CovidDashboard')
    parent_id = None
    big_parent_id = None

    covid_qs = CovidDashboard.objects
    for item in admin_levels:
        data = dict()
        for key, value in item.items():
            if key != 'children':
                data['parent_id'] = None
                data[key] = value
            elif key == 'children':
                new_covid = covid_qs.create(
                    **data
                )
                big_parent_id = new_covid.id
                for val in value:
                    child = dict()
                    for child_key, child_value in val.items():
                        if child_key != 'children':
                            child['parent_id'] = big_parent_id
                            child[child_key] = child_value
                        elif child_key == 'children':
                            new_covid = covid_qs.create(
                                **child
                            )
                            parent_id = new_covid.id
                            for child_item in child_value:
                                child_child = dict()
                                for child_child_key, child_child_value in child_item.items():
                                    child_child['parent_id'] = parent_id
                                    child_child[child_child_key] = child_child_value
                                covid_qs.create(
                                    **child_child
                                )


class Migration(migrations.Migration):

    dependencies = [
        ('frontend_covid', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(_insert_datas),
    ]
