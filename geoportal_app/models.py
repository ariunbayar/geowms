from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.core import validators
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

from main import utils


class Role(models.Model):
    ROLE1 = 1
    ROLE2 = 2
    ADMIN = 5
    ROLE_CHOICES = (
        (ROLE1, 'role1'),
        (ROLE2, 'role2'),
        (ADMIN, 'admin'),
    )

    id = models.PositiveSmallIntegerField(
        choices=ROLE_CHOICES, primary_key=True)

    def __str__(self):
        return self.get_id_display()

    class Meta:
        verbose_name = ("Хэрэглэгчийн эрх")
        verbose_name_plural = ("Хэрэглэгчийн эрхүүд")

@deconstructible
class UserRegistratioinNumberValidator(validators.RegexValidator):
    regex = utils.RE_REGISTER
    message = _(
        'Регистрийн дугаараа зөв оруулна уу! '
        'Жишээлбэл: АА00000000'
    )
    flags = 0


class User(AbstractUser):
    register_validator = UserRegistratioinNumberValidator()

    roles = models.ManyToManyField(Role)
    register = models.CharField(
        max_length=10,
        null=True,
        validators=[register_validator],
        error_messages={
            'invalid_register': _('Буруу регистр оруулсан байна!')
        }
    )
    gender = models.CharField(max_length=10, null=True)
    is_sso = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)


class UserValidationEmail(models.Model):
    user  = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approve = models.BooleanField(default=False)
    token = models.CharField(max_length=100, null=True, db_index=True)
    valid_before = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self):
        return now() < self.valid_before
