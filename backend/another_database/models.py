from django.db import models
from django.conf import settings


class AnotherDatabase(models.Model):
    MSSSQL = 1
    MONGODB = 2
    PgDB = 3

    DB_CHOICES = [
        (1, 'MSSQL'),
        (2, 'MONGODB'),
        (3, 'PgDB'),
    ]
    class Meta:
        db_table = "another_database"
        ordering = ('id',)

    name = models.CharField(max_length=250)
    db_type = models.PositiveIntegerField(choices=DB_CHOICES, db_index=True, verbose_name='Төлөв', null=True)
    definition = models.CharField(max_length=500, null=True, verbose_name='Товч агуулга')
    connection = models.TextField()
    unique_id = models.IntegerField()
    database_updated_at = models.DateTimeField(auto_now=True)
    crontab = models.TextField(null=True)
    crontab_is_active = models.BooleanField(default=False)
    is_export = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class AnotherDatabaseTable(models.Model):

    class Meta:
        db_table = "another_database_table"
        ordering = ('id',)

    table_name = models.CharField(max_length=250)
    feature_code = models.CharField(max_length=250)
    field_config = models.TextField()
    another_database = models.ForeignKey(AnotherDatabase, on_delete=models.CASCADE, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
