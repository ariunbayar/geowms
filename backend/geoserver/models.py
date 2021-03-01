from django.db import models


# Create your models here.
class WmtsCacheConfig(models.Model):

    class Meta:
        db_table = "geoserver_wmts_cache_config"
        ordering = ('created_at',)

    feature_id = models.IntegerField()
    img_format = models.CharField(max_length=50)
    zoom_start = models.IntegerField(null=True)
    zoom_stop = models.IntegerField()
    type_of_operation = models.CharField(max_length=255, )
    number_of_tasks_to_use = models.IntegerField()
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GroupLayer(models.Model):

    class Meta:
        db_table = "geoserver_wmts_group_layer"
        ordering = ('created_at',)

    name = models.CharField(max_length=50)
    title = models.CharField(max_length=50)
    Abstract = models.CharField(max_length=500)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
