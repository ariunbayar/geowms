import os

from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from .models import TsegUstsan, TsegPersonal, TuuhSoyol, TuuhSoyolPoint, TuuhSoyolHuree, TuuhSoyolAyuulHuree, Mpoint_view, Mpoint1, Mpoint2, Mpoint3, Mpoint4, Mpoint5, Mpoint6, Mpoint7, Mpoint8, Mpoint9,Mpoint10, TuuhSoyolHureePol, TuuhSoyolAyuulHureePol, TsegUstsanLog
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile
from geoportal_app.models import User
from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
import math
from pyproj import Transformer
import uuid
from django.db.models import Q
import re
from django.conf import settings
from fpdf import FPDF
# Create your models here.

def createPdf(pk):

    tseg = TsegPersonal.objects.filter(id=pk).first()
    data = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
    if tseg.latlongy and tseg.latlongx:
        L = float(tseg.latlongy)
        B = float(tseg.latlongx)
        LA = int(L)
        LB = int((L-LA)*60)
        LC = float((L-LA-LB/60)*3600 )
        LC = "%.6f" % LC
        BA = int(B)
        BB = int((B-BA)*60)
        BC = float((B-BA-BB/60)*3600 )
        BC = "%.6f" % BC
        Bchar = str(BA) + '°' + str(BB) + "'" + str(float(BC))  + '"'
        Lchar = str(LA) + '°' + str(LB) + "'" + str(float(LC))  + '"'
        transformer = Transformer.from_crs(4326, 26917)
        transformer = Transformer.from_crs("EPSG:4326", 'EPSG:3857')
        transformer
        val1 = transformer.transform(L, B)
        utmx = val1[0]
        utmx = str("%.6f" % utmx)
        utmy = val1[1]
        utmy = str("%.6f" % utmy)
    else:
        Bchar = ''
        Lchar = ''
        utmx = ''
        utmy = ''
    data = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
    pdf = FPDF()
    pdf.add_page()
    pdf.set_xy(0, 0)
    pdf.add_font('DejaVu', '', settings.MEDIA_ROOT + '/' + 'DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font('DejaVu', '', 10)
    pdf.ln(10)
    pdf.cell(50)
    pdf.cell(75, 8, "ГЕОДЕЗИЙН БАЙНГЫН ЦЭГ ТЭМДЭГТИЙН ХУВИЙН ХЭРЭГ", 0, 2, 'D')
    pdf.cell(75, 8, "", 0, 2, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')

    # tseg ner ehni mor
    pdf.cell(-50)
    pdf.cell(10, 8, '1.', 1, 0, 'C')
    pdf.cell(41, 8, 'Цэгийн нэр', 1, 0, 'C')
    pdf.cell(43, 8, data.point_name, 1, 0, 'C')

    pdf.cell(10, 8, '2.', 1, 0, 'C')
    pdf.cell(41, 8, 'Төвийн дугаар', 1, 0, 'C')
    pdf.cell(43, 8, data.point_id, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    pdf.cell(-188)
    pdf.cell(10, 8, '3.', 1, 0, 'C')
    pdf.cell(51, 8, 'Трапцийн дугаар', 1, 0, 'C')
    if data.sheet1:
        trapets = data.sheet1 + '-' + str(int(data.sheet2)) + '-' + str(int(data.sheet3))
    pdf.cell(33, 8, trapets, 1, 0, 'C')
    pdf.cell(10, 8, '4.', 1, 0, 'C')
    pdf.cell(41, 8, 'Сүлжээний төрөл', 1, 0, 'C')
    pdf.cell(43, 8, tseg.suljeenii_torol, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    # mor 3
    pdf.ln(0)
    pdf.cell(10, 8, '5.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байршил (Аймаг, сум, дүүрэг, хороо)', 1, 0, 'C')
    pdf.cell(94, 8, data. aimag + ' ' + data.sum, 1, 1, 'C')
    pdf.ln(0)
    pdf.cell(10, 8, '6.', 1, 0, 'C')
    pdf.cell(33, 8, 'Цэгийн солбилцол', 1, 0, 'C')
    pdf.cell(33, 8, 'B= ' + Bchar, 1, 0, 'C')
    pdf.cell(33, 8, 'L= ' + Lchar, 1, 0, 'C')
    pdf.cell(40, 8, 'X= ' + utmx, 1, 0, 'C')
    pdf.cell(39, 8, 'Y= ' + utmy, 1, 0, 'C')
    # mor 5
    pdf.ln(0)
    pdf.cell(10, 8, '', 1, 1, 'C')
    pdf.cell(188, 8, '7. Цэгийн фото зураг', 1, 1, 'C')
    # mor 6
    pdf.cell(94, 8, 'Холоос', 1, 0, 'C')
    pdf.cell(94, 8, 'Ойроос', 1, 0, 'C')
    pdf.ln(0)
    pdf.cell(94, 70, '', 1, 0, 'C')
    pdf.cell(94, 70, '', 1, 0, 'C')
    pdf.ln(70)
    if tseg.tseg_oiroos_img_url:
        pdf.image(settings.MEDIA_ROOT + '/' + tseg.tseg_oiroos_img_url.name, x = 11, y = 83, w = 92, h = 60, type = '', link = '')
    if tseg.tseg_holoos_img_url:
        pdf.image(settings.MEDIA_ROOT + '/' + tseg.tseg_holoos_img_url.name, x = 105, y = 83, w = 92, h = 60, type = '', link = '')
    # mor 6
    pdf.ln(0)
    pdf.cell(188, 8, '8. Байршлийн тухай', 1, 0, 'C')
    pdf.ln(8)
    pdf.multi_cell(188, 5, tseg.barishil_tuhai, 1, 0, 'C')
    newH = pdf.get_y()
    # mor 6
    if tseg.bairshil_tseg_holoos_img_url != '' and tseg.bairshil_tseg_oiroos_img_url:
        pdf.cell(94, 8, '9. Байршлын тойм зураг.', 1, 0, 'C')
        pdf.cell(94, 8, '10. Төв цэгийн хэлбэр', 1, 0, 'C')
        pdf.ln(8)
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.ln(62)
        pdf.image(settings.MEDIA_ROOT + '/' + tseg.bairshil_tseg_oiroos_img_url.name, x = 11, y = newH + 8, w = 92, h =60, type = '', link = '')
        pdf.image(settings.MEDIA_ROOT + '/' + tseg.bairshil_tseg_holoos_img_url.name, x = 105, y = newH + 8, w = 92, h =60, type = '', link = '')
    else:
        pdf.ln(0)
    # mor 6
    pdf.cell(10, 8, '11.', 1, 0, 'C')
    if tseg.sudalga_or_shine:
        sudalgaa = tseg.sudalga_or_shine
    else:
        sudalgaa = 'байхгүй'
    pdf.cell(84, 8, 'Судалгаа: ' + sudalgaa, 1, 0, 'C')
    pdf.cell(10, 8, '12.', 1, 0, 'C')
    if tseg.date:
        date = tseg.date.strftime("%Y-%m-%d")
    else:
        date = ''
    pdf.cell(84, 8, 'Огноо: ' +  date, 1, 0, 'C')

    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '13.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хөрсний шинж байдал:', 1, 0, 'C')
    pdf.cell(94, 8, tseg.hors_shinj_baidal, 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '14.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хувийн хэрэг хөтөлсөн:', 1, 0, 'C')
    pdf.cell(94, 8, tseg.hotolson, 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '15.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байгууллага', 1, 0, 'C')
    pdf.cell(94, 8, tseg.alban_baiguullga, 1, 0, 'C')
    return pdf


@require_POST
@ajax_required
def create(request, payload):

    date = None
    unique_id = uuid.uuid4()
    form_datas = payload.get('form_datas')
    if form_datas['date']:
        date = form_datas['date']
    TuuhSoyol.objects.using('postgis_db').create( id = unique_id,
                                dugaar=form_datas['dugaar'],
                                date=date,
                                inspireid="geo",
                                too_shirheg=form_datas['too_shirheg'],
                                aimagname=payload.get('aimagname'),
                                sumname=payload.get('sumname'),
                                burtgegch=form_datas['burtgegch']
                            )
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeCountEdit(request, payload):
    id = payload.get('id')
    action = payload.get('action')
    tuuh_id = payload.get('tuuh_id')
    tuuh = TuuhSoyol.objects.using('postgis_db').filter(id=tuuh_id).first()

    if action == 'add':
        too_shirheg = int(tuuh.too_shirheg) + 1
        TuuhSoyol.objects.using('postgis_db').filter(id=tuuh_id).update(too_shirheg=too_shirheg)
    else:
        alls = TuuhSoyolHuree.objects.filter(tuuh_soyl_huree_id__gt=id, tuuh_soyl=tuuh_id).order_by('tuuh_soyl_huree_id')
        TuuhSoyolHuree.objects.filter(tuuh_soyl_huree_id=id).delete()
        if alls:
            for data in alls:
                count = data.tuuh_soyl_huree_id - 1
                TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuh_id, id=data.id).update(tuuh_soyl_huree_id=count)

        too_shirheg = int(tuuh.too_shirheg) - 1
        TuuhSoyol.objects.using('postgis_db').filter(id=tuuh_id).update(too_shirheg=too_shirheg)
    return JsonResponse({'success': True})



@require_POST
@ajax_required
def update(request, payload):
    date = None
    form_datas = payload.get('form_datas')
    if form_datas['date']:
        date = form_datas['date']
    TuuhSoyol.objects.using('postgis_db').filter(id=form_datas['id']).update(
                                                        dugaar=form_datas['dugaar'],
                                                        date=date,
                                                        inspireid="geo",
                                                        too_shirheg=form_datas['too_shirheg'],
                                                        aimagname=payload.get('aimagname'),
                                                        sumname=payload.get('sumname'),
                                                        burtgegch=form_datas['burtgegch']
                                                    )
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def remove(request, payload):
    pk = payload.get('id')
    tuuhSoyol = TuuhSoyol.objects.filter(id=pk)
    tuuhSoyol = TuuhSoyol.objects.using('postgis_db').filter(id=pk)
    if tuuhSoyol:
        tuuhsoylPoint = TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl=pk)
        if tuuhsoylPoint:
            tuuhsoylPoint.delete()

        point = TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl=pk)
        if point:
            point.delete()

        hureePol = TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl=pk)
        if hureePol:
            hureePol.delete()

        HureePolAyul = TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl=pk)
        if HureePolAyul:
            HureePolAyul.delete()

        AyulHuree = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=pk)
        if AyulHuree:
            AyulHuree.delete()

        huree = TuuhSoyolHuree.objects.filter(tuuh_soyl=pk)
        if huree:
            huree.delete()

    else:
        rsp = {
            'success': False,
            'msg': "Амжилтгүй"
        }
        return JsonResponse(rsp)

    tuuhSoyol.delete()
    rsp = {
        'success': True,
        'msg': "Амжилттай устгасан"
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def about(request, payload):
    ids = payload.get('id')
    tuuh_soyl = []
    for tuuh in TuuhSoyol.objects.using('postgis_db').filter(id=ids):
        tuuh_soyl.append({
            'id': tuuh.id,
            'dugaar': tuuh.dugaar,
            'date': tuuh.date.strftime("%Y-%m-%d") if tuuh.date else '',
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
    for tuuh in TuuhSoyol.objects.using('postgis_db').all():
        tuuh_soyl.append({
            'id': tuuh.id,
            'dugaar': tuuh.dugaar,
            'date': tuuh.date.strftime("%Y-%m-%d") if tuuh.date else '',
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
def dursgaltGazarUpdate(request, payload):
    form_datas = payload.get('form_datas')
    form_datas_values = payload.get('form_datas_values')
    tuuhsoyl = TuuhSoyol.objects.using('postgis_db').filter(id=form_datas['tuuhenov_id']).first()
    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinaty'])
    cursor = connections['postgis_db'].cursor()
    cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [y, x])
    dursgal = form_datas_values['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'
    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']
    stone = form_datas_values['torol_zuiltorol_zuil_name']
    geom = cursor.fetchone()
    length =form_datas_values['hemjee_urt']
    width =form_datas_values['hemjee_orgon']
    hight =form_datas_values['hemjee_ondor']
    area =form_datas_values['hemjee_talbai']
    depth =form_datas_values['hemjee_zuzaan']
    meridian =form_datas_values['hemjee_golch']
    other = form_datas_values['hemjee_busad_hemjee']
    number = form_datas_values['hemjee_too_shirheg']
    protection = form_datas_values['dgh_angilal']
    protecti_1 = form_datas_values['dgh_bus_togtooh_shaardlaga']
    tus = form_datas_values['dgh_tusgai_hamgaalalt']
    yaral = form_datas_values['dgh_yaaraltai_hamgaalalt']
    malts = form_datas_values['dgh_maltan_sudaltan_hamgaalalt']
    human = form_datas['dgh_gemtliin_all']
    human1 = ''
    for hun in form_datas['dgh_gemtliin_all']:
        human1 = human1 + hun + ''
    natural = form_datas['dgh_baigaliin_huchin_zuil_all']
    natural1 = ''
    for natur in form_datas['dgh_baigaliin_huchin_zuil_all']:
        natural1 = natural1 + natur + ''
    recover = form_datas_values['dgh_sergeen_zasvarlasan_eseh_hamgaalalt']
    recover1 = form_datas_values['dgh_sergeen_zasvarlah_eseh_nenshaardlaga']
    protecti_2 = form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal']
    descriptio = form_datas_values['torol_zuil_todorhoilolt']
    other1 = form_datas_values['last_busad_temdeglel']
    hashaa = form_datas_values['dgh_hashaa_baigaa_eseh_hashaa']
    saravch = form_datas_values['dgh_saravchtai_eseh_saravch']
    hayg = form_datas_values['dgh_hayg_tailbar_eseh_hayg']
    omchlol = form_datas_values['dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt']
    protection_irgen = form_datas_values['dg_ezen_dursgalt_gazar_ezen']
    tuuhsoyolpoint = TuuhSoyolPoint.objects.using('postgis_db').filter(pk=form_datas['durgal_id']).update(
                            tuuh_soyl=tuuhsoyl.id,
                            dursgal=dursgal,
                            dursgal2=dursgal2, descriptio=descriptio,
                            type1=form_datas['torol_zuil_torol_zuil'],
                            type2=type2,
                            stone=stone, length=length,
                            area=area,
                            width=width, hight=hight, depth=depth,
                            meridian=meridian, other=other,
                            number=number, hemjee_comment=form_datas_values['hemjee_temdeglel'],
                            protection_irgen=protection_irgen,
                            protection_irgen_commnent=form_datas_values['dg_ezen_temdeglel'],
                            protection=protection, protecti_1=protecti_1,
                            tus=tus, tus_comment=form_datas_values['dgh_tusgai_temdeglel'],
                            yaral=yaral, yaral_comment=form_datas_values['dgh_yaaraltai_temdeglel'],
                            omchlol=omchlol, omchlol_comment=form_datas_values['dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'],
                            malts=malts, malts_comment=form_datas_values['dgh_maltan_sudaltan_temdeglel'],
                            human=human, human_comment=form_datas_values['dgh_gemtliin_temdeglel'],
                            natural=natural, natural_comment=form_datas_values['dgh_baigaliin_huchin_zuil_temdeglel'],
                            recover=recover, recover_comment=form_datas_values['dgh_sergeen_zasvarlasan_eseh_temdeglel'],
                            recover1=recover1,recover1_comment=form_datas_values['dgh_sergeen_zasvarlah_eseh_temdeglel'],
                            protecti_2=protecti_2, protecti_2_comment=form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
                            hashaa=hashaa, hashaa_comment=form_datas_values['dgh_hashaa_baigaa_eseh_temdeglel'],
                            saravch=saravch, saravch_comment=form_datas_values['dgh_saravchtai_eseh_temdeglel'],
                            hayg=hayg, hayg_comment=form_datas_values['dgh_hayg_tailbar_eseh_temdeglel'],
                            other1=other1,
                            x=x, y=y,
                            ondor=form_datas_values['torol_zuil_dursgalt_gazriin_coordinatalt'],
                            )
    update_cursor = connections['postgis_db'].cursor()
    update_cursor.execute(''' UPDATE tuuhsoyolpoint SET geom = %s WHERE id = %s ''', [geom, form_datas['durgal_id']])
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def dursgaltGazarCreate(request, payload):
    form_datas = payload.get('form_datas')
    form_datas_values = payload.get('form_datas_values')
    tuuhsoyl = TuuhSoyol.objects.using('postgis_db').filter(id=form_datas['tuuhenov_id']).first()
    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinaty'])
    cursor = connections['postgis_db'].cursor()
    cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [y, x])
    dursgal = form_datas_values['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'
    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']
    stone = form_datas_values['torol_zuiltorol_zuil_name']
    geom = cursor.fetchone()
    length =form_datas_values['hemjee_urt']
    width =form_datas_values['hemjee_orgon']
    area =form_datas_values['hemjee_talbai']
    hight =form_datas_values['hemjee_ondor']
    depth =form_datas_values['hemjee_zuzaan']
    meridian =form_datas_values['hemjee_golch']
    other = form_datas_values['hemjee_busad_hemjee']
    number = form_datas_values['hemjee_too_shirheg']
    protection = form_datas_values['dgh_angilal']
    protecti_1 = form_datas_values['dgh_bus_togtooh_shaardlaga']
    tus = form_datas_values['dgh_tusgai_hamgaalalt']
    yaral = form_datas_values['dgh_yaaraltai_hamgaalalt']
    malts = form_datas_values['dgh_maltan_sudaltan_hamgaalalt']
    human = form_datas['dgh_gemtliin_all']
    human = form_datas['dgh_gemtliin_all']
    human1 = ''
    for hun in form_datas['dgh_gemtliin_all']:
        human1 = human1 + hun + ''
    natural = form_datas['dgh_baigaliin_huchin_zuil_all']
    natural1 = ''
    for natur in form_datas['dgh_baigaliin_huchin_zuil_all']:
        natural1 = natural1 + natur + ''
    recover = form_datas_values['dgh_sergeen_zasvarlasan_eseh_hamgaalalt']
    recover1 = form_datas_values['dgh_sergeen_zasvarlah_eseh_nenshaardlaga']
    protecti_2 = form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal']
    descriptio = form_datas_values['torol_zuil_todorhoilolt']
    other1 = form_datas_values['last_busad_temdeglel']
    hashaa = form_datas_values['dgh_hashaa_baigaa_eseh_hashaa']
    saravch = form_datas_values['dgh_saravchtai_eseh_saravch']
    hayg = form_datas_values['dgh_hayg_tailbar_eseh_hayg']
    omchlol = form_datas_values['dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt']
    protection_irgen = form_datas_values['dg_ezen_dursgalt_gazar_ezen']
    tuuhsoyolpoint = TuuhSoyolPoint.objects.using('postgis_db').create(
                            tuuh_soyl=tuuhsoyl.id,
                            dursgal=dursgal,
                            dursgal2=dursgal2, descriptio=descriptio,
                            type1=form_datas['torol_zuil_torol_zuil'],
                            type2=type2,
                            stone=stone, length=length,
                            width=width, hight=hight, depth=depth,
                            area=area,
                            meridian=meridian, other=other,
                            number=number, hemjee_comment=form_datas_values['hemjee_temdeglel'],
                            protection_irgen=protection_irgen,
                            protection_irgen_commnent=form_datas_values['dg_ezen_temdeglel'],
                            protection=protection, protecti_1=protecti_1,
                            tus=tus, tus_comment=form_datas_values['dgh_tusgai_temdeglel'],
                            yaral=yaral, yaral_comment=form_datas_values['dgh_yaaraltai_temdeglel'],
                            omchlol=omchlol, omchlol_comment=form_datas_values['dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'],
                            malts=malts, malts_comment=form_datas_values['dgh_maltan_sudaltan_temdeglel'],
                            human=human, human_comment=form_datas_values['dgh_gemtliin_temdeglel'],
                            natural=natural, natural_comment=form_datas_values['dgh_baigaliin_huchin_zuil_temdeglel'],
                            recover=recover, recover_comment=form_datas_values['dgh_sergeen_zasvarlasan_eseh_temdeglel'],
                            recover1=recover1,recover1_comment=form_datas_values['dgh_sergeen_zasvarlah_eseh_temdeglel'],
                            protecti_2=protecti_2, protecti_2_comment=form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
                            hashaa=hashaa, hashaa_comment=form_datas_values['dgh_hashaa_baigaa_eseh_temdeglel'],
                            saravch=saravch, saravch_comment=form_datas_values['dgh_saravchtai_eseh_temdeglel'],
                            hayg=hayg, hayg_comment=form_datas_values['dgh_hayg_tailbar_eseh_temdeglel'],
                            other1=other1,
                            x=x, y=y,
                            ondor=form_datas_values['torol_zuil_dursgalt_gazriin_coordinatalt'],
                            )
    update_cursor = connections['postgis_db'].cursor()
    update_cursor.execute(''' UPDATE tuuhsoyolpoint SET geom = %s WHERE id = %s ''', [geom, tuuhsoyolpoint.id])
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def dursgaltGazarAll(request, payload):
    form_data = []
    tuug_soyol = payload.get('id')
    for data in TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl = tuug_soyol):
        form_data.append({
            'id': data.id,
            'dursgal': data.dursgal,
            'tuuh_soyl': data.tuuh_soyl,
            'x': data.x,
            'y': data.y,
            'stone': data.stone,
            'dursgal': data.dursgal,
            'protection': data.protection,
            'point_check': findPoint(data.x, data.y, tuug_soyol),
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'form_data': form_data})


def findPoint(x,y, tuug_soyol):
    find_cursor = connections['postgis_db'].cursor()
    find_cursor.execute(''' select * from tuuhsoyolhureepol where ST_DWithin(geom, ST_MakePoint(%s, %s)::geography, 1) and tuuh_soyl = %s ''', [y, x, tuug_soyol])
    check = find_cursor.fetchone()
    if check:
        return True
    else:
        return False


@require_POST
@ajax_required
def dursgaltGazarAbout(request, payload):
    form_data = []
    for data in TuuhSoyolPoint.objects.using('postgis_db').filter(pk = payload.get('id')):
        form_data.append({
            'dursgal': data.dursgal,
            'dursgal2': data.dursgal2,
            'descriptio': data.descriptio,
            'type1': data.type1,
            'type2': data.type2,
            'stone': data.stone,
            'length': data.length,
            'width': data.width,
            'hight': data.hight,
            'area': data.area,
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
            'alt': data.ondor,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'form_data': form_data})


@require_POST
@ajax_required
def dursgaltGazarRemove(request, payload):
    pk = payload.get('id')
    tuuhsoylPoint = TuuhSoyolPoint.objects.using('postgis_db').filter(id=pk)
    if tuuhsoylPoint:
        tuuhsoylPoint.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def tseg_personal_list(request, payload):
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    tseg_personal = []
    mpoint = Mpoint_view.objects.using('postgis_db').annotate(search=SearchVector(
        'point_id',
        'pid',
        't_type',
        'mclass',
        ) + SearchVector('point_name')).filter(search__contains=query).order_by("id")
    total_items = Paginator(mpoint, per_page)
    items_page = total_items.page(page)
    for mpoint_all in items_page.object_list:
        tseg_personal.append({
            'id': mpoint_all.id,
            'objectid': mpoint_all.objectid,
            'point_id':mpoint_all.point_id.zfill(4) if mpoint_all.point_id and len(mpoint_all.point_id)<4 else mpoint_all.point_id,
            'point_name': mpoint_all.point_name,
            'pid': mpoint_all.pid,
            'point_class': mpoint_all.point_class,
            'point_type': mpoint_all.mclass,
            'center_typ': mpoint_all.mclass,
            'aimag': mpoint_all.aimag,
            'sum': mpoint_all.sum,
            'sheet1': mpoint_all.sheet1,
            'sheet2': mpoint_all.sheet2,
            'sheet3': mpoint_all.sheet3,
            'geom': mpoint_all.geom,
            't_type': mpoint_all.t_type,
        })
    total_page = total_items.num_pages
    rsp = {
        'items': tseg_personal,
        'page': page,
        'total_page': total_page,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def tsegPersonalRemove(request, payload):
    pk = payload.get('id')
    class_type = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
    data = None
    if class_type.t_type == 'g102':
        data = Mpoint2.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g103':
        data = Mpoint3.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g104':
        data = Mpoint4.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g105':
        data = Mpoint5.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g106':
        data = Mpoint6.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g107':
        data = Mpoint7.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g108':
        data = Mpoint8.objects.using('postgis_db').filter(id=pk).first()
    if class_type.t_type == 'g109':
        data = Mpoint9.objects.using('postgis_db').filter(id=pk).first()
    if data:
        mpoint10 = Mpoint10.objects.using('postgis_db').create(
            id=data.id, objectid=data.objectid,
            point_id=data.point_id, point_name=data.point_name,
            point_class_name='Устсан төлөв', pid=data.pid,
            point_class=10, mclass=data.mclass,
            center_typ=data.center_typ,aimag=data.aimag, sum=data.sum,
            sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
            ondor=data.ondor, ondor_type=data.ondor_type, t_type='g110'
        )
        if mpoint10:
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint10 SET geom =
            %s WHERE id = %s ''', [data.geom, str(mpoint10.id)])
            data.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def tsegPersonalUpdate(request, payload):
    pk = payload.get('id')
    tseg_display = []
    tseg = TsegPersonal.objects.filter(id = pk).first()
    search_cursor = connections['postgis_db'].cursor()
    data = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
    search_cursor.execute(''' SELECT ST_X(ST_TRANSFORM(ST_CENTROID(%s),4326)) AS x,  ST_Y(ST_CENTROID(ST_TRANSFORM(%s,4326))) AS y FROM mpoint_view where id = %s ''', [data.geom, data.geom, str(pk)])
    search_cursor_data = search_cursor.fetchone()
    if search_cursor_data:
        latlongx = search_cursor_data[0]
        latlongy = search_cursor_data[1]
        LA = int(float(latlongx))
        LB = int((float(latlongx)-LA)*60)
        LC = float("{:.6f}".format(((float(latlongx))-LA-LB/60)*3600 ))
        BA = int(float(latlongy))
        BB = int((float(latlongy)-BA)*60)
        BC = (float(float(latlongy))-BA-BB/60)*3600
    if data.sheet2:
        sheet2 = int(data.sheet2)
    else:
        sheet2 = 0
    if data.sheet3:
        sheet3 = int(data.sheet3)
    else:
        sheet3 = 0
    tseg_display.append({
        'latlongx': latlongx if search_cursor_data else '',
        'latlongy': latlongy if search_cursor_data else '',
        'LA':LA if search_cursor_data else '',
        'LB':LB if search_cursor_data else "",
        'LC':LC if search_cursor_data else '',
        'BA':BA if search_cursor_data else "",
        'BB':BB if search_cursor_data else "",
        'BC':BC if search_cursor_data else "",
        'tseg_oiroos_img_url': tseg.tseg_oiroos_img_url.url if tseg and tseg.tseg_oiroos_img_url else '',
        'tseg_holoos_img_url': tseg.tseg_holoos_img_url.url if tseg and tseg.tseg_holoos_img_url  else '',
        'barishil_tuhai': tseg.barishil_tuhai if tseg else '',
        'bairshil_tseg_oiroos_img_url': tseg.bairshil_tseg_oiroos_img_url.url if tseg and tseg.bairshil_tseg_oiroos_img_url else '',
        'bairshil_tseg_holoos_img_url': tseg.bairshil_tseg_holoos_img_url.url if tseg and tseg.bairshil_tseg_holoos_img_url else '',
        'sudalga_or_shine':  tseg.sudalga_or_shine if tseg else '',
        'hors_shinj_baidal': tseg.hors_shinj_baidal if tseg else '',
        'date': tseg.date.strftime("%Y-%m-%d") if tseg and tseg.date else '',
        'hotolson': tseg.hotolson if tseg else '',
        'file_path1': tseg.file_path1.name if tseg else '',
        'file_path2': tseg.file_path2.name if tseg else '',
        'alban_tushaal': tseg.alban_tushaal if tseg else '',
        'alban_baiguullga': tseg.alban_baiguullga if tseg else '',
        'suljeenii_torol': tseg.suljeenii_torol if tseg else '',
        'id': data.id if data.id else '',
        'objectid': data.objectid if data.objectid else '',
        'point_id': data.point_id if  data.point_id else '',
        'point_name': data.point_name if data.point_name else '',
        'pid': data.pid if data.pid else '',
        'ondor_torol': data.ondor_type if data.ondor_type else '',
        'center_typ': data.mclass if data.mclass else '',
        'aimag': data.aimag if data.aimag else '',
        'sum': data.sum if data.sum else '',
        'sheet1':data.sheet1 if data.sheet1 else '',
        'zone': int(data.sheet2) if sheet2 else '',
        'cc': int(data.sheet3) if sheet3 else '',
        't_type': data.t_type if data.t_type else '',
        'ondor': data.ondor if data.ondor else '',
    })
    rsp = {
        'tseg_display': tseg_display,
    }
    return JsonResponse(rsp)

class UnAcceptedValueError(Exception):
    def __init__(self, data):
        self.data = data
    def __str__(self):
        return repr(self.data)


@require_POST
@ajax_required
def findPoints(request, payload):
    try:
        point_id = str(payload.get("point_id"))
        find_cursor = connections['postgis_db'].cursor()
        find_cursor.execute(''' SELECT ST_X(ST_TRANSFORM(ST_CENTROID(geom),4327)) AS X,  ST_Y(ST_CENTROID(ST_TRANSFORM(geom,4327))) AS Y FROM mpoint_view where point_id = %s limit 1 ''', [point_id])
        data = find_cursor.fetchone()
        if(data):

            rsp = {
                'success': True,
                'info': data
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Уучлаарай энэ мэдээлэл олдсонгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def findSum(request, payload):
    try:
        info = []
        L = payload.get("y")
        B = payload.get("x")
        cursor = connections['postgis_db'].cursor()
        cursor.execute('''select "name", "text" from "AdmUnitSum" where ST_DWithin(geom, ST_MakePoint(%s, %s)::geography, 100)''', [L, B])
        geom = cursor.fetchone()
        if(geom):
            zoneout=int(L)/6+31
            instr = ("+proj=longlat +datum=WGS84 +no_defs")
            outstr = ("+proj=tmerc +lat_0=0 +lon_0="+str((zoneout-30)*6-3)+" +k=0.9996 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")
            inproj = pyproj.Proj(instr)
            outproj = pyproj.Proj(outstr)
            val = pyproj.transform(inproj, outproj, L,B)

            Brange=[40,44,48,52,56]
            Letter=['K','L','M','N','O']
            for k in Brange:
                if k>B:
                    ind=Brange.index(k)
                    B0=Letter[ind-1]
                    Bmin=Brange[ind-1]
                    break
                else:
                    B0 = "aldaa"
            zone=int(L/6)+31
            Lmin=(zone-30)*6-6
            c=0
            while Lmin<L:
                Lmin=Lmin+0.5
                c=c+1
            cc=0
            while Bmin<B:
                Bmin=Bmin+1/3
                cc=cc+1
            cc = (12-cc)*12+c
            LA = int(L)
            LB = int((L-LA)*60)
            LC = float((L-LA-LB/60)*3600 )
            BA = int(B)
            BB = int((B-BA)*60)
            BC = float((B-BA-BB/60)*3600 )
            info.append({
                'aimag': geom[0],
                'sum': geom[1],
                "vseg": B0,
                'zone': zone,
                'cc': cc,
                'BA': BA,
                'BB': BB,
                'BC': BC,
                'LA': LA,
                'LB': LB,
                'LC': LC
            })
            rsp = {
                'success': True,
                'info': info
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'info': "Монгол улсын хилийн гадна байна !!!",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'info': "Алдаа гарсан",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def tsegPersonal(request):
    pk = request.POST.get('idx')
    point_id = request.POST.get('toviin_dugaar')
    ondor_type = request.POST.get('ondor_torol')
    if(len(point_id)<4):
        point_id.zfill(4)

    if pk:
        date = None
        tseg_personal = TsegPersonal.objects.filter(id=pk).first()
        if not tseg_personal:
            TsegPersonal.objects.create(id=pk)

        if request.POST.get('date'):
            date = request.POST.get('date')

        y = float(request.POST.get('latlongy'))
        x = float(request.POST.get('latlongx'))
        cursor = connections['postgis_db'].cursor()
        cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326)''', [x, y])
        geom = cursor.fetchone()
        ondor = request.POST.get('ondor')
        mpoints = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
        if request.POST.get('suljeenii_torol'):
            point_class = int(request.POST.get('suljeenii_torol'))
        else:
            point_class = 0
        if mpoints.t_type == 'g102':
            Mpoint2.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='GNSS-ийн байнгын ажиллагаатай станц'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint2 SET geom = %s WHERE id = %s ''', [geom, pk])

        if mpoints.t_type == 'g103':
            Mpoint3.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                         point_class_name='GPS-ийн сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint3 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g104':
            Mpoint4.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Триангуляцийн сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint4 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g105':
            Mpoint5.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Полигонометрийн сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint5 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g106':
            Mpoint6.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Гравиметрийн сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint6 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g107':
            Mpoint7.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        point_class=point_class,
                        ondor_type=ondor_type,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Өндрийн сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint7 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g108':
            Mpoint8.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        ondor_type=ondor_type,
                        point_class=point_class,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Зураглалын сүлжээний цэг'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint8 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g109':
            Mpoint9.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        ondor_type=ondor_type,
                        point_class=point_class,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Шинээр нэмэгдсэн төлөв'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint9 SET geom = %s WHERE id = %s ''', [geom, pk])
        if mpoints.t_type == 'g110':
            Mpoint10.objects.using('postgis_db').filter(id=pk).update(
                        objectid="null" ,point_id=point_id,
                        point_name=request.POST.get('tesgiin_ner'),
                        ondor=ondor,
                        ondor_type=ondor_type,
                        point_class=point_class,
                        mclass=request.POST.get('center_typ'),
                        aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                        sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('zone'),
                        sheet3=request.POST.get('cc'),
                        point_class_name='Устсан төлөв'
            )
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint10 SET geom = %s WHERE id = %s ''', [geom, pk])
        TsegPersonal.objects.filter(id=pk).update(
                    suljeenii_torol=request.POST.get('suljeenii_torol'),
                    latlongx=request.POST.get('latlongx'),
                    latlongy=request.POST.get('latlongy'),
                    barishil_tuhai=request.POST.get('barishil_tuhai'),
                    sudalga_or_shine=request.POST.get('sudalga_or_shine'),
                    hors_shinj_baidal=request.POST.get('hors_shinj_baidal'),
                    date=date, hotolson=request.POST.get('hotolson'),
                    alban_tushaal=request.POST.get('alban_tushaal'),
                    alban_baiguullga=request.POST.get('alban_baiguullga'),
        )
        tseg_personal = TsegPersonal.objects.filter(id=pk).first()
        if request.POST.get('tseg_oiroos_img_url') and len(request.POST.get('tseg_oiroos_img_url')) > 2000:
            if tseg_personal.tseg_oiroos_img_url:
                tseg_personal.tseg_oiroos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('tseg_oiroos_img_url'), [(720, 720)])
            tseg_personal.tseg_oiroos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if request.POST.get('tseg_holoos_img_url') and len(request.POST.get('tseg_holoos_img_url')) > 2000:
            if tseg_personal.tseg_holoos_img_url:
                tseg_personal.tseg_holoos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('tseg_holoos_img_url'), [(720, 720)])
            tseg_personal.tseg_holoos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if request.POST.get('bairshil_tseg_oiroos_img_url')  and len(request.POST.get('bairshil_tseg_oiroos_img_url')) > 2000:
            if tseg_personal.bairshil_tseg_oiroos_img_url:
                tseg_personal.bairshil_tseg_oiroos_img_url.delete(save=False)
            tseg_personal.bairshil_tseg_oiroos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('bairshil_tseg_oiroos_img_url'), [(720, 720)])
            tseg_personal.bairshil_tseg_oiroos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if  request.POST.get('bairshil_tseg_holoos_img_url') and len(request.POST.get('bairshil_tseg_holoos_img_url')) > 2000:
            if tseg_personal.bairshil_tseg_holoos_img_url:
                tseg_personal.bairshil_tseg_holoos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('bairshil_tseg_holoos_img_url'), [(720, 720)])
            tseg_personal.bairshil_tseg_holoos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if not request.POST.get('file1'):
            tseg_personal.file_path1.delete(save=False)
            tseg_personal.file_path1 = request.FILES['file1']
            tseg_personal.save()
        if not request.POST.get('file2'):
            tseg_personal.file_path2.delete(save=False)
            tseg_personal.file_path2 = request.FILES['file2']
            tseg_personal.save()
        pdf_id = Mpoint_view.objects.using('postgis_db').filter(id=pk).first()
        file_name = pdf_id.pid + '.pdf'
        src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', file_name)
        pdf = createPdf(pk)
        pdf.output(src_file, 'F')
        return JsonResponse({'success': True, 'name': False, 'ids':False})
    else:
        tesgiin_ner = request.POST.get('tesgiin_ner')
        objectid = request.POST.get('toviin_dugaar')
        file_name = 'PDF'+ objectid + '.pdf'
        for_db_pdf_name = 'PDF' + objectid
        tesgiin_ner_check = Mpoint_view.objects.using('postgis_db').filter(point_name=tesgiin_ner)
        objectid_check = Mpoint_view.objects.using('postgis_db').filter(point_id=objectid)
        if tesgiin_ner_check or objectid_check:
            name = False
            ids = False
            if tesgiin_ner_check:
                name = True
            if objectid_check:
                ids = True
            return JsonResponse({'success': False, 'name': name, 'ids':ids})
        date = None
        file1 = ''
        file2 = ''
        if not request.POST.get('file1'):
            file1 = request.FILES['file1']
        if not request.POST.get('file2'):
            file2 = request.FILES['file2']
        if request.POST.get('date'):
            date = request.POST.get('date')
        check_id = True
        while check_id:
            unique_id = uuid.uuid4()
            if Mpoint_view.objects.using('postgis_db').filter(id=unique_id):
                check_id = True
            else:
                check_id = False

        x = float(request.POST.get('latlongx'))
        y = float(request.POST.get('latlongy'))
        cursor = connections['postgis_db'].cursor()
        update_cursor = connections['postgis_db'].cursor()
        cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326)''', [x, y])
        geom = cursor.fetchone()
        ondor = request.POST.get('ondor')
        mpoint = Mpoint9.objects.using('postgis_db').create(
                    id=unique_id,
                    objectid='null', point_id=point_id,
                    ondor=ondor,
                    point_name=request.POST.get('tesgiin_ner'),
                    ondor_type=ondor_type,
                    pid=for_db_pdf_name, point_class=request.POST.get('suljeenii_torol'), mclass=request.POST.get('center_typ'),
                    aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                    sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('BA'),
                    sheet3=request.POST.get('LA'),
                    t_type='g109',
                    point_class_name='Шинээр нэмэгдсэн төлөв'
        )
        update_cursor.execute(''' UPDATE mpoint9 SET geom = %s WHERE id = %s ''', [geom, str(unique_id)])
        tsegPersenal = TsegPersonal.objects.create(
                    id=unique_id,
                    suljeenii_torol=request.POST.get('suljeenii_torol'),
                    latlongx=request.POST.get('latlongx'),
                    latlongy=request.POST.get('latlongy'),
                    barishil_tuhai=request.POST.get('barishil_tuhai'),
                    sudalga_or_shine=request.POST.get('sudalga_or_shine'),
                    hors_shinj_baidal=request.POST.get('hors_shinj_baidal'),
                    date=date, hotolson=request.POST.get('hotolson'),
                    file_path1=file1,file_path2=file2,
                    alban_tushaal=request.POST.get('alban_tushaal'),
                    alban_baiguullga=request.POST.get('alban_baiguullga'),
        )
        if  request.POST.get('tseg_oiroos_img_url'):
            [image_x2] = resize_b64_to_sizes( request.POST.get('tseg_oiroos_img_url'), [(720, 720)])
            tseg_oiroos_img_url = SimpleUploadedFile('img.png', image_x2)
            tsegPersenal.tseg_oiroos_img_url = tseg_oiroos_img_url
            tsegPersenal.save()
        if  request.POST.get('tseg_holoos_img_url'):
            [image_x2] = resize_b64_to_sizes( request.POST.get('tseg_holoos_img_url'), [(720, 720)])
            tseg_holoos_img_url = SimpleUploadedFile('img.png', image_x2)
            tsegPersenal.tseg_holoos_img_url = tseg_holoos_img_url
            tsegPersenal.save()
        if  request.POST.get('bairshil_tseg_oiroos_img_url'):
            [image_x2] = resize_b64_to_sizes( request.POST.get('bairshil_tseg_oiroos_img_url'), [(720, 720)])
            bairshil_tseg_oiroos_img_url = SimpleUploadedFile('img.png', image_x2)
            tsegPersenal.bairshil_tseg_oiroos_img_url = bairshil_tseg_oiroos_img_url
            tsegPersenal.save()
        if  request.POST.get('bairshil_tseg_holoos_img_url'):
            [image_x2] = resize_b64_to_sizes( request.POST.get('bairshil_tseg_holoos_img_url'), [(720, 720)])
            bairshil_tseg_holoos_img_url = SimpleUploadedFile('img.png', image_x2)
            tsegPersenal.bairshil_tseg_holoos_img_url = bairshil_tseg_holoos_img_url
            tsegPersenal.save()
        if not request.POST.get('file1'):
            file1 = request.FILES['file1']
        if not request.POST.get('file2'):
            file2 = request.FILES['file2']
        if request.POST.get('date'):
            date = request.POST.get('date')
        src_file = os.path.join(settings.FILES_ROOT, 'tseg-personal-file', file_name)
        pdf = createPdf(tsegPersenal.id)
        pdf.output(src_file, 'F')
    return JsonResponse({'success': True, 'name': False, 'ids':False})


@require_POST
@ajax_required
def tsegUstsan(request):
    is_dan = bool(request.POST.get('is_dan'))
    tseg_id = int(request.POST.get('id'))
    email = request.POST.get('email')
    baiguulla = request.POST.get('baiguulaga')
    alban_tushaal = request.POST.get('alban_tushaal')
    phone = request.POST.get('utas')
    tseg_dugaar = request.POST.get('tsegiin_dugaar')
    oiroltsoo_bairlal = request.POST.get('oiroltsoo_bairlal')
    evdersen_baidal = request.POST.get('evdersen_baidal')
    shaltgaan = request.POST.get('nohtsol_baidal')
    sergeeh_sanal = request.POST.get('sergeeh_sanal')
    TorF = request.POST.get('hemjilt_hiih_bolomj')
    if TorF == 'false':
        TorF = False
    else:
        TorF = True
    img_holoos = request.POST.get('zurag_hol')
    img_oiroos = request.POST.get('zurag_oir')
    img_baruun = request.POST.get('zurag_baruun')
    img_zuun = request.POST.get('zurag_zuun')
    img_hoino = request.POST.get('zurag_hoid')
    img_omno = request.POST.get('zurag_omno')
    if is_dan:
        users = User.objects.filter(id=request.user.id)
        for user in users:
            email = user.email
            baiguulla = ''
            alban_tushaal = ''
            phone = ''
    if tseg_id != -1:
        Tsegs = get_object_or_404(TsegUstsan, id=tseg_id)
        TsegUstsan.objects.filter(id=tseg_id).update(
                email=email,
                name=baiguulla,
                alban_tushaal=alban_tushaal,
                phone=phone,
                tseg_id=tseg_dugaar,
                oiroltsoo_bairlal=oiroltsoo_bairlal,
                evdersen_baidal=evdersen_baidal,
                shaltgaan=shaltgaan,
                sergeeh_sanal=sergeeh_sanal,
                gps_hemjilt=TorF,
            )
        if img_holoos and len(img_holoos) > 2000:
            Tsegs.img_holoos.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_holoos, [(200, 200)])
            Tsegs.img_holoos = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_oiroos and len(img_oiroos) > 2000:
            Tsegs.img_oiroos.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_oiroos, [(200, 200)])
            Tsegs.img_oiroos = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_baruun  and len(img_baruun) > 2000:
            Tsegs.img_baruun.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_baruun, [(200, 200)])
            Tsegs.img_baruun = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_zuun and len(img_zuun) > 2000:
            Tsegs.img_zuun.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_zuun, [(200, 200)])
            Tsegs.img_zuun = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_omno and len(img_omno) > 2000:
            Tsegs.img_omno.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_omno, [(200, 200)])
            Tsegs.img_omno = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_hoino and len(img_hoino) > 2000:
            Tsegs.img_hoino.delete(save=False)
            [image_x2] = resize_b64_to_sizes(img_hoino, [(200, 200)])
            Tsegs.img_hoino = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        return JsonResponse({'success': True})
    else:
        if img_holoos:
            [image_x2] = resize_b64_to_sizes(img_holoos, [(720, 720)])
            img_holoos = SimpleUploadedFile('img.png', image_x2)
        if img_oiroos:
            [image_x2] = resize_b64_to_sizes(img_oiroos, [(720, 720)])
            img_oiroos = SimpleUploadedFile('img.png', image_x2)
        if img_baruun:
            [image_x2] = resize_b64_to_sizes(img_baruun, [(720, 720)])
            img_baruun = SimpleUploadedFile('img.png', image_x2)
        if img_zuun:
            [image_x2] = resize_b64_to_sizes(img_zuun, [(720, 720)])
            img_zuun = SimpleUploadedFile('img.png', image_x2)
        if img_hoino:
            [image_x2] = resize_b64_to_sizes(img_hoino, [(720, 720)])
            img_hoino = SimpleUploadedFile('img.png', image_x2)
        if img_omno:
            [image_x2] = resize_b64_to_sizes(img_omno, [(720, 720)])
            img_omno = SimpleUploadedFile('img.png', image_x2)
        TsegUstsan.objects.create(
            email=email,
            name=baiguulla,
            alban_tushaal=alban_tushaal,
            phone=phone,
            img_holoos=img_holoos,
            img_oiroos=img_oiroos,
            img_baruun=img_baruun,
            img_zuun=img_zuun,
            img_hoino=img_hoino,
            img_omno=img_omno,
            tseg_id=tseg_dugaar,
            oiroltsoo_bairlal=oiroltsoo_bairlal,
            evdersen_baidal=evdersen_baidal,
            shaltgaan=shaltgaan,
            sergeeh_sanal=sergeeh_sanal,
            gps_hemjilt=TorF,
        )
        return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegUstsanSuccess(request, payload):
    pk = payload.get('id')
    tseg_ustsan = get_object_or_404(TsegUstsan, pk=pk)
    mpoint = Mpoint_view.objects.using('postgis_db').filter(point_id=tseg_ustsan.tseg_id).first()
    if mpoint:
        tseglog = TsegUstsanLog.objects.create(
                    log_id=mpoint.id,
                    img_holoos =  tseg_ustsan.img_holoos.url if tseg_ustsan.img_holoos else '',
                    img_oiroos = tseg_ustsan.img_oiroos.url if tseg_ustsan.img_oiroos else '',
                    img_baruun = tseg_ustsan.img_baruun.url if tseg_ustsan.img_baruun else '',
                    img_zuun = tseg_ustsan.img_zuun.url if tseg_ustsan.img_zuun else '',
                    img_hoino = tseg_ustsan.img_hoino.url if tseg_ustsan.img_hoino else '',
                    img_omno = tseg_ustsan.img_omno.url if tseg_ustsan.img_omno else '',
            )
    class_type = Mpoint_view.objects.using('postgis_db').filter(id=mpoint.id).first()
    data = None
    if class_type.t_type == 'g102':
        data = Mpoint2.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g103':
        data = Mpoint3.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g104':
        data = Mpoint4.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g105':
        data = Mpoint5.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g106':
        data = Mpoint6.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g107':
        data = Mpoint7.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g108':
        data = Mpoint8.objects.using('postgis_db').filter(id=mpoint.id).first()
    if class_type.t_type == 'g109':
        data = Mpoint9.objects.using('postgis_db').filter(id=mpoint.id).first()
    if data:
        mpoint10 = Mpoint10.objects.using('postgis_db').create( id=data.id, objectid=data.objectid, point_id=data.point_id, point_name=data.point_name, pid=data.pid, point_class=10, mclass=data.mclass, center_typ=data.center_typ, sum=data.sum,aimag=data.aimag, sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3, ondor=data.ondor, t_type='g110')
        if mpoint10:
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE mpoint10 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint10.id)])
            data.delete()
            tseg_ustsan.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def tsegUstsanList(request, payload):
    page = payload.get('page')
    per_page = payload.get('perpage')
    query = payload.get('query')
    display_items = []
    tsegs = TsegUstsan.objects.annotate(search=SearchVector('email','tseg_id','name')).filter(search__icontains=query).order_by('id')

    total_items = Paginator(tsegs, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list
    for item in items_page.object_list:
        display_items.append({
            'id': item.id,
            'tseg_id': item.tseg_id,
            'email': item.email,
            'name': item.name,
            'alban_tushaal': item.alban_tushaal,
            'phone': item.phone,
            'oiroltsoo_bairlal': item.oiroltsoo_bairlal,
            'evdersen_baidal': item.evdersen_baidal,
            'nohtsol_baidal': item.shaltgaan,
        })
    total_page = total_items.num_pages

    rsp = {
        'items': display_items,
        'page': page,
        'total_page': total_page,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def tsegUstsanRemove(request, payload):
    pk = payload.get('id')
    tseg_ustsan = TsegUstsan.objects.get(pk=pk)
    if tseg_ustsan:
        if tseg_ustsan.img_holoos:
            tseg_ustsan.img_holoos.delete(save=False)
        if tseg_ustsan.img_oiroos:
            tseg_ustsan.img_oiroos.delete(save=False)
        if tseg_ustsan.img_baruun:
            tseg_ustsan.img_baruun.delete(save=False)
        if tseg_ustsan.img_zuun:
            tseg_ustsan.img_zuun.delete(save=False)
        if tseg_ustsan.img_hoino:
            tseg_ustsan.img_hoino.delete(save=False)
        if tseg_ustsan.img_omno:
            tseg_ustsan.img_omno.delete(save=False)
        tseg_ustsan.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
def hureeCreate(request, payload):
    x = payload.get('x')
    y = payload.get('y')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    dursgalt_id = payload.get('dursgalt_id')
    x_t=float(x)
    y_t=float(y)
    TuuhSoyolHuree.objects.create(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl = dursgalt_id,  x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    cursor = connections['postgis_db'].cursor()
    geom_data = 'LINESTRING( '
    if tuuh_hure_datas.count() > 2:
        geom_data = 'LINESTRING( '
        for tuuh_hure in tuuh_hure_datas:
            geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '
        geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
        geom_data = geom_data + ' )'
        cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
        geom = cursor.fetchone()
        check = TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
        if not check:
            TuuhSoyolHureePol.objects.using('postgis_db').create(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
        update_cursor = connections['postgis_db'].cursor()
        update_cursor.execute(''' UPDATE tuuhsoyolhureepol SET geom = %s WHERE tuuh_soyl = %s and tuuh_soyl_huree_id = %s''', [geom, dursgalt_id,tuuh_soyl_huree_id])

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    idx = payload.get('id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    x = payload.get('x')
    y = payload.get('y')
    x_t=float(x)
    y_t=float(y)
    TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=idx).update(x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    cursor = connections['postgis_db'].cursor()
    geom_data = 'LINESTRING( '
    if tuuh_hure_datas.count() > 2:
        geom_data = 'LINESTRING( '
        for tuuh_hure in tuuh_hure_datas:
            geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '
        geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
        geom_data = geom_data + ' )'
        cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
        geom = cursor.fetchone()
        update_cursor = connections['postgis_db'].cursor()
        update_cursor.execute(''' UPDATE tuuhsoyolhureepol SET geom = %s WHERE tuuh_soyl = %s and tuuh_soyl_huree_id = %s''', [geom, tuuhen_ov,tuuh_soyl_huree_id])

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    tuuhsoyl = TuuhSoyolHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    cursor = connections['postgis_db'].cursor()
    if tuuhsoyl:
        tuuhsoyl.delete()
        geom_data = 'LINESTRING( '
        if tuuh_hure_datas.count() > 2:
            geom_data = 'LINESTRING( '
            for tuuh_hure in tuuh_hure_datas:
                geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '
            geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
            geom_data = geom_data + ' )'
            cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
            geom = cursor.fetchone()
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE tuuhsoyolhureepol SET geom = %s WHERE tuuh_soyl = %s and tuuh_soyl_huree_id = %s''', [geom, tuuhen_ov,tuuh_soyl_huree_id])
        else:
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id).delete()
    else:
        return JsonResponse({'success': False})
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeAll(request, payload):
    ids = payload.get('id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    huree_data = []
    for data in TuuhSoyolHuree.objects.filter(tuuh_soyl=ids, tuuh_soyl_huree_id=tuuh_soyl_huree_id):
        huree_data.append({
            'id': data.id,
            'x': data.x,
            'y': data.y,
            'created_at': data.created_at.strftime('%m-%d-%Y'),
        })
    return JsonResponse({'huree_data': huree_data})


@require_POST
@ajax_required
def ayulAll(request, payload):
    ids = payload.get('id')
    ayul_data = []
    for data in TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=ids):
        ayul_data.append({
            'id': data.id,
            'x': data.x,
            'y': data.y,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'ayul_data': ayul_data})


@require_POST
@ajax_required
def ayulHureeCreate(request, payload):

    x = payload.get('x')
    y = payload.get('y')
    idx = payload.get('dursgalt_id')
    x_t=float(x)
    y_y=float(y)
    TuuhSoyolAyuulHuree.objects.create(tuuh_soyl = idx, x=x, y=y)
    cursor = connections['postgis_db'].cursor()
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl = idx)
    geom_data = 'LINESTRING( '
    if tuuh_hure_datas.count() > 2:
        geom_data = 'LINESTRING( '
        for tuuh_hure in tuuh_hure_datas:
            geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '
        geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
        geom_data = geom_data + ' )'
        cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
        geom = cursor.fetchone()
        check = TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = idx)
        if not check:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').create(tuuh_soyl = idx)
        update_cursor = connections['postgis_db'].cursor()
        update_cursor.execute(''' UPDATE tuuhsoyolayuulhureepol SET geom = %s WHERE tuuh_soyl = %s ''', [geom, idx])

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def ayulHureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    huree_id = payload.get('id')
    x = payload.get('x')
    y = payload.get('y')
    x_t=float(x)
    y_t=float(y)
    TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=tuuhen_ov, pk=huree_id).update(x=x, y=y)
    cursor = connections['postgis_db'].cursor()
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl = tuuhen_ov)
    geom_data = 'LINESTRING( '
    if tuuh_hure_datas.count() > 2:
        geom_data = 'LINESTRING( '
        for tuuh_hure in tuuh_hure_datas:
            geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '
        geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
        geom_data = geom_data + ' )'
        cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
        geom = cursor.fetchone()
        update_cursor = connections['postgis_db'].cursor()
        update_cursor.execute(''' UPDATE tuuhsoyolayuulhureepol SET geom = %s WHERE tuuh_soyl = %s ''', [geom, tuuhen_ov])
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def ayulHureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuhsoyl = TuuhSoyolAyuulHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl = tuuhen_ov)
    cursor = connections['postgis_db'].cursor()
    if tuuhsoyl:
        tuuhsoyl.delete()
        geom_data = 'LINESTRING( '
        if tuuh_hure_datas.count() > 2:
            geom_data = 'LINESTRING( '
            for tuuh_hure in tuuh_hure_datas:
                geom_data = geom_data + tuuh_hure.y + ' ' + tuuh_hure.x + ', '

            geom_data = geom_data + tuuh_hure_datas[0].y + ' ' + tuuh_hure_datas[0].x
            geom_data = geom_data + ' )'
            cursor.execute('''SELECT ST_Polygon(ST_GeomFromText(%s), 4326);''', [geom_data])
            geom = cursor.fetchone()
            update_cursor = connections['postgis_db'].cursor()
            update_cursor.execute(''' UPDATE tuuhsoyolayuulhureepol SET geom = %s WHERE tuuh_soyl = %s ''', [geom, tuuhen_ov])
        else:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = tuuhen_ov).delete()
    else:
        return JsonResponse({'success': False})
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegUstsanEdit(request, payload):
    form_data = []
    img_holoos_url = ''
    img_oiroos_url = ''
    img_baruun_url = ''
    img_zuun_url = ''
    img_omno_url = ''
    img_hoino_url = ''
    for tseg in TsegUstsan.objects.filter(pk = payload.get('id')):
        if tseg.img_holoos:
            img_holoos_url = tseg.img_holoos.url
        if tseg.img_holoos:
            img_holoos_url = tseg.img_holoos.url
        if tseg.img_oiroos:
            img_oiroos_url = tseg.img_oiroos.url
        if tseg.img_baruun:
            img_baruun_url = tseg.img_baruun.url
        if tseg.img_zuun:
            img_zuun_url = tseg.img_zuun.url
        if tseg.img_omno:
            img_omno_url = tseg.img_omno.url
        if tseg.img_hoino:
            img_hoino_url = tseg.img_hoino.url
        form_data.append({
            'tseg_id': tseg.tseg_id,
            'email': tseg.email,
            'name': tseg.name,
            'alban_tushaal': tseg.alban_tushaal,
            'utas': tseg.phone,
            'oiroltsoo_bairlal': tseg.oiroltsoo_bairlal,
            'evdersen_baidal': tseg.evdersen_baidal,
            'nohtsol_baidal': tseg.shaltgaan,
            'sergeeh_sanal': tseg.sergeeh_sanal,
            'gps_hemjilt': tseg.gps_hemjilt,
            'img_holoos': img_holoos_url,
            'img_oiroos': img_oiroos_url,
            'img_baruun': img_baruun_url,
            'img_zuun': img_zuun_url,
            'img_omno': img_omno_url,
            'img_hoino': img_hoino_url,
        })
    rsp ={
        'form_data': form_data
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def tsegPersonalNameSearch(request, payload):
    query = payload.get('query')
    name = payload.get('name')
    List = open(settings.MEDIA_ROOT + '/soil.txt').read().splitlines()
    if(name == 'tesgiin_ner'):
        names = []
        mpoint = Mpoint_view.objects.using('postgis_db').filter(Q(point_name__iexact=query))[:10]
        if(mpoint):
            for tseg in mpoint:
                names.append({
                    "tseg": tseg.point_name
                })
            rsp = {
                'names': names,
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'names': False,
            }
            return JsonResponse(rsp)
    elif(name == 'toviin_dugaar'):
        point_ids = []
        mpoint = Mpoint_view.objects.using('postgis_db').filter(Q(point_id__iexact=query))[:10]
        if(mpoint):
            for tseg in mpoint:
                point_ids.append({
                    "tseg": tseg.point_id
                })
            rsp = {
                'point_ids': point_ids,
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'point_ids':False,
            }
            return JsonResponse(rsp)
    elif(name == 'hors_shinj_baidal'):
        hors_shinj_baidal_list = []
        filterlist = [x for x in List if query in x]
        if(filterlist):
            for tseg in filterlist:
                hors_shinj_baidal_list.append({
                    "tseg": tseg.replace(',', '')
                })
            rsp = {
                'hors_shinj_baidal_list':hors_shinj_baidal_list[:10],
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'hors_shinj_baidal_list':False,
            }
            return JsonResponse(rsp)


@require_POST
@ajax_required
def tsegPersonalSearch(request, payload):
    query = payload.get('query')
    items = []
    names = []
    mpoint = Mpoint_view.objects.using('postgis_db').filter(point_id__iexact=query)[:10]
    if(mpoint):
        for tseg in mpoint:
            items.append({
                "tseg": tseg.point_id
            })
        for name in mpoint[:1]:
            names.append({
                'aimag_ner': name.aimag,
                'sum_ner': name.sum,
            })
        rsp = {
            'items': items,
            'names': names
        }
        return JsonResponse(rsp)
    else:
        rsp = {
            'items': False
        }
        return JsonResponse(rsp)

@require_POST
@ajax_required
def tsegPersonalSuccess(request, payload):
    try:
        point_type = int(payload.get('point_type')) # zereg

        objectid = payload.get('objectid')
        point_class = int(payload.get('point_class'))
        t_type = payload.get('t_type')
        data = None
        if t_type == 'g102':
            data = Mpoint2.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 2:
                data = None
        if t_type == 'g103':
            data = Mpoint3.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 3:
                data = None
        if t_type == 'g104':
            data = Mpoint4.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 4:
                data = None
        if t_type == 'g105':
            data = Mpoint5.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 5:
                data = None
        if t_type == 'g106':
            data = Mpoint6.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 6:
                data = None
        if t_type == 'g107':
            data = Mpoint7.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 7:
                data = None
        if t_type == 'g108':
            data = Mpoint8.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 8:
                data = None
        if t_type == 'g109':
            data = Mpoint9.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 9:
                data = None
        if t_type == 'g110':
            data = Mpoint10.objects.using('postgis_db').filter(id=objectid).first()
            if data.point_class == 10:
                data = None

        if data:
            update_cursor = connections['postgis_db'].cursor()
            if data.point_class == 2:
                mpoint_data = Mpoint2.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id,
                    point_name=data.point_name,
                    pid=data.pid, point_class=2,
                    ondor_type=data.ondor_type,
                    point_class_name='GNSS-ийн байнгын ажиллагаатай станц',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag, sheet1=data.sheet1,
                    sheet2=data.sheet2, sheet3=data.sheet3, ondor=data.ondor,
                    t_type='g102'
                )
                update_cursor.execute(''' UPDATE mpoint2 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 3:
                mpoint_data = Mpoint3.objects.using('postgis_db').create(
                    id=data.id,
                    objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=3,
                    ondor_type=data.ondor_type,
                    point_class_name='GPS-ийн сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g103'
                )
                update_cursor.execute(''' UPDATE mpoint3 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 4:
                mpoint_data = Mpoint4.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=4,
                    ondor_type=data.ondor_type,
                    point_class_name='Триангуляцийн сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g104'
                )
                update_cursor.execute(''' UPDATE mpoint4 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 5:
                mpoint_data = Mpoint5.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=5,
                    ondor_type=data.ondor_type,
                    point_class_name='Полигонометрийн сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g105'
                    )
                update_cursor.execute(''' UPDATE mpoint5 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 6:
                mpoint_data = Mpoint6.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=6,
                    ondor_type=data.ondor_type,
                    point_class_name='Гравиметрийн сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g106'
                    )
                update_cursor.execute(''' UPDATE mpoint6 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 7:
                mpoint_data = Mpoint7.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=7,
                    ondor_type=data.ondor_type,
                    point_class_name='Өндрийн сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g107'
                    )
                update_cursor.execute(''' UPDATE mpoint7 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 8:
                mpoint_data = Mpoint8.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=8,
                    ondor_type=data.ondor_type,
                    point_class_name='Зураглалын сүлжээний цэг',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g108'
                    )
                update_cursor.execute(''' UPDATE mpoint8 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 9:
                mpoint_data = Mpoint9.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=9,
                    ondor_type=data.ondor_type,
                    point_class_name='Шинээр нэмэгдсэн төлөв',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g109'
                    )
                update_cursor.execute(''' UPDATE mpoint9 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
                data.delete()
            if data.point_class == 10:
                mpoint_data = Mpoint10.objects.using('postgis_db').create(
                    id=data.id, objectid=data.objectid,
                    point_id=data.point_id, point_name=data.point_name,
                    pid=data.pid, point_class=10,
                    ondor_type=data.ondor_type,
                    point_class_name='Устсан төлөв',
                    mclass=data.mclass, center_typ=data.center_typ,
                    sum=data.sum, aimag=data.aimag,
                    sheet1=data.sheet1, sheet2=data.sheet2, sheet3=data.sheet3,
                    ondor=data.ondor, t_type='g110'
                    )
                update_cursor.execute(''' UPDATE mpoint10 SET geom = %s WHERE id = %s ''', [data.geom, str(mpoint_data.id)])
            rsp = {
                'success': True,
                'msg': "Амжилттай боллоо",
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'success': False,
                'msg': "Төлөв адилхан тул боломжгүй",
            }
            return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False,
            'msg': "Амжилтгүй боллоо",
        }
        return JsonResponse(rsp)


@require_POST
@ajax_required
def tuuhenOvList(request, payload):
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    display_item = []
    tuuhs = TuuhSoyol.objects.using('postgis_db').annotate(search=SearchVector(
        'dugaar',
        'burtgegch',
        )).filter(search__icontains=query).order_by('id')
    total_items = Paginator(tuuhs, per_page)
    items_page = total_items.page(page)
    for item in items_page.object_list:
        display_item.append({
            'id' : item.id,
            'dugaar': item.dugaar,
            'date': item.date,
            'inspireid': item.inspireid,
            'too_shirheg': item.too_shirheg,
            'aimagname': item.aimagname,
            'sumname': item.sumname,
            'burtgegch': item.burtgegch,
            'created_at': item.created_at.strftime('%Y-%m-%d'),
        })
    total_page = total_items.num_pages
    rsp = {
        'items': display_item,
        'page': page,
        'total_page': total_page,
    }
    return JsonResponse(rsp)