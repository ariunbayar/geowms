from django.db import models

# Create your models here.
class Config(models.Model):
    name = models.CharField(max_length=250, db_index=True, verbose_name='Гарчиг')
    value = models.TextField(verbose_name='Товч агуулга')
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = ("Агентлагийн мэдээлэл")