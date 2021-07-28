from django.db import models
from django.conf import settings


class System(models.Model):

    class Meta:
        ordering = ('created_at',)
        db_table = 'system'
    org = models.ForeignKey('backend_org.Org', on_delete=models.PROTECT, null=True)
    name = models.CharField(max_length=250)
    website = models.CharField(max_length=250, null=True)
    token = models.CharField(max_length=250, db_index=True)

    wms_layers = models.ManyToManyField(
        'backend_wmslayer.WMSLayer',
        through='backend_govorg.GovOrgWMSLayer',
        related_name='govorgs'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True)
    deleted_at = models.DateTimeField(null=True)


class GovOrgWMSLayer(models.Model):
    system = models.ForeignKey('backend_govorg.System', on_delete=models.CASCADE)
    wms_layer = models.ForeignKey('backend_wmslayer.WMSLayer', on_delete=models.CASCADE)
    attributes = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
