from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from .models import TsegUstsan, TsegPersonal, TuuhSoyol, TuuhSoyolPoint, TuuhSoyolHuree, TuuhSoyolAyuulHuree, Mpoint, TuuhSoyolHureePol, TuuhSoyolAyuulHureePol, TsegUstsanLog
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile
from geoportal_app.models import User
from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
import math
import pyproj
import uuid
# Create your models here.


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
    tuuhSoyol = get_object_or_404(TuuhSoyol, pk=pk)
    TuuhSoyolPoint.objects.using('postgis_db').filter(tuuh_soyl=pk).delete()
    TuuhSoyolHuree.objects.using('postgis_db').filter(tuuh_soyl=pk).delete()
    TuuhSoyolHureePol.objects.filter(tuuh_soyl=pk).delete()
    TuuhSoyolAyuulHuree.objects.using('postgis_db').filter(tuuh_soyl=pk).delete()
    TuuhSoyolAyuulHureePol.objects.filter(tuuh_soyl=pk).delete()
    tuuhSoyol.delete()

    return JsonResponse({'success': True})


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
    tseg_personal = get_object_or_404(TuuhSoyolPoint, pk=pk)
    tseg_personal.delete()
    return JsonResponse({'success': True})


@require_POST
@ajax_required
@user_passes_test(lambda u: u.is_superuser)
def tseg_personal_list(request, payload):
    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [108.1232, 95.12312])
    # geoms= cursor.fetchone()
    query = payload.get('query')
    page = payload.get('page')
    per_page = payload.get('perpage')
    tseg_personal = []
    mpoint = Mpoint.objects.using('postgis_db').annotate(search=SearchVector(
        'point_id',
        'pid',
        't_type',
        'point_type',
        ) + SearchVector('point_name')).filter(search__contains=query)
    total_items = Paginator(mpoint, per_page)
    items_page = total_items.page(page)
    for mpoint_all in items_page.object_list:
        tseg_personal.append({
            'id': mpoint_all.id,
            'objectid': mpoint_all.objectid,
            'point_id': mpoint_all.point_id,
            'point_name': mpoint_all.point_name,
            'pid': mpoint_all.pid,
            'point_class': mpoint_all.point_class,
            'point_type': mpoint_all.point_type,
            'center_typ': mpoint_all.center_typ,
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
    mpoint = Mpoint.objects.using('postgis_db').filter(id=pk).update(point_class=9)
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def tsegPersonalUpdate(request, payload):
    pk = payload.get('id')
    tseg_display = []
    tseg = TsegPersonal.objects.filter(id = pk).first() 
    data = Mpoint.objects.using('postgis_db').filter(id=pk).first() 
    if(tseg):
            LA = int(float(tseg.latlongx))
            LB = int((float(tseg.latlongx)-LA)*60)
            LC = float("{:.6f}".format(((float(tseg.latlongx))-LA-LB/60)*3600 ))
            BA = int(float(tseg.latlongy))
            BB = int((float(tseg.latlongy)-BA)*60)
            BC = (float(float(tseg.latlongy))-BA-BB/60)*3600 
    tseg_display.append({
        'latlongx': tseg.latlongx if tseg else '',
        'latlongy': tseg.latlongy if tseg else '',
        'LA':LA if tseg else '',
        'LB':LB if tseg else "",
        'LC':LC if tseg else '',
        'BA':BA if tseg else "",
        'BB':BB if tseg else "",
        'BC':BC if tseg else "",
        'tseg_oiroos_img_url': tseg.tseg_oiroos_img_url.url if tseg else '',
        'tseg_holoos_img_url': tseg.tseg_holoos_img_url.url if tseg else '',
        'barishil_tuhai': tseg.barishil_tuhai if tseg else '',
        'bairshil_tseg_oiroos_img_url': tseg.bairshil_tseg_oiroos_img_url.url if tseg else '',
        'bairshil_tseg_holoos_img_url': tseg.bairshil_tseg_holoos_img_url.url if tseg else '',
        'sudalga_or_shine':  tseg.sudalga_or_shine if tseg else '',
        'hors_shinj_baidal': tseg.hors_shinj_baidal if tseg else '',
        'date': tseg.date.strftime("%Y-%m-%d") if tseg else '',
        'hotolson': tseg.hotolson if tseg else '',
        'file_path1': tseg.file_path1.name if tseg else '',
        'file_path2': tseg.file_path2.name if tseg else '',
        'alban_tushaal': tseg.alban_tushaal if tseg else '',
        'alban_baiguullga': tseg.alban_baiguullga if tseg else '',
        'suljeenii_torol': tseg.suljeenii_torol if tseg else '',
        'id': data.id if tseg else '',
        'objectid': data.objectid if tseg else '',
        'point_id': data.point_id if tseg else "",
        'point_name': data.point_name if tseg else '',
        'pid': data.pid if tseg else '',
        'point_class': data.point_class if tseg else '',
        'point_type': data.point_type if tseg else '',
        'center_typ': data.center_typ if tseg else '',
        'aimag': data.aimag if tseg else '',
        'sum': data.sum if tseg else '',
        'sheet1': data.sheet1 if tseg else '',
        'sheet2': data.sheet2 if tseg else "",
        'sheet3': data.sheet3 if tseg else "",
        't_type': data.t_type if tseg else '',
    })
    rsp = {
        'tseg_display': tseg_display,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def findSum(request, payload):
    info = []
    L = payload.get("y")
    B = payload.get("x")
    cursor = connections['postgis_db'].cursor()
    cursor.execute('''select "name", "text" from "AdmUnitSum" where ST_DWithin(geom, ST_MakePoint(%s, %s)::geography, 1000)''', [L, B])
    geom = cursor.fetchone()
    zoneout=int(L)/6+31
    instr = ("+proj=longlat +datum=WGS84 +no_defs")
    outstr = ("+proj=tmerc +lat_0=0 +lon_0="+str((zoneout-30)*6-3)+" +k=0.9996 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")
    inproj = pyproj.Proj(instr)
    outproj = pyproj.Proj(outstr)
    val= pyproj.transform(inproj, outproj, L,B)
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
    LC = float("{:.6f}".format((L-LA-LB/60)*3600 ))
    BA = int(B)
    BB = int((B-BA)*60)
    BC = float("{:.6f}".format((B-BA-BB/60)*3600 ))
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
    return JsonResponse({"info":info})


@require_POST
@ajax_required
def tsegPersonal(request):
    pk = request.POST.get('idx')
    point_id = request.POST.get('toviin_dugaar')
    if(len(point_id)<4):
        point_id.zfill(4)
    if pk:
        date = None
        tseg_personal = get_object_or_404(TsegPersonal, id=pk)
        if request.POST.get('date'):
            date = request.POST.get('date')
        x = float(request.POST.get('latlongx'))
        y = float(request.POST.get('latlongy'))
        cursor = connections['postgis_db'].cursor()
        update_cursor = connections['postgis_db'].cursor()
        cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326)''', [x, y])
        geom = cursor.fetchone()

        update_cursor.execute(''' UPDATE mpoint SET geom = %s WHERE id = %s ''', [geom, pk])

        Mpoint.objects.using('postgis_db').filter(id=pk).update(
                    objectid="null" ,point_id=point_id,
                    point_name=request.POST.get('tesgiin_ner'),
                    pid=request.POST.get('pid'), point_class=8, point_type=request.POST.get('suljeenii_torol'), center_typ=request.POST.get('center_typ'),
                    aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                    sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('BA'),
                    sheet3=request.POST.get('LA'), t_type='g109',
        )
        TsegPersonal.objects.filter(id=pk).update(
                    suljeenii_torol=request.POST.get('suljeenii_torol'),
                    utmx=request.POST.get('utmx'), utmy=request.POST.get('utmy'),
                    latlongx=request.POST.get('latlongx'),
                    latlongy=request.POST.get('latlongy'),
                    barishil_tuhai=request.POST.get('barishil_tuhai'),
                    sudalga_or_shine=request.POST.get('sudalga_or_shine'),
                    hors_shinj_baidal=request.POST.get('hors_shinj_baidal'),
                    date=date, hotolson=request.POST.get('hotolson'), 
                    alban_tushaal=request.POST.get('alban_tushaal'),
                    alban_baiguullga=request.POST.get('alban_baiguullga'),
        )
        if request.POST.get('tseg_oiroos_img_url') and len(request.POST.get('tseg_oiroos_img_url')) > 2000:
            tseg_personal.tseg_oiroos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('tseg_oiroos_img_url'), [(200, 200)])
            tseg_personal.tseg_oiroos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if request.POST.get('tseg_holoos_img_url') and len(request.POST.get('tseg_holoos_img_url')) > 2000:
            tseg_personal.tseg_holoos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('tseg_holoos_img_url'), [(200, 200)])
            tseg_personal.tseg_holoos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if request.POST.get('bairshil_tseg_oiroos_img_url')  and len(request.POST.get('bairshil_tseg_oiroos_img_url')) > 2000:
            tseg_personal.bairshil_tseg_oiroos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('bairshil_tseg_oiroos_img_url'), [(200, 200)])
            tseg_personal.bairshil_tseg_oiroos_img_url = SimpleUploadedFile('icon.png', image_x2)
            tseg_personal.save()
        if  request.POST.get('bairshil_tseg_holoos_img_url')  and len(request.POST.get('bairshil_tseg_holoos_img_url')) > 2000:
            tseg_personal.bairshil_tseg_holoos_img_url.delete(save=False)
            [image_x2] = resize_b64_to_sizes(request.POST.get('bairshil_tseg_holoos_img_url'), [(200, 200)])
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
        return JsonResponse({'success': True, 'name': False, 'ids':False})
    else:
        tesgiin_ner = request.POST.get('tesgiin_ner')
        objectid = request.POST.get('toviin_dugaar')
        tesgiin_ner_check = Mpoint.objects.using('postgis_db').filter(point_name=tesgiin_ner)
        objectid_check = Mpoint.objects.using('postgis_db').filter(point_id=objectid)
        if tesgiin_ner_check or objectid_check:
            name = False
            ids = False
            if tesgiin_ner_check:
                name = True
            if objectid_check:
                ids = True
            return JsonResponse({'success': False, 'name': name, 'ids':ids})
        Mpoint.objects.using('postgis_db').filter(point_name=tesgiin_ner)
        date = None
        file1 = ''
        file2 = ''
        tseg_oiroos_img_url = ''
        tseg_holoos_img_url = ''
        bairshil_tseg_oiroos_img_url = ''
        bairshil_tseg_holoos_img_url = ''
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
        check_id = True
        while check_id:
            unique_id = uuid.uuid4()
            if Mpoint.objects.using('postgis_db').filter(id=unique_id):
                check_id = True
            else:
                check_id = False

        x = float(request.POST.get('latlongx'))
        y = float(request.POST.get('latlongy'))
        cursor = connections['postgis_db'].cursor()
        update_cursor = connections['postgis_db'].cursor()
        cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326)''', [x, y])
        geom = cursor.fetchone()
        mpoint = Mpoint.objects.using('postgis_db').create(
                    id=unique_id, 
                    objectid='null', point_id=point_id,
                    point_name=request.POST.get('tesgiin_ner'),
                    pid=request.POST.get('pid'), point_class=8, point_type=request.POST.get('suljeenii_torol'), 
                    center_typ=request.POST.get('center_typ'),
                    aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                    sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('BA'),
                    sheet3=request.POST.get('LA'), t_type='g109',
        )
        update_cursor.execute(''' UPDATE mpoint SET geom = %s WHERE id = %s ''', [geom, str(unique_id)])
        TsegPersonal.objects.create(
                    id=unique_id,
                    suljeenii_torol=request.POST.get('suljeenii_torol'),
                    utmx=request.POST.get('utmx'), utmy=request.POST.get('utmy'),
                    latlongx=request.POST.get('latlongx'),
                    latlongy=request.POST.get('latlongy'),
                    barishil_tuhai=request.POST.get('barishil_tuhai'),
                    sudalga_or_shine=request.POST.get('sudalga_or_shine'),
                    hors_shinj_baidal=request.POST.get('hors_shinj_baidal'),
                    date=date, hotolson=request.POST.get('hotolson'), 
                    file_path1=file1,file_path2=file2,
                    bairshil_tseg_oiroos_img_url=bairshil_tseg_oiroos_img_url,
                    bairshil_tseg_holoos_img_url=bairshil_tseg_holoos_img_url,
                    tseg_oiroos_img_url=tseg_oiroos_img_url,
                    tseg_holoos_img_url=tseg_holoos_img_url,
                    alban_tushaal=request.POST.get('alban_tushaal'),
                    alban_baiguullga=request.POST.get('alban_baiguullga'),
        )
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
    TorF = bool(request.POST.get('hemjilt_hiih_bolomj'))
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
        return JsonResponse({'success': True})
    else:
        if img_holoos:
            [image_x2] = resize_b64_to_sizes(img_holoos, [(300, 300)])
            img_holoos = SimpleUploadedFile('img.png', image_x2)
        if img_oiroos:
            [image_x2] = resize_b64_to_sizes(img_oiroos, [(300, 300)])
            img_oiroos = SimpleUploadedFile('img.png', image_x2)
        if img_baruun:
            [image_x2] = resize_b64_to_sizes(img_baruun, [(300, 300)])
            img_baruun = SimpleUploadedFile('img.png', image_x2)
        if img_zuun:
            [image_x2] = resize_b64_to_sizes(img_zuun, [(300, 300)])
            img_zuun = SimpleUploadedFile('img.png', image_x2)
        if img_hoino:
            [image_x2] = resize_b64_to_sizes(img_hoino, [(300, 300)])
            img_hoino = SimpleUploadedFile('img.png', image_x2)
        if img_omno:
            [image_x2] = resize_b64_to_sizes(img_omno, [(300, 300)])
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


@require_GET
@ajax_required
def tsegUstsanAll(request):
    tseg_ustsan = []
    for tseg in TsegUstsan.objects.all():
        tseg_ustsan.append({
            'id': tseg.id,
            'tseg_id': tseg.tseg_id,
            'email': tseg.email,
            'name': tseg.name,
            'alban_tushaal': tseg.alban_tushaal,
            'utas': tseg.phone,
            'oiroltsoo_bairlal': tseg.oiroltsoo_bairlal,
            'evdersen_baidal': tseg.evdersen_baidal,
            'nohtsol_baidal': tseg.shaltgaan,
        })
    return JsonResponse({
        'tseg_ustsan_all': tseg_ustsan,
        'success': True
    })

@require_POST
@ajax_required
def tsegUstsanRemove(request, payload):
    pk = payload.get('id')
    tseg_ustsan = get_object_or_404(TsegUstsan, pk=pk)
    mpoint = Mpoint.objects.using('postgis_db').filter(point_id=tseg_ustsan.tseg_id).first()
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
        tseg_ustsan.delete()
        Mpoint.objects.using('postgis_db').filter(point_id=tseg_ustsan.tseg_id).update(point_class=9)
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeCreate(request, payload):

    x = payload.get('x')
    y = payload.get('y')
    tuuh_soyl_huree_id = payload.get('tuuh_soyl_huree_id')
    dursgalt_id = payload.get('dursgalt_id')
    x_t=float(x)
    y_t=float(y)
    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])
    # geom = 
    TuuhSoyolHuree.objects.create(tuuh_soyl_huree_id=tuuh_soyl_huree_id, tuuh_soyl = dursgalt_id,  x=x, y=y)
    
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeUpdate(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    huree_id = payload.get('id')
    x = payload.get('x')
    y = payload.get('y')
    x_t=float(x)
    y_t=float(y)
    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])
    # geom = 
    TuuhSoyolHuree.objects.filter(tuuh_soyl=tuuhen_ov, pk=huree_id).update(x=x, y=y)
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuhsoyl = TuuhSoyolHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    if tuuhsoyl:
        tuuhsoyl.delete()
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
            'created_at': data.created_at.strftime('%Y-%m-%d'),
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
    cursor = connections['postgis_db'].cursor()
    # xy_array = [ '95 102' , '12 , 123']
    # cursor.execute('''SELECT ST_MakePolygon( ST_AddPoint(foo.open_line, ST_StartPoint(foo.open_line)) ) FROM (SELECT ST_GeomFromText('LINESTRING(%s)') As open_line) As foo;''', [xy_array]) 
    # geom = cursor.fetchone()
    TuuhSoyolAyuulHuree.objects.create(tuuh_soyl = idx, x=x, y=y)
    # check = TuuhSoyolAyuulHureePol.objects.using('postgis_db').filter(tuuh_soyl = idx)
    # if not check:
    #     TuuhSoyolAyuulHureePol.objects.using('postgis_db').create(tuuh_soyl = idx)
    # update_cursor = connections['postgis_db'].cursor()
    # update_cursor.execute(''' UPDATE tuuhsoyolayuulhureepol SET geom = %s WHERE tuuh_soyl = %s ''', [geom, idx])

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
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def ayulHureeDelete(request, payload):
    tuuhen_ov = payload.get('tuuhen_ov')
    ayul_id = payload.get('ayul_id')
    tuuhsoyl = TuuhSoyolAyuulHuree.objects.filter(id=ayul_id, tuuh_soyl=tuuhen_ov)
    if tuuhsoyl:
        tuuhsoyl.delete()
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
def tsegPersonalSearch(request, payload):
    query = payload.get('query')
    items = []
    mpoint = Mpoint.objects.using('postgis_db').filter(point_id__icontains=query)
    if(mpoint):
        for tseg in mpoint:
            items.append({
                "tseg": tseg.point_id
            })
        rsp = {
            'items': items
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
        point_type = int(payload.get('point_type'))
        objectid = payload.get('objectid')
        point_class = int(payload.get('point_class'))
        mpoints = Mpoint.objects.using('postgis_db').filter(objectid=objectid)
        if point_class == point_type:
            rsp = {
                'success': False, 
                'msg': "Төлөв адилхан тул боломжгүй",
            }
            return JsonResponse(rsp)
        mpoints.update(
            point_class=point_type
        )
        rsp = {
            'success': True, 
            'msg': "Амжилттай боллоо",
        }
        return JsonResponse(rsp)
    except Exception:
        rsp = {
            'success': False, 
            'msg': "Амжилтгүй боллоо",
        }
        return JsonResponse(rsp)