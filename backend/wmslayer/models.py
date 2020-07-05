from django.db import models
from django.conf import settings

from backend.wms.models import WMS


class WMSLayer(models.Model):

    class Meta:
        ordering = ('sort_order',)

    wms = models.ForeignKey(WMS, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, null=True)
    code = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sort_order = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.sort_order = WMSLayer.objects.count()
        super(WMSLayer, self).save(*args, **kwargs)
