from django.db import models


class GovOrg(models.Model):

    name = models.CharField(max_length=250)
    token = models.CharField(max_length=250)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
