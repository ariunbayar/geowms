from django.db import models


class KindToken(models.Model):

    class Meta:
        db_table = 'kind_token'
        unique_together = ('kind', 'token')

    KIND_VALIDATION_EMAIL = 1
    KIND_RESET_PASSWORD = 2
    KIND_GIS_EMPLOYEE_TOKEN = 3
    KIND_GIS_SYSTEM_TOKEN = 4

    KIND_CHOICES = [
        (KIND_VALIDATION_EMAIL, 'Мэйл хаягаа баталгаажуулах'),
        (KIND_RESET_PASSWORD, 'Нууц үг сэргээх'),
        (KIND_GIS_EMPLOYEE_TOKEN, 'WMS, WFS, WMTS-руу албан хаагч хандах'),
        (KIND_GIS_SYSTEM_TOKEN, 'WMS, WFS, WMTS-руу байгууллагын системээс хандах'),
    ]

    kind = models.PositiveSmallIntegerField(choices=KIND_CHOICES)
    token = models.CharField(max_length=64)  # token-ий утга
    is_used = models.BooleanField(default=False)
