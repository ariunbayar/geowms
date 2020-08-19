from django.db import models
from geoportal_app.models import User
# Create your models here.


class Payment(models.Model):
    geo_unique_number = models.CharField(max_length=300, unique=True)
    bank_unique_number = models.CharField(max_length=300)

    data_id = models.CharField(max_length=300)
    description = models.CharField(max_length=500)
    amount = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    is_success = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    success_at = models.DateTimeField(auto_now=True)
    failed_at = models.DateTimeField(auto_now=True)

    error_message = models.CharField(max_length=500)
    error_code = models.CharField(max_length=100)
