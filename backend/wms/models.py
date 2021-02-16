from django.db import models
from django.conf import settings
from backend.org.models import Employee


class Style(models.Model):

    class Meta:
        db_table = 'style'

    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    abstract = models.CharField(max_length=200)
    onlineResource = models.CharField(max_length=500)
    imgformat = models.CharField(max_length=50)


class WMS(models.Model):

    class Meta:
        db_table = 'wms'
        ordering = ('created_at',)

    name = models.CharField(max_length=200)
    url = models.CharField(max_length=500)
    cache_url = models.CharField(max_length=500, null=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    styles = models.ManyToManyField(Style)


class WMSLog(models.Model):

    class Meta:
        db_table = 'api_wms_log'
        ordering = ('-created_at',)

    system = models.ForeignKey('backend_govorg.GovOrg', on_delete=models.PROTECT, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True)
    wms = models.ForeignKey('backend_wms.WMS', on_delete=models.PROTECT, null=True)

    qs_all = models.TextField(null=True)
    qs_request = models.CharField(max_length=50, db_index=True)

    rsp_status = models.PositiveIntegerField()
    rsp_size = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
