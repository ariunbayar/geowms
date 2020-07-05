from django.db import models


class GovOrg(models.Model):

    class Meta:
        ordering = ('created_at',)
        db_table = 'govorg'

    name = models.CharField(max_length=250)
    token = models.CharField(max_length=250)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
