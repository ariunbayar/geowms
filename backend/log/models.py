from django.db import models


# Create your models here.
class UserLog(models.Model):
    username = models.CharField(max_length=180)
    email = models.CharField(max_length=180)
    ip_address = models.CharField(max_length=180)
    browser_name = models.CharField(max_length=180)
    browser_version = models.CharField(max_length=180)
    device_name = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
