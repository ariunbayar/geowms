import os
from django.db import migrations, models
from django.conf import settings
from main import utils


def _delete_prev_files(file):
    main_folder = 'llc-request-files'
    file_path = file.file_path
    file_path = os.path.join(settings.MEDIA_ROOT, file_path.name)
    if os.path.exists(file_path):
        utils.remove_file(file_path)


def remove_files(apps, schema_editor):

    RequestFiles = apps.get_model('llc_request', 'RequestFiles')
    RequestFilesShape = apps.get_model('llc_request', 'RequestFilesShape')
    ShapeGeom = apps.get_model('llc_request', 'ShapeGeom')
    RequestForm = apps.get_model('llc_request', 'RequestForm')
    LLCRequest = apps.get_model('llc_request', 'LLCRequest')

    ChangeRequest = apps.get_model('org_request', 'ChangeRequest')

    for requestfile in RequestFiles.objects.all():
        shapes_of_file = RequestFilesShape.objects.filter(files=requestfile)
        for shape_of_file in shapes_of_file:
            geom_of_shapes = ShapeGeom.objects.filter(shape=shape_of_file)
            if geom_of_shapes:
                geom_of_shapes.delete()
            shape_of_file.delete()

        request_forms  = RequestForm.objects.filter(file=requestfile)
        if request_forms:
            request_forms.delete()

        llc_requests = LLCRequest.objects.filter(file=requestfile)
        for llc_request in llc_requests:
            change_requests = ChangeRequest.objects.filter(llc_request=llc_request)
            if change_requests:
                change_requests.delete()
            llc_request.delete()
        
        _delete_prev_files(requestfile)
        requestfile.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('llc_request', '0012_auto_20210624_1118'),
        ('org_request', '0020_changerequest_description'),
    ]

    operations = [
        migrations.RunPython(remove_files),
    ]
