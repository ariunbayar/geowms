from django.db import models


class СуурьДавхарга(models.Model):

    class Meta:
        db_table = 'суурь_давхарга'
        ordering = ('created_at',)

    name = models.CharField(max_length=250)
    url = models.CharField(max_length=500)
    thumbnail_1x = models.ImageField(upload_to='суурь_давхарга/thumbnail_1x/')
    thumbnail_2x = models.ImageField(upload_to='суурь_давхарга/thumbnail_2x/')

    created_at = models.DateTimeField(auto_now_add=True)
