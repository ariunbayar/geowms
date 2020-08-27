from django.shortcuts import render
from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from .models import TsegUstsan, TsegPersonal, TuuhSoyol, DursgaltGazar
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile, UploadedFile

# Create your models here.


@require_POST
@ajax_required
def create(request, payload):
    date = None
    if request.POST.get('date'):
        date = request.POST.get('date')
    form_datas = payload.get('form_datas')
    TuuhSoyol.objects.create(dugaar=form_datas['tuuhin_ov_register_id'],
                            date=date,
                            inspireid="geo",
                            too_shirheg=form_datas['too_shirheg'],
                            aimagname=form_datas['tuuhin_ov_aimag'],
                            sumname=form_datas['tuuhin_ov_sum_duureg'],
                            burtgegch=form_datas['burtgegch']
                            )

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def update(request, payload):
    date = None
    if request.POST.get('date'):
        date = request.POST.get('date')
    form_datas = payload.get('form_datas')

    TuuhSoyol.objects.filter(id=form_datas['id']).update(dugaar=form_datas['tuuhin_ov_register_id'],
                            date=date,
                            inspireid="geo",
                            too_shirheg=form_datas['too_shirheg'],
                            aimagname=form_datas['tuuhin_ov_aimag'],
                            sumname=form_datas['tuuhin_ov_sum_duureg'],
                            burtgegch=form_datas['burtgegch']
                            )

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def about(request, payload):
    ids = payload.get('id')
    tuuh_soyl = []
    for tuuh in TuuhSoyol.objects.filter(id=ids):
        tuuh_soyl.append({
            'id': tuuh.id,
            'dugaar': tuuh.dugaar,
            'date': tuuh.date,
            'inspireid': tuuh.inspireid,
            'too_shirheg': tuuh.too_shirheg,
            'aimagname': tuuh.aimagname,
            'sumname': tuuh.sumname,
            'burtgegch': tuuh.burtgegch,
            'created_at': tuuh.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'tuuh_soyl': tuuh_soyl})


@require_GET
@ajax_required
def all(request):

    tuuh_soyl = []
    for tuuh in TuuhSoyol.objects.all():
        tuuh_soyl.append({
            'id': tuuh.id,
            'dugaar': tuuh.dugaar,
            'date': tuuh.date,
            'inspireid': tuuh.inspireid,
            'too_shirheg': tuuh.too_shirheg,
            'aimagname': tuuh.aimagname,
            'sumname': tuuh.sumname,
            'burtgegch': tuuh.burtgegch,
            'created_at': tuuh.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'tuuh_soyl': tuuh_soyl})


@require_POST
@ajax_required
def dursgaltGazarCreate(request, payload):
    form_datas = payload.get('form_datas')

    get_object_or_404(TuuhSoyol, pk=form_datas['tuuh_soyl_id'])

    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatllx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatlly'])

    cursor = connections['postgis_db'].cursor()
    cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])

    FID = 1
    register_id = form_datas['tuuhin_ov_register_id']

    dursgal = form_datas['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'

    aimagname = form_datas['tuuhin_ov_aimag']
    sumname = form_datas['tuuhin_ov_sum_duureg']

    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']

    type1 = form_datas['torol_zuil_torol_zuil'] + ' ' + type2
    
    stone = form_datas['torol_zuiltorol_zuil_name']
    geom = cursor.fetchone()
    length =form_datas['hemjee_urt']
    width =form_datas['hemjee_orgon']
    hight =form_datas['hemjee_ondor']
    depth =form_datas['hemjee_zuzaan']
    meridian =form_datas['hemjee_golch']

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
    
    if form_datas['dgh_hayg_tailbar_eseh_hayg']:
        hashaa = 'Тийм'
    else:
        hashaa = 'Үгүй'
    if form_datas['dgh_hashaa_baigaa_eseh_hashaa']:
        saravch = 'Тийм'
    else:
        saravch = 'Үгүй'

    if form_datas['dgh_hayg_tailbar_eseh_hayg']:
        hayg = 'Тийм'
    else:
        hayg = 'Үгүй'

    if form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal']:
        omchlol = 'Тийм'
    else:
        omchlol = 'Үгүй'
    if form_datas['dg_ezen_dursgalt_gazar_ezen']:
        protection_irgen = 'Тийм'
    else:
        protection_irgen = 'Үгүй'

    DursgaltGazar.objects.create(   
                                tuuh_soyl = tuuhSoyol, geom = geom, 
                                latlong = latlong, utm = utm, dursgal = dursgal, 
                                dursgal2 = dursgal2, descriptio = dursgal2, 
                                type1 = form_datas['torol_zuil_torol_zuil_tree'], 
                                type2 = form_datas['torol_zuil_torol_zuil_tree2'], 
                                stone = stone, length = length, 
                                width = width, hight = hight, depth = depth, 
                                meridian = meridian, other = other, 
                                number = number, hemjee_comment = form_datas['hemjee_temdeglel'], 
                                protection_irgen = protection_irgen,
                                protection_irgen_commnent = form_datas['dg_ezen_temdeglel'],
                                protection = protection, protecti_1 = protecti_1,
                                tus = tus, tus_comment = form_datas['dgh_tusgai_temdeglel'], 
                                yaral = yaral, yaral_comment = form_datas['dgh_yaaraltai_temdeglel'], 
                                omchlol = omchlol, omchlol_comment = form_datas['dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'], 
                                malts = malts, malts_comment = form_datas['dgh_maltan_sudaltan_temdeglel'], 
                                human = human, human_comment = form_datas['dgh_gemtliin_temdeglel'], 
                                natural = natural, natural_comment = form_datas['dgh_baigaliin_huchin_zuil_temdeglel'], 
                                recover = recover, recover_comment = form_datas['dgh_sergeen_zasvarlasan_eseh_temdeglel'], 
                                recover1 = recover1,recover1_comment = form_datas['dgh_sergeen_zasvarlah_eseh_temdeglel'], 
                                protecti_2 = protecti_2, protecti_2_comment = form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'], 
                                hashaa = hashaa, hashaa_comment = form_datas['dgh_hashaa_baigaa_eseh_temdeglel'], 
                                saravch = saravch, saravch_comment = form_datas['dgh_saravchtai_eseh_temdeglel'], 
                                hayg = hayg, hayg_comment = form_datas['dgh_hayg_tailbar_eseh_temdeglel'], 
                                other1 = other1,
                                ndd = ndd, nmm = nmm,
                                nss = nss, edd = edd, emm = emm , ess = ess, x=x, y=y,
                                utm_zone= form_datas['torol_zuil_dursgalt_gazriin_coordinatutm'],
                                utm_x= form_datas['torol_zuil_dursgalt_gazriin_coordinatx'],
                                utm_y= form_datas['torol_zuil_dursgalt_gazriin_coordinaty'],
                                )

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def dursgaltGazarAll(request, payload):
    form_data = []
    for data in DursgaltGazar.objects.filter(tuuh_soyl_id = payload.get('id')):
        form_data.append({
            'id': data.id,
            'dursgal': data.dursgal,
            'tuuh_soyl_id': data.tuuh_soyl_id,
            'geom': data.geom,
            'latlong': data.latlong,
            'utm': data.utm,
            'type': data.type1,
            'stone': data.stone,
            'dursgal': data.dursgal,
            'protection': data.protection,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'form_data': form_data})


@require_POST
@ajax_required
def dursgaltGazarAbout(request, payload):
    get_object_or_404(DursgaltGazar, pk=payload.get('id'))
    form_data = []
    for data in DursgaltGazar.objects.filter(pk = payload.get('id')):
        form_data.append({
            'geom': data.geom,
            'latlong': data.latlong,
            'utm': data.utm,
            'dursgal': data.dursgal, 
            'dursgal2': data.dursgal2,
            'descriptio': data.descriptio,
            'type1': data.type1,  
            'type2': data.type2,  
            'stone': data.stone, 
            'length': data.length,
            'width': data.width,
            'hight': data.hight,
            'depth': data.depth,
            'meridian': data.meridian,
            'other': data.other,
            'number': data.number,
            'hemjee_comment': data.hemjee_comment,

            'protection_irgen': data.protection_irgen,
            'protection_irgen_commnent': data.protection_irgen_commnent,
            
            'protection': data.protection, 
            'protecti_1': data.protecti_1, 

            'tus': data.tus,
            'tus_comment': data.tus_comment,

            'yaral': data.yaral,
            'yaral_comment': data.yaral_comment,
            
            'omchlol': data.omchlol,
            'omchlol_comment': data.omchlol_comment,

            'malts': data.malts,
            'malts_comment': data.malts_comment,

            'human': data.human,
            'human_comment': data.human_comment,

            'natural': data.natural,
            'natural_comment': data.natural_comment,

            'recover': data.recover,
            'recover_comment': data.recover_comment,

            'recover1': data.recover1,
            'recover1_comment': data.recover1_comment,

            'protecti_2': data.protecti_2, 
            'protecti_2_comment': data.protecti_2_comment,

            'hashaa': data.hashaa,
            'hashaa_comment': data.hashaa_comment,

            'saravch': data.saravch,
            'saravch_comment': data.saravch_comment,

            'hayg': data.hayg,
            'hayg_comment': data.hayg_comment,

            'other1': data.other1,
            'x': data.x,
            'y': data.y,

            'utm_zone': data.utm_zone,
            'utm_x': data.utm_x,
            'utm_y': data.utm_y,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    print(form_data)
    return JsonResponse({'form_data': form_data})


@require_POST
@ajax_required
def dursgaltGazarRemove(request, payload):

    pk = payload.get('id')
    tseg_personal = get_object_or_404(DursgaltGazar, pk=pk)
    tseg_personal.delete()

    return JsonResponse({'success': True})


@require_GET
@ajax_required
def tsegPersonalAll(request):

    tseg_personal = []
    for tseg in TsegPersonal.objects.all():
          tseg_personal.append({
            'id': tseg.id,
            'tesgiin_ner': tseg.tesgiin_ner,
            'toviin_dugaar': tseg.toviin_dugaar,
            'trapetsiin_dugaar': tseg.trapetsiin_dugaar,
            'suljeenii_torol': tseg.suljeenii_torol,
            'aimag_name': tseg.aimag_name,
            'sum_name': tseg.sum_name,
            'utmx': tseg.utmx,
            'utmy': tseg.utmy,
            'latlongx': tseg.latlongx,
            'latlongy': tseg.latlongy,
        })
    return JsonResponse({'tseg_personal': tseg_personal})

@require_POST
@ajax_required
def tsegPersonalRemove(request, payload):

    pk = payload.get('id')
    tseg_personal = get_object_or_404(TsegPersonal, pk=pk)

    tseg_personal.tseg_oiroos_img_url.delete(save=False)
    tseg_personal.tseg_holoos_img_url.delete(save=False)
    tseg_personal.bairshil_tseg_oiroos_img_url.delete(save=False)
    tseg_personal.bairshil_tseg_holoos_img_url.delete(save=False)

    tseg_personal.file_path1.delete(save=False)
    tseg_personal.file_path2.delete(save=False)
    tseg_personal.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegPersonal(request):
    tseg_oiroos_img_url = None
    tseg_holoos_img_url = None
    bairshil_tseg_oiroos_img_url = None
    bairshil_tseg_holoos_img_url = None
    file1 = None
    file2 = None
    date = None
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
    if not request.POST.get('file1'):
        file1 = request.FILES['file1']
    if not request.POST.get('file2'):
        file2 = request.FILES['file2']
    if request.POST.get('date'):
        date = request.POST.get('date')

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
                date= date,
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

    img_holoos = None
    img_oiroos = None
    img_baruun = None
    img_zuun = None
    img_hoino = None
    img_omno = None

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


