from django.db import models

# Create your models here.

class TuuhSoyol:
    managed = False


class TsegPersonal(models.Model):


    name = models.CharField(max_length=300, unique=True)
    bank_unique_number = models.CharField(max_length=300)

    data_id = models.CharField(max_length=300)
    description = models.CharField(max_length=500)
    amount = models.PositiveIntegerField()

    is_success = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    success_at = models.DateTimeField(null=True)
    failed_at = models.DateTimeField(null=True)

    error_message = models.CharField(max_length=500)
    error_code = models.CharField(max_length=100)



    tesgiin_ner = models.CharField(max_length=300, unique=True)
    toviin_dugaar = models.CharField(max_length=300, unique=True)
    trapetsiin_dugaar = models.CharField(max_length=300, unique=True)
    suljeenii_dugaar = models.CharField(max_length=300, unique=True)
    aimag_ner = models.CharField(max_length=300, unique=True)
    sum_ner = models.CharField(max_length=300, unique=True)


    utmx = models.CharField(max_length=300, unique=True)
    utmy = models.CharField(max_length=300, unique=True)
    latlongx = models.CharField(max_length=300, unique=True)
    latlongy = models.CharField(max_length=300, unique=True)

    tseg_oiroos_img_url: '',
    tseg_holoos_img_url: '',



    barishil_tuhai: '',


    bairshil_tseg_oiroos_img_url: '',
    bairshil_tseg_holoos_img_url: '',


    sudalga_or_shine: '',
    hors_shinj_baidal: '',
    date: '',

    hotolson: '',
    alban_tushaal: '',
    alban_baiguullga: '',



    

    file_path1: '',
    file_path2: '',
    bairshil_tseg_holoos_img_url: '',