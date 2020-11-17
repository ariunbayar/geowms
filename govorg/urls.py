from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views
from govorg.backend.org_request import views as org_request_views
from govorg.backend.govorg_inspire import views as govorg_inspire_views
from govorg.backend.zipcode import views as zipcode_views
from govorg.backend.forms import views as forms_views
from govorg.backend.meta_data import views as meta_data_views
from govorg.backend.profile import views as user_profile_views

urlpatterns = [
    path('api/', include(([

        path('employee/', include(([
            path('', employee_views.employees, name='employees'),
        ], 'employee'))),
        path('system/', system_views.systemList, name='system'),
        path('bundle/', bundle_views.bundle, name='bundle'),
        path('inspire/', include(([
            path('', govorg_inspire_views.changeset_all),
            path('<int:pid>/<int:fid>/getRoles/', govorg_inspire_views.getRoles),
            path('table_list/', govorg_inspire_views.bundleButetsAll),
            path('<int:pid>/<int:fid>/rows/', govorg_inspire_views.rows),
            path('<int:pid>/<int:fid>/geom-type/', govorg_inspire_views.geom_type),
            path('<int:pid>/<int:fid>/add/', govorg_inspire_views.add),
            path('<int:pid>/<str:fid>/save/', govorg_inspire_views.save),
            path('create/', govorg_inspire_views.create),
            path('createDel/', govorg_inspire_views.createDel),
            path('createUpd/', govorg_inspire_views.createUpd),
            path('<str:pk>/<str:fid>/detail/', govorg_inspire_views.detail),
            path('<int:tid>/<int:pid>/<int:fid>/detail/', govorg_inspire_views.detailNone),
            path('<int:pid>/<int:fid>/remove/', govorg_inspire_views.delete),
            path('<int:fid>/geom-update/', govorg_inspire_views.updateGeom),
            path('<int:fid>/add-geom/', govorg_inspire_views.geomAdd),
            path('send-data/<int:tid>/<int:fid>/', govorg_inspire_views.FileUploadSaveData),
        ], 'inspire'))),

        path('org-request/', include(([
            path('', org_request_views.getAll, name="all"),
            path('change-request/', org_request_views.getChangeAll, name="change-request"),
            path('<int:pk>/delete/', org_request_views.requestDelete, name="delete"),
            path('<int:pk>/approve/', org_request_views.requestApprove, name="approve"),
            path('getCount/', org_request_views.getCount, name='getCount'),
            path('search/', org_request_views.search, name='request-search'),
        ], 'org-request'))),
        path('zip-code/', include(([
            path('aimag/', zipcode_views.aimag, name='aimag'),
            path('sum/', zipcode_views.sum, name='sum'),
            path('bag-horoo/', zipcode_views.bagaHoroo, name='bag-horoo'),
            path('zip/', zipcode_views.zip, name='zip'),
            path('zip-update/', zipcode_views.zipUpdate, name='zip-update'),
            path('wms-layer/', zipcode_views.wmsLayer, name='wms-layer'),
            path('search/', zipcode_views.search, name='search'),
        ], 'zip-code'))),

        path('tuuhen_ov/', include(([
            path('', forms_views.all, name='all'),
            path('list/', forms_views.tuuhenOvList, name='list'),
            path('about/', forms_views.about, name='about'),
            path('update/', forms_views.update, name='update'),
            path('remove/', forms_views.remove, name='remove'),
            path('create/', forms_views.create, name='create'),
            path('huree-count/', forms_views.hureeCountEdit, name='huree-count'),
            path('tseg-personal/', forms_views.tsegPersonal, name='tseg-personal'),
            path('tseg-personal/findSum/', forms_views.findSum, name='findSum'),
            path('tseg-personal/find-point/', forms_views.findPoints, name='find-point'),
            path('tseg-personal/batalgaajuulah/', forms_views.tsegPersonalSuccess, name='tseg-personal-batalgaajuulah'),
            path('tseg-personal/update/', forms_views.tsegPersonalUpdate, name='tsegPersonalUpdate'),
            path('tseg-personal/search/', forms_views.tsegPersonalSearch, name='tsegPersonalSearch'),
            path('tseg-personal/searchName/', forms_views.tsegPersonalNameSearch, name='tsegPersonalNameSearch'),
            path('tseg-personal/list/', forms_views.tseg_personal_list, name='tseg-personal-list'),
            path('tseg-personal/remove/', forms_views.tsegPersonalRemove, name='tseg-personal-remove'),
            path('tseg-ustsan/', forms_views.tsegUstsan, name='tseg-ustsan'),
            path('tseg-ustsan-success/', forms_views.tsegUstsanSuccess, name='tseg-ustsan-success'),
            path('tseg-ustsan-list/', forms_views.tsegUstsanList, name='tseg-ustsan-list'),
            path('tseg-ustsan-remove/', forms_views.tsegUstsanRemove, name='tseg-ustsan-remove'),
            path('tseg-ustsan_edit/', forms_views.tsegUstsanEdit, name='tsegUstsanEdit'),
            path('dursgalt-gazar/create/', forms_views.dursgaltGazarCreate, name='dursgalt-gazar-create'),
            path('dursgalt-gazar/update/', forms_views.dursgaltGazarUpdate, name='dursgalt-gazar-update'),
            path('dursgalt-gazar/all/', forms_views.dursgaltGazarAll, name='dursgalt-gazar-all'),
            path('dursgalt-gazar/remove/', forms_views.dursgaltGazarRemove, name='dursgalt-gazar-remove'),
            path('dursgalt-gazar/about/', forms_views.dursgaltGazarAbout, name='dursgalt-gazar-about'),
            path('dursgalt-gazar/huree-create/', forms_views.hureeCreate, name='dursgalt-gazar-huree-create'),
            path('dursgalt-gazar/huree-update/', forms_views.hureeUpdate, name='dursgalt-gazar-huree-update'),
            path('dursgalt-gazar/huree-delete/', forms_views.hureeDelete, name='dursgalt-gazar-huree-delete'),
            path('dursgalt-gazar/huree-all/', forms_views.hureeAll, name='dursgalt-gazar-huree-all'),
            path('dursgalt-gazar/ayul-create/', forms_views.ayulHureeCreate, name='dursgalt-gazar-ayul-create'),
            path('dursgalt-gazar/ayul-update/', forms_views.ayulHureeUpdate, name='dursgalt-gazar-ayul-update'),
            path('dursgalt-gazar/ayul-delete/', forms_views.ayulHureeDelete, name='dursgalt-gazar-ayul-delete'),
            path('dursgalt-gazar/ayul-all/', forms_views.ayulAll, name='dursgalt-gazar-ayul-all'),
            path('rows/', forms_views.rows, name='rows'),
            path('ayuul_geoms/', forms_views.ayuul_geoms, name='ayuul_geoms'),
            path('geom_points/', forms_views.geom_points, name='geom_points'),
        ], 'tuuhen_ov'))),

        path('meta-data/', include(([
            path('', meta_data_views.all),
            path('<int:pk>/detail/', meta_data_views.detail),
            path('<int:pk>/delete/', meta_data_views.delete),
            path('<int:pk>/edit/', meta_data_views.edit),
            path('create/', meta_data_views.create),
            path('get-fields/', meta_data_views.get_fields),
        ], 'meta-data'))),

        path('user/profile/', include(([
            path('', user_profile_views.detail),
            path('update-password/', user_profile_views.update_password),
        ], 'user-profile'))),

    ], 'back_org'))),

    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
