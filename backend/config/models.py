from django.db import models

from backend.org.models import Org

class Config(models.Model):

    class Meta:
        verbose_name_plural = "Агентлагийн мэдээлэл"
        db_table = "config"
        ordering = ('id',)

    name = models.CharField(max_length=250, db_index=True, verbose_name='Гарчиг')
    value = models.TextField(verbose_name='Товч агуулга')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CovidConfig(models.Model):

    class Meta:
        db_table = "config_covid"
        ordering = ('id',)

    name = models.CharField(max_length=250, db_index=True, verbose_name='Гарчиг')
    value = models.TextField(verbose_name='Товч агуулга')
    org = models.ForeignKey(Org, on_delete=models.PROTECT, null=True, verbose_name="Байгууллага")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Error500(models.Model):

    class Meta:
        db_table = "error500"

    request_scheme = models.CharField(max_length=20, null=True) # htto, https
    request_url = models.CharField(max_length=500, null=True)
    request_method = models.CharField(max_length=50, null=True) # GET, POST
    request_headers = models.TextField(null=True) # {"name": "sdfsdfsdfsd", "asdfasdf": ""}
    request_data = models.TextField(null=True) # {"name": "sdfsdfsdfsd", "asdfasdf": ""}
    description = models.TextField(null=True) # traceback buyu terminal deer garah aldaa
    created_at = models.DateTimeField(auto_now_add=True)
