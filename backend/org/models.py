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


class Position(models.Model):

    DEFAULT_POSITIONS = [
        "Байхгүй",
        "Сайд",
        "Дэд сайд",
        "Төрийн нарийн бичгийн дарга",
        "Дарга",
        "Орлогч дарга",
        "Тэргүүн дэд",
        "Газрын дарга",
        "Хэлтсийн дарга",
        "Ахлах шинжээч",
        "Шинжээч",
        "Ахлах мэргэжилтэн",
        "Мэргэжилтэн",
        "Зөвлөх"
    ]

    class Meta:
        db_table = "backend_org_position"

    name = models.CharField(max_length=250, verbose_name='Албан тушаалын нэр')
    org = models.ForeignKey(Org, on_delete=models.PROTECT, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class Employee(models.Model):
    STATE_WORKING = 'Ажиллаж байгаа'
    STATE_BREAK = 'Чөлөөтэй'
    STATE_FIRED = 'Чөлөөлөгдсөн'
    STATE_SICK = 'Өвчтэй'

    STATE_WORKING_CODE = 1
    STATE_BREAK_CODE = 2
    STATE_FIRED_CODE = 3
    STATE_SICK_CODE = 4

    STATE_CHOICES = [
        (STATE_WORKING_CODE, STATE_WORKING),
        (STATE_BREAK_CODE, STATE_BREAK),
        (STATE_FIRED_CODE, STATE_FIRED),
        (STATE_SICK_CODE, STATE_SICK),
    ]

    ANGIIN_DARGA = 'Ангийн дарга'
    GISHUUN = 'Гишүүн'
    NARIIN_BICHGIIN_DARGA = 'Нарийн бичгийн дарга'

    ANGIIN_DARGA_CODE = 1
    GISHUUN_CODE = 2
    NARIIN_BICHGIIN_DARGA_CODE = 3

    CLASS_CHOICES = [
        (ANGIIN_DARGA_CODE, ANGIIN_DARGA),
        (GISHUUN_CODE, GISHUUN),
        (NARIIN_BICHGIIN_DARGA_CODE, NARIIN_BICHGIIN_DARGA),
    ]

    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    position = models.ForeignKey(Position, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=8, null=True)
    token = models.CharField(max_length=250, unique=True, null=True)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True)
    pro_class = models.PositiveIntegerField(choices=CLASS_CHOICES, null=True)


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
    STATE_REGULER_CODE = 1
    STATE_SHORT_CODE = 2

    STATE_REGULER = 'Байнгын оршин суугаа хаяг'
    STATE_SHORT = 'Түр оршин суугаа хаяг'

    STATE_CHOICES = [
        (STATE_REGULER_CODE, STATE_REGULER),
        (STATE_SHORT_CODE, STATE_SHORT),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    level_1 = models.CharField(max_length=100, null=True)
    level_2 = models.CharField(max_length=100, null=True)
    level_3 = models.CharField(max_length=100, null=True)
    street = models.CharField(max_length=100, null=True)
    apartment = models.CharField(max_length=100, null=True)
    door_number = models.CharField(max_length=100, null=True)
    point = models.PointField(srid=4326)
    address_state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True)


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
    is_over = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Оноосон огноо')


class ErguulTailbar(models.Model):
    DONE = 1
    NOT_DONE = 2

    STATE_CHOICES = [
        (1, 'Гарсан'),
        (2, 'Гараагүй'),
    ]

    erguul = models.OneToOneField(EmployeeErguul, on_delete=models.CASCADE)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, verbose_name='Төлөв')
    description = models.CharField(max_length=10000, db_index=True, verbose_name='Тайлбар')
