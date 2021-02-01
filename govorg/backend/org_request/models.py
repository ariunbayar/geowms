from django.db import models
from backend.org.models import Employee
from backend.org.models import Org

# Create your models here.

class ChangeRequest(models.Model):

    STATE_NEW = 1
    STATE_REJECT = 2
    STATE_APPROVE = 3
    STATE_CONTROL = 4

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_REJECT, 'ТАТГАЛЗСАН'),
        (STATE_APPROVE, 'ЗӨВШӨӨРСӨН'),
        (STATE_CONTROL, 'ХЯНАХ')
    )

    KIND_CREATE = 1
    KIND_UPDATE = 2
    KIND_DELETE = 3
    KIND_DIRECT = 4
    KIND_REVOKE = 5

    KIND_CHOICES = (
        (KIND_CREATE, 'ҮҮССЭН'),
        (KIND_DELETE, 'УСТГАСАН'),
        (KIND_UPDATE, 'ЗАССАН'),
        (KIND_DIRECT, 'ШУУД'),
        (KIND_REVOKE, 'ЦУЦЛАСАН'),
    )

    old_geo_id = models.CharField(max_length=100, null=True)
    new_geo_id = models.CharField(max_length=100, null=True)
    order_no = models.CharField(max_length=50, null=True)
    order_at = models.DateTimeField(null=True)
    theme_id = models.IntegerField()
    package_id = models.IntegerField()
    feature_id = models.IntegerField()
    employee_id = models.IntegerField(null=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    form_json = models.TextField(null=True)
    geo_json = models.TextField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
