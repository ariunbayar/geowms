from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


class User(AbstractUser):

    class Meta:
        db_table = 'auth_user'

    objects = UserManager()

    groups = None
    user_permissions = None

    # Fields defined in AbstractUser
    # password
    # last_login
    # is_superuser
    # username
    # first_name
    # last_name
    # email
    # is_staff
    # is_active
    # date_joined

    register = models.CharField(max_length=10, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True)
    
    address = models.CharField(max_length=250, null=True, blank=True, verbose_name='Хаяг')
    phone1 = models.CharField(max_length=20, null=True, blank=True)
    phone2 = models.CharField(max_length=20, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True)