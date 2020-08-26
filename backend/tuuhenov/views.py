from django.shortcuts import render
from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from .models import TsegUstsan, TsegPersonal
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile, UploadedFile

# Create your models here.


@require_POST
@ajax_required
def create(request, payload):

    query = connections['postgis_db'].cursor()

    form_datas = payload.get('form_datas')
    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatllx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatlly'])

    cursor = connections['postgis_db'].cursor()
    cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])

    FID = 1
    register_id = form_datas['tuuhin_ov_register_id']

    dursgal = form_datas['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = "dursgal2"

    aimagname = form_datas['tuuhin_ov_aimag']
    sumname = form_datas['tuuhin_ov_sum_duureg']

    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']

    type1 = form_datas['torol_zuil_torol_zuil'] + ' ' + type2
    
    stone = form_datas['torol_zuiltorol_zuil_name']
    geom = cursor.fetchone()
    length = str(form_datas['hemjee_urt']) + 'м'
    width = str(form_datas['hemjee_orgon']) + 'м'
    hight = str(form_datas['hemjee_ondor']) + 'м'
    depth = str(form_datas['hemjee_zuzaan']) + 'м'
    meridian = str(form_datas['hemjee_golch']) + 'м'

    other = form_datas['hemjee_busad_hemjee']

    number = form_datas['hemjee_too_shirheg']
    protection = form_datas['dgh_angilal']

    if form_datas['dgh_bus_togtooh_shaardlaga']:
        protecti_1 = 'Тийм'
    else:
        protecti_1 = 'Үгүй'

    if form_datas['dgh_tusgai_hamgaalalt']:
        tus = 'Тийм'
    else:
        tus = 'Үгүй'

    if form_datas['dgh_yaaraltai_hamgaalalt']:
        yaral = 'Тийм'
    else:
        yaral = 'Үгүй'

    if form_datas['dgh_maltan_sudaltan_hamgaalalt']:
        malts = 'Тийм'
    else:
        malts = 'Үгүй'

    human = ''
    for hun in form_datas['dgh_gemtliin_all']:
        human = human + hun + ', '

    natural = ''
    for natur in form_datas['dgh_baigaliin_huchin_zuil_all']:
        natural = natural + natur + ', '

    if form_datas['dgh_sergeen_zasvarlasan_eseh_hamgaalalt']:
        recover = 'Тийм'
    else:
        recover = 'Үгүй'

    if form_datas['dgh_sergeen_zasvarlasan_eseh_todorhoi_bish']:
        recover1 = 'Тийм'
    else:
        recover1 = 'Үгүй'

    if form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal']:
        protecti_2 = 'Тийм'
    else:
        protecti_2 = 'Үгүй'

    descriptio = form_datas['torol_zuil_todorhoilolt']
    other1 = form_datas['last_busad_temdeglel']
    
    ndd = int(x)
    nmm = int((x - ndd) * 60)
    nss = int((((x - ndd) * 60) - nmm) * 60)
    edd = int(y)
    emm = int((y - edd) * 60)
    ess = int((((y - edd) * 60) - emm) * 60)

    utm = form_datas['torol_zuil_dursgalt_gazriin_coordinatutm']  + ' N' + str(form_datas['torol_zuil_dursgalt_gazriin_coordinatx']) + ' E' + str(form_datas['torol_zuil_dursgalt_gazriin_coordinaty'])
    latlong = 'N' + str(ndd) + ' ' + str(nmm) + ' ' + str(nss)

    query.execute(''' INSERT INTO public."TuuhSoyol"( geom, inspireid, descriptio, dursgal, dursgal2, aimagname, sumname, type, stone, latlong, utm, length, width, hight, depth, meridian, other,"number", protection, protecti_1, tus, yaral, malts, human, "natural", recover, recover1, protecti_2, other1, ndd, nmm, nss, edd, emm, ess, x, y, dugaar) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''', 
                                                [geom, register_id, descriptio, dursgal, dursgal2, aimagname, sumname, type1, stone, latlong, utm ,length, width, hight, depth, meridian, other, number, protection, protecti_1, tus, yaral, malts, human, natural, recover, recover1, protecti_2, other1, ndd, nmm, nss, edd, emm, ess, x, y, register_id])

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegPersonal(request):

    tseg_oiroos_img_url = ''
    tseg_holoos_img_url = ''
    bairshil_tseg_oiroos_img_url = ''
    bairshil_tseg_holoos_img_url = ''
    file1 = ''
    file2 = ''
    if  request.POST.get('tseg_oiroos_img_url'):
        [image_x2] = resize_b64_to_sizes( request.POST.get('tseg_oiroos_img_url'), [(1024, 1080)])
        tseg_oiroos_img_url = SimpleUploadedFile('img.png', image_x2)
    if  request.POST.get('tseg_holoos_img_url'):
        [image_x2] = resize_b64_to_sizes( request.POST.get('tseg_holoos_img_url'), [(1024, 1080)])
        tseg_holoos_img_url = SimpleUploadedFile('img.png', image_x2)
    if  request.POST.get('bairshil_tseg_oiroos_img_url'):
        [image_x2] = resize_b64_to_sizes( request.POST.get('bairshil_tseg_oiroos_img_url'), [(1024, 1080)])
        bairshil_tseg_oiroos_img_url = SimpleUploadedFile('img.png', image_x2)
    if  request.POST.get('bairshil_tseg_holoos_img_url'):
        [image_x2] = resize_b64_to_sizes( request.POST.get('bairshil_tseg_holoos_img_url'), [(1024, 1080)])
        bairshil_tseg_holoos_img_url = SimpleUploadedFile('img.png', image_x2)
    if request.FILES['file1']:
        file1 = request.FILES['file1']
    if request.FILES['file1']:
        file2 = request.FILES['file2']

    TsegPersonal.objects.create(
                tesgiin_ner= request.POST.get('tesgiin_ner'),
                toviin_dugaar= request.POST.get('toviin_dugaar'),
                trapetsiin_dugaar= request.POST.get('trapetsiin_dugaar'),
                suljeenii_torol= request.POST.get('suljeenii_dugaar'),
                aimag_name= request.POST.get('aimag_name'),
                sum_name= request.POST.get('sum_name'),
                utmx= request.POST.get('utmx'),
                utmy= request.POST.get('utmy'),
                latlongx= request.POST.get('latlongx'),
                latlongy= request.POST.get('latlongy'),
                tseg_oiroos_img_url= tseg_oiroos_img_url,
                tseg_holoos_img_url= tseg_holoos_img_url,
                barishil_tuhai= request.POST.get('barishil_tuhai'),
                bairshil_tseg_oiroos_img_url= bairshil_tseg_oiroos_img_url,
                bairshil_tseg_holoos_img_url= bairshil_tseg_holoos_img_url,
                sudalga_or_shine= request.POST.get('sudalga_or_shine'),
                hors_shinj_baidal= request.POST.get('hors_shinj_baidal'),
                # date= request.POST.get('date'),
                hotolson= request.POST.get('hotolson'),
                file_path1= file1,
                file_path2= file2,
                alban_tushaal= request.POST.get('alban_tushaal'),
                alban_baiguullga= request.POST.get('alban_baiguullga'),
                                )

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegUstsan(request, payload):
    img_holoos = ''
    img_oiroos = ''
    img_baruun = ''
    img_zuun = ''
    img_hoino = ''
    img_omno = ''

    form_datas = payload.get('form_datas')

    if form_datas['zurag_hol']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_hol'], [(1024, 1080)])
        img_holoos = SimpleUploadedFile('img.png', image_x2)
    if form_datas['zurag_oir']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_oir'], [(1024, 1080)])
        img_oiroos = SimpleUploadedFile('img.png', image_x2)
    if form_datas['zurag_baruun']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_baruun'], [(1024, 1080)])
        img_baruun = SimpleUploadedFile('img.png', image_x2)
    if form_datas['zurag_zuun']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_zuun'], [(1024, 1080)])
        img_zuun = SimpleUploadedFile('img.png', image_x2)
    if form_datas['zurag_hoid']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_hoid'], [(1024, 1080)])
        img_hoino = SimpleUploadedFile('img.png', image_x2)
    if form_datas['zurag_omno']:
        [image_x2] = resize_b64_to_sizes(form_datas['zurag_omno'], [(1024, 1080)])
        img_omno = SimpleUploadedFile('img.png', image_x2)
        
    TsegUstsan.objects.create(email= form_datas['email'],
                            name= form_datas['baiguulaga'],
                            alban_tushaal= form_datas['alban_tushaal'],
                            phone= form_datas['utas'],
                            tseg_id= form_datas['tsegiin_dugaar'],
                            oiroltsoo_bairlal= form_datas['oiroltsoo_bairlal'],
                            evdersen_baidal= form_datas['evdersen_baidal'],
                            shaltgaan= form_datas['nohtsol_baidal'],
                            img_holoos=img_holoos,
                            img_oiroos= img_oiroos,
                            img_baruun= img_baruun,
                            img_zuun= img_zuun,
                            img_hoino= img_hoino,
                            img_omno= img_omno,
                            sergeeh_sanal= form_datas['sergeeh_sanal'],
                            gps_hemjilt= form_datas['hemjilt_hiih_bolomj'],
                                    )

    return JsonResponse({'success': True})
