import os
import json
import pyproj
import uuid

from fpdf import FPDF
from pyproj import Transformer

from django.db import connections, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.contrib.gis.geos import GEOSGeometry, Point, Polygon
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchVector
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.paginator import Paginator

from backend.inspire.models import (
    LFeatures,
    LPackages,
    LThemes,
    LProperties,
)
from backend.org.models import Employee, Org
from geoportal_app.models import User
from .models import TsegRequest

from .models import (
    TsegUstsan,
    TsegPersonal,
    TuuhSoyol,
    TuuhSoyolPoint,
    TuuhSoyolHuree,
    TuuhSoyolAyuulHuree,
    Mpoint_view,
    Mpoint2,
    Mpoint3,
    Mpoint4,
    Mpoint5,
    Mpoint6,
    Mpoint7,
    Mpoint8,
    Mpoint9,
    Mpoint10,
    TuuhSoyolHureePol,
    TuuhSoyolAyuulHureePol,
    TsegUstsanLog,
)

from main.decorators import ajax_required
from main.components import Datatable
from main import utils
# Create your models here.


def createPdf(tseg, x, y):

    data = Mpoint_view.objects.using('postgis_db').filter(point_id=tseg['PointNumber']).first()
    if y and x:
        L = float(y)
        B = float(x)
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
    pdf.cell(41, 8, 'Цэгийн дугаар', 1, 0, 'C')
    pdf.cell(43, 8, data.point_id, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    pdf.cell(-188)
    pdf.cell(10, 8, '3.', 1, 0, 'C')
    pdf.cell(51, 8, 'Трапцийн дугаар', 1, 0, 'C')
    trapets = 'Байхгүй'
    if 'Nomenclature' in tseg:
        trapets = tseg['Nomenclature']
    pdf.cell(33, 8, trapets, 1, 0, 'C')
    pdf.cell(10, 8, '4.', 1, 0, 'C')
    pdf.cell(41, 8, 'Сүлжээний төрөл', 1, 0, 'C')
    pdf.cell(43, 8, str(tseg['GeodeticalNetworkPointClassValue']), 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    # mor 3
    pdf.ln(0)
    pdf.cell(10, 8, '5.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байршил (Аймаг, сум, дүүрэг)', 1, 0, 'C')
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
    if 'PointNearPhoto' in tseg:
        pdf.image(os.path.join(settings.MEDIA_ROOT, tseg['PointNearPhoto']), x = 11, y = 83, w = 92, h = 60, type = '', link = '')
    if 'PointFarPhoto' in tseg:
        pdf.image(os.path.join(settings.MEDIA_ROOT, tseg['PointFarPhoto']), x = 105, y = 83, w = 92, h = 60, type = '', link = '')
    # mor 6
    pdf.ln(0)
    pdf.cell(188, 8, '8. Байршлийн тухай', 1, 0, 'C')
    pdf.ln(8)
    pdf.multi_cell(188, 5, tseg['PointLocationDescription'], 1, 0, 'C')
    newH = pdf.get_y()
    # mor 6
    if 'LocationOverviewMap' in tseg:
        pdf.cell(94, 8, '9. Байршлын тойм зураг.', 1, 0, 'C')
        pdf.cell(94, 8, '10. Төв цэгийн хэлбэр', 1, 0, 'C')
        pdf.ln(8)
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.ln(62)
        pdf.image(os.path.join(settings.MEDIA_ROOT, tseg['PointCenterType']), x = 11, y = newH + 8, w = 92, h =60, type = '', link = '')
        pdf.image(os.path.join(settings.MEDIA_ROOT, tseg['LocationOverviewMap']), x = 105, y = newH + 8, w = 92, h =60, type = '', link = '')
    else:
        pdf.ln(0)
    # mor 6
    pdf.cell(10, 8, '11.', 1, 0, 'C')
    if 'sudalga_or_shine' in tseg:
        sudalgaa = tseg['sudalga_or_shine']
    else:
        sudalgaa = 'Байхгүй'
    pdf.cell(84, 8, 'Судалгаа: ' + sudalgaa, 1, 0, 'C')
    pdf.cell(10, 8, '12.', 1, 0, 'C')
    if 'date' in tseg:
        date = tseg['date']
    else:
        date = ''

    pdf.cell(84, 8, 'Огноо: ' +  date, 1, 0, 'C')

    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '13.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хөрсний шинж байдал:', 1, 0, 'C')
    pdf.cell(94, 8, tseg['SoilType'], 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '14.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хувийн хэрэг хөтөлсөн:', 1, 0, 'C')
    pdf.cell(94, 8, tseg['EmployeeName'], 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '15.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байгууллага', 1, 0, 'C')
    pdf.cell(94, 8, tseg['CompanyName'], 1, 0, 'C')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
def dursgaltGazarUpdate(request, payload):
    form_datas = payload.get('form_datas')
    form_datas_values = payload.get('form_datas_values')
    tuuhsoyl = TuuhSoyol.objects.using('postgis_db').filter(id=form_datas['tuuhenov_id']).first()
    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinaty'])
    geom = Point(y, x)
    dursgal = form_datas_values['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'
    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']
    stone = form_datas_values['torol_zuiltorol_zuil_name']
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
                            geom = geom
                            )
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def dursgaltGazarCreate(request, payload):
    form_datas = payload.get('form_datas')
    form_datas_values = payload.get('form_datas_values')
    tuuhsoyl = TuuhSoyol.objects.using('postgis_db').filter(id=form_datas['tuuhenov_id']).first()
    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinaty'])
    geom = Point(y, x)
    dursgal = form_datas_values['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'
    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']
    stone = form_datas_values['torol_zuiltorol_zuil_name']
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
                            geom = geom
                            )
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def dursgaltGazarAll(request, payload):
    page = payload.get('page')
    query = payload.get('query')
    per_page = payload.get('perpage')
    tuuh_soyol = payload.get('id')
    form_data = []
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    if query == None:
        query = ''
    if page == None:
        page = 1
    data = TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl = tuuh_soyol).annotate(search=SearchVector('dursgal')).filter(search__contains=query).order_by(sort_name)

    total_items = Paginator(data, per_page)
    items_page = total_items.page(page)
    page_items = items_page.object_list
    for data in page_items:
        form_data.append({
            'id': data.id,
            'dursgal': data.dursgal,
            'tuuh_soyl': data.tuuh_soyl,
            'x': data.x,
            'y': data.y,
            'stone': data.stone,
            'protection': data.protection,
            'point_check': findPoint(data.x, data.y, tuuh_soyol),
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    total_page = total_items.num_pages
    rsp = {
    'items': form_data,
    'page': page,
    'total_page': total_page
    }
    return JsonResponse(rsp)


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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
def tseg_personal_list(request, payload):
    requests = TsegRequest.objects
    requests = requests.exclude(state=TsegRequest.STATE_REJECT)
    if requests:
        datatable = Datatable(
            initial_qs=requests,
            model=TsegRequest,
            payload=payload,
        )

        items, total_page = datatable.get()
        rsp = {
            'items': items,
            'page': payload.get("page"),
            'total_page': total_page
        }
    else:
        rsp = {
            'items': [],
            'page': 1,
            'total_page': 1,
        }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegPersonalRemove(request, payload):
    pk = payload.get('id')
    t_type = payload.get('t_type')
    class_type = Mpoint_view.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    data = None
    if class_type.t_type == 'g102':
        data = Mpoint2.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g103':
        data = Mpoint3.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g104':
        data = Mpoint4.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g105':
        data = Mpoint5.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g106':
        data = Mpoint6.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g107':
        data = Mpoint7.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g108':
        data = Mpoint8.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if class_type.t_type == 'g109':
        data = Mpoint9.objects.using('postgis_db').filter(id=pk, t_type=t_type).first()
    if data:
        mpoint10 = Mpoint10.objects.using('postgis_db').create(
            objectid=data.objectid,
            point_id=data.point_id,
            point_name=data.point_name,
            point_class_name='Устсан төлөв',
            pid=data.pid,
            point_class=data.point_class,
            mclass=data.mclass,
            center_typ=data.center_typ,
            aimag=data.aimag,
            sum=data.sum,
            sheet1=data.sheet1,
            sheet2=data.sheet2,
            sheet3=data.sheet3,
            ondor=data.ondor,
            ondor_type=data.ondor_type,
            t_type='g110',
            geom=data.geom
        )
        if mpoint10:
            data.delete()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegPersonalUpdate(request, payload):
    pk = payload.get('id')
    tseg_display = []

    requests = TsegRequest.objects
    requests = requests.filter(pk=pk).first()
    if requests:
        geo_json = json.loads(requests.geo_json)
        if geo_json['coordinates']:
            latlongx = geo_json['coordinates'][0]
            latlongy = geo_json['coordinates'][1]
            LA = int(float(latlongx))
            LB = int((float(latlongx)-LA)*60)
            LC = float("{:.6f}".format(((float(latlongx))-LA-LB/60)*3600 ))
            BA = int(float(latlongy))
            BB = int((float(latlongy)-BA)*60)
            BC = (float(float(latlongy))-BA-BB/60)*3600

        if requests.values:
            values = json.loads(requests.values)
            sheets = values['Nomenclature']
            sheets = sheets.split("-")

            tseg_display.append({
                'latlongx': latlongx,
                'latlongy': latlongy,
                'LA': LA,
                'LB': LB,
                'LC': LC,
                'BA': BA,
                'BB': BB,
                'BC': BC,
                'tseg_oiroos_img_url': '/media/' + values['PointNearPhoto'] if values and 'PointNearPhoto' in values else '',
                'tseg_holoos_img_url': '/media/' + values['PointFarPhoto'] if values and 'PointFarPhoto' in values else '',
                'barishil_tuhai': values['PointLocationDescription'] if 'PointLocationDescription' in values else '',
                'bairshil_tseg_oiroos_img_url': '/media/' + values['PointCenterType'] if values and 'PointCenterType' in values else '',
                'bairshil_tseg_holoos_img_url': '/media/' + values['LocationOverviewMap'] if values and 'LocationOverviewMap' in values else '',
                'sudalga_or_shine':  values['PointShape'] if 'PointShape' in values else '',
                'hors_shinj_baidal': values['Nomenclature'] if 'Nomenclature' in values else '',
                'date': values['beginLifespanVersion'].strftime("%Y-%m-%d") if values and 'beginLifespanVersion' in values else '',
                'hotolson': values['EmployeeName'] if 'EmployeeName' in values else '',
                'alban_tushaal': values['EmployeePosition'] if 'EmployeePosition' in values else '',
                'alban_baiguullga': values['CompanyName'] if 'CompanyName' in values else '',
                'suljeenii_torol': values['GeodeticalNetworkPointClassValue'] if 'GeodeticalNetworkPointClassValue' in values else '',
                'id': requests.id if requests.id else '',
                'point_id': requests.point_id if  requests.point_id else '',
                'point_name': requests.point_name if requests.point_name else '',
                'pid': requests.pdf_id if requests.pdf_id else '',
                'aimag': requests.aimag if requests.aimag else '',
                'sum': requests.sum if requests.sum else '',
                'sheet1': sheets[0],
                'zone': int(sheets[1]),
                'cc': int(sheets[2]),
                'center_typ': requests.point_type if requests.point_type else '',
                'ondor': values['elevation'] if values['elevation'] else '',
                'geo_id': values['geo_id']
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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


def _get_point_class_name(point_class):
    obj = {
        str(utils.InspireCodeList('G102_P').code_list_id): '2', # gnss in baingin ajillagatai
        str(utils.InspireCodeList('G103_P').code_list_id): '3', # gps iin suljee
        str(utils.InspireCodeList('G104_P').code_list_id): '4', # trangulyts
        str(utils.InspireCodeList('G105_P').code_list_id): '5', # polygometer
        str(utils.InspireCodeList('G106_P').code_list_id): '6', # gravimeter
        str(utils.InspireCodeList('G107_P').code_list_id): '7', # ulsin geodiez undur suljee
        str(utils.InspireCodeList('G108_P').code_list_id): '8', # zuraglalliin suljee
    }
    return obj[str(point_class)]


def _create_request(request_datas):
    change_request = TsegRequest()

    change_request.old_geo_id = None
    change_request.new_geo_id = None
    change_request.theme_id = request_datas['theme_id']
    change_request.package_id = request_datas['package_id']
    change_request.feature_id = request_datas['feature_id']
    change_request.employee = request_datas['employee']
    change_request.org = request_datas['employee'].org
    change_request.state = request_datas['state']
    change_request.kind = request_datas['kind']
    change_request.form_json = request_datas['form_json'] if 'form_json' in request_datas else None
    change_request.geo_json = request_datas['geo_json'] if 'geo_json' in request_datas else None
    change_request.values = request_datas['values'] if 'values' in request_datas else None
    change_request.pdf_id = request_datas['pdf_id'] if 'pdf_id' in request_datas else None
    change_request.point_id = request_datas['point_id'] if 'point_id' in request_datas else None
    change_request.point_name = request_datas['point_name'] if 'point_name' in request_datas else None

    change_request.point_class = request_datas['point_class'] if 'point_class' in request_datas else None
    change_request.point_type = request_datas['point_type'] if 'point_type' in request_datas else None

    change_request.save()
    return change_request.id


def _check_and_make_form_json(feature_id, values):
    form_json_list = list()
    code_list_values = ""

    for key, value in values.items():
        prop_qs = LProperties.objects
        prop_qs = prop_qs.filter(property_code=key)
        prop_qs = prop_qs.first()

        form_json = dict()
        form_json['property_name'] = prop_qs.property_name
        form_json['property_id'] = prop_qs.property_id
        form_json['property_code'] = prop_qs.property_code
        form_json['property_definition'] = prop_qs.property_definition
        if prop_qs.value_type_id == 'single-select':
            code_list_values = utils.get_code_list_from_property_id(prop_qs.property_id)
        form_json['value_type_id'] = prop_qs.value_type_id
        form_json['value_type'] = prop_qs.value_type_id
        form_json['data_list'] = code_list_values
        form_json['data'] = ''

        for p_code, value in values.items():
            if p_code.lower() in prop_qs.property_name.lower():
                form_json['data'] = value
                if prop_qs.value_type_id == 'date':
                    form_json['data'] = utils.date_fix_format(value)

        form_json_list.append(form_json)

    form_json_list = json.dumps(form_json_list, ensure_ascii=False)
    return form_json_list


def _make_request_datas(values, request_values):
    form_json_list = _check_and_make_form_json(
        request_values['feature_id'],
        values
    )

    request_datas = {
        'theme_id': request_values['theme_id'],
        'package_id': request_values['package_id'],
        'feature_id': request_values['feature_id'],
        'employee': request_values['employee'],
        'state': TsegRequest.STATE_NEW,
        'kind': request_values['kind'],
        'form_json': form_json_list,
        'geo_json': request_values['geo_json'],
        'values': json.dumps(values, ensure_ascii=False),
        'pdf_id': request_values['pdf_id'],
        'point_id': request_values['point_id'],
        'point_name': request_values['point_name'],
        'point_class': request_values['point_class'],
        'point_type': request_values['point_type'],
    }

    success = _create_request(request_datas)
    info = 'Амжилттай хадгаллаа'

    return success, info


def _get_model_qs(Model, search):
    qs = Model.objects
    qs = qs.filter(**search)
    return qs


def _get_values(request):
    value = dict()
    value['PointNumber'] = request.POST.get('toviin_dugaar').zfill(4) if(len(request.POST.get('toviin_dugaar')) < 4) else request.POST.get('toviin_dugaar')
    value['GeodeticalNetworkPointClassValue'] = int(request.POST.get('suljeenii_torol')) #bolson
    value['GeodeticalNetworkPointTypeValue'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None # bolson
    value['PointLocationDescription'] = request.POST.get('barishil_tuhai') # bolson
    value['Nomenclature'] = str(request.POST.get('trapetsiin_dugaar')) + "-" + str(request.POST.get('BA')) + "-" + str(request.POST.get('LA'))#bolson
    value['EmployeePosition'] = request.POST.get('alban_tushaal') # bolson
    value['EmployeeName'] = request.POST.get('hotolson') # bolson
    value['CompanyName'] = request.POST.get('alban_baiguullga') # bolson
    value['OperatorName'] = request.POST.get('alban_baiguullga') # bolson
    value['name'] = request.POST.get('tesgiin_ner') # bolson
    value['beginLifespanVersion'] = utils.date_to_timezone(request.POST.get('date')) #bolson
    value['AdministrativeUnitSubClass_1'] = request.POST.get('aimag_name') #bolson
    value['AdministrativeUnitSubClass_2'] = request.POST.get('sum_name') #bolson
    value['SoilType'] = request.POST.get('hors_shinj_baidal') #mdku
    # value['endLifespanVersion'] = date # ustsanii daraah hadagalah # TODO
    value['elevation'] = request.POST.get('ondor')#bolson
    return value


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegPersonal(request):
    employee = get_object_or_404(Employee, user=request.user)
    pk = request.POST.get('idx')
    point_id = request.POST.get('toviin_dugaar')

    tseg_image_url = 'tseg-personal'
    tseg_bairshil_img_url = 'tseg-personal-img'

    request_values = dict()

    create_tseg = True

    qs = _get_model_qs(LThemes, {'theme_code': 'gnp'})
    theme_id = qs.first().theme_id
    qs = _get_model_qs(LPackages, {'theme_id': theme_id})
    package_id = qs.first().package_id
    qs = _get_model_qs(LFeatures, {'package_id': package_id})
    feature_id = qs.first().feature_id

    feature_code = qs.first().feature_code

    request_values['theme_id'] = theme_id
    request_values['package_id'] = package_id
    request_values['feature_id'] = feature_id
    request_values['employee'] = employee

    if pk:
        create_tseg = False

    y = float(request.POST.get('latlongy'))
    x = float(request.POST.get('latlongx'))
    geom = Point(x, y)

    def _save_image(request_name, folder_path, request):
        image_name = ''
        if request.POST.get(request_name):
            [image_x2] = utils.resize_b64_to_sizes(request.POST.get(request_name), [(720, 720)])
            image_name = utils.save_img_to_folder(image_x2, folder_path, 'img', '.png')
        return image_name

    with transaction.atomic():
        if not create_tseg:
            tseg = utils.get_mdata_values(feature_code, point_id)

            if not tseg:
                create_tseg = True

                value = _get_values(request)

                def _remove_and_save(request_name, property_name, tseg, value, folder_path, request):
                    post_request = request.POST.get(request_name)
                    if post_request and len(post_request) > 2000:
                        if property_name in tseg:
                            os.remove(os.path.join(settings.MEDIA_ROOT, tseg[property_name]))

                        value[property_name] = _save_image(request_name, folder_path, request)

                    return value

                value = _remove_and_save('tseg_oiroos_img_url', 'PointNearPhoto', tseg, value, tseg_image_url, request)
                value = _remove_and_save('tseg_holoos_img_url', 'PointFarPhoto', tseg, value, tseg_image_url, request)
                value = _remove_and_save('bairshil_tseg_oiroos_img_url', 'PointCenterType', tseg, value, tseg_bairshil_img_url, request)
                value = _remove_and_save('bairshil_tseg_holoos_img_url', 'LocationOverviewMap', tseg, value, tseg_bairshil_img_url, request)

                # TODO
                # if not request.POST.get('file1'):
                #     tseg_personal.file_path1.delete(save=False)
                #     tseg_personal.file_path1 = request.FILES['file1']
                #     tseg_personal.save()

                # if not request.POST.get('file2'):
                #     tseg_personal.file_path2.delete(save=False)
                #     tseg_personal.file_path2 = request.FILES['file2']
                #     tseg_personal.save()

                # mdatas = utils.save_value_to_mdatas(value, feature_code, [x, y, 0], geo_id=geo_id)

                request_values['kind'] = TsegPersonal.KIND_UPDATE
                request_values['geo_json'] = geom.json
                request_values['pdf_id'] = point_id

                request_values['point_id'] = point_id
                request_values['point_name'] = request.POST.get('tesgiin_ner')
                request_values['point_class'] = request.POST.get('suljeenii_torol')
                request_values['point_type'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None

                _make_request_datas(value, request_values)
                return JsonResponse({ 'success': True, 'name': False, 'ids': False })

        if create_tseg:
            has_name, has_ids = utils.check_saved_data(request.POST.get('tesgiin_ner'), point_id) # tsegiin ner bolon object id ni huuchin hadgalsan uguig shalgana

            if has_name or has_ids:
                name = False
                ids = False
                if has_name:
                    name = True
                if has_ids:
                    ids = True
                return JsonResponse({'success': False, 'name': name, 'ids':ids})

            # TODO
            # if not request.POST.get('file1'):
                # file1 = request.FILES['file1']
                # file1_name = utils.save_file_to_storage(file1, tseg_file_url)
            # if not request.POST.get('file2'):
                # file2 = request.FILES['file2']
                # file2_name = utils.save_file_to_storage(file2, tseg_file_url)

            value = _get_values(request)

            def _make_value(request_name, property_name, folder_path, request, value):
                image_name = _save_image(request_name, folder_path, request)
                if image_name:
                    value[property_name] = image_name

                return value

            value = _make_value('tseg_oiroos_img_url', 'PointNearPhoto', tseg_image_url, request, value)
            value = _make_value('tseg_holoos_img_url', 'PointFarPhoto', tseg_image_url, request, value)
            value = _make_value('bairshil_tseg_oiroos_img_url', 'PointCenterType', tseg_bairshil_img_url, request, value)
            value = _make_value('bairshil_tseg_holoos_img_url', 'LocationOverviewMap', tseg_bairshil_img_url, request, value)

            request_values['kind'] = TsegRequest.KIND_CREATE
            request_values['geo_json'] = geom.json
            request_values['pdf_id'] = point_id

            request_values['point_id'] = point_id
            request_values['point_name'] = request.POST.get('tesgiin_ner')
            request_values['point_class'] = request.POST.get('suljeenii_torol')
            request_values['point_type'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None

            _make_request_datas(value, request_values)
            # mdatas = utils.save_value_to_mdatas(value, feature_code, [x, y, 0])

    return JsonResponse({'success': True, 'name': False, 'ids': False})


def _send_data_to_pdf(values, file_name, tseg_file_url='tseg-personal-file'):
    src_file = os.path.join(settings.FILES_ROOT, file_name + ".pdf")
    pdf = createPdf(values['value'], values['x'], values['y'])
    pdf.output(src_file, 'F')


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
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
            [image_x2] = utils.resize_b64_to_sizes(img_holoos, [(200, 200)])
            Tsegs.img_holoos = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_oiroos and len(img_oiroos) > 2000:
            Tsegs.img_oiroos.delete(save=False)
            [image_x2] = utils.resize_b64_to_sizes(img_oiroos, [(200, 200)])
            Tsegs.img_oiroos = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_baruun  and len(img_baruun) > 2000:
            Tsegs.img_baruun.delete(save=False)
            [image_x2] = utils.resize_b64_to_sizes(img_baruun, [(200, 200)])
            Tsegs.img_baruun = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_zuun and len(img_zuun) > 2000:
            Tsegs.img_zuun.delete(save=False)
            [image_x2] = utils.resize_b64_to_sizes(img_zuun, [(200, 200)])
            Tsegs.img_zuun = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_omno and len(img_omno) > 2000:
            Tsegs.img_omno.delete(save=False)
            [image_x2] = utils.resize_b64_to_sizes(img_omno, [(200, 200)])
            Tsegs.img_omno = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        if img_hoino and len(img_hoino) > 2000:
            Tsegs.img_hoino.delete(save=False)
            [image_x2] = utils.resize_b64_to_sizes(img_hoino, [(200, 200)])
            Tsegs.img_hoino = SimpleUploadedFile('icon.png', image_x2)
            Tsegs.save()
        return JsonResponse({'success': True})

    else:
        if img_holoos:
            [image_x2] = utils.resize_b64_to_sizes(img_holoos, [(720, 720)])
            img_holoos = SimpleUploadedFile('img.png', image_x2)
        if img_oiroos:
            [image_x2] = utils.resize_b64_to_sizes(img_oiroos, [(720, 720)])
            img_oiroos = SimpleUploadedFile('img.png', image_x2)
        if img_baruun:
            [image_x2] = utils.resize_b64_to_sizes(img_baruun, [(720, 720)])
            img_baruun = SimpleUploadedFile('img.png', image_x2)
        if img_zuun:
            [image_x2] = utils.resize_b64_to_sizes(img_zuun, [(720, 720)])
            img_zuun = SimpleUploadedFile('img.png', image_x2)
        if img_hoino:
            [image_x2] = utils.resize_b64_to_sizes(img_hoino, [(720, 720)])
            img_hoino = SimpleUploadedFile('img.png', image_x2)
        if img_omno:
            [image_x2] = utils.resize_b64_to_sizes(img_omno, [(720, 720)])
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
@login_required(login_url='/gov/secure/login/')
def tsegUstsanSuccess(request, payload):
    pk = payload.get('id')

    tseg_request = get_object_or_404(TsegRequest, pk=pk, kind=TsegRequest.STATE_REJECT)
    #TODO ustsan tseg iig ustgah iig batalgaajuulah batalgaajwal mdatas mgeodatas aas ustana refreshmaterialzed view
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegUstsanList(request, payload):
    page = payload.get('page')
    per_page = payload.get('perpage')
    query = payload.get('query')
    display_items = []
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    tsegs = TsegUstsan.objects.annotate(search=SearchVector('email','tseg_id','name')).filter(search__icontains=query).order_by(sort_name)

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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
def hureeCreate(request, payload):
    x = payload.get('x')
    y = payload.get('y')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    dursgalt_id = payload.get('dursgalt_id')
    x_t=float(x)
    y_t=float(y)
    TuuhSoyolHuree.objects.create(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl = dursgalt_id,  x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    point = []
    points = []
    if tuuh_hure_datas.count() > 2:
        for tuuh_hure in tuuh_hure_datas:
            x = float(tuuh_hure.x)
            y = float(tuuh_hure.y)
            point = (y, x)
            points.append(point)
        x = float(tuuh_hure_datas[0].x)
        y = float(tuuh_hure_datas[0].y)
        point = (y, x)
        points.append(point)
        geom = Polygon(points)
        check = TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
        if not check:
            TuuhSoyolHureePol.objects.using('postgis_db').create(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)
        else:
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id).update(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def hureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    idx = payload.get('id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    x = payload.get('x')
    y = payload.get('y')
    x_t=float(x)
    y_t=float(y)
    point = []
    points = []
    TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=idx).update(x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    if tuuh_hure_datas.count() > 2:
        for tuuh_hure in tuuh_hure_datas:
            x = float(tuuh_hure.x)
            y = float(tuuh_hure.y)
            point = (y, x)
            points.append(point)
        x = float(tuuh_hure_datas[0].x)
        y = float(tuuh_hure_datas[0].y)
        point = (y, x)
        points.append(point)
        geom = Polygon(points)
        TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl=tuuhen_ov).update(tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def hureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    tuuhsoyl = TuuhSoyolHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
    point = []
    points = []
    if tuuhsoyl:
        tuuhsoyl.delete()
        if tuuh_hure_datas.count() > 2:
            for tuuh_hure in tuuh_hure_datas:
                x = float(tuuh_hure.x)
                y = float(tuuh_hure.y)
                point = (y, x)
                points.append(point)
            x = float(tuuh_hure_datas[0].x)
            y = float(tuuh_hure_datas[0].y)
            point = (y, x)
            points.append(point)
            geom = Polygon(points)
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl = tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id).update(tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)
        else:
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl=tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id).delete()
    else:
        return JsonResponse({'success': False})
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
def ayulHureeCreate(request, payload):
    x = payload.get('x')
    y = payload.get('y')
    idx = payload.get('dursgalt_id')
    x_t=float(x)
    y_y=float(y)
    TuuhSoyolAyuulHuree.objects.create(tuuh_soyl = idx, x=x, y=y)
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=idx)
    point = []
    points = []
    if tuuh_hure_datas.count() > 2:
        for tuuh_hure in tuuh_hure_datas:
            x = float(tuuh_hure.x)
            y = float(tuuh_hure.y)
            point = (y, x)
            points.append(point)
        x = float(tuuh_hure_datas[0].x)
        y = float(tuuh_hure_datas[0].y)
        point = (y, x)
        points.append(point)
        geom = Polygon(points)
        check = TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = idx)
        if not check:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').create(tuuh_soyl = idx, geom = geom)
        else:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = idx).update(tuuh_soyl = idx, geom = geom)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def ayulHureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    huree_id = payload.get('id')
    x = payload.get('x')
    y = payload.get('y')
    x_t=float(x)
    y_t=float(y)
    TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=idx).update(x=x, y=y)
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl = tuuhen_ov, id = huree_id)
    point = []
    points = []
    if tuuh_hure_datas.count() > 2:
        for tuuh_hure in tuuh_hure_datas:
            x = float(tuuh_hure.x)
            y = float(tuuh_hure.y)
            point = (y, x)
            points.append(point)
        x = float(tuuh_hure_datas[0].x)
        y = float(tuuh_hure_datas[0].y)
        point = (y, x)
        points.append(point)
        geom = Polygon(points)
        TuuhSoyolAyuulHureePol.objects.using('postgis_db').update(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def ayulHureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuhsoyl = TuuhSoyolAyuulHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl = tuuhen_ov)
    point = []
    points = []
    if tuuhsoyl:
        tuuhsoyl.delete()
        if tuuh_hure_datas.count() > 2:
            for tuuh_hure in tuuh_hure_datas:
                x = float(tuuh_hure.x)
                y = float(tuuh_hure.y)
                point = (y, x)
                points.append(point)
            x = float(tuuh_hure_datas[0].x)
            y = float(tuuh_hure_datas[0].y)
            point = (y, x)
            points.append(point)
            geom = Polygon(points)
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').update(tuuh_soyl = tuuhen_ov, geom = geom)
        else:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = tuuhen_ov).delete()
    else:
        return JsonResponse({'success': False})
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
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
@login_required(login_url='/gov/secure/login/')
def tsegPersonalSuccess(request, payload):
    feauture_id = 83
    point_type = int(payload.get('point_type')) # zereg

    objectid = payload.get('objectid')
    point_class = int(payload.get('point_class'))

    if data:
        #TODO tuhain huseltend bgaa form iig m_datas ruu hadgalaad geom iig ni mdatas ruu hadgalana
        utils.refreshMaterializedView(feauture_id)
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


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tuuhenOvList(request, payload):
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    display_item = []
    sort_name = payload.get('sort_name')
    if not sort_name:
        sort_name = 'id'
    tuuhs = TuuhSoyol.objects.using('postgis_db').annotate(search=SearchVector(
        'dugaar',
        'burtgegch',
        )).filter(search__icontains=query).order_by(sort_name)
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


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def rows(request, payload):
    tuuh_soyl = payload.get('id')
    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            id, ST_AsGeoJSON(ST_Transform(geom,4326)) as geom
        FROM
            tuuhsoyolhureepol
        WHERE
            tuuh_soyl = %s
        ORDER BY id ASC
    """
    cursor.execute(sql,[tuuh_soyl])
    rows = utils.dict_fetchall(cursor)
    rows = list(rows)
    rsp = {
        'rows': rows,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def ayuul_geoms(request, payload):
    tuuh_soyl = payload.get('id')
    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            id, ST_AsGeoJSON(ST_Transform(geom,4326)) as geom
        FROM
            tuuhsoyolayuulhureepol
        WHERE
            tuuh_soyl = %s
        ORDER BY id ASC
    """
    cursor.execute(sql,[tuuh_soyl])
    ayuul_geoms = utils.dict_fetchall(cursor)
    ayuul_geoms = list(ayuul_geoms)
    rsp = {
        'ayuul_geoms': ayuul_geoms,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def geom_points(request, payload):
    tuuh_soyl = payload.get('id')
    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            id, ST_AsGeoJSON(ST_Transform(geom,4326)) as geom
        FROM
            tuuhsoyolpoint
        WHERE
            tuuh_soyl = %s
        ORDER BY id ASC
    """
    cursor.execute(sql, [tuuh_soyl])
    geom_points = utils.dict_fetchall(cursor)
    geom_points = list(geom_points)
    rsp = {
        'geom_points': geom_points,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_field_values(request):
    point_type = utils.InspireProperty('GeodeticalNetworkPointTypeValue')
    point_class = utils.InspireProperty('GeodeticalNetworkPointClassValue')
    ondor_type = utils.InspireProperty('elevationReference')
    # nativeness = utils.InspireProperty('nativeness')
    point_types = utils.get_code_list_from_property_id(point_type.property_id)
    point_classes = utils.get_code_list_from_property_id(point_class.property_id)
    ondor_types = utils.get_code_list_from_property_id(ondor_type.property_id)
    # nativeness = utils.get_code_list_from_property_id(nativeness.property_id)
    rsp = {
        'point_types': point_types,
        'point_classes': point_classes,
        'ondor_types': ondor_types,
        # 'nativeness': nativeness,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_request_list(request, payload):
    datatable = Datatable(
        model=TsegRequest,
        payload=payload,
    )

    items, total_page = datatable.get()
    rsp = {
        'items': items,
        'page': payload.get("page"),
        'total_page': total_page
    }
    return JsonResponse(rsp)