from django.db import models
from django.conf import settings

from backend.wms.models import WMS


class WMSLayer(models.Model):

    wms = models.ForeignKey(WMS, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
