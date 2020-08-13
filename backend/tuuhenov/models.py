from django.db import models

# Create your models here.

class TuuhenOv(models.Model):

    class Meta:
        db_table = 'tuuhen_ov'

    burtgel_id = models.PositiveIntegerField()
    aimag = models.CharField(max_length=200)
    duureg = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)


class DGTorolZuil(models.Model):

    class Meta:
        db_table = 'tuuhen_ov_torol_zuil'

    torol_zuil = models.CharField(max_length=200)
    borjin = models.BooleanField(db_index=False)
    gantig = models.BooleanField(db_index=False)
    zanar = models.BooleanField(db_index=False)
    els = models.BooleanField(db_index=False)
    hurmen = models.BooleanField(db_index=False)
    tsahiurlag = models.BooleanField(db_index=False)
    bosol = models.BooleanField(db_index=False)
    shohoin = models.BooleanField(db_index=False)
    oohon = models.BooleanField(db_index=False)
    busad = models.BooleanField(db_index=False)


class DGNer(models.Model):
    class Meta:
        db_table = 'tuuhen_ov_dursgalt_gazriin_ner'
    
    dursgalt_gazriin_ner = models.CharField(max_length=200)
    utm_zone = models.CharField(max_length=200)
    utm_n = models.CharField(max_length=200)
    utm_e = models.CharField(max_length=200)
    lautude_longitude_n = models.CharField(max_length=200)
    lautude_longitude_e = models.CharField(max_length=200)
    alt = models.CharField(max_length=200)


class DGHemjee(models.Model):
    class Meta:
        db_table = 'tuuhen_ov_dursgalt_gazriin_hemjee'
    
    talbai = models.PositiveIntegerField()
    urt = models.PositiveIntegerField()
    orgon = models.PositiveIntegerField()
    ondor = models.PositiveIntegerField()
    zuzaan = models.PositiveIntegerField()
    golch = models.PositiveIntegerField()

    busad_hemjee = models.CharField(max_length=300)
    tooShirheg = models.PositiveIntegerField()
    temdeglel = models.CharField(max_length=1000)


class DGHamrahHureeCoordinat(models.Model):
    class Meta:
        db_table = 'tuuhen_ov_dursgalt_gazriin_hamrah_huree_coordinat'
    
    utm_zone = models.CharField(max_length=200)
    utm_n = models.CharField(max_length=200)
    utm_e = models.CharField(max_length=200)
    lautude_longitude_n = models.CharField(max_length=200)
    lautude_longitude_e = models.CharField(max_length=200)
    alt = models.CharField(max_length=200)
``

class DGHariutssanIrgen(models.Model):
    class Meta:
        db_table = 'tuuhen_ov_hariutssan_irgen'
    
    irgen_check = models.BooleanField(db_index=False)
    temdeglel = models.CharField(max_length=1000)


class DGHamgaalaltiinAngilal(models.Model):
    class Meta:
        db_table = 'tuuhen_ov_hamgaalaltiin_angilal'
    
    angilal = models.CharField(max_length=200)

    bus_togtooh = models.BooleanField(db_index=False)

    
    alt = models.CharField(max_length=200)

    temdeglel = models.CharField(max_length=1000)







    layers = models.ManyToManyField(WMSLayer, through='BundleLayer')
    name = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    is_removeable = models.BooleanField()
    icon = models.ImageField(upload_to='дэд-сан/')

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sort_order = models.PositiveIntegerField()

    layer = models.ForeignKey(WMSLayer, on_delete=models.PROTECT)
    bundle = models.ForeignKey(Bundle, on_delete=models.PROTECT)
    role = models.ForeignKey(Role, on_delete=models.PROTECT, default=5)
    defaultCheck = models.PositiveIntegerField(default=0)
    org = models.ForeignKey('backend_org.Org', on_delete=models.PROTECT, null=True)
    name = models.CharField(max_length=250)
    token = models.CharField(max_length=250, db_index=True)

    wms_layers = models.ManyToManyField(
        'backend_wmslayer.WMSLayer',
        through='backend_govorg.GovOrgWMSLayer',
        related_name='govorgs'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GovOrgWMSLayer(models.Model):
    govorg = models.ForeignKey('backend_govorg.GovOrg', on_delete=models.CASCADE)
    wms_layer = models.ForeignKey('backend_wmslayer.WMSLayer', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
