from django.db import models
from django.db.models.base import Model
from django.db.models.fields import TextField
from backend.org.models import Org


# Create your models here.
class RequestFiles(models.Model):

    class Meta:
        db_table = "llc_request_files"

    STATE_NEW = 1
    STATE_SENT = 2
    STATE_APPROVE = 3
    STATE_REJECT = 4

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_SENT, 'ИЛГЭЭСЭН '),
    )

    KIND_SOLVED = 1
    KIND_PENDING = 2
    KIND_DISMISS = 3
    KIND_REVOKE = 4

    KIND_CHOICES = (
        (KIND_PENDING, 'ХҮЛЭЭГДЭЖ БУЙ'),
        (KIND_SOLVED, 'ШИЙДВЭРЛЭГДСЭН'),
        (KIND_DISMISS, 'БУЦААГДСАН'),
        (KIND_REVOKE, 'ЦУЦЛАСАН')
    )
    # aan = models.ForeignKey(Org, on_delete=models.PROTECT, db_index=True)
    name = models.CharField(max_length=250, verbose_name='Нэр')
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    description = models.TextField(default='')
    tools = models.TextField(default='')
    geo_id = models.CharField(max_length=100)
    file_path = models.FileField(upload_to='llc-request-files/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

class RequestFilesShape(models.Model):

    class Meta:
        db_table = "llc_file_shapes"


    files = models.ForeignKey(RequestFiles, on_delete=models.PROTECT, db_index=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT, db_index=True)
    theme_id = models.IntegerField(null=True)
    package_id = models.IntegerField(null=True)
    feature_id = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class ShapeGeom(models.Model):

    class Meta:
        db_table = "llc_shapes_geom"

    shape = models.ForeignKey(RequestFilesShape, on_delete=models.PROTECT, db_index=True)
    geom_json = models.TextField()
    form_json = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class RequestForm(models.Model):

    class Meta:
        db_table = 'llc_request_form'

    forms = models.ForeignKey(RequestFiles, on_delete=models.PROTECT, db_index=True)
    client_org = models.CharField(max_length=100, verbose_name='Нэр')
    project_name = models.CharField(max_length=100, verbose_name='Нэр')
    object_type = models.TextField()
    object_quantum = models.TextField()
    investment_status = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
