from django.db import models


class ChangeSet(models.Model):

    class Meta:
        db_table = 'changeset'

    geom = models.TextField(null=True)
    features = models.TextField(null=True)
    projection = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
