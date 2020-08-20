from django.shortcuts import render
from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
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
