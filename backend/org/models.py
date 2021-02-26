from django.contrib.gis.db import models
from django.conf import settings


class Org(models.Model):
    LEVEL_CHOICES = [
        (1, '1-р түвшин'),
        (2, '2-р түвшин'),
        (3, '3-р түвшин'),
        (4, '4-р түвшин'),
    ]
    geo_id = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=250)
    level = models.PositiveIntegerField(choices=LEVEL_CHOICES, db_index=True)


class Employee(models.Model):
    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    position = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=8, null=True)
    token = models.CharField(max_length=250, unique=True, null=True)


class OrgRole(models.Model):
    class Meta:
        unique_together = [['org', 'bundle']]

    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    bundle = models.ForeignKey('backend_bundle.Bundle', on_delete=models.PROTECT)
    perm_view = models.BooleanField(db_index=True)
    perm_create = models.BooleanField(db_index=True)
    perm_remove = models.BooleanField(db_index=True)
    perm_revoke = models.BooleanField(db_index=True)
    perm_review = models.BooleanField(db_index=True)
    perm_approve = models.BooleanField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmployeeAddress(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    level_1 = models.CharField(max_length=100, null=True)
    level_2 = models.CharField(max_length=100, null=True)
    level_3 = models.CharField(max_length=100, null=True)
    street = models.CharField(max_length=100, null=True)
    apartment = models.CharField(max_length=100, null=True)
    door_number = models.CharField(max_length=100, null=True)
    point = models.PointField(srid=4326)


class EmployeeErguul(models.Model):
    DAY_TIME = 1
    NIGHT_TIME = 2

    DAY_HOUR = '08:00 - 15:00'
    NIGHT_HOUR = '15:00 - 22:00'

    PART_TIME_CHOICES = [
        (1, 'Үдээс хойш'),
        (2, 'Үдээс өмнө'),
    ]

    address = models.ForeignKey(EmployeeAddress, on_delete=models.CASCADE, verbose_name='Ажилтан')
    level_3 = models.CharField(max_length=100, null=True, verbose_name='Баг/Хороо')
    street = models.CharField(max_length=100, null=True, verbose_name='Гудамж')
    apartment = models.CharField(max_length=100, null=True, verbose_name='Байр')
    point = models.PointField(srid=4326, verbose_name='Байршил')
    part_time = models.PositiveIntegerField(choices=PART_TIME_CHOICES, db_index=True, verbose_name='Ээлж')
    date_start = models.DateTimeField(verbose_name='Эхлэх огноо')
    date_end = models.DateTimeField(verbose_name='Дуусах огноо')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Оноосон огноо')


class ErguulTailbar(models.Model):
    DONE = 1
    NOT_DONE = 2

    STATE_CHOICES = [
        (1, 'Гарсан'),
        (2, 'Гараагүй'),
    ]

    erguul = models.ForeignKey(EmployeeErguul, on_delete=models.CASCADE)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, verbose_name='Төлөв')
    description = models.CharField(max_length=10000, db_index=True, verbose_name='Тайлбар')
