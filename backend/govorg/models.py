from django.db import models


class GovOrg(models.Model):

    class Meta:
        ordering = ('created_at',)
        db_table = 'govorg'

    name = models.CharField(max_length=250)
    token = models.CharField(max_length=250)

    wms_layers = models.ManyToManyField(
        'backend_wmslayer.WMSLayer',
        through='backend_govorg.GovOrgWMSLayer',
        related_name='govorgs'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GovOrgWMSLayer(models.Model):
    govorg = models.ForeignKey('backend_govorg.GovOrg', on_delete=models.CASCADE)
    wms_layer = models.ForeignKey('backend_wmslayer.WMSLayer', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
