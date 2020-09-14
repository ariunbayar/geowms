from django.db import models
from geoportal_app.models import User
# Create your models here.


class Payment(models.Model):

    KIND_MONGOLBANK = 1
    KIND_QPAY = 2

    KIND_CHOICES = (
       (KIND_MONGOLBANK, 'Монгол Банк'),
       (KIND_QPAY, 'QPay'),
    )

    EXPORT_KIND_POINT = 1
    EXPORT_KIND_POLYGON = 2

    EXPORT_KIND_CHOICES = (
       (EXPORT_KIND_POINT, 'Цэг'),
       (EXPORT_KIND_POLYGON, 'Полигон'),
    )

    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    export_kind = models.PositiveIntegerField(choices=EXPORT_KIND_CHOICES, db_index=True)
    geo_unique_number = models.CharField(max_length=300, unique=True)
    bank_unique_number = models.CharField(max_length=300)
    description = models.CharField(max_length=500)
    total_amount = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    is_success = models.BooleanField()
    success_at = models.DateTimeField(null=True)
    failed_at = models.DateTimeField(null=True)
    card_number = models.CharField(max_length=500)
    message = models.CharField(max_length=500)
    code = models.CharField(max_length=100)
    qpay_rsp = models.TextField(null=True)
    mongolbank_rsp = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    export_file = models.CharField(max_length=250, null=True)
    bundle = models.OneToOneField('backend_bundle.Bundle', on_delete=models.PROTECT, null=True)


class PaymentPoint(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    point_id = models.CharField(max_length=100)
    point_name = models.CharField(max_length=100)
    amount = models.PositiveIntegerField()
    pdf_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class PaymentPolygon(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    data_id = models.CharField(max_length=100)
    pdf_id = models.CharField(max_length=100)
    amount = models.PositiveIntegerField()
    coodrinatLeftTopX = models.DecimalField(decimal_places=10, max_digits=20)
    coodrinatLeftTopY = models.DecimalField(decimal_places=10, max_digits=20)
    coodrinatRightBottomX = models.DecimalField(decimal_places=10, max_digits=20)
    coodrinatRightBottomY = models.DecimalField(decimal_places=10, max_digits=20)
    created_at = models.DateTimeField(auto_now_add=True)


class PaymentLayer(models.Model):

    wms_layer = models.ForeignKey('backend_wmslayer.WMSLayer', on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    defaultCheck = models.PositiveIntegerField(default=0)
