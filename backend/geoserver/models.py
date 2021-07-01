from django.db import models


# Create your models here.
class WmtsCacheConfig(models.Model):

    class Meta:
        db_table = "geoserver_wmts_cache_config"
        ordering = ('created_at',)

    feature_id = models.IntegerField(null=True)
    group_name = models.CharField(max_length=100, null=True)
    img_format = models.CharField(max_length=50, null=True)
    zoom_start = models.IntegerField(null=True)
    zoom_stop = models.IntegerField(null=True)
    type_of_operation = models.CharField(max_length=255, null=True)
    number_of_tasks_to_use = models.IntegerField(null=True)
    is_modified = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
