from django.db import models
from geoportal_app.models import User
# Create your models here.


class Payment(models.Model):
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
    created_at = models.DateTimeField(auto_now_add=True)


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
