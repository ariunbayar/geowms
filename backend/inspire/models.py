from django.contrib.gis.db import models

# Create your models here.
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
    order_no = models.IntegerField()
    is_active = models.BooleanField(default=True)
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
    property_id = models.IntegerField()
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


class LPackages(models.Model):
    class Meta:
        db_table = 'l_packages'
        managed = False

    package_id = models.AutoField(primary_key=True)
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


class LValueTypes(models.Model):
    class Meta:
        db_table = 'l_value_types'
        managed = False

    value_type_id = models.AutoField(primary_key=True)
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
    value_date = models.DateTimeField(auto_now=True)
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
    value_date = models.DateTimeField(auto_now=True)
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
    value_date = models.DateTimeField(auto_now=True)
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
    value_date = models.DateTimeField(auto_now=True)
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
    value_date = models.DateTimeField(auto_now=True)
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