from django.db import models
from django.conf import settings

from backend.wmslayer.models import WMSLayer
from geoportal_app.models import Role


class Bundle(models.Model):

    class Meta:
        ordering = ('sort_order',)
    MODULE_TUUHEN_UV = 1
    MODULE_TSEG_BURTGEL = 2
    MODULE_TEEVRIIN_SULJEE = 3
    MODULE_DED_BUTETS = 4
    MODULE_BAIR_ZUIN_ZURAG = 5
    MODULE_BARILGA_SUURIN_GAZAR = 6

    MODULE_CHOICES = (
        (MODULE_TUUHEN_UV, 'Түүх, соёлын өв'),
        (MODULE_TSEG_BURTGEL, 'Геодезийн тулгуур сүлжээ'),
        (MODULE_TEEVRIIN_SULJEE, 'Тээврийн сүлжээ'),
        (MODULE_DED_BUTETS, 'Дэд бүтэц'),
        (MODULE_BAIR_ZUIN_ZURAG, 'Байр зүйн зураг'),
        (MODULE_BARILGA_SUURIN_GAZAR, 'Барилга, суурин газар'),
    )

    layers = models.ManyToManyField(WMSLayer, through='BundleLayer', blank=True)
    name = models.CharField(max_length=200)
    module = models.PositiveIntegerField(choices=MODULE_CHOICES, db_index=True, null=True)

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
