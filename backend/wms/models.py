from django.db import models
from django.conf import settings


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
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    styles = models.ManyToManyField(Style)
