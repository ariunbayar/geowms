# Generated by Django 3.0.7 on 2021-03-21 10:43

from django.db import migrations, models
import django.db.models.deletion

import os
import csv


def _import_data(apps, schema_editor):
    print("\nУншиж байна ...")
    PopulationAge = apps.get_model('frontend_covid', 'PopulationAge')
    PopulationCount = apps.get_model('frontend_covid', 'PopulationCount')

    file_path = os.path.join('frontend/covid/files/PopulationAgeGroup2020.csv')
    with open(file_path, 'rt') as f:
        contents = csv.reader(f)
        contents = list(contents)
        for idx in range(0, len(contents)):
            if idx == 0:
                for item in range (1, len(contents)):
                    geo_id = contents[item][5]
                    code = contents[item][0]
                    name = contents[item][1]
                    total_number = contents[item][4]
                    age_group_number = contents[item][2]
                    age_group = contents[item][3]

                    pop_age = PopulationAge(age_group=age_group, age_group_number=age_group_number)
                    pop_age.save()
                    pop_age_id = pop_age.id
                    pop_count = PopulationCount(geo_id=geo_id, name=name, total_number=total_number, code=code, age=PopulationAge.objects.get(id=pop_age_id))
                    pop_count.save()


class Migration(migrations.Migration):

    dependencies = [
        ('frontend_covid', '0007_auto_20210322_1313'),
    ]

    operations = [
        migrations.RunPython(_import_data),
    ]

