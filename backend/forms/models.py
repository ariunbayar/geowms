from django.db import models

# Create your models here.
class TuuhSoyol(models.Model):
    dugaar = models.CharField(max_length=100) # Дурсгалт газрын бүртгэлийн дугаар
    date = models.DateTimeField(null=True) # Он,сар,өдөр
    inspireid = models.CharField(max_length=25) #
    too_shirheg = models.CharField(max_length=1000) #	
    aimagname = models.CharField(max_length=50) # Аймаг, Нийслэл	
    sumname = models.CharField(max_length=50) # Сум, Дүүрэг
    burtgegch = models.CharField(max_length=100) #
    created_at = models.DateTimeField(auto_now_add=True)


class DursgaltGazar(models.Model):

    tuuh_soyl = models.ForeignKey(TuuhSoyol, on_delete=models.PROTECT)
    latlong = models.CharField(max_length=100) #
    utm = models.CharField(max_length=100) #
    dursgal = models.CharField(max_length=100) # 
    dursgal2 = models.CharField(max_length=100) #
    descriptio = models.CharField(max_length=500) #	Дурсгалт газрын шинж чанар, хэлбэр хэмжээ, тоо ширхэг, хийсэн матерал, хадгалалт хамгаалалтын байдал зэргийг тоочин тэмдэглэл бичнэ.
    type1 = models.CharField(max_length=100) #    Төрөл зүйл
    type2 = models.CharField(max_length=100) #    Төрөл зүйл
    stone = models.CharField(max_length=100) # Чулуулгын төрөл
    length = models.CharField(max_length=100) #
    width = models.CharField(max_length=20) #
    hight = models.CharField(max_length=20) #
    depth = models.CharField(max_length=20) #
    meridian = models.CharField(max_length=20) #
    other = models.CharField(max_length=50) #
    number = models.CharField(max_length=100) #
    hemjee_comment = models.CharField(max_length=1000)

    protection_irgen = models.CharField(max_length=100) # Дурсгалт газрын гэрээгээр хариуцуулж байгаа иргэн (малчин) байгаа эсэх.
    protection_irgen_commnent = models.CharField(max_length=1000) # Дурсгалт газрын гэрээгээр хариуцуулж байгаа иргэн (малчин) байгаа эсэх.
    
    protection = models.CharField(max_length=100) # Хамгаалалтын ангилал.
    protecti_1 = models.CharField(max_length=100) # Хамгаалалтын бүс тогтоох шаардлагатай эсэх.

    tus = models.CharField(max_length=100) #
    tus_comment = models.CharField(max_length=100) #

    yaral = models.CharField(max_length=100) #
    yaral_comment = models.CharField(max_length=100) #
    
    omchlol = models.CharField(max_length=100) #
    omchlol_comment = models.CharField(max_length=100) #

    malts = models.CharField(max_length=100) #
    malts_comment = models.CharField(max_length=100) #

    human = models.CharField(max_length=100) #
    human_comment = models.CharField(max_length=100) #

    natural = models.CharField(max_length=100) #
    natural_comment = models.CharField(max_length=100) #

    recover = models.CharField(max_length=100) #Сэргээн засварласан эсэх.
    recover_comment = models.CharField(max_length=100) #

    recover1 = models.CharField(max_length=100) #Сэргээн засварлах эсэх.
    recover1_comment = models.CharField(max_length=100) #

    protecti_2 = models.CharField(max_length=100) # Хамгаалалтын зэрэг өөрчлөх санал.
    protecti_2_comment = models.CharField(max_length=100) #

    hashaa = models.CharField(max_length=100)
    hashaa_comment = models.CharField(max_length=100)

    saravch = models.CharField(max_length=100)
    saravch_comment = models.CharField(max_length=100)

    hayg = models.CharField(max_length=100)
    hayg_comment = models.CharField(max_length=100)

    other1 = models.CharField(max_length=100) #
    utm = models.CharField(max_length=100) #
    ndd = models.CharField(max_length=100)
    nmm = models.CharField(max_length=100) #
    nss = models.CharField(max_length=100) #
    edd = models.CharField(max_length=100)
    emm = models.CharField(max_length=100) #
    ess = models.CharField(max_length=100) #
    x = models.CharField(max_length=25) #
    y = models.CharField(max_length=25) #

    utm_zone = models.CharField(max_length=25) #
    utm_x = models.CharField(max_length=25) #
    utm_y = models.CharField(max_length=25) #
    y = models.CharField(max_length=25) #

    created_at = models.DateTimeField(auto_now_add=True)


class TuuhSoyolHuree(models.Model):
    tuuh_soyl = models.ForeignKey(TuuhSoyol, on_delete=models.PROTECT)
    geom = models.CharField(max_length=150)
    latlong = models.CharField(max_length=100) #
    utm = models.CharField(max_length=100) #
    utmx = models.CharField(max_length=100) #
    utmy = models.CharField(max_length=100) #
    ndd = models.CharField(max_length=100) #
    nmm = models.CharField(max_length=100) #
    nss = models.CharField(max_length=100) #
    edd = models.CharField(max_length=100) #
    emm = models.CharField(max_length=100) #
    ess = models.CharField(max_length=100) #
    x = models.CharField(max_length=100) #
    y = models.CharField(max_length=100) #
    alt = models.CharField(max_length=100) #
    created_at = models.DateTimeField(auto_now_add=True)


class TuuhSoyolAyuulHuree(models.Model):
    tuuh_soyl = models.ForeignKey(TuuhSoyol, on_delete=models.PROTECT)
    geom = models.CharField(max_length=150)
    latlong = models.CharField(max_length=100) #
    utm = models.CharField(max_length=100) #
    utmx = models.CharField(max_length=100) #
    utmy = models.CharField(max_length=100) #
    ndd = models.CharField(max_length=100) #
    nmm = models.CharField(max_length=100) #
    nss = models.CharField(max_length=100) #
    edd = models.CharField(max_length=100) #
    emm = models.CharField(max_length=100) #
    ess = models.CharField(max_length=100) #
    x = models.CharField(max_length=100) #
    y = models.CharField(max_length=100) #
    alt = models.CharField(max_length=100) #
    created_at = models.DateTimeField(auto_now_add=True)


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
