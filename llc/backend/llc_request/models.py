import os
from django.db import models
from django.db.models.base import Model
from django.db.models.fields import TextField
from backend.org.models import Org
from main import utils


def upload_file_path(instance, filename):
    return os.path.join('llc-request-files', utils.get_file_name(filename), filename)


# Create your models here.
class RequestFiles(models.Model):

    class Meta:
        db_table = "llc_request_files"

    STATE_NEW = 1
    STATE_SENT = 2
    STATE_SOLVED = 3

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_SENT, 'ИЛГЭЭСЭН'),
        (STATE_SOLVED, 'ШИЙДВЭРЛЭГДСЭН'),
    )

    KIND_APPROVED = 1
    KIND_PENDING = 2
    KIND_DISMISS = 3
    KIND_REVOKE = 4
    KIND_NEW = 5


    KIND_CHOICES = (
        (KIND_APPROVED, 'БАТАЛГААЖСАН'),
        (KIND_PENDING, 'ХҮЛЭЭГДЭЖ БУЙ'),
        (KIND_DISMISS, 'БУЦААГДСАН'),
        (KIND_REVOKE, 'ЦУЦЛАСАН'),
        (KIND_NEW, 'ШИНЭ'),
    )

    name = models.CharField(max_length=250, verbose_name='Нэр')
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    description = models.TextField(default='')
    tools = models.TextField(default='')
    geo_id = models.CharField(max_length=100)
    file_path = models.FileField(upload_to=upload_file_path)
    requested_employee = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


class RequestFilesShape(models.Model):

    class Meta:
        db_table = "llc_file_shapes"

    STATE_NEW = 1
    STATE_SENT = 2
    STATE_SOLVED = 3

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_SENT, 'ИЛГЭЭСЭН'),
        (STATE_SOLVED, 'ШИЙДВЭРЛЭГДСЭН'),
    )

    KIND_PENDING = 1
    KIND_APPROVED = 2
    KIND_DISMISS = 3
    KIND_REVOKE = 4


    KIND_CHOICES = (
        (KIND_PENDING, 'ХҮЛЭЭГДЭЖ БУЙ'),
        (KIND_APPROVED, 'БАТАЛГААЖСАН'),
        (KIND_DISMISS, 'БУЦААГДСАН'),
        (KIND_REVOKE, 'ЦУЦЛАСАН')
    )

    files = models.ForeignKey(RequestFiles, on_delete=models.PROTECT, db_index=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT, db_index=True)
    theme_id = models.IntegerField(null=True)
    package_id = models.IntegerField(null=True)
    feature_id = models.IntegerField(null=True)
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    description = models.TextField(default='', null=True)
    order_no = models.CharField(max_length=50, null=True)
    order_at = models.DateTimeField(null=True)
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

    PROJECT_PROGRAM = 1
    LOCAL_AREA = 2
    STATE_FUND = 3
    PERSONAL = 4


    INVESTMENT_STATUS = (
        (PROJECT_PROGRAM, 'ТӨСӨЛ, ХӨТӨЛБӨРИЙН'),
        (LOCAL_AREA, 'ОРОН НУТГИЙН'),
        (STATE_FUND, 'УЛСЫН ТӨСВИЙН'),
        (PERSONAL, 'ХУВИЙН')
    )
    file = models.ForeignKey(RequestFiles, on_delete=models.PROTECT, db_index=True)
    client_org = models.CharField(max_length=100, verbose_name='Нэр')
    project_name = models.CharField(max_length=100, verbose_name='Нэр')
    object_type = models.TextField()
    object_quantum = models.TextField()
    investment_status = models.PositiveIntegerField(choices=INVESTMENT_STATUS, db_index=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class LLCRequest(models.Model):

    class Meta:
        db_table = "llc_request"

    STATE_NEW = 1
    STATE_SENT = 2
    STATE_SOLVED = 3

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_SENT, 'ИЛГЭЭСЭН'),
        (STATE_SOLVED, 'ШИЙДВЭРЛЭГДСЭН'),
    )

    KIND_APPROVED = 1
    KIND_PENDING = 2
    KIND_DISMISS = 3
    KIND_REVOKE = 4
    KIND_NEW = 5

    KIND_CHOICES = (
        (KIND_APPROVED, 'БАТАЛГААЖСАН'),
        (KIND_PENDING, 'ХҮЛЭЭГДЭЖ БУЙ'),
        (KIND_DISMISS, 'БУЦААГДСАН'),
        (KIND_REVOKE, 'ЦУЦЛАСАН'),
        (KIND_NEW, 'ШИНЭ')
    )

    file = models.ForeignKey(RequestFiles, on_delete=models.PROTECT, db_index=True)
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
