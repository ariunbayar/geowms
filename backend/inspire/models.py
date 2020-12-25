from django.contrib.gis.db import models
from backend.org.models import Org, Employee
from django.conf import settings


class LCodeListConfigs(models.Model):
    class Meta:
        db_table = 'l_code_list_configs'
        managed = False

    code_list_config_id = models.AutoField(primary_key=True)
    property_id = models.IntegerField()
    to_property_id = models.IntegerField()
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LCodeLists(models.Model):
    class Meta:
        db_table = 'l_code_lists'
        managed = False

    code_list_id = models.AutoField(primary_key=True)
    property_id = models.IntegerField()
    code_list_code = models.CharField(max_length=255)
    code_list_name = models.CharField(max_length=255)
    code_list_name_eng = models.CharField(max_length=255)
    code_list_definition = models.CharField(max_length=500)
    code_list_definition_eng = models.CharField(max_length=500)
    has_text_value = models.BooleanField(default=True)
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LDataTypeConfigs(models.Model):
    class Meta:
        db_table = 'l_data_type_configs'
        managed = False

    data_type_config_id = models.AutoField(primary_key=True)
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LDataTypes(models.Model):
    class Meta:
        db_table = 'l_data_types'
        managed = False

    data_type_id = models.AutoField(primary_key=True)
    data_type_code = models.CharField(max_length=255)
    data_type_name = models.CharField(max_length=255)
    data_type_name_eng = models.CharField(max_length=255)
    data_type_definition = models.CharField(max_length=500)
    data_type_definition_eng = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    is_read_only = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LFeatureConfigs(models.Model):
    class Meta:
        db_table = 'l_feature_configs'
        managed = False

    feature_config_id = models.AutoField(primary_key=True)
    feature_id = models.IntegerField()
    has_class = models.BooleanField(default=True)
    data_type_id = models.IntegerField()
    data_type_display_name = models.CharField(max_length=255)
    is_connect_to_feature = models.BooleanField(default=True)
    connect_feature_id = models.IntegerField()
    connect_feature_property_id = models.IntegerField()
    order_no = models.IntegerField()
    is_required = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LFeatures(models.Model):

    class Meta:
        db_table = 'l_features'
        managed = False

    feature_id = models.AutoField(primary_key=True)
    feature_code = models.CharField(max_length=255, null=True)
    feature_name = models.CharField(max_length=255, null=True)
    feature_name_eng = models.CharField(max_length=255, null=True)
    package_id = models.IntegerField(null=True)
    order_no = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.IntegerField(null=True)
    modified_on = models.DateTimeField(auto_now=True, null=True)
    modified_by = models.IntegerField(null=True)


class LPackages(models.Model):
    class Meta:
        db_table = 'l_packages'
        managed = False

    package_id = models.AutoField(primary_key=True)
    package_code = models.CharField(max_length=255, null=True)
    package_name = models.CharField(max_length=255, null=True)
    package_name_eng = models.CharField(max_length=255, null=True)
    theme_id = models.IntegerField(null=True)
    order_no = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.IntegerField(null=True)
    modified_on = models.DateTimeField(auto_now=True, null=True)
    modified_by = models.IntegerField(null=True)


class LProperties(models.Model):
    class Meta:
        db_table = 'l_properties'
        managed = False

    property_id = models.AutoField(primary_key=True)
    property_code = models.CharField(max_length=255)
    property_name = models.CharField(max_length=255)
    property_name_eng = models.CharField(max_length=255)
    property_definition = models.CharField(max_length=500)
    property_definition_eng = models.CharField(max_length=500)
    value_type_id = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_read_only = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class LThemes(models.Model):
    class Meta:
        db_table = 'l_themes'
        managed = False

    theme_id = models.AutoField(primary_key=True)
    theme_code = models.CharField(max_length=255, null=True)
    theme_name = models.CharField(max_length=255, null=True)
    theme_name_eng = models.CharField(max_length=255, null=True)
    top_theme_id = models.IntegerField(null=True)
    order_no = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.IntegerField(null=True)
    modified_on = models.DateTimeField(auto_now=True, null=True)
    modified_by = models.IntegerField(null=True)


class LValueTypes(models.Model):
    class Meta:
        db_table = 'l_value_types'
        managed = False

    value_type_id = models.CharField(max_length=255, primary_key=True)
    value_type_name = models.CharField(max_length=255)
    value_type_name_eng = models.CharField(max_length=255)
    order_no = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MDatasBoundary(models.Model):
    class Meta:
        db_table = 'm_datas_boundary'
        managed = False

    boundary_id = models.BigAutoField(primary_key=True)
    geo_id = models.CharField(max_length=100)
    feature_config_id = models.IntegerField()
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    code_list_id = models.IntegerField()
    value_text = models.CharField(max_length=4000)
    value_number = models.FloatField()
    value_date = models.DateTimeField(auto_now=False)
    value_connected_geo_id = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MDatasBuilding(models.Model):
    class Meta:
        db_table = 'm_datas_building'
        managed = False

    building_id = models.BigAutoField(primary_key=True)
    geo_id = models.CharField(max_length=100)
    feature_config_id = models.IntegerField()
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    code_list_id = models.IntegerField()
    value_text = models.CharField(max_length=4000)
    value_number = models.FloatField()
    value_date = models.DateTimeField(auto_now=False)
    value_connected_geo_id = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MDatasCadastral(models.Model):
    class Meta:
        db_table = 'm_datas_cadastral'
        managed = False

    cadastral_id = models.BigAutoField(primary_key=True)
    geo_id = models.CharField(max_length=100)
    feature_config_id = models.IntegerField()
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    code_list_id = models.IntegerField()
    value_text = models.CharField(max_length=4000)
    value_number = models.FloatField()
    value_date = models.DateTimeField(auto_now=False)
    value_connected_geo_id = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MDatasGeographical(models.Model):
    class Meta:
        db_table = 'm_datas_geographical'
        managed= False

    geographical_id = models.BigAutoField(primary_key=True)
    geo_id = models.CharField(max_length=100)
    feature_config_id = models.IntegerField()
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    code_list_id = models.IntegerField()
    value_text = models.CharField(max_length=4000)
    value_number = models.FloatField()
    value_date = models.DateTimeField(auto_now=False)
    value_connected_geo_id = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MDatasHydrography(models.Model):
    class Meta:
        db_table = 'm_datas_hydrography'
        managed= False

    hydrography_id = models.BigAutoField(primary_key=True)
    geo_id = models.CharField(max_length=100)
    feature_config_id = models.IntegerField()
    data_type_id = models.IntegerField()
    property_id = models.IntegerField()
    code_list_id = models.IntegerField()
    value_text = models.CharField(max_length=4000)
    value_number = models.FloatField()
    value_date = models.DateTimeField(auto_now=False)
    value_connected_geo_id = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class MGeoDatas(models.Model):
    class Meta:
        db_table = 'm_geo_datas'
        managed= False

    geo_id = models.CharField(primary_key=True, max_length=100)
    geo_data = models.GeometryCollectionField(srid=32648) #geometry(GeometryZ,32648),
    feature_id = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    modified_on = models.DateTimeField(auto_now=True)
    modified_by = models.IntegerField()


class GovRole(models.Model):
    class Meta:
        db_table = 'perm_gov_role'
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=1000)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class GovPerm(models.Model):
    class Meta:
        db_table = 'perm_gov_perm'
    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    gov_role = models.ForeignKey(GovRole, on_delete=models.CASCADE, db_index=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class EmpRole(models.Model):
    class Meta:
        db_table = 'perm_emp_role'
    gov_perm = models.ForeignKey(GovPerm, on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=1000)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class EmpPerm(models.Model):
    class Meta:
        db_table = 'perm_emp_perm'
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    emp_role = models.ForeignKey(EmpRole, on_delete=models.CASCADE, db_index=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class GovRoleInspire(models.Model):
    class Meta:
        db_table = 'perm_gov_role_inspire'
    PERM_VIEW = 1
    PERM_CREATE = 2
    PERM_REMOVE = 3
    PERM_UPDATE = 4
    PERM_APPROVE = 5
    PERM_REVOKE = 6

    PERM_KIND_CHOICES = (
        (PERM_VIEW, 'ХАРАХ'),
        (PERM_CREATE, 'НЭМЭХ'),
        (PERM_REMOVE, 'ХАСАХ'),
        (PERM_UPDATE, 'ЗАСАХ'),
        (PERM_REVOKE, 'ЦУЦЛАХ'),
        (PERM_APPROVE, 'БАТЛАХ'),
    )

    gov_role = models.ForeignKey(GovRole, on_delete=models.CASCADE, db_index=True)
    perm_kind = models.PositiveIntegerField(choices=PERM_KIND_CHOICES, db_index=True)
    feature_id = models.IntegerField()
    data_type_id = models.IntegerField(null=True)
    property_id = models.IntegerField(null=True)
    geom = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)



class GovPermInspire(models.Model):
    class Meta:
        db_table = 'perm_gov_perm_inspire'
    PERM_VIEW = 1
    PERM_CREATE = 2
    PERM_REMOVE = 3
    PERM_UPDATE = 4
    PERM_APPROVE = 5
    PERM_REVOKE = 6

    PERM_KIND_CHOICES = (
        (PERM_VIEW, 'ХАРАХ'),
        (PERM_CREATE, 'НЭМЭХ'),
        (PERM_REMOVE, 'ХАСАХ'),
        (PERM_UPDATE, 'ЗАСАХ'),
        (PERM_REVOKE, 'ЦУЦЛАХ'),
        (PERM_APPROVE, 'БАТЛАХ'),
    )

    gov_role_inspire = models.ForeignKey(GovRoleInspire, on_delete=models.CASCADE, db_index=True, null=True)
    gov_perm = models.ForeignKey(GovPerm, on_delete=models.CASCADE, db_index=True)
    perm_kind = models.PositiveIntegerField(choices=PERM_KIND_CHOICES, db_index=True)
    feature_id = models.IntegerField()
    data_type_id = models.IntegerField(null=True)
    property_id = models.IntegerField(null=True)
    geom = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class EmpRoleInspire(models.Model):
    class Meta:
        db_table = 'perm_emp_role_inspire'
    PERM_VIEW = 1
    PERM_CREATE = 2
    PERM_REMOVE = 3
    PERM_UPDATE = 4
    PERM_APPROVE = 5
    PERM_REVOKE = 6

    PERM_KIND_CHOICES = (
        (PERM_VIEW, 'ХАРАХ'),
        (PERM_CREATE, 'НЭМЭХ'),
        (PERM_REMOVE, 'ХАСАХ'),
        (PERM_UPDATE, 'ЗАСАХ'),
        (PERM_REVOKE, 'ЦУЦЛАХ'),
        (PERM_APPROVE, 'БАТЛАХ'),
    )

    gov_perm_inspire = models.ForeignKey(GovPermInspire, on_delete=models.CASCADE, db_index=True, null=True)
    emp_role = models.ForeignKey(EmpRole, on_delete=models.CASCADE, db_index=True)

    perm_kind = models.PositiveIntegerField(choices=PERM_KIND_CHOICES, db_index=True)
    feature_id = models.IntegerField()
    data_type_id = models.IntegerField(null=True)
    property_id = models.IntegerField(null=True)
    geom = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)


class EmpPermInspire(models.Model):
    class Meta:
        db_table = 'perm_emp_perm_inspire'
    PERM_VIEW = 1
    PERM_CREATE = 2
    PERM_REMOVE = 3
    PERM_UPDATE = 4
    PERM_APPROVE = 5
    PERM_REVOKE = 6

    PERM_KIND_CHOICES = (
        (PERM_VIEW, 'ХАРАХ'),
        (PERM_CREATE, 'НЭМЭХ'),
        (PERM_REMOVE, 'ХАСАХ'),
        (PERM_UPDATE, 'ЗАСАХ'),
        (PERM_REVOKE, 'ЦУЦЛАХ'),
        (PERM_APPROVE, 'БАТЛАХ'),
    )

    gov_perm_inspire = models.ForeignKey(GovPermInspire, on_delete=models.CASCADE, db_index=True, null=True)
    emp_role_inspire = models.ForeignKey(EmpRoleInspire, on_delete=models.CASCADE, db_index=True, null=True)
    emp_perm = models.ForeignKey(EmpPerm, on_delete=models.CASCADE, db_index=True)
    perm_kind = models.PositiveIntegerField(choices=PERM_KIND_CHOICES, db_index=True)
    feature_id = models.IntegerField()
    data_type_id = models.IntegerField(null=True)
    property_id = models.IntegerField(null=True)
    geom = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='+', null=True)
