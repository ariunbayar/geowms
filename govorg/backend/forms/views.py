import os
import json
import uuid

from fpdf import FPDF
from pyproj import Transformer

from django.db import connections, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.contrib.gis.geos import Point, Polygon
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchVector
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.paginator import Paginator

from backend.inspire.models import (
    LCodeLists, LFeatures,
    LPackages,
    LThemes,
    LProperties, MDatas, MGeoDatas,
    EmpPermInspire, EmpPerm
)
from backend.org.models import Employee
from geoportal_app.models import User
from .models import TsegRequest

from .models import (
    TsegUstsan,
    TuuhSoyol,
    TuuhSoyolPoint,
    TuuhSoyolHuree,
    TuuhSoyolAyuulHuree,
    Mpoint_view,
    TuuhSoyolHureePol,
    TuuhSoyolAyuulHureePol,
)

from main.decorators import ajax_required
from main.components import Datatable
from main import utils
# Create your models here.


def _get_model_qs(Model, search):
    qs = Model.objects
    qs = qs.filter(**search)
    return qs


def createPdf(values, requests):

    geo_json = json.loads(requests.geo_json)
    coroutines = geo_json['coordinates']
    x = coroutines[0]
    y = coroutines[1]

    if y and x:
        L = float(y)
        B = float(x)
        LA = int(L)
        LB = int((L - LA) * 60)
        LC = float((L - LA - LB / 60) * 3600)
        LC = "%.6f" % LC
        BA = int(B)
        BB = int((B - BA) * 60)
        BC = float((B - BA - BB / 60) * 3600)
        BC = "%.6f" % BC
        Bchar = str(BA) + '°' + str(BB) + "'" + str(float(BC)) + '"'
        Lchar = str(LA) + '°' + str(LB) + "'" + str(float(LC)) + '"'
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
    pdf.cell(43, 8, requests.point_name, 1, 0, 'C')

    pdf.cell(10, 8, '2.', 1, 0, 'C')
    pdf.cell(41, 8, 'Цэгийн дугаар', 1, 0, 'C')
    pdf.cell(43, 8, requests.point_id, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    pdf.cell(-188)
    pdf.cell(10, 8, '3.', 1, 0, 'C')
    pdf.cell(51, 8, 'Трапцийн дугаар', 1, 0, 'C')
    trapets = 'Байхгүй'
    if 'Nomenclature' in values:
        trapets = values['Nomenclature']
    pdf.cell(33, 8, trapets, 1, 0, 'C')
    pdf.cell(10, 8, '4.', 1, 0, 'C')
    pdf.cell(41, 8, 'Сүлжээний төрөл', 1, 0, 'C')
    suljee = ''
    if 'Geodeticаlnetworktype' in values:
        qs = _get_model_qs(LCodeLists, {'code_list_id': values['Geodeticаlnetworktype']})
        if qs:
            suljee = qs.first().code_list_name
    pdf.cell(43, 8, suljee, 1, 0, 'C')
    pdf.cell(90, 8, " ", 0, 2, 'C')
    # mor 3
    pdf.ln(0)
    pdf.cell(10, 8, '5.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байршил (Аймаг, сум, дүүрэг)', 1, 0, 'C')
    pdf.cell(94, 8, requests.aimag + ' ' + requests.sum, 1, 1, 'C')
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
    if 'photoOfControlPointToNear' in values:
        pdf.image(os.path.join(settings.MEDIA_ROOT, values['photoOfControlPointToNear']), x=11, y=83, w=92, h=60, type='', link='')
    if 'photoOfControlPoinFromFar' in values:
        pdf.image(os.path.join(settings.MEDIA_ROOT, values['photoOfControlPoinFromFar']), x=105, y=83, w=92, h=60, type='', link='')
    # mor 6
    pdf.ln(0)
    pdf.cell(188, 8, '8. Байршлийн тухай', 1, 0, 'C')
    pdf.ln(8)
    pdf.multi_cell(188, 5, values['locationNote'], 1, 0, 'C')
    newH = pdf.get_y()
    # mor 6
    if 'overviewPhotoOfControlPointLocation' in values or 'pointCentreType' in values:
        pdf.cell(94, 8, '9. Байршлын тойм зураг.', 1, 0, 'C')
        pdf.cell(94, 8, '10. Төв цэгийн хэлбэр', 1, 0, 'C')
        pdf.ln(8)
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.cell(94, 62, '', 1, 0, 'C')
        pdf.ln(62)
        if 'pointCentreType' in values:
            pdf.image(os.path.join(settings.MEDIA_ROOT, values['pointCentreType']), x=11, y=newH + 8, w=92, h=0, type='', link='')
        if 'overviewPhotoOfControlPointLocation' in values:
            pdf.image(os.path.join(settings.MEDIA_ROOT, values['overviewPhotoOfControlPointLocation']), x=105, y=newH + 8, w=92, h=0, type='', link='')
    else:
        pdf.ln(0)
    # mor 6
    pdf.cell(10, 8, '11.', 1, 0, 'C')
    if 'sudalga_or_shine' in values:
        sudalgaa = values['sudalga_or_shine']
    else:
        sudalgaa = 'Байхгүй'
    pdf.cell(84, 8, 'Судалгаа: ' + sudalgaa, 1, 0, 'C')
    pdf.cell(10, 8, '12.', 1, 0, 'C')
    if 'beginLifespanVersion' in values:
        date = values['beginLifespanVersion']
    else:
        date = ''

    pdf.cell(84, 8, 'Огноо: ' + date, 1, 0, 'C')

    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '13.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хөрсний шинж байдал:', 1, 0, 'C')
    pdf.cell(94, 8, values['SoilType'], 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '14.', 1, 0, 'C')
    pdf.cell(84, 8, 'Хувийн хэрэг хөтөлсөн:', 1, 0, 'C')
    pdf.cell(94, 8, values['EmployeeName'], 1, 0, 'C')
    # mor 6
    pdf.ln(8)
    pdf.cell(10, 8, '15.', 1, 0, 'C')
    pdf.cell(84, 8, 'Байгууллага', 1, 0, 'C')
    pdf.cell(94, 8, values['CompanyName'], 1, 0, 'C')
    return pdf


@require_POST
@ajax_required
def create(request, payload):

    date = None
    unique_id = uuid.uuid4()
    form_datas = payload.get('form_datas')
    if form_datas['date']:
        date = form_datas['date']
    TuuhSoyol.objects.using('postgis_db').create(
        id=unique_id,
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
    TuuhSoyol.objects.using('postgis_db').filter(
        id=form_datas['id']).update(
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
    length = form_datas_values['hemjee_urt']
    width = form_datas_values['hemjee_orgon']
    hight = form_datas_values['hemjee_ondor']
    area = form_datas_values['hemjee_talbai']
    depth = form_datas_values['hemjee_zuzaan']
    meridian = form_datas_values['hemjee_golch']
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
    TuuhSoyolPoint.objects.using('postgis_db').filter(pk=form_datas['durgal_id']).update(
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
        recover1=recover1, recover1_comment=form_datas_values['dgh_sergeen_zasvarlah_eseh_temdeglel'],
        protecti_2=protecti_2, protecti_2_comment=form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
        hashaa=hashaa, hashaa_comment=form_datas_values['dgh_hashaa_baigaa_eseh_temdeglel'],
        saravch=saravch, saravch_comment=form_datas_values['dgh_saravchtai_eseh_temdeglel'],
        hayg=hayg, hayg_comment=form_datas_values['dgh_hayg_tailbar_eseh_temdeglel'],
        other1=other1,
        x=x, y=y,
        ondor=form_datas_values['torol_zuil_dursgalt_gazriin_coordinatalt'],
        geom=geom
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
    length = form_datas_values['hemjee_urt']
    width = form_datas_values['hemjee_orgon']
    area = form_datas_values['hemjee_talbai']
    hight = form_datas_values['hemjee_ondor']
    depth = form_datas_values['hemjee_zuzaan']
    meridian = form_datas_values['hemjee_golch']
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
    TuuhSoyolPoint.objects.using('postgis_db').create(
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
        recover1=recover1, recover1_comment=form_datas_values['dgh_sergeen_zasvarlah_eseh_temdeglel'],
        protecti_2=protecti_2, protecti_2_comment=form_datas_values['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
        hashaa=hashaa, hashaa_comment=form_datas_values['dgh_hashaa_baigaa_eseh_temdeglel'],
        saravch=saravch, saravch_comment=form_datas_values['dgh_saravchtai_eseh_temdeglel'],
        hayg=hayg, hayg_comment=form_datas_values['dgh_hayg_tailbar_eseh_temdeglel'],
        other1=other1,
        x=x, y=y,
        ondor=form_datas_values['torol_zuil_dursgalt_gazriin_coordinatalt'],
        geom=geom
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
    if query is None:
        query = ''
    if page is None:
        page = 1
    data = TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl=tuuh_soyol).annotate(search=SearchVector('dursgal')).filter(search__contains=query).order_by(sort_name)

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


def findPoint(x, y, tuug_soyol):
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
    for data in TuuhSoyolPoint.objects.using('postgis_db').filter(pk=payload.get('id')):
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


def _get_display_text(field, value):
    for f in TsegRequest._meta.get_fields():
        if hasattr(f, 'choices'):
            if f.name == field:
                for c_id, c_type in f.choices:
                    if c_id == value:
                        return c_type


def _get_state_color(state, item):
    display_name = _get_display_text('state', state)
    return display_name


def _get_kind_color(kind, item):
    display_name = _get_display_text('kind', kind)
    return display_name


def _getname(point_class, item=None):
    point_class = _get_model_qs(LCodeLists, {'code_list_id': int(point_class)})
    point_class = point_class.first()
    if point_class:
        point_class = point_class.code_list_name
    else:
        point_class = ''
    return point_class


def _get_point_type_name(point_type, item):
    if point_type:
        point_type = _get_model_qs(LCodeLists, {'code_list_id': int(point_type)})
        point_type = point_type.first()
        if point_type:
            point_type = point_type.code_list_name
        else:
            point_type = ''
    return point_type


def _make_location_name(aimag, item):
    location_name = aimag + ', ' + item['sum']
    return location_name


def _get_len_geo_id(geo_id):
    len_geo_id = len(geo_id)
    level3 = 4
    level4 = 6
    if len_geo_id == level4:
        len_geo_id = len(geo_id[:level3])
    return len_geo_id


def _get_qs_in_boundary(initial_qs, org):
    levels = [
        [2, 'aimag'],
        [4, 'sum']
    ]

    property_code = 'text'
    feature_code = 'bnd-au-au'
    org_geo_id = org.geo_id

    feature = utils.get_feature_from_code(feature_code)
    feature_id = feature.feature_id

    properties_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(feature_id)
    datas = utils._get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs, property_codes=[property_code])

    mdatas_qs = MDatas.objects
    mdatas_qs = mdatas_qs.filter(geo_id=org_geo_id)
    mdatas_qs = mdatas_qs.filter(**datas[0])
    if mdatas_qs:
        mdatas_qs = mdatas_qs.values()
        mdatas_qs = mdatas_qs.first()
        org_boundary_name = mdatas_qs['value_text']

        len_of_geo_id = _get_len_geo_id(org_geo_id)

        filter_data = dict()
        for level, level_name in levels:
            if len_of_geo_id == level:
                filter_data[level_name] = org_boundary_name

        initial_qs = initial_qs.filter(**filter_data)

    return initial_qs


def _get_org_from_request(request):
    qs = request.user
    qs = qs.employee_set
    qs = qs.get(~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    org = qs.org
    return org


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_personal_list(request, payload):

    perm_name = EmpPermInspire.PERM_VIEW
    check_point, info = _check_tseg_role(perm_name, request.user)
    if check_point:

        org = _get_org_from_request(request)

        requests = TsegRequest.objects
        requests = _get_qs_in_boundary(requests, org)
        requests = requests.exclude(kind=TsegRequest.KIND_DELETE)
        if requests:
            requests = requests.order_by('-created_at')

            хувьсах_талбарууд = [
                {"field": "state", "action": _get_state_color, "new_field": "state"},
                {"field": "kind", "action": _get_kind_color, "new_field": "kind"},
                {"field": "point_type", "action": _get_point_type_name, "new_field": "point_type"},
                {"field": "point_class", "action": _getname, "new_field": "point_class"},
                {"field": "aimag", "action": _make_location_name, "new_field": "point_location"},
            ]

            datatable = Datatable(
                initial_qs=requests,
                model=TsegRequest,
                payload=payload,
                хувьсах_талбарууд=хувьсах_талбарууд
            )

            items, total_page, start_index = datatable.get()
            rsp = {
                'items': items,
                'page': payload.get("page"),
                'total_page': total_page,
                'start_index': start_index
            }
        else:
            rsp = {
                'items': [],
                'page': 1,
                'total_page': 1,
            }
    else:
        rsp = {
            'items': [],
            'page': 1,
            'total_page': 1,
        }

    return JsonResponse(rsp)


def _get_property_zero(initial_qs):
    value = ''
    initial_qs = initial_qs.filter(feature_config_id=None)
    initial_qs = initial_qs.filter(property_id=0)
    initial_qs = initial_qs.first()
    if initial_qs:
        value = initial_qs.value_text
    return value


def _get_geo_data(geo_id):
    m_geo_qs = MGeoDatas.objects
    m_geo_qs = m_geo_qs.filter(geo_id=geo_id)
    m_geo_qs = m_geo_qs.first()
    geo_data = m_geo_qs.geo_data
    return geo_data


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_inspire_list(request, payload):
    display_items = []
    page = payload.get("page")
    per_page = payload.get("perpage")
    sort_name = payload.get("sort_name")
    if not sort_name:
        sort_name = '-created_on'

    org = _get_org_from_request(request)
    geo_data = _get_geo_data(org.geo_id)

    # qs = _get_model_qs(LThemes, {'theme_code': 'gnp'})
    # theme_id = qs.first().theme_id
    # qs = _get_model_qs(LPackages, {'theme_id': theme_id})
    # package_id = qs.first().package_id
    qs = _get_model_qs(LFeatures, {'feature_code': 'gnp-gp-gp'})
    feature = qs.first()
    feature_id = feature.feature_id
    perm_name = EmpPermInspire.PERM_VIEW
    check_point, info = _check_tseg_role(perm_name, request.user)
    if not check_point:
        rsp = {
            'items': 1,
            'total_page': [],
            'page': 1,
        }
        return JsonResponse(rsp)

    property_codes = ['Geodeticnetworkorderclass', 'Geodeticаlnetworktype', 'Pointid', 'Pointname']

    properties_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(feature_id)
    datas = utils._get_filter_field_with_values(properties_qs, l_feature_c_qs, data_type_c_qs, property_codes)

    qs = MGeoDatas.objects
    geo_qs = qs.filter(geo_data__intersects=geo_data, feature_id=feature_id)
    geo_qs = geo_qs.order_by(sort_name)

    total_items = Paginator(geo_qs, per_page)
    items_page = total_items.page(page)

    for item in items_page.object_list:
        geo_id = item.geo_id
        mdatas_qs = MDatas.objects
        mdatas_qs = mdatas_qs.filter(geo_id=geo_id)
        values = utils.mdatas_for_paginator(mdatas_qs, datas)
        data = dict()
        for value in values:
            property_qs = LProperties.objects.filter(property_id__in=value.keys())
            for prop in property_qs:
                if prop.property_id in value.keys():
                    data[prop.property_code] = value[prop.property_id]

        display_items.append({
            'suljeenii_torol': data['Geodeticаlnetworktype'] if 'Geodeticаlnetworktype' in data else '',
            'center_typ': data['Geodeticnetworkorderclass'] if 'Geodeticnetworkorderclass' in data else '',
            'geo_id': geo_id if geo_id else '',
            'point_id': data['Pointid'] if 'Pointid' in data else '',
            'point_name': data['Pointname'] if 'Pointname' in data else 'Хоосон байна',
        })

    total_page = total_items.num_pages

    rsp = {
        'items': display_items,
        'total_page': total_page,
        'page': page,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_personal_remove(request, id):

    perm_name = EmpPermInspire.PERM_REVOKE
    check_point, info = _check_tseg_role(perm_name, request.user)

    if not check_point:
        rsp = {
            'success': False,
            'msg': 'Танд цуцлах эрх алга байна.'
        }
        return JsonResponse(rsp)

    org = _get_org_from_request(request)

    qs = TsegRequest.objects
    qs = _get_qs_in_boundary(qs, org)
    if qs:
        qs = qs.filter(pk=id)
    else:
        rsp = {
            'success': False,
            'msg': 'Таны хамрах хүрээ биш байна',
        }
        return JsonResponse(rsp)

    if qs:
        qs.update(state=TsegRequest.STATE_REJECT)

        rsp = {
            'success': True,
            'msg': 'Амжилттай татгалзлаа'
        }
    else:
        rsp = {
            'success': False,
            'msg': 'Энэ мэдээлэл олдсонгүй'
        }
    return JsonResponse(rsp)


def _get_geom_from_mgeo(geo_id):
    geo_json = []
    mgeo_qs = MGeoDatas.objects
    mgeo_qs = mgeo_qs.filter(geo_id=geo_id)
    mgeo = mgeo_qs.first()
    geo = mgeo.geo_data
    geo_json = json.loads(geo.json)
    return geo_json


def _get_coords_from_geojson(geo_json):
    multi = 'Multi'
    if multi in geo_json['type']:
        return geo_json['coordinates'][0]
    else:
        return geo_json['coordinates'][0]


def _get_aimag_sum(values, code):
    aimag = ''
    sum = ''
    if code in values:
        code_list_id = values[code]
        code_qs = LCodeLists.objects
        codes_qs = code_qs.filter(code_list_id=code_list_id)
        if codes_qs:
            code = codes_qs.first()
            if code.top_code_list_id:
                code_qs = code_qs.filter(code_list_id=code.top_code_list_id)
                sum = code.code_list_name
                aimag = code_qs.first().code_list_name
            else:
                aimag = code.code_list_name

    return aimag, sum


def _get_hurs(geo_id):
    hurs = ''
    mdata_qs = MDatas.objects
    mdata_qs = mdata_qs.filter(geo_id=geo_id)
    if mdata_qs:
        hurs = mdata_qs.filter(property_id=0)
        if hurs:
            hurs = hurs.first().value_text
        else:
            hurs = ''
    return hurs


def _check_geo_inside_boundary(geo_id, boundary_geo_id):
    bnd_qs = MGeoDatas.objects
    bnd_qs = bnd_qs.filter(geo_id=boundary_geo_id)
    bnd_qs = bnd_qs.first()
    bnd_geo_data = bnd_qs.geo_data
    mgeo_datas = MGeoDatas.objects
    mgeo_datas = mgeo_datas.filter(geo_id=geo_id, geo_data__intersects=bnd_geo_data)
    return mgeo_datas


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegPersonalUpdate(request, payload):
    pk = payload.get('id')
    geo_id = payload.get('geo_id')
    tseg_display = []
    org = _get_org_from_request(request)

    if pk:
        requests = TsegRequest.objects
        requests = _get_qs_in_boundary(requests, org)
        requests = requests.filter(pk=pk).first()
        if requests:
            geo_json = json.loads(requests.geo_json)
            latlongx = geo_json['coordinates'][0]
            latlongy = geo_json['coordinates'][1]
        else:
            rsp = {
                'success': False,
                'msg': 'Танд эрх байхгүй байна'
            }
            return JsonResponse(rsp)
    if geo_id:
        is_inside = _check_geo_inside_boundary(geo_id, org.geo_id)
        if is_inside:
            requests = utils.get_mdata_value('gnp-gp-gp', geo_id, is_display=True)
            geo_json = _get_geom_from_mgeo(geo_id)
            coordinates = _get_coords_from_geojson(geo_json)
            latlongx = coordinates[0]
            latlongy = coordinates[1]
        else:
            rsp = {
                'success': False,
                'msg': 'Танд эрх байхгүй байна'
            }
            return JsonResponse(rsp)
    if requests:
        if geo_json['coordinates']:
            LA = int(float(latlongx))
            LB = int((float(latlongx) - LA) * 60)
            LC = float("{:.6f}".format(((float(latlongx)) - LA - LB / 60) * 3600))
            BA = int(float(latlongy))
            BB = int((float(latlongy) - BA) * 60)
            BC = (float(float(latlongy)) - BA - BB / 60) * 3600
            if pk:
                values = json.loads(requests.values)
            if geo_id:
                values = requests
            sheets = values['Nomenclature'] if values and 'Nomenclature' in values else ''
            if sheets:
                sheets = sheets.split("-")
            data = dict()
            data['latlongx'] = latlongx
            data['latlongy'] = latlongy
            data['LA'] = LA
            data['LB'] = LB
            data['LC'] = LC
            data['BA'] = BA
            data['BB'] = BB
            data['BC'] = BC
            data['tseg_oiroos_img_url'] = '/media/' + values['photoOfControlPointToNear'] if values and 'photoOfControlPointToNear' in values else ''
            data['tseg_holoos_img_url'] = '/media/' + values['photoOfControlPoinFromFar'] if values and 'photoOfControlPoinFromFar' in values else ''
            data['barishil_tuhai'] = values['locationNote'] if 'locationNote' in values else ''
            data['bairshil_tseg_oiroos_img_url'] = '/media/' + values['pointCentreType'] if values and 'pointCentreType' in values else ''
            data['bairshil_tseg_holoos_img_url'] = '/media/' + values['overviewPhotoOfControlPointLocation'] if values and 'overviewPhotoOfControlPointLocation' in values else ''
            data['sudalga_or_shine'] = values['pointCentreType'] if 'pointCentreType' in values else ''
            data['date'] = utils.datetime_to_string(values['beginLifespanVersion']) if values and 'beginLifespanVersion' in values else ''
            data['hotolson'] = values['EmployeeName'] if 'EmployeeName' in values else ''
            data['alban_tushaal'] = values['EmployeePosition'] if 'EmployeePosition' in values else ''
            data['alban_baiguullga'] = values['CompanyName'] if 'CompanyName' in values else ''
            data['suljeenii_torol'] = values['Geodeticаlnetworktype'] if 'Geodeticаlnetworktype' in values else ''
            data['sheet1'] = sheets[0] if sheets else ''
            data['zone'] = int(sheets[1]) if sheets else ''
            data['cc'] = int(sheets[2]) if sheets else ''
            data['ondor'] = values['ellipsoidheight'] if 'ellipsoidheight' in values else ''

            if pk:
                data['id'] = requests.id if requests.id else ''
                data['point_id'] = requests.point_id if requests.point_id else ''
                data['point_name'] = requests.point_name if requests.point_name else ''
                data['pid'] = requests.pdf_id if requests.pdf_id else ''
                data['aimag'] = requests.aimag if requests.aimag else ''
                data['sum'] = requests.sum if requests.sum else ''
                data['center_typ'] = requests.point_type if requests.point_type else ''
                data['hors_shinj_baidal'] = values['SoilType'] if 'SoilType' in values else ''
            if geo_id:
                aimag, sum = _get_aimag_sum(values, 'AdministrativeUnitSubClass')
                soil_type = _get_hurs(geo_id)
                data['geo_id'] = geo_id if geo_id else ''
                data['point_id'] = values['Pointid'] if 'Pointid' in values else ''
                data['point_name'] = values['Pointname'] if 'Pointname' in values else ''
                data['aimag'] = aimag
                data['sum'] = sum
                data['center_typ'] = values['Geodeticnetworkorderclass'] if 'Geodeticnetworkorderclass' in values else ''
                data['hors_shinj_baidal'] = soil_type
                # data['suljeenii_torol'] = suljeenii_torol
            tseg_display.append(data)

    rsp = {
        'success': True,
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
def findSum(request, payload):
    info = []
    L = payload.get('y')
    B = payload.get('x')

    aimag, sum = utils.get_aimag_sum_from_point(L, B)

    if aimag or sum:
        Brange = [40, 44, 48, 52, 56]
        Letter = ['K', 'L', 'M', 'N', 'O']
        for k in Brange:
            if k > B:
                ind = Brange.index(k)
                B0 = Letter[ind - 1]
                Bmin = Brange[ind - 1]
                break
            else:
                B0 = "aldaa"

        zone = int(L / 6) + 31
        Lmin = (zone - 30) * 6 - 6
        c = 0
        while Lmin < L:
            Lmin = Lmin + 0.5
            c = c + 1
        cc = 0
        while Bmin < B:
            Bmin = Bmin + 1 / 3
            cc = cc + 1
        cc = (12 - cc) * 12 + c
        LA = int(L)
        LB = int((L - LA) * 60)
        LC = float((L - LA - LB / 60) * 3600)
        BA = int(B)
        BB = int((B - BA) * 60)
        BC = float((B - BA - BB / 60) * 3600)
        info.append({
            'aimag': aimag,
            'sum': sum,
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


def _get_point_class_name(point_class):
    obj = {
        str(utils.InspireCodeList('G102_P').code_list_id): '2',  # gnss in baingin ajillagatai
        str(utils.InspireCodeList('G103_P').code_list_id): '3',  # gps iin suljee
        str(utils.InspireCodeList('G104_P').code_list_id): '4',  # trangulyts
        str(utils.InspireCodeList('G105_P').code_list_id): '5',  # polygometer
        str(utils.InspireCodeList('G106_P').code_list_id): '6',  # gravimeter
        str(utils.InspireCodeList('G107_P').code_list_id): '7',  # ulsin geodiez undur suljee
        str(utils.InspireCodeList('G108_P').code_list_id): '8',  # zuraglalliin suljee
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

    change_request.aimag = request_datas['aimag'] if 'aimag' in request_datas else None
    change_request.sum = request_datas['sum'] if 'sum' in request_datas else None

    change_request.save()
    return change_request.id


def _check_and_make_form_json(feature_id, values):
    form_json_list = list()
    code_list_values = ""

    for key, value in values.items():
        prop_qs = LProperties.objects
        prop_qs = prop_qs.filter(property_code__iexact=key)
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
        'aimag': request_values['aimag'],
        'sum': request_values['sum'],
    }

    success = _create_request(request_datas)
    info = 'Амжилттай хадгаллаа'

    return success, info


def _get_values(request):
    value = dict()
    value['Pointid'] = request.POST.get('toviin_dugaar').zfill(4) if(len(request.POST.get('toviin_dugaar')) < 4) else request.POST.get('toviin_dugaar')
    value['Geodeticаlnetworktype'] = int(request.POST.get('suljeenii_torol'))  # bolson
    value['Geodeticnetworkorderclass'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None  # bolson
    value['locationNote'] = request.POST.get('barishil_tuhai')  # bolson
    value['Nomenclature'] = str(request.POST.get('trapetsiin_dugaar')) + "-" + str(request.POST.get('BA')) + "-" + str(request.POST.get('LA'))  # bolson
    value['EmployeePosition'] = request.POST.get('alban_tushaal')  # bolson
    value['EmployeeName'] = request.POST.get('hotolson')  # bolson
    value['CompanyName'] = request.POST.get('alban_baiguullga')  # bolson
    value['Pointname'] = request.POST.get('tesgiin_ner')  # bolson
    value['beginLifespanVersion'] = request.POST.get('date')  # bolson
    value['AdministrativeUnitSubClass'] = utils.get_code_list_id_from_name(request.POST.get('sum_name'), 'AdministrativeUnitSubClass') if request.POST.get('sum_name') else None  # bolson
    value['SoilType'] = request.POST.get('hors_shinj_baidal')  # mdku
    # value['endLifespanVersion'] = date # ustsanii daraah hadagalah # TODO
    value['ellipsoidheight'] = request.POST.get('ondor')  # bolson
    return value


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegPersonal(request):
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    geo_id = request.POST.get('geo_id')
    point_id = request.POST.get('toviin_dugaar')

    tseg_image_url = 'tseg-personal'
    tseg_bairshil_img_url = 'tseg-personal-img'

    request_values = dict()

    create_tseg = True
    if geo_id:
        create_tseg = False

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
            tseg = utils.get_mdata_value(feature_code, geo_id, True)
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

            value = _remove_and_save('tseg_oiroos_img_url', 'photoOfControlPointToNear', tseg, value, tseg_image_url, request)
            value = _remove_and_save('tseg_holoos_img_url', 'photoOfControlPoinFromFar', tseg, value, tseg_image_url, request)
            value = _remove_and_save('bairshil_tseg_oiroos_img_url', 'pointCentreType', tseg, value, tseg_bairshil_img_url, request)
            value = _remove_and_save('bairshil_tseg_holoos_img_url', 'overviewPhotoOfControlPointLocation', tseg, value, tseg_bairshil_img_url, request)

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

            request_values['kind'] = TsegRequest.KIND_UPDATE
            request_values['geo_json'] = geom.json
            request_values['pdf_id'] = point_id

            request_values['point_id'] = point_id
            request_values['point_name'] = request.POST.get('tesgiin_ner')
            request_values['point_class'] = request.POST.get('suljeenii_torol')
            request_values['point_type'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None
            request_values['aimag'] = request.POST.get('aimag_name') if request.POST.get('aimag_name') else None
            request_values['sum'] = request.POST.get('sum_name') if request.POST.get('sum_name') else None
            _make_request_datas(value, request_values)
            return JsonResponse({'success': True, 'name': False, 'ids': False})

        if create_tseg:
            has_name, has_ids = utils.check_saved_data(request.POST.get('tesgiin_ner'), point_id)  # tsegiin ner bolon object id ni huuchin hadgalsan uguig shalgana

            if has_name or has_ids:
                name = False
                ids = False
                if has_name:
                    name = True
                if has_ids:
                    ids = True
                return JsonResponse({'success': False, 'name': name, 'ids': ids})

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

            value = _make_value('tseg_oiroos_img_url', 'photoOfControlPointToNear', tseg_image_url, request, value)
            value = _make_value('tseg_holoos_img_url', 'photoOfControlPoinFromFar', tseg_image_url, request, value)
            value = _make_value('bairshil_tseg_oiroos_img_url', 'pointCentreType', tseg_bairshil_img_url, request, value)
            value = _make_value('bairshil_tseg_holoos_img_url', 'overviewPhotoOfControlPointLocation', tseg_bairshil_img_url, request, value)

            request_values['kind'] = TsegRequest.KIND_CREATE
            request_values['geo_json'] = geom.json
            request_values['pdf_id'] = point_id

            request_values['point_id'] = point_id
            request_values['point_name'] = request.POST.get('tesgiin_ner')
            request_values['point_class'] = request.POST.get('suljeenii_torol')
            request_values['point_type'] = request.POST.get('center_typ') if request.POST.get('center_typ') else None

            request_values['aimag'] = request.POST.get('aimag_name') if request.POST.get('aimag_name') else None
            request_values['sum'] = request.POST.get('sum_name') if request.POST.get('sum_name') else None
            _make_request_datas(value, request_values)
            # mdatas = utils.save_value_to_mdatas(value, feature_code, [x, y, 0])

    return JsonResponse({'success': True, 'name': False, 'ids': False})


def _send_data_to_pdf(values, file_name, requests, tseg_file_url='tseg-personal-file'):
    if isinstance(values, str):
        values = json.loads(values)
    src_file = os.path.join(settings.FILES_ROOT, tseg_file_url, file_name + ".pdf")
    pdf = createPdf(values, requests)
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
            baiguulla = 'Дан'
            alban_tushaal = 'Дан'
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
        if img_baruun and len(img_baruun) > 2000:
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


def _get_feature_id(feature_code):
    feat_qs = LFeatures.objects
    feat_qs = feat_qs.filter(feature_code=feature_code)
    return feat_qs


def _get_filter_dicts(property_code):
    prop_qs = LProperties.objects
    prop_qs = prop_qs.filter(property_code__iexact=property_code)
    prop = prop_qs.first()

    feature_qs = _get_feature_id('gnp-gp-gp')
    if feature_qs:

        feature = feature_qs.first()
        property_qs, l_feature_c_qs, data_type_c_qs = utils.get_properties(feature.feature_id)
        data = utils.get_filter_field_with_value(property_qs, l_feature_c_qs, data_type_c_qs, prop.property_code)

        for prop_dict in prop_qs.values():
            for type in utils.value_types():
                if prop_dict['value_type_id'] in type['value_names']:
                    filter_value_type = type['value_type']
                    break
    return data, filter_value_type


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_ustsan_success(request, payload):
    pk = payload.get('id')

    tseg_request = get_object_or_404(TsegUstsan, pk=pk)

    with transaction.atomic():

        data, filter_value_type = _get_filter_dicts('Pointid')
        search = dict()
        search[filter_value_type] = tseg_request.tseg_id

        mdatas_qs = MDatas.objects
        mdatas_qs = mdatas_qs.filter(**data, **search)

        perm_name = EmpPermInspire.PERM_APPROVE
        check_point, info = _check_tseg_role(perm_name, request.user)
        if not check_point:
            rsp = {
                'success': False,
                'msg': info
            }
            return JsonResponse(rsp)

        if mdatas_qs:

            geo_id = mdatas_qs.first().geo_id

            mdatas_qs = MDatas.objects
            mdatas_qs = mdatas_qs.filter(geo_id=geo_id)
            mdatas_qs.delete()

            mgeo_qs = MGeoDatas.objects
            mgeo_qs = mgeo_qs.filter(geo_id=geo_id)
            mgeo_qs.delete()

            tseg_request.is_removed = True

            qs = _get_model_qs(LThemes, {'theme_code': 'gnp'})
            theme_id = qs.first().theme_id
            qs = _get_model_qs(LPackages, {'theme_id': theme_id})
            package_id = qs.first().package_id
            qs = _get_model_qs(LFeatures, {'package_id': package_id})
            feature_id = qs.first().feature_id

            utils.refreshMaterializedView(feature_id)

            tseg_request.save()

            rsp = {
                'success': True,
                'msg': 'Амжилттай цуцаллаа'
            }
            return JsonResponse(rsp)
    rsp = {
        'success': False,
        'msg': 'Энэ цэг олдсонгүй'
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tsegUstsanList(request, payload):

    display_items = []
    page = payload.get('page')
    per_page = payload.get('perpage')
    query = payload.get('query')
    sort_name = payload.get('sort_name')
    total_page = []
    if not sort_name:
        sort_name = 'id'
    tsegs = TsegUstsan.objects.annotate(search=SearchVector('email', 'tseg_id', 'name')).filter(search__icontains=query).order_by(sort_name)

    total_items = Paginator(tsegs, per_page)
    items_page = total_items.page(page)
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
            'is_removed': item.is_removed
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
    perm_name = EmpPermInspire.PERM_REMOVE
    check_point, info = _check_tseg_role(perm_name, request.user)
    if not check_point:
        return JsonResponse({
            'success': False,
            'info': 'Танд цэг утсгах эрх байхгүй байн'
        })

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

        return JsonResponse({
            'success': True,
            'info': 'Амжилттай устгалаа'
        })
    else:
        return JsonResponse({
            'success': False,
            'info': 'Цэг устгахад алдаа гарлаа'
        })


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def hureeCreate(request, payload):
    x = payload.get('x')
    y = payload.get('y')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    dursgalt_id = payload.get('dursgalt_id')
    TuuhSoyolHuree.objects.create(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl=dursgalt_id, x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl=dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
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
        check = TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl=dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
        if not check:
            TuuhSoyolHureePol.objects.using('postgis_db').create(tuuh_soyl=dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom=geom)
        else:
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl=dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id).update(tuuh_soyl=dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom=geom)

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
    point = []
    points = []
    TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=idx).update(x=x, y=y)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
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
        TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl=tuuhen_ov).update(tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom=geom)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def hureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    tuuhsoyl = TuuhSoyolHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id)
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
            TuuhSoyolHureePol.objects.using('postgis_db').filter(tuuh_soyl=tuuhen_ov, tuuh_soyl_huree_id=tuuh_soyl_huree_id).update(tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom=geom)
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
    TuuhSoyolAyuulHuree.objects.create(tuuh_soyl=idx, x=x, y=y)
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
        check = TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl=idx)
        if not check:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').create(tuuh_soyl=idx, geom=geom)
        else:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl=idx).update(tuuh_soyl=idx, geom=geom)

    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def ayulHureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    huree_id = payload.get('id')
    x = payload.get('x')
    y = payload.get('y')
    # TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=idx).update(x=x, y=y)  # TODO idx undefined variable
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=tuuhen_ov, id=huree_id)
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
        # geom = Polygon(points)
        # TuuhSoyolAyuulHureePol.objects.using('postgis_db').update(tuuh_soyl = dursgalt_id, tuuh_soyl_huree_id=tuuh_soyl_huree_id, geom = geom)  # TODO idx undefined variable
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def ayulHureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuhsoyl = TuuhSoyolAyuulHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    tuuh_hure_datas = TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl=tuuhen_ov)
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
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').update(tuuh_soyl=tuuhen_ov, geom=geom)
        else:
            TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl=tuuhen_ov).delete()
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
    for tseg in TsegUstsan.objects.filter(pk=payload.get('id')):
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
    rsp = {
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
                'point_ids': False,
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
                'hors_shinj_baidal_list': hors_shinj_baidal_list[:10],
            }
            return JsonResponse(rsp)
        else:
            rsp = {
                'hors_shinj_baidal_list': False,
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


def _save_property_zero(geo_id, values):
    values = json.loads(values)

    datas = list()
    mdata_qs = MDatas.objects.filter(geo_id=geo_id)
    for mdata in mdata_qs.values():
        prop_qs = LProperties.objects
        props_qs = prop_qs.filter(property_id=mdata['property_id'])
        prop_code = props_qs.first().property_code
        if prop_code in values.keys():
            del values[prop_code]

    data = dict()
    for key, value in values.items():
        prop_qs = prop_qs.filter(property_code=key)
        prop = prop_qs.first()
        property_id = prop.property_id
        data['property_id'] = property_id
        data['geo_id'] = geo_id
        if key == 'SoilType':
            data['value_text'] = value
        else:
            for types in utils._value_types():
                if prop.value_type_id == types['value_names']:
                    data[types['value_type']] = value
        datas.append(data)

    for data in datas:
        MDatas.objects.create(**data)


def _check_tseg_role(perm_name, user):
    check_point = False
    info = ''
    point_feature_id = LFeatures.objects.filter(feature_code='gnp-gp-gp').first()
    if point_feature_id:
        employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=user)
        emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
        perm_kind = EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=point_feature_id.feature_id, perm_kind=perm_name, geom=True)
        if perm_kind:
            check_point = True
        else:
            info = 'Танд баталгаажуулах эрх алга байна !!!'
    else:
        info = 'gnp-gp-gp нэртэй feature байхгүй байна !!!'

    return check_point, info


def _check_tseg(values, property_code='Pointid'):
    msg = ''
    has_tseg = False
    values = utils.json_load(values)
    if property_code in values:
        value = values.get(property_code)
        if value:
            data, filter_value_type = _get_filter_dicts(property_code)
            search = dict()
            search[filter_value_type] = value

            mdatas_qs = MDatas.objects
            mdatas_qs = mdatas_qs.filter(**data, **search)
            if mdatas_qs:
                has_tseg = True
                msg = 'Уучлаарай {tseg} цэг бүртгэлтэй байна'.format(tseg=value)
        else:
            msg = 'Цэг олдсонгүй'
    else:
        msg = 'Цэг олдсонгүй'
    return has_tseg, msg


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def tseg_personal_success(request, id):

    perm_name = EmpPermInspire.PERM_APPROVE
    check_point, info = _check_tseg_role(perm_name, request.user)
    if not check_point:
        rsp = {
            'success': False,
            'msg': info
        }
        return JsonResponse(rsp)

    qs = TsegRequest.objects
    qs = qs.filter(pk=id)
    if qs:
        with transaction.atomic():
            value = qs.first()
            has_tseg, msg = _check_tseg(value.values)
            if not has_tseg:
                feature_qs = _get_model_qs(LFeatures, {'feature_id': value.feature_id})
                feature_code = feature_qs.first().feature_code

                geo_json = json.loads(value.geo_json)
                coroutines = geo_json['coordinates']

                new_geo_id = utils.save_value_to_mdatas(value.values, feature_code, [coroutines[0], coroutines[1], 0])

                # TODO arilana hurs hatuu onooson
                _save_property_zero(new_geo_id, value.values)

                utils.refreshMaterializedView(value.feature_id)

                qs.update(
                    state=TsegRequest.STATE_APPROVE,
                    new_geo_id=new_geo_id,
                )
                # _send_data_to_pdf(value.values, value.pdf_id, value)

                rsp = {
                    'success': True,
                    'msg': "Амжилттай боллоо",
                }
            else:
                rsp = {
                    'success': False,
                    'msg': msg,
                }
    else:
        rsp = {
            'success': False,
            'msg': "Мэдээлэл олдсонгүй",
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
            'id': item.id,
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
    cursor.execute(sql, [tuuh_soyl])
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
    cursor.execute(sql, [tuuh_soyl])
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
    point_type = utils.InspireProperty('Geodeticаlnetworktype')
    point_class = utils.InspireProperty('Geodeticnetworkorderclass')
    point_types = utils.get_code_list_from_property_id(point_type.property_id)
    point_classes = utils.get_code_list_from_property_id(point_class.property_id)
    rsp = {
        'point_types': point_types,
        'point_classes': point_classes,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
@login_required(login_url='/gov/secure/login/')
def get_tseg(request, payload):
    pk = payload.get('id')
    geo_id = payload.get('geo_id')
    org = _get_org_from_request(request)
    if pk:
        requests = TsegRequest.objects
        requests = _get_qs_in_boundary(requests, org)
        requests = requests.filter(pk=pk).first()
        if requests:
            geo_json = json.loads(requests.geo_json)
            latlongx = geo_json['coordinates'][0]
            latlongy = geo_json['coordinates'][1]
        else:
            return JsonResponse({
                'success': False,
            })
    if geo_id:
        is_inside = _check_geo_inside_boundary(geo_id, org.geo_id)
        if is_inside:
            requests = utils.get_mdata_value('gnp-gp-gp', geo_id, is_display=True)
            geo_json = _get_geom_from_mgeo(geo_id)
            coordinates = _get_coords_from_geojson(geo_json)
            latlongx = coordinates[0]
            latlongy = coordinates[1]
        else:
            return JsonResponse({
                'success': False,
            })

    coord = [latlongx, latlongy]
    return JsonResponse({
        'success': True,
        'coord': coord,
    })


@require_GET
@ajax_required
@login_required(login_url='/gov/secure/login/')
def emp_tseg_roles(request):
    inspire_roles = {'PERM_VIEW': False, 'PERM_CREATE': False, 'PERM_REMOVE': False, 'PERM_UPDATE': False, 'PERM_APPROVE': False, 'PERM_REVOKE': False}
    employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user=request.user)
    point_feature_id = LFeatures.objects.filter(feature_code='gnp-gp-gp').first().feature_id
    if point_feature_id:
        employee = get_object_or_404(Employee, ~Q(state=Employee.STATE_FIRED_CODE), user__username=request.user)
        emp_perm = EmpPerm.objects.filter(employee_id=employee.id).first()
        perm_kinds = list(EmpPermInspire.objects.filter(emp_perm_id=emp_perm.id, feature_id=point_feature_id, geom=True).distinct('perm_kind').values_list('perm_kind', flat=True))

        for perm_kind in perm_kinds:
            if perm_kind == EmpPermInspire.PERM_VIEW:
                inspire_roles['PERM_VIEW'] = True
            elif perm_kind == EmpPermInspire.PERM_CREATE:
                inspire_roles['PERM_CREATE'] = True
            elif perm_kind == EmpPermInspire.PERM_REMOVE:
                inspire_roles['PERM_REMOVE'] = True
            elif perm_kind == EmpPermInspire.PERM_UPDATE:
                inspire_roles['PERM_UPDATE'] = True
            elif perm_kind == EmpPermInspire.PERM_APPROVE:
                inspire_roles['PERM_APPROVE'] = True
            elif perm_kind == EmpPermInspire.PERM_REVOKE:
                inspire_roles['PERM_REVOKE'] = True

    rsp = {
        'point_role_list': inspire_roles,
    }

    return JsonResponse(rsp)
