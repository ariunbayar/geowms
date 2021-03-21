from django.db import models
from django.conf import settings

from backend.org.models import Org


class CovidDashboard(models.Model):

    class Meta:
        db_table = 'covid_dashboard'

    name = models.CharField(max_length=250, null=False, verbose_name="Нэр")
    parent_id = models.PositiveIntegerField(null=True)
    geo_id = models.CharField(max_length=250, null=True, db_index=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT, null=True, verbose_name="Байгууллага")
    batlagdsan_tohioldol_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Батлагдсан тохиолдол")
    edgersen_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эдгэрсэн хүмүүсийн тоо")
    emchlegdej_bui_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмчлэгдэж буй хүмүүсийн тоо")
    shinjilgee_hiisen_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Шинжилгээ хийсэн тоо")
    nas_barsan_hunii_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Нас барсан хүмүүсийн тоо")
    tusgaarlagdaj_bui_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Тусгаарлагдаж буй хүмүүсийн тоо")
    niit_eruul_mendiin_baiguullaga_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Нийт эрүүл мэндийн байгууллагын тоо")
    emnelegiin_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмнэлэгийн тоо")
    emiin_sangiin_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмийн сангийн тоо")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True, verbose_name="Бүртгэсэн ажилтан")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Бүртгэсэн огноо")


class CovidDashboardLog(models.Model):

    class Meta:
        db_table = 'covid_dashboard_log'

    name = models.CharField(max_length=250, null=False, verbose_name="Нэр")
    parent_id = models.PositiveIntegerField(null=True)
    geo_id = models.CharField(max_length=250, null=True, db_index=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT, null=True, verbose_name="Байгууллага")
    batlagdsan_tohioldol_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Батлагдсан тохиолдол")
    edgersen_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эдгэрсэн хүмүүсийн тоо")
    emchlegdej_bui_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмчлэгдэж буй хүмүүсийн тоо")
    nas_barsan_hunii_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Нас барсан хүмүүсийн тоо")
    tusgaarlagdaj_bui_humuus_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Тусгаарлагдаж буй хүмүүсийн тоо")
    niit_eruul_mendiin_baiguullaga_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Нийт эрүүл мэндийн байгууллагын тоо")
    emnelegiin_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмнэлэгийн тоо")
    emiin_sangiin_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Эмийн сангийн тоо")
    shinjilgee_hiisen_too = models.PositiveIntegerField(null=True, default=0, verbose_name="Шинжилгээ хийсэн тоо")
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True, verbose_name="Бүртгэсэн ажилтан")
    updated_at = models.DateTimeField(auto_now=False, verbose_name="Бүртгэсэн огноо")


class PopulationAge(models.Model):
    age_group_number = models.PositiveIntegerField(null=False)
    age_group = models.CharField(max_length=250, null=False)


class PopulationCount(models.Model):
    geo_id = models.PositiveIntegerField(null=False)
    name = models.CharField(max_length=250, null=False)
    code = models.PositiveIntegerField(null=False)
    age = models.ForeignKey(PopulationAge, on_delete=models.PROTECT)
    total_number = models.PositiveIntegerField(null=False)
