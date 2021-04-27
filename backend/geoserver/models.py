from django.db import models


# Create your models here.
class WmtsCacheConfig(models.Model):

    class Meta:
        db_table = "geoserver_wmts_cache_config"
        ordering = ('created_at',)

    feature_id = models.IntegerField(null=True)
    feature_count = models.BigIntegerField(null=True)
    group_name = models.CharField(max_length=100, null=True)
    img_format = models.CharField(max_length=50)
    zoom_start = models.IntegerField(null=True)
    zoom_stop = models.IntegerField()
    type_of_operation = models.CharField(max_length=255)
    number_of_tasks_to_use = models.IntegerField()
    is_modified = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
