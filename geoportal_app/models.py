from django.db import models
from django.contrib.auth.models import AbstractUser


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


class User(AbstractUser):
    roles = models.ManyToManyField(Role)
    register = models.CharField(max_length=10, null=True)
    gender = models.CharField(max_length=10, null=True)
    is_sso = models.BooleanField(default=False)
