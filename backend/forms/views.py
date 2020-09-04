from django.db import connections
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from main.decorators import ajax_required
from django.http import JsonResponse
from .models import TsegUstsan, TsegPersonal, TuuhSoyol, DursgaltGazar, TuuhSoyolHuree, TuuhSoyolAyuulHuree, Mpoint
from main.utils import resize_b64_to_sizes
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.decorators import user_passes_test
from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator

import uuid
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
def remove(request, payload):
    pk = payload.get('id')
    tuuhSoyol = get_object_or_404(TuuhSoyol, pk=pk)
    DursgaltGazar.objects.filter(tuuh_soyl_id=pk).delete()
    TuuhSoyolHuree.objects.filter(tuuh_soyl_id=pk).delete()
    TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl_id=pk).delete()
    tuuhSoyol.delete()

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

    tuuhsoyl = get_object_or_404(TuuhSoyol, pk=form_datas['id'])

    x = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatllx'])
    y = float(form_datas['torol_zuil_dursgalt_gazriin_coordinatlly'])

    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])

    dursgal = form_datas['torol_zuil_dursgalt_gazriin_ner']
    dursgal2 = 'None'


    type2 = form_datas['torol_zuil_torol_zuil_tree']
    if form_datas['torol_zuil_torol_zuil_tree2']:
        type2 = form_datas['torol_zuil_torol_zuil_tree2']

    # type1 = form_datas['torol_zuil_torol_zuil'] + ' ' + type2

    stone = form_datas['torol_zuiltorol_zuil_name']
    # geom = cursor.fetchone()
    length =form_datas['hemjee_urt']
    width =form_datas['hemjee_orgon']
    hight =form_datas['hemjee_ondor']
    depth =form_datas['hemjee_zuzaan']
    meridian =form_datas['hemjee_golch']

    other = form_datas['hemjee_busad_hemjee']

    number = form_datas['hemjee_too_shirheg']
    protection = form_datas['dgh_angilal']

    protecti_1 = form_datas['dgh_bus_togtooh_shaardlaga']

    tus = form_datas['dgh_tusgai_hamgaalalt']

    yaral = form_datas['dgh_yaaraltai_hamgaalalt']

    malts = form_datas['dgh_maltan_sudaltan_hamgaalalt']

    human = ''
    for hun in form_datas['dgh_gemtliin_all']:
        human = human + hun + ''

    natural = ''
    for natur in form_datas['dgh_baigaliin_huchin_zuil_all']:
        natural = natural + natur + ''

    recover = form_datas['dgh_sergeen_zasvarlasan_eseh_hamgaalalt']

    recover1 = form_datas['dgh_sergeen_zasvarlah_eseh_nenshaardlaga']

    protecti_2 = form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal']

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

    hashaa = form_datas['dgh_hashaa_baigaa_eseh_hashaa']
    saravch = form_datas['dgh_saravchtai_eseh_saravch']

    hayg = form_datas['dgh_hayg_tailbar_eseh_hayg']

    omchlol = form_datas['dgh_omchlol_ezemshih_omchlol_sanal_hamgaalalt']
    protection_irgen = form_datas['dg_ezen_dursgalt_gazar_ezen']
    if form_datas['durgal_id']:
        DursgaltGazar.objects.filter(pk=form_datas['durgal_id']).update(
                                tuuh_soyl_id=tuuhsoyl.id,
                                latlong=latlong, utm=utm, dursgal=dursgal,
                                dursgal2=dursgal2, descriptio=descriptio,
                                type1=form_datas['torol_zuil_torol_zuil_tree'],
                                type2=form_datas['torol_zuil_torol_zuil_tree2'],
                                stone=stone, length=length,
                                width=width, hight=hight, depth=depth,
                                meridian=meridian, other=other,
                                number=number, hemjee_comment=form_datas['hemjee_temdeglel'],
                                protection_irgen=protection_irgen,
                                protection_irgen_commnent=form_datas['dg_ezen_temdeglel'],
                                protection=protection, protecti_1=protecti_1,
                                tus=tus, tus_comment=form_datas['dgh_tusgai_temdeglel'],
                                yaral=yaral, yaral_comment=form_datas['dgh_yaaraltai_temdeglel'],
                                omchlol=omchlol, omchlol_comment=form_datas['dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'],
                                malts=malts, malts_comment=form_datas['dgh_maltan_sudaltan_temdeglel'],
                                human=human, human_comment=form_datas['dgh_gemtliin_temdeglel'],
                                natural=natural, natural_comment=form_datas['dgh_baigaliin_huchin_zuil_temdeglel'],
                                recover=recover, recover_comment=form_datas['dgh_sergeen_zasvarlasan_eseh_temdeglel'],
                                recover1=recover1,recover1_comment=form_datas['dgh_sergeen_zasvarlah_eseh_temdeglel'],
                                protecti_2=protecti_2, protecti_2_comment=form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
                                hashaa=hashaa, hashaa_comment=form_datas['dgh_hashaa_baigaa_eseh_temdeglel'],
                                saravch=saravch, saravch_comment=form_datas['dgh_saravchtai_eseh_temdeglel'],
                                hayg=hayg, hayg_comment=form_datas['dgh_hayg_tailbar_eseh_temdeglel'],
                                other1=other1,
                                ndd=ndd, nmm=nmm,
                                nss=nss, edd=edd, emm=emm , ess=ess, x=x, y=y,
                                utm_zone= form_datas['torol_zuil_dursgalt_gazriin_coordinatutm'],
                                utm_x= form_datas['torol_zuil_dursgalt_gazriin_coordinatx'],
                                utm_y= form_datas['torol_zuil_dursgalt_gazriin_coordinaty'],
                               )
    else:
        DursgaltGazar.objects.create(
                                tuuh_soyl_id=tuuhsoyl.id,
                                latlong=latlong, utm=utm, dursgal=dursgal,
                                dursgal2=dursgal2, descriptio=dursgal2,
                                type1=form_datas['torol_zuil_torol_zuil_tree'],
                                type2=form_datas['torol_zuil_torol_zuil_tree2'],
                                stone=stone, length=length,
                                width=width, hight=hight, depth=depth,
                                meridian=meridian, other=other,
                                number=number, hemjee_comment=form_datas['hemjee_temdeglel'],
                                protection_irgen=protection_irgen,
                                protection_irgen_commnent=form_datas['dg_ezen_temdeglel'],
                                protection=protection, protecti_1=protecti_1,
                                tus=tus, tus_comment=form_datas['dgh_tusgai_temdeglel'],
                                yaral=yaral, yaral_comment=form_datas['dgh_yaaraltai_temdeglel'],
                                omchlol=omchlol, omchlol_comment=form_datas['dgh_omchlol_ezemshih_omchlol_sanal_temdeglel'],
                                malts=malts, malts_comment=form_datas['dgh_maltan_sudaltan_temdeglel'],
                                human=human, human_comment=form_datas['dgh_gemtliin_temdeglel'],
                                natural=natural, natural_comment=form_datas['dgh_baigaliin_huchin_zuil_temdeglel'],
                                recover=recover, recover_comment=form_datas['dgh_sergeen_zasvarlasan_eseh_temdeglel'],
                                recover1=recover1,recover1_comment=form_datas['dgh_sergeen_zasvarlah_eseh_temdeglel'],
                                protecti_2=protecti_2, protecti_2_comment=form_datas['dgh_hamgaalaltiin_zereg_oorchloh_sanal_temdeglel'],
                                hashaa=hashaa, hashaa_comment=form_datas['dgh_hashaa_baigaa_eseh_temdeglel'],
                                saravch=saravch, saravch_comment=form_datas['dgh_saravchtai_eseh_temdeglel'],
                                hayg=hayg, hayg_comment=form_datas['dgh_hayg_tailbar_eseh_temdeglel'],
                                other1=other1,
                                ndd=ndd, nmm=nmm,
                                nss=nss, edd=edd, emm=emm , ess=ess, x=x, y=y,
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
    return JsonResponse({'form_data': form_data})


@require_POST
@ajax_required
def dursgaltGazarRemove(request, payload):
    pk = payload.get('id')
    tseg_personal = get_object_or_404(DursgaltGazar, pk=pk)
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
    tseg_display.append({
        'utmx': tseg.utmx,
        'utmy': tseg.utmy,
        'latlongx': tseg.latlongx,
        'latlongy': tseg.latlongy,
        'tseg_oiroos_img_url': tseg.tseg_oiroos_img_url.url if tseg.tseg_oiroos_img_url else '',
        'tseg_holoos_img_url': tseg.tseg_holoos_img_url.url if tseg.tseg_holoos_img_url else '',
        'barishil_tuhai': tseg.barishil_tuhai,
        'bairshil_tseg_oiroos_img_url': tseg.bairshil_tseg_oiroos_img_url.url if tseg.bairshil_tseg_oiroos_img_url else '',
        'bairshil_tseg_holoos_img_url': tseg.bairshil_tseg_holoos_img_url.url if tseg.bairshil_tseg_holoos_img_url else '',
        'sudalga_or_shine':  tseg.sudalga_or_shine,
        'hors_shinj_baidal': tseg.hors_shinj_baidal,
        'date': tseg.date.strftime("%Y-%m-%d") if tseg.date else '',
        'hotolson': tseg.hotolson,
        'file_path1': tseg.file_path1.name if tseg.file_path1 else '',
        'file_path2': tseg.file_path2.name if tseg.file_path2 else '',
        'alban_tushaal': tseg.alban_tushaal,
        'alban_baiguullga': tseg.alban_baiguullga,
        'id': data.id,
        'objectid': data.objectid,
        'point_id': data.point_id,
        'point_name': data.point_name,
        'pid': data.pid,
        'point_class': data.point_class,
        'point_type': data.point_type,
        'center_typ': data.center_typ,
        'aimag': data.aimag,
        'sum': data.sum,
        'sheet1': data.sheet1,
        'sheet2': data.sheet2,
        'sheet3': data.sheet3,
        't_type': data.t_type,
    })
    rsp = {
        'tseg_display': tseg_display,
    }
    return JsonResponse(rsp)


@require_POST
@ajax_required
def findSum(request, payload):
    info = []
    x = payload.get("y")
    y = payload.get("x")
    cursor = connections['postgis_db'].cursor()
    cursor.execute('''select "name", "text" from "AdmUnitSum" where ST_DWithin(geom, ST_MakePoint(%s, %s)::geography, 1000)''', [x, y])
    geom = cursor.fetchone()
    info.append({
        'aimag': geom[0],
        'sum': geom[1]
    })

    return JsonResponse({"info":info})


@require_POST
@ajax_required
def tsegPersonal(request):
    pk = request.POST.get('idx')
    if pk:
        date = None
        tseg_personal = get_object_or_404(TsegPersonal, id=pk)
        if request.POST.get('date'):
            date = request.POST.get('date')
        objectid = float(request.POST.get('toviin_dugaar'))
        x = float(request.POST.get('latlongx'))
        y = float(request.POST.get('latlongy'))
        cursor = connections['postgis_db'].cursor()
        update_cursor = connections['postgis_db'].cursor()
        cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s), 4326)''', [x, y])
        geom = cursor.fetchone()

        update_cursor.execute(''' UPDATE mpoint SET geom = %s WHERE id = %s ''', [geom, pk])

        Mpoint.objects.using('postgis_db').filter(id=pk).update(
                     objectid=objectid ,point_id="null",
                    point_name=request.POST.get('tesgiin_ner'),
                    pid=request.POST.get('pid'), point_class=8, point_type=request.POST.get('suljeenii_torol'), center_typ=request.POST.get('center_typ'),
                    aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                    sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('latlongx'),
                    sheet3=request.POST.get('latlongy'), t_type='g109',
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
        objectid = int(request.POST.get('toviin_dugaar'))
        tesgiin_ner_check = Mpoint.objects.using('postgis_db').filter(point_name=tesgiin_ner)
        objectid_check = Mpoint.objects.using('postgis_db').filter(objectid=objectid)
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
                    id=unique_id, objectid=objectid ,point_id="null",
                    point_name=request.POST.get('tesgiin_ner'),
                    pid=request.POST.get('pid'), point_class=8, point_type=request.POST.get('suljeenii_torol'), center_typ=request.POST.get('center_typ'),
                    aimag=request.POST.get('aimag_name'), sum=request.POST.get('sum_name'),
                    sheet1=request.POST.get('trapetsiin_dugaar'), sheet2=request.POST.get('latlongx'),
                    sheet3=request.POST.get('latlongy'), t_type='g109',
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
    if form_datas['id'] :
        TsegUstsan.objects.filter(id=form_datas['id']).update(
            email=form_datas['email'],
            name=form_datas['baiguulaga'],
            alban_tushaal=form_datas['alban_tushaal'],
            phone=form_datas['utas'],
            img_holoos=img_holoos,
            img_oiroos=img_oiroos,
            img_baruun=img_baruun,
            img_zuun=img_zuun,
            img_hoino=img_hoino,
            img_omno=img_omno,
            tseg_id=form_datas['tsegiin_dugaar'],
            oiroltsoo_bairlal=form_datas['oiroltsoo_bairlal'],
            evdersen_baidal=form_datas['evdersen_baidal'],
            shaltgaan=form_datas['nohtsol_baidal'],
            sergeeh_sanal=form_datas['sergeeh_sanal'],
            gps_hemjilt=form_datas['hemjilt_hiih_bolomj'],
            )
        return JsonResponse({'success': True})
    else:
        TsegUstsan.objects.create(
            email=form_datas['email'],
            name=form_datas['baiguulaga'],
            alban_tushaal=form_datas['alban_tushaal'],
            phone=form_datas['utas'],
            img_holoos=img_holoos,
            img_oiroos=img_oiroos,
            img_baruun=img_baruun,
            img_zuun=img_zuun,
            img_hoino=img_hoino,
            img_omno=img_omno,
            tseg_id=form_datas['tsegiin_dugaar'],
            oiroltsoo_bairlal=form_datas['oiroltsoo_bairlal'],
            evdersen_baidal=form_datas['evdersen_baidal'],
            shaltgaan=form_datas['nohtsol_baidal'],
            sergeeh_sanal=form_datas['sergeeh_sanal'],
            gps_hemjilt=form_datas['hemjilt_hiih_bolomj'],
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
    tseg_ustsan.delete()

    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeCreate(request, payload):

    hm_utm = payload.get('hm_utm')
    hm_x = payload.get('hm_x')
    hm_y = payload.get('hm_y')
    hm_llx = payload.get('hm_llx')
    hm_lly = payload.get('hm_lly')
    hm_llalt = payload.get('hm_llalt')
    idx = payload.get('id')
    x=float(hm_llx)
    y=float(hm_lly)
    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])
    # geom = 
    geom = 'geom'

    ndd = int(x)
    nmm = int((x - ndd) * 60)
    nss = int((((x - ndd) * 60) - nmm) * 60)
    edd = int(y)
    emm = int((y - edd) * 60)
    ess = int((((y - edd) * 60) - emm) * 60)
    latlong = 'N' + str(ndd) + ' ' + str(nmm) + ' ' + str(nss)

    TuuhSoyolHuree.objects.create(tuuh_soyl_id = idx,  geom= geom, latlong=latlong, utm=hm_utm, utmx=hm_llx, utmy=hm_lly, ndd=ndd, nmm=nmm, nss=nss, edd=edd, emm=emm, ess=ess, x=hm_llx, y=hm_lly, alt=hm_llalt )
    return JsonResponse({'success': True})


@require_POST
@ajax_required
def hureeAll(request, payload):
    ids = payload.get('id')
    huree_data = []
    for data in TuuhSoyolHuree.objects.filter(tuuh_soyl_id=ids):
        huree_data.append({
            'id': data.id,
            'x': data.x,
            'y': data.y,
            'utmx': data.utmx,
            'utmy': data.utmy,
            'utm': data.utm,
            'alt': data.alt,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'huree_data': huree_data})


@require_POST
@ajax_required
def ayulAll(request, payload):
    ids = payload.get('id')
    ayul_data = []
    for data in TuuhSoyolAyuulHuree.objects.filter(tuuh_soyl_id=ids):
        ayul_data.append({
            'id': data.id,
            'x': data.x,
            'y': data.y,
            'utmx': data.utmx,
            'utmy': data.utmy,
            'utm': data.utm,
            'alt': data.alt,
            'created_at': data.created_at.strftime('%Y-%m-%d'),
        })
    return JsonResponse({'ayul_data': ayul_data})


@require_POST
@ajax_required
def ayulHureeCreate(request, payload):

    ayul_utm = payload.get('ayul_utm')
    ayul_x = payload.get('ayul_x')
    ayul_y = payload.get('ayul_y')
    ayul_llx = payload.get('ayul_llx')
    ayul_lly = payload.get('ayul_lly')
    ayul_llalt = payload.get('ayul_llalt')
    idx = payload.get('id')
    x=float(ayul_llx)
    y=float(ayul_lly)
    # cursor = connections['postgis_db'].cursor()
    # cursor.execute('''SELECT ST_SetSRID(ST_MakePoint(%s, %s),4326)''', [x, y])
    # geom = cursor.fetchone()
    geom = 'geom'

    ndd = int(x)
    nmm = int((x - ndd) * 60)
    nss = int((((x - ndd) * 60) - nmm) * 60)
    edd = int(y)
    emm = int((y - edd) * 60)
    ess = int((((y - edd) * 60) - emm) * 60)
    latlong = 'N' + str(ndd) + ' ' + str(nmm) + ' ' + str(nss)

    TuuhSoyolAyuulHuree.objects.create(tuuh_soyl_id = idx,  geom= geom, latlong=latlong, utm=ayul_utm, utmx=ayul_x, utmy=ayul_y, ndd=ndd, nmm=nmm, nss=nss, edd=edd, emm=emm, ess=ess, x=ayul_llx, y=ayul_lly, alt=ayul_llalt )
    return JsonResponse({'success': True})
    

@require_POST
@ajax_required
def tsegUstsanEdit(request, payload):

    form_data = []
    for tseg in TsegUstsan.objects.filter(pk = payload.get('id')):
        form_data.append({
            'tseg_id': tseg.tseg_id,
            'email': tseg.email,
            'name': tseg.name,
            'alban_tushaal': tseg.alban_tushaal,
            'utas': tseg.phone,
            'oiroltsoo_bairlal': tseg.oiroltsoo_bairlal,
            'evdersen_baidal': tseg.evdersen_baidal,
            'nohtsol_baidal': tseg.shaltgaan,
        })
    return JsonResponse({'form_data': form_data})