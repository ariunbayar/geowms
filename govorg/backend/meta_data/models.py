from django.db import models
from django.conf import settings
from backend.inspire.models import MGeoDatas

class MetaData(models.Model):

    class Meta:
        db_table = 'meta_data'

    CATEGORY_CHOICES = [
        ('1', 'Агаар сансрын зураг'),
    ]

    STATUS_CHOICES = [
        ('1', 'Completed'),
    ]

    geo_datas                       = models.ManyToManyField('backend_inspire.MGeoDatas', through='MetaDataGeom', verbose_name='Геометр өгөгдлүүд')
    org_name                        = models.CharField(max_length=50, verbose_name='Бэлдсэн байгууллага')
    customer_org                    = models.CharField(max_length=50, verbose_name='Захиалагч байгууллага')
    distributor_org                 = models.CharField(max_length=50, verbose_name='Түгээгч байгууллага')
    owner_org                       = models.CharField(max_length=50, verbose_name='Гүйцэтгэгч байгууллага')
    keywords                        = models.CharField(max_length=500, verbose_name='Ямар өгөгдөл дээр ажилласан')
    category                        = models.CharField(max_length=2, choices=CATEGORY_CHOICES, verbose_name='Ямар арга ашигласан')
    status                          = models.CharField(max_length=2, choices=STATUS_CHOICES)
    language                        = models.CharField(max_length=50, null=True, verbose_name='Ямар хэл дээр мэдээлэл гаргаж байгаа')
    abstract                        = models.CharField(max_length=2000, null=True, verbose_name='Дэлгэрэнгүй мэдээлэл')
    title                           = models.CharField(max_length=2000, verbose_name='Гарчиг')
    uuid                            = models.CharField(max_length=50, null=True)
    schema                          = models.CharField(max_length=100, null=True)

    created_by   = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_name', on_delete=models.PROTECT)
    updated_by   = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='updated_name', on_delete=models.PROTECT)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)


class MetaDataGeom(models.Model):

    class Meta:
        db_table = 'meta_data_geom'

    geo_data_id         = models.ForeignKey('backend_inspire.MGeoDatas', on_delete = models.PROTECT)
    meta_data_id        = models.ForeignKey(MetaData, on_delete=models.PROTECT)
