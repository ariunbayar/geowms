from django.db import models

# Create your models here.
class LThemes(models.Model):
    class Meta:
        db_table = 'l_themes'
        managed = False
    theme_id = models.IntegerField(primary_key=True)
    theme_code = models.CharField(max_length=255)
    theme_name = models.CharField(max_length=255)
    theme_name_eng = models.CharField(max_length=255)
    top_theme_id = models.IntegerField()
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LPackages(models.Model):
    class Meta:
        db_table = 'l_packages'
        managed = False
    package_id = models.IntegerField(primary_key=True)
    package_code = models.CharField(max_length=255)
    package_name = models.CharField(max_length=255)
    package_name_eng = models.CharField(max_length=255)
    theme_id = models.IntegerField()
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LFeatures(models.Model):
    class Meta:
        db_table = 'l_features'
        managed = False
    feature_id = models.IntegerField(primary_key=True)
    feature_code = models.CharField(max_length=255)
    feature_name = models.CharField(max_length=255)
    feature_name_eng = models.CharField(max_length=255)
    package_id = models.IntegerField()
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()
