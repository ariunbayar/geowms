from django.db import models

# Create your models here.

# class TuuhSoyol:
#     managed = False


class TsegPersonal(models.Model):


    tesgiin_ner = models.CharField(max_length=50)
    toviin_dugaar = models.CharField(max_length=100)
    trapetsiin_dugaar = models.CharField(max_length=100)
    suljeenii_torol = models.CharField(max_length=20)

    aimag_name = models.CharField(max_length=30)
    sum_name = models.CharField(max_length=30)

    utmx = models.CharField(max_length=50)
    utmy = models.CharField(max_length=50)
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
