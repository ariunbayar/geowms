import requests
import json
from geojson import Feature, FeatureCollection

from django.db import connections
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST

from backend.changeset.models import ChangeSet
from backend.org.models import Org
from main.decorators import ajax_required



def _get_changeset_display(ob):

    geom= eval(ob.geom)
    geometry = eval(geom['geom'])
    coordinates = geometry['coordinates']
    geom_type = geometry['type']

    return {
        'coordinate':coordinates,
        'geom_type':geom_type,
        'changeset_id':ob.id,
        'changeset_attributes':ob.features,
        'projection': ob.projection
    }

def _get_feature_coll(ob, changeset_list):
    geom_type = changeset_list[ob]['geom_type']
    if geom_type == 'Point':
        from geojson import Point
        point = Point((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)
    elif geom_type == 'LineString':
        from geojson import LineString
        point = LineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'Polygon':
        from geojson import Polygon
        point = Polygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)

    elif geom_type == 'MultiPoint':
        from geojson import MultiPoint
        point = MultiPoint((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


    elif geom_type == 'MultiLineString':
        from geojson import MultiLineString
        point = MultiLineString((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


    else:
        from geojson import MultiPolygon
        point = MultiPolygon((changeset_list[ob]['coordinate']))
        return Feature(type = 'Feature', properties={"changeset_id": str(changeset_list[ob]['changeset_id'])}, geometry=point)


@require_GET
@ajax_required
def changeset_all(request):

    feature = []
    geoJson = []
    changeset_list = [_get_changeset_display(ob) for ob in ChangeSet.objects.all()]
    features = [ _get_feature_coll(ob, changeset_list) for ob in range(len(changeset_list))]
    feature_collection = FeatureCollection(features)
    rsp = {
        'GeoJson': feature_collection,
    }
    return JsonResponse(rsp)


@require_GET
@ajax_required
def table_list(request):

    org = get_object_or_404(Org, employee__user=request.user)

    rsp = {
        'items': [
            {
                'oid': 88363,
                'schema': 'public',
                'table': 'AU_SumUnit',
            },
            {
                'oid': 83299,
                'schema': 'public',
                'table': 'AU_StateUnit',
            },
            {
                'oid': 83311,
                'schema': 'public',
                'table': 'AU_AimagUnit',
            },
            {
                'oid': 59907,
                'schema': 'public',
                'table': 'AddressPoint',
            },
            {
                'oid': 24149,
                'schema': 'public',
                'table': 'AdmUnitSum',
            },
            {
                'oid': 24630,
                'schema': 'public',
                'table': 'AdmUnitUls',
            },
            {
                'oid': 35684,
                'schema': 'public',
                'table': 'Sand',
            },
            {
                'oid': 85312,
                'schema': 'public',
                'table': 'Shuudan_uilchilgeenii_salbaruud',
            },
        ]
    }

    return JsonResponse(rsp)


@require_GET
@ajax_required
def rows(request, oid):

    org = get_object_or_404(Org, employee__user=request.user)

    fields = [
        "id",
        "geom",
        "objectid_1",
        "fid_1",
        "objectid_2",
        "\u0442url",
        "objectid_3",
        "\u0442url_1",
        "butenner",
        "sum",
        "bag",
        "gudamj",
        "hayag",
        "objectid",
    ]

    rows = [
        {
            "id": 1,
            "geom": "POINT ZM (97.708101366243",
            "objectid_1": 1,
            "fid_1": 0.0,
            "objectid_2": 1.0,
            "\u0442url": 101.0,
            "objectid_3": 1.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-4-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 406.0,
            "objectid": 1
        },
        {
            "id": 2,
            "geom": "POINT ZM (97.706275394361",
            "objectid_1": 2,
            "fid_1": 1.0,
            "objectid_2": 2.0,
            "\u0442url": 101.0,
            "objectid_3": 2.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-4-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 404.0,
            "objectid": 2
        },
        {
            "id": 3,
            "geom": "POINT ZM (97.706064042387",
            "objectid_1": 3,
            "fid_1": 2.0,
            "objectid_2": 3.0,
            "\u0442url": 101.0,
            "objectid_3": 3.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-4-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 401.0,
            "objectid": 3
        },
        {
            "id": 4,
            "geom": "POINT ZM (97.706677901300",
            "objectid_1": 4,
            "fid_1": 3.0,
            "objectid_2": 4.0,
            "\u0442url": 101.0,
            "objectid_3": 4.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 300.0,
            "objectid": 4
        },
        {
            "id": 5,
            "geom": "POINT ZM (97.707272094176",
            "objectid_1": 5,
            "fid_1": 4.0,
            "objectid_2": 5.0,
            "\u0442url": 101.0,
            "objectid_3": 5.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 302.0,
            "objectid": 5
        },
        {
            "id": 6,
            "geom": "POINT ZM (97.706067371888",
            "objectid_1": 6,
            "fid_1": 5.0,
            "objectid_2": 6.0,
            "\u0442url": 101.0,
            "objectid_3": 6.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 307.0,
            "objectid": 6
        },
        {
            "id": 7,
            "geom": "POINT ZM (97.704538908007",
            "objectid_1": 7,
            "fid_1": 6.0,
            "objectid_2": 7.0,
            "\u0442url": 101.0,
            "objectid_3": 7.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 301.0,
            "objectid": 7
        },
        {
            "id": 8,
            "geom": "POINT ZM (97.705203142314",
            "objectid_1": 8,
            "fid_1": 7.0,
            "objectid_2": 8.0,
            "\u0442url": 101.0,
            "objectid_3": 8.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 303.0,
            "objectid": 8
        },
        {
            "id": 9,
            "geom": "POINT ZM (97.707729485980",
            "objectid_1": 9,
            "fid_1": 8.0,
            "objectid_2": 9.0,
            "\u0442url": 101.0,
            "objectid_3": 9.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 311.0,
            "objectid": 9
        },
        {
            "id": 10,
            "geom": "POINT ZM (97.709291238422",
            "objectid_1": 10,
            "fid_1": 9.0,
            "objectid_2": 10.0,
            "\u0442url": 101.0,
            "objectid_3": 10.0,
            "\u0442url_1": 101.0,
            "butenner": "\u0413\u043e\u0432\u044c-\u0410\u043b\u0442\u0430\u0439 \u0430\u0439\u043c\u0430\u0433",
            "sum": "\u042d\u0440\u0434\u044d\u043d\u044d \u0441\u0443\u043c",
            "bag": "\u04e8\u043b\u0437\u0438\u0439\u0442 4-\u0440 \u0431\u0430\u0433",
            "gudamj": "\u041c\u0430\u043d\u0434\u0430\u043b-3-\u0440 \u0433\u0443\u0434\u0430\u043c\u0436",
            "hayag": 315.0,
            "objectid": 10
        }
    ]

    rsp = {
        'data': {
            'fields': fields,
            'rows': rows,
        }
    }
    return JsonResponse(rsp)
