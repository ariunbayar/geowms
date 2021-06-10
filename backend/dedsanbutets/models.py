from django.db import models


class ViewNames(models.Model):
    view_name = models.CharField(unique=True, max_length=250)
    feature_id = models.IntegerField()
    open_datas = models.TextField(null=True, default=None)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ViewProperties(models.Model):
    view = models.ForeignKey(ViewNames, on_delete=models.PROTECT)
    property_id = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class FeatureOverlaps(models.Model):
    feature_id = models.IntegerField()
    overlap_feature_id = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
