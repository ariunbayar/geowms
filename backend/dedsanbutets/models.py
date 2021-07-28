from django.db import models
from django.db.models.deletion import PROTECT
from backend.inspire.models import LFeatures, LProperties


class ViewNames(models.Model):
    view_name = models.CharField(unique=True, max_length=250)
    feature = models.ForeignKey(LFeatures, null=True, on_delete=PROTECT)
    open_datas = models.TextField(null=True, default=None)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ViewProperties(models.Model):
    view = models.ForeignKey(ViewNames, on_delete=models.PROTECT)
    property = models.ForeignKey(LProperties, null=True, on_delete=models.PROTECT)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class FeatureOverlaps(models.Model):
    feature_id = models.IntegerField()
    overlap_feature_id = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
