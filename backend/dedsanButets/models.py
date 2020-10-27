from django.db import models


class ViewName(models.Model):

    view_name = models.CharField(unique=True, max_length=250)
    feature_id = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ViewProperty(models.Model):

    view = models.ForeignKey(ViewName, on_delete=models.PROTECT)
    property_id = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)