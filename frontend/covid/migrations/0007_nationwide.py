# Generated by Django 3.0.7 on 2021-03-21 10:43

from django.db import migrations, models
import django.db.models.deletion
from django.db.models import Count
from main.utils import get_1stOrder_geo_id


def _nationwide(apps, schema_editor):
    print("\nУншиж байна ...")
    PopulationAge = apps.get_model('frontend_covid', 'PopulationAge')
    PopulationCount = apps.get_model('frontend_covid', 'PopulationCount')

    sorted_age_group_number = PopulationAge.objects.all().values('age_group_number').annotate(Count('age_group_number')).order_by('age_group_number')
    sorted_age_group_number = list(sorted_age_group_number)
    age_group_numbers = []
    for sorted_age in sorted_age_group_number:
        age_group_numbers.append(sorted_age['age_group_number'])

    pop_age_ids = []
    age_group_totals = []
    for age_group_number in age_group_numbers:
        count = 0
        pk_ids = PopulationAge.objects.filter(age_group_number=age_group_number).values('id')
        for pk_id in pk_ids:
            total_number = PopulationCount.objects.filter(age=pk_id['id']).first().total_number
            count += total_number

        age_group_totals.append(count)

    geo_id = get_1stOrder_geo_id()
    name = "Улсын хэмжээнд"
    code = geo_id
    age_groups = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29',  '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70+']

    for i in range(len(age_group_totals)):

        pop_age = PopulationAge(age_group=age_groups[i], age_group_number=age_group_numbers[i])
        pop_age.save()
        pop_age_id = pop_age.id
        pop_count = PopulationCount(geo_id=geo_id, name=name, total_number=age_group_totals[i], code=code, age=PopulationAge.objects.get(id=pop_age_id))
        pop_count.save()


class Migration(migrations.Migration):

    dependencies = [
        ('frontend_covid', '0006_import_data'),
    ]

    operations = [
        migrations.RunPython(_nationwide),
    ]

