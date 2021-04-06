# Generated by Django 3.0.7 on 2021-04-06 03:00
import os
from zipfile import ZipFile
from django.db import migrations
from django.conf import settings

from main import utils


def _detect_format(image_path):
    file_paths = utils.get_all_file_paths(image_path)
    formats = ['jpeg', 'png', 'tiff']

    for file in file_paths:
        for format in formats:
            if format in file:
                return format


def create_payment_type(apps, schema_editor):
    payment = apps.get_model('payment', 'payment')
    pay_id = payment.objects.last().id

    for count_id in range(pay_id):
        check_data = payment.objects.filter(pk=count_id).first()
        if check_data:
            if check_data.export_file is not None:
                exp_file = check_data.export_file
                if 'shape' in exp_file:
                    payment.objects.filter(pk=count_id).update(ext_type='shape')
                elif 'pdf' in exp_file:
                    payment.objects.filter(pk=count_id).update(ext_type='pdf')
                elif 'tseg' in exp_file:
                    payment.objects.filter(pk=count_id).update(ext_type='point')
                elif 'image' in exp_file:
                    file_name = str(count_id)
                    folder_name = 'image'
                    path = os.path.join(settings.FILES_ROOT, folder_name, file_name)
                    with ZipFile(path + "/export.zip", 'r') as zipObj:
                        zipObj.extractall(path+"/")
                    image_format = _detect_format(path)
                    payment.objects.filter(pk=count_id).update(ext_type=image_format)


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0013_payment_ext_type'),
    ]

    operations = [
          migrations.RunPython(create_payment_type),
    ]
