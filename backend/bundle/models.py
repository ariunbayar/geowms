from django.db import models
from django.conf import settings

from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role


class Bundle(models.Model):

    class Meta:
        ordering = ('sort_order',)
    MODUL_TVVHEN_UV = 1
    MODULE_CHOICES = (
        (MODUL_TVVHEN_UV, 'Түүх, соёлын өв'),
    )
    
    layers = models.ManyToManyField(WMSLayer, through='BundleLayer')
    name = models.CharField(max_length=200)
    modul = models.PositiveIntegerField(choices=MODULE_CHOICES, db_index=True, null=True)

    is_removeable = models.BooleanField()
    icon = models.ImageField(upload_to='дэд-сан/')

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sort_order = models.PositiveIntegerField()


class BundleLayer(models.Model):

    layer = models.ForeignKey(WMSLayer, on_delete=models.PROTECT)
    bundle = models.ForeignKey(Bundle, on_delete=models.PROTECT)
    role = models.ForeignKey(Role, on_delete=models.PROTECT, default=5)
    defaultCheck = models.PositiveIntegerField(default=0)
