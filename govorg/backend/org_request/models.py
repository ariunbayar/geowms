from django.db import models
from backend.org.models import Employee

# Create your models here.

class OrgRequest(models.Model):

    STATE_CREATE = 1
    STATE_REVOKE = 2
    STATE_REVIEW = 3
    STATE_APPROVE = 4

    STATE_CHOICES = (
        (STATE_CREATE, 'Шинээр үүссэн'),
        (STATE_REVOKE, 'Цуцлах'),
        (STATE_REVIEW, 'Хянах'),
        (STATE_APPROVE, 'Батлах'),
    )

    theme_id = models.IntegerField()
    package_id = models.IntegerField()
    feature_id = models.IntegerField()
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    form_json = models.TextField(null=True)
    geo_json = models.TextField(null=True)

    created_on = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
