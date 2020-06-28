from django.db import models


class BaseLayer(models.Model):

    class Meta:
        db_table = 'base_layer'
        ordering = ('created_at',)

    TILENAME_CHOICES = [
            ('wms', 'wms'),
            ('xyz', 'xyz'),
        ]

    name = models.CharField(max_length=250)
    url = models.CharField(max_length=500)
    tilename = models.CharField(max_length=10, choices=TILENAME_CHOICES)
    thumbnail_1x = models.ImageField(upload_to='суурь_давхарга/thumbnail_1x/')
    thumbnail_2x = models.ImageField(upload_to='суурь_давхарга/thumbnail_2x/')

    created_at = models.DateTimeField(auto_now_add=True)
