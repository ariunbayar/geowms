from django.db import models
from django.conf import settings

from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role
from backend.inspire.models import LThemes


class Bundle(models.Model):

    class Meta:
        ordering = ('sort_order',)

    layers = models.ManyToManyField(WMSLayer, through='BundleLayer', blank=True)
    ltheme = models.OneToOneField(LThemes, on_delete=models.CASCADE, null=True)
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


class BundleGIS(models.Model):

    bundle = models.ForeignKey(Bundle, on_delete=models.PROTECT)
    oid = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
