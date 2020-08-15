from django.shortcuts import render
from django.db import connection
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
# Create your models here.


@require_POST
@ajax_required
def create(request, payload):

    form_datas = payload.get('form_datas')
    lat = form_datas['torol_zuil_dursgalt_gazriin_coordinatx']
    long_ = form_datas['torol_zuil_dursgalt_gazriin_coordinaty']
    
    cursor = connection.cursor()
    cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [ lat, long_])

    FID = 1
    print(FID)

    Бүртг = form_datas['tuuhin_ov_register_id']
    print(Бүртг)

    Дурсг = form_datas['torol_zuil_dursgalt_gazriin_ner']
    print(Дурсг)
    # Дурс_1 = 

    Аймаг = form_datas['tuuhin_ov_aimag']
    print(Аймаг)
    Сум = form_datas['tuuhin_ov_sum_duureg']
    print(Сум)
    Төрөл = form_datas['torol_zuil_torol_zuil'] + form_datas['torol_zuil_torol_zuil_tree'] + form_datas['torol_zuil_torol_zuil_tree2']

    print(Төрөл)
    Чулуу = form_datas['torol_zuiltorol_zuil_name']
    print(Чулуу)
    # Lat_Long = 
    UTM = cursor.fetchone()
    print(UTM)

    Урт__м = form_datas['hemjee_urt']
    print(Урт__м)
    Өргөн = form_datas['hemjee_orgon']
    print(Өргөн)
    Өндөр = form_datas['hemjee_ondor']
    print(Өндөр)
    Зузаа = form_datas['hemjee_zuzaan']
    print(Зузаа)
    Голч__ = form_datas['hemjee_golch']

    print(Голч__)
    Бусад = form_datas['hemjee_busad_hemjee']
    print(Бусад)
    Тоо_ш = form_datas['hemjee_too_shirheg']
    print(Тоо_ш)
    Хамга = form_datas['dgh_angilal']
    print(Хамга)
    Хамг_1 = form_datas['dgh_bus_togtooh_shaardlaga']
    print(Хамг_1)
    Тусга = form_datas['dgh_tusgai_hamgaalalt']


    print(Тусга)
    Яарал = form_datas['dgh_yaaraltai_hamgaalalt']
    print(Яарал)
    Малтс = form_datas['dgh_maltan_sudaltan_hamgaalalt']

    Хүний = form_datas['dgh_gemtliin_all']
    print(Хүний)
    Байга = form_datas['dgh_baigaliin_huchin_zuil_all']
    print(Байга)


    print(Малтс)
    Сэргэ = form_datas['dgh_sergeen_zasvarlasan_eseh_hamgaalalt']

    print(Сэргэ)
    Сэрг_1 = form_datas['dgh_sergeen_zasvarlasan_eseh_todorhoi_bish']

    print(Сэрг_1)
    Хамг_2 = form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal']
    
    print(Хамг_2)
    Буса_1 = form_datas['last_busad_temdeglel']
    
    dd = 1
    mm = 1
    ss = 1
    dd1 = 1
    mm1 = 1
    ss1 = 1

    print(dd, mm, ss, dd1, mm1, ss1)

    print(form_datas['tuuhin_ov_date'])

    
    return JsonResponse({'success': True})