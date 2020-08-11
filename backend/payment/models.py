from django.db import models
from geoportal_app.models import User
# Create your models here.
class Payment(models.Model):
    number = models.CharField(max_length=32, unique=True) 
    amount = models.PositiveIntegerField()
    description = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    is_success = models.BooleanField()
    success_at = models.DateTimeField(auto_now_add=True, null=True)