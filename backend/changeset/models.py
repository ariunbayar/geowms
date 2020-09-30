from django.db import models


class ChangeSet(models.Model):

    class Meta:
        db_table = 'changeset'

    geom = models.TextField(null=True)
    features = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
