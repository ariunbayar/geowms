# from django.db import models
from django.contrib.gis.db import models

from backend.org.models import Org, Employee

class TuuhSoyol(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    dugaar = models.CharField(max_length=100)
    date = models.DateTimeField(null=True)
    inspireid = models.CharField(max_length=25)
    too_shirheg = models.PositiveIntegerField()
    aimagname = models.CharField(max_length=30)
    sumname = models.CharField(max_length=30)
    burtgegch = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'tuuhsoyol'
        managed = False


class TuuhSoyolPoint(models.Model):
    tuuh_soyl = models.CharField(max_length=100)
    dursgal = models.CharField(max_length=100)
    dursgal2 = models.CharField(max_length=100)
    descriptio = models.CharField(max_length=150)
    type1 = models.CharField(max_length=200)
    type2 = models.CharField(max_length=200)
    stone = models.CharField(max_length=50)
    length = models.CharField(max_length=100)
    width = models.CharField(max_length=20)
    area = models.CharField(max_length=20)
    width = models.CharField(max_length=20)
    hight = models.CharField(max_length=20)
    depth = models.CharField(max_length=20)
    meridian = models.CharField(max_length=20)
    other = models.CharField(max_length=50)
    number = models.BigIntegerField()
    hemjee_comment = models.CharField(max_length=500)
    protection_irgen = models.CharField(max_length=100)
    protection_irgen_commnent = models.CharField(max_length=1000)
    protection = models.CharField(max_length=100)
    protecti_1 = models.CharField(max_length=100)
    tus = models.CharField(max_length=10)
    tus_comment = models.CharField(max_length=500)
    yaral = models.CharField(max_length=100)
    yaral_comment = models.CharField(max_length=500)
    omchlol = models.CharField(max_length=100)
    omchlol_comment = models.CharField(max_length=500)
    malts = models.CharField(max_length=100)
    malts_comment = models.CharField(max_length=500)
    human = models.CharField(max_length=100)
    human_comment = models.CharField(max_length=500)
    natural = models.CharField(max_length=100)
    natural_comment = models.CharField(max_length=500)
    recover = models.CharField(max_length=100)
    recover_comment = models.CharField(max_length=500)
    recover1 = models.CharField(max_length=100)
    recover1_comment = models.CharField(max_length=500)
    protecti_2 = models.CharField(max_length=100)
    protecti_2_comment = models.CharField(max_length=500)
    hashaa = models.CharField(max_length=100)
    hashaa_comment = models.CharField(max_length=500)
    saravch = models.CharField(max_length=100)
    saravch_comment = models.CharField(max_length=500)
    hayg = models.CharField(max_length=100)
    hayg_comment = models.CharField(max_length=500)
    other1 = models.CharField(max_length=100)
    x = models.CharField(max_length=50)
    y = models.CharField(max_length=50)
    ondor = models.CharField(max_length=101)
    created_at = models.DateTimeField(auto_now_add=True)
    geom = models.PointField(srid=4326)
    class Meta:
        db_table = 'tuuhsoyolpoint'
        managed = False


class TuuhSoyolHuree(models.Model):
    tuuh_soyl = models.CharField(max_length=100)
    tuuh_soyl_huree_id = models.PositiveIntegerField()
    x = models.CharField(max_length=100)
    y = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'tuuhsoyolhuree'


class TuuhSoyolHureePol(models.Model):
    tuuh_soyl = models.CharField(max_length=100)
    tuuh_soyl_huree_id = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    geom = models.PolygonField(srid=4326)
    class Meta:
        db_table = 'tuuhsoyolhureepol'
        managed = False


class TuuhSoyolAyuulHuree(models.Model):
    tuuh_soyl = models.CharField(max_length=100)
    x = models.CharField(max_length=100)
    y = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'tuuhsoyolayuulhuree'

class TuuhSoyolAyuulHureePol(models.Model):
    tuuh_soyl = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    geom = models.PolygonField(srid=4326)
    class Meta:
        db_table = 'tuuhsoyolayuulhureepol'
        managed = False


class TsegPersonal(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    suljeenii_torol = models.CharField(max_length=20)
    latlongx = models.CharField(max_length=100)
    latlongy = models.CharField(max_length=100)
    tseg_oiroos_img_url = models.ImageField(upload_to='tseg-personal/')
    tseg_holoos_img_url = models.ImageField(upload_to='tseg-personal/')
    barishil_tuhai = models.CharField(max_length=1000)
    bairshil_tseg_oiroos_img_url = models.ImageField(upload_to='tseg-personal-img/')
    bairshil_tseg_holoos_img_url = models.ImageField(upload_to='tseg-personal-img/')
    sudalga_or_shine = models.CharField(max_length=30)
    hors_shinj_baidal = models.CharField(max_length=200)
    date = models.DateTimeField(null=True)
    hotolson = models.CharField(max_length=100)
    file_path1 = models.FileField(upload_to='tseg-personal-file/')
    file_path2 = models.FileField(upload_to='tseg-personal-file/')
    alban_tushaal = models.CharField(max_length=200)
    alban_baiguullga = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)


class TsegUstsan(models.Model):
    email = models.CharField(max_length=300)
    name = models.CharField(max_length=300)
    alban_tushaal = models.CharField(max_length=300)
    phone = models.CharField(max_length=50)
    tseg_id = models.CharField(max_length=300)
    oiroltsoo_bairlal = models.CharField(max_length=300)
    evdersen_baidal = models.CharField(max_length=300)
    shaltgaan = models.CharField(max_length=1000)
    img_holoos = models.ImageField(upload_to='tseg-ustsan/')
    img_oiroos = models.ImageField(upload_to='tseg-ustsan/')
    img_baruun = models.ImageField(upload_to='tseg-ustsan/')
    img_zuun = models.ImageField(upload_to='tseg-ustsan/')
    img_hoino = models.ImageField(upload_to='tseg-ustsan/')
    img_omno = models.ImageField(upload_to='tseg-ustsan/')
    sergeeh_sanal = models.CharField(max_length=100)
    gps_hemjilt = models.BooleanField(db_index=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_removed = models.BooleanField(default=False)


class TsegUstsanLog(models.Model):
    log_id = models.CharField(max_length=100)
    img_holoos = models.ImageField(upload_to='tseg-ustsan/')
    img_oiroos = models.ImageField(upload_to='tseg-ustsan/')
    img_baruun = models.ImageField(upload_to='tseg-ustsan/')
    img_zuun = models.ImageField(upload_to='tseg-ustsan/')
    img_hoino = models.ImageField(upload_to='tseg-ustsan/')
    img_omno = models.ImageField(upload_to='tseg-ustsan/')
    created_at = models.DateTimeField(auto_now_add=True)


class Mpoint1(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint1'


class Mpoint2(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint2'


class Mpoint3(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint3'


class Mpoint4(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint4'


class Mpoint5(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint5'


class Mpoint6(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint6'

class Mpoint7(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint7'


class Mpoint8(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint8'


class Mpoint9(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint9'


class Mpoint10(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.PointField(srid=4326)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint10'


class Mpoint_view(models.Model):
    objectid = models.CharField(max_length=4)
    point_id =  models.CharField(max_length=4)
    ondor = models.FloatField()
    point_name = models.CharField(max_length=50)
    pid = models.CharField(max_length=20)
    point_class = models.BigIntegerField()
    mclass = models.BigIntegerField()
    point_class_name = models.CharField(max_length=100)
    point_class_name = models.CharField(max_length=100)
    ondor_type = models.CharField(max_length=100)
    center_typ = models.CharField(max_length=10)
    aimag = models.CharField(max_length=50)
    sum = models.CharField(max_length=50)
    sheet1 = models.CharField(max_length=1)
    sheet2 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    sheet3 = models.DecimalField(blank=True, max_digits=20,  decimal_places=10)
    geom = models.DecimalField(max_digits=300,  decimal_places=10)
    t_type = models.CharField(max_length=100)
    class Meta:
        managed = False
        db_table = 'mpoint_view'


class TsegRequest(models.Model):

    class Meta:
        db_table = 'tseg_request'

    STATE_NEW = 1
    STATE_REJECT = 2
    STATE_APPROVE = 3

    STATE_CHOICES = (
        (STATE_NEW, 'ШИНЭ'),
        (STATE_REJECT, 'ТАТГАЛЗСАН'),
        (STATE_APPROVE, 'ЗӨВШӨӨРСӨН'),
    )

    KIND_CREATE = 1
    KIND_UPDATE = 2
    KIND_DELETE = 3

    KIND_CHOICES = (
        (KIND_CREATE, 'ҮҮССЭН'),
        (KIND_UPDATE, 'ЗАССАН'),
        (KIND_DELETE, 'УСТГАСАН'),
    )

    old_geo_id = models.CharField(max_length=100, null=True)
    new_geo_id = models.CharField(max_length=100, null=True)
    theme_id = models.IntegerField()
    package_id = models.IntegerField()
    feature_id = models.IntegerField()
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='+', null=True)
    org = models.ForeignKey(Org, on_delete=models.PROTECT)
    state = models.PositiveIntegerField(choices=STATE_CHOICES, db_index=True, null=True)
    kind = models.PositiveIntegerField(choices=KIND_CHOICES, db_index=True, null=True)
    values = models.TextField(null=True)
    form_json = models.TextField(null=True)
    geo_json = models.TextField(null=True)
    pdf_id = models.CharField(max_length=100, null=True)

    point_id = models.CharField(max_length=100, null=True)
    point_name = models.CharField(max_length=100, null=True)
    point_class = models.CharField(max_length=100, null=True)
    point_type = models.CharField(max_length=100, null=True)
    aimag = models.CharField(max_length=100, null=True)
    sum = models.CharField(max_length=100, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
