from django.db import models
from django.conf import settings


class Org(models.Model):
    LEVEL_CHOICES = [
        (1, '1-р түвшин'),
        (2, '2-р түвшин'),
        (3, '3-р түвшин'),
        (4, '4-р түвшин'),
    ]

    name = models.CharField(max_length=250)
    level = models.PositiveIntegerField(choices=LEVEL_CHOICES, db_index=True)


class Employee(models.Model):
    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    position = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrgRole(models.Model):
    class Meta:
        unique_together = [['org', 'bundle']]

    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    bundle = models.ForeignKey('backend_bundle.Bundle', on_delete=models.PROTECT)
    perm_view = models.BooleanField(db_index=True)
    perm_create = models.BooleanField(db_index=True)
    perm_remove = models.BooleanField(db_index=True)
    perm_revoke = models.BooleanField(db_index=True)
    perm_review = models.BooleanField(db_index=True)
    perm_approve = models.BooleanField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrgInspireRoles(models.Model):
    THEME = 1
    PACKEGE = 2
    FEATURE = 3
    PROPERTY = 4

    MODULE_CHOICES = (
        (THEME, 'Дэд сан'),
        (PACKEGE, 'Багц'),
        (FEATURE, 'Давхрага'),
        (PROPERTY, 'Талбар'),
    )

    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    module_root_id = models.BigIntegerField(null=True)
    module_id = models.BigIntegerField()
    module = models.PositiveIntegerField(choices=MODULE_CHOICES, db_index=True, null=True)
    perm_view = models.BooleanField(db_index=True)
    perm_create = models.BooleanField(db_index=True)
    perm_remove = models.BooleanField(db_index=True)
    perm_update = models.BooleanField(db_index=True)
    perm_revoke = models.BooleanField(db_index=True)
    perm_review = models.BooleanField(db_index=True)
    perm_approve = models.BooleanField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)