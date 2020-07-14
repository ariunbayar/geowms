from django.db import models


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
