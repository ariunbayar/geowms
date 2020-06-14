from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import User
# Create your models here.



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

  id = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, primary_key=True)

  def __str__(self):
      return self.get_id_display()

  class Meta:
      verbose_name = ("Хэрэглэгчийн эрх")
      verbose_name_plural = ("Хэрэглэгчийн эрхүүд")


class User(AbstractUser):
  roles = models.ManyToManyField(Role)
  register = models.CharField(max_length=10, null=True)
  gender = models.CharField(max_length=10, null=True)

class Page(models.Model):
    title = models.CharField(max_length=1000, verbose_name='Гарчиг')
    short_body = models.TextField(verbose_name='Товч агуулга')
    body = RichTextUploadingField(verbose_name='Агуулга')
    sort = models.IntegerField(verbose_name='Дараалал')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = ("Цэс")
        verbose_name_plural = ("Цэсүүд")
