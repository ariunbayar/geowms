from django.db import models

class ChangeSet(models.Model):
    geom = models.TextField(null=True)
    features = models.TextField(null=True)