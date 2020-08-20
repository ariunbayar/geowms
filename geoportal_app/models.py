from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User


class Role(models.Model):
    ROLE1 = 1
    ROLE2 = 2
    ROLE3 = 3
    ROLE4 = 4
    ADMIN = 5
    ROLE_CHOICES = (
        (ROLE1, 'role1'),
        (ROLE2, 'role2'),
        (ROLE3, 'role3'),
        (ROLE4, 'role4'),
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
