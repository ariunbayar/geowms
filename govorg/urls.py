from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.role.employee import views as role_employee_views
from govorg.backend.role.role import views as role_views
from govorg.backend.role.region import views as role_region_views
from govorg.backend.system import views as system_views
from govorg.backend.org_request import views as org_request_views
from govorg.backend.govorg_inspire import views as govorg_inspire_views
from govorg.backend.forms import views as forms_views
from govorg.backend.meta_data import views as meta_data_views
from govorg.backend.revoke_request import views as revoke_request_views
from govorg.backend.secure import views as secure_views
from govorg.backend.tseg import views as tseg_view
from backend.another_database import pg_views

urlpatterns = [
    path('api/', include(([

        path('role/', include(([
            path('region/', include(([
                path('', role_region_views.map_region)
            ], 'region'))),
            path('employee/', include(([
                path('', role_employee_views.list),
                path('send-mail/', role_employee_views.send_mail),
                path('create/', role_employee_views.create),
                path('<int:pk>/update/', role_employee_views.update),
                path('<int:pk>/detail/', role_employee_views.detail),
                path('<int:pk>/delete/', role_employee_views.delete),
                path('<int:pk>/get-erguul-info/', role_employee_views.get_erguul_info),
                path('addresses/', role_employee_views.get_addresses),
                path('get-erguul/', role_employee_views.get_erguul),
                path('erguul-list/', role_employee_views.erguul_list),
                path('get-field-tailbar/', role_employee_views.get_field_tailbar),
                path('save-field-tailbar/', role_employee_views.save_field_tailbar),
                path('<int:pk>/refresh-token/', role_employee_views.refresh_token),
            ], 'employee'))),
            path('', include(([
                path('', role_views.list),
                path('role-list/', role_views.role_list),
                path('create/', role_views.create),
                path('<int:pk>/update/', role_views.update),
                path('<int:pk>/detail/', role_views.detail),
                path('<int:pk>/delete/', role_views.delete),
            ], 'role'))),
            path('position/', include(([
                path('', org_views.position_list),
                path('create/', org_views.pos_create),
                path('<int:pk>/remove/', org_views.pos_remove),
                path('<int:pk>/edit/', org_views.pos_update),
                path('<int:pk>/detail/', org_views.pos_detail),
            ], 'position'))),
        ], 'role'))),

        path('tseg/', include(([
            path('', tseg_view.tseg_personal),
            path('get-fields/', tseg_view.get_tseg_fields),
        ], 'tseg'))),

        path('system/', include(([
            path('', system_views.systemList, name='system'),
            path('<int:pk>/detail/', system_views.detail, name='detail'),
        ], 'system'))),

        path('inspire/', include(([
            path('<int:tid>/<int:fid>/getRoles/', govorg_inspire_views.getRoles),
            path('<int:tid>/<int:pid>/<int:fid>/get-wms-layer/', govorg_inspire_views.get_wms_layer),
            path('<int:pid>/<int:fid>/geom-type/', govorg_inspire_views.geom_type),
            path('<int:pid>/<int:fid>/add/', govorg_inspire_views.add),
            path('<int:pid>/<str:fid>/save/', govorg_inspire_views.save),
            path('create/', govorg_inspire_views.create),
            path('createDel/', govorg_inspire_views.remove),
            path('createUpd/', govorg_inspire_views.update),
            path('<str:gid>/<int:tid>/<int:fid>/detailUpdate/', govorg_inspire_views.detail),
            path('<int:tid>/<int:pid>/<int:fid>/detailCreate/', govorg_inspire_views.detailCreate),
            path('<int:pid>/<int:fid>/remove/', govorg_inspire_views.delete),
            path('<int:fid>/geom-update/', govorg_inspire_views.updateGeom),
            path('send-data/<int:tid>/<int:pid>/<int:fid>/<str:ext>/', govorg_inspire_views.file_upload_save_data),
            path('qgis-url/<int:fid>/', govorg_inspire_views.get_qgis_url),
            path('qpi-url/', govorg_inspire_views.get_api_url),
            path('control-to-approve/', govorg_inspire_views.control_to_approve),
            path('control-to-remove/', govorg_inspire_views.control_to_remove),
            path('get-layers/<int:fid>/', govorg_inspire_views.get_layers),
        ], 'inspire'))),

        path('org-request/', include(([
            path('', org_request_views.get_list),
            path('change-request/', org_request_views.get_change_all, name="change-request"),
            path('reject/', org_request_views.request_reject, name="reject"),
            path('approve/', org_request_views.request_approve, name="approve"),
            path('getCount/', org_request_views.get_count, name='getCount'),
            path('get_choices/', org_request_views.get_choices, name='get-choices'),
        ], 'org-request'))),

        path('tseg-personal/', include(([
            path('', forms_views.tsegPersonal, name='tseg-personal'),
            path('tseg-roles/', forms_views.emp_tseg_roles, name='tseg-roles'),
            path('findSum/', forms_views.findSum, name='findSum'),
            path('success-point/<int:id>/', forms_views.tseg_personal_success, name='tseg-personal-batalgaajuulah'),
            path('update/', forms_views.tsegPersonalUpdate, name='tsegPersonalUpdate'),
            path('search/', forms_views.tsegPersonalSearch, name='tsegPersonalSearch'),
            path('searchName/', forms_views.tsegPersonalNameSearch, name='tsegPersonalNameSearch'),
            path('list/', forms_views.tseg_personal_list, name='tseg-personal-list'),
            path('remove-point/<int:id>/', forms_views.tseg_personal_remove, name='tseg-personal-remove'),
            path('get-field-values/', forms_views.get_field_values),
            path('get-inspire-list/', forms_views.tseg_inspire_list),
            path('get-tseg/', forms_views.get_tseg),
        ], 'tseg-personal'))),

        path('tseg-ustsan/', include(([
            path('', forms_views.tsegUstsan, name='tseg-ustsan'),
            path('success/', forms_views.tseg_ustsan_success, name='tseg-ustsan-success'),
            path('list/', forms_views.tsegUstsanList, name='tseg-ustsan-list'),
            path('remove/', forms_views.tsegUstsanRemove, name='tseg-ustsan-remove'),
            path('edit/', forms_views.tsegUstsanEdit, name='tsegUstsanEdit'),
        ], 'tseg-ustsan'))),

        path('tuuhen_ov/', include(([
            path('', forms_views.all, name='all'),
            path('list/', forms_views.tuuhenOvList, name='list'),
            path('about/', forms_views.about, name='about'),
            path('update/', forms_views.update, name='update'),
            path('remove/', forms_views.remove, name='remove'),
            path('create/', forms_views.create, name='create'),
            path('huree-count/', forms_views.hureeCountEdit, name='huree-count'),
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
            path('<int:pk>/<str:is_show_choice>/detail/', meta_data_views.detail),
            path('<int:pk>/delete/', meta_data_views.delete),
            path('<int:pk>/edit/', meta_data_views.edit),
            path('create/', meta_data_views.create),
            path('get-fields/', meta_data_views.get_fields),
        ], 'meta-data'))),

        path('revoke_request/', include(([
            path('', revoke_request_views.get_list),
            path('revoke-new/', revoke_request_views.revoke_new),
            path('revoke-change-state/', revoke_request_views.revoke_state),
            # path('revoke-search/', revoke_request_views.revoke_paginate),
            path('get_choices/', revoke_request_views.get_choices),
        ], 'revoke_request'))),

        path('llc-request/', include(([
            path('', org_request_views.get_llc_list),
            path('reject/', org_request_views.llc_request_reject, name="reject"),
            path('approve/<int:request_id>/', org_request_views.llc_request_approve),
            path('dismiss/', org_request_views.llc_request_dismiss, name="dismiss"),
            path('<int:conn_id>/get-all-view-names/', pg_views.get_pg_table_names),
            path('<int:id>/<int:table_id>/table-detail/', pg_views.table__detail),
            path('get-fields/', pg_views.getFields),
            path('<int:id>/get-request-data/', org_request_views.get_request_data, name=' save_request'),
            path('<int:id>/get-request-detail/', org_request_views.get_request_detail, name=' save_request'),
            path('get-search-choices/', org_request_views.get_search_choices),
            path('inspire-save/', org_request_views.inspire_save, name=' inspire_save'),
            path('geom-type/', org_request_views.geom_type, name=' geom_type'),
            path('<int:id>/get-file-shapes/', org_request_views.get_file_shapes, name=' save_request'),
        ], 'llc-request'))),

    ], 'back_org'))),

    path('secure/', include(([
        path('login/', secure_views.login, name='login'),
        path('approve/<str:token>/', secure_views.approve, name='approve'),
        path('logout/', secure_views.logout, name='logout'),
    ], 'gov_secure'))),

    path('', include(([
        path('', org_views.frontend, name='frontend'),
        path('emp-role/', org_views.emp_role, name='emp-role'),
        path('get-perms/', org_views.get_perms),
        path('get_approve_and_revoke/', org_views.get_approve_and_revoke),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
