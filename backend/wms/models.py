from django.db import models
from django.conf import settings


class WMS(models.Model):

    class Meta:
        db_table = 'wms'
        ordering = ('created_at',)

    name = models.CharField(max_length=200)
    url = models.CharField(max_length=500)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
