from django.urls import re_path, path, include

from backend.bundle import views as bundle_views
from backend.webapp import views as webapp_views
from backend.wms import views as wms_views
from backend.user import views as user_views
from backend.govorg import views as govorg_views
from backend.суурь_давхарга import views as суурь_давхарга
from backend.config import views as config_views
from backend.org import views as org_views
from backend.log import views as log_views
from backend.payment import views as payment_views
from backend.dedsanbutets import views as dedsan_butets
import backend.gis.views
from backend.geoserver import views as geoserver_views

app_name = 'backend'
urlpatterns = [

    path('wms/', include(([
        path('all/', wms_views.all, name='all'),
        path('pagination/', wms_views.pagination, name='pagination'),
        path('create/', wms_views.create, name='create'),
        path('update/', wms_views.update, name='update'),
        path('delete/', wms_views.delete, name='delete'),
        path('wmsLayerall/', wms_views.wms_layer_all, name='layer-all'),
        path('WMS/<int:wms_id>/', wms_views.proxy, name='proxy'),
        path('titleUpdate/', wms_views.titleUpdate, name='titleUpdate'),
        path('layerAdd/', wms_views.layerAdd, name='layerAdd'),
        path('layerRemove/', wms_views.layerRemove, name='layerRemove'),
        path('move/', wms_views.move, name='move'),
        path('activeUpdate/', wms_views.activeUpdate, name='activeUpdate'),
        path('<int:pk>/updatemore/', wms_views.updateMore, name='updatemore'),
        path('paginatedList/', wms_views.paginated_list, name='paginatedList'),
        path('get-geo/', wms_views.get_geo, name='get-geo'),
        path('save-geo/', wms_views.save_geo, name='save-geo'),
    ], 'wms'))),

    path('bundle/', include(([
        path('all/', bundle_views.all, name='all'),
        path('update/', bundle_views.update, name='update'),
        path('swap/', bundle_views.swap, name='swap'),
        path('<int:pk>/update-detail/', bundle_views.detail, name='update-detail'),
        path('get-layer/', bundle_views.get_form_options, name='get-layer'),
        path('role-create/', bundle_views.roleCreate, name='role-create'),
        path('role-remove/', bundle_views.roleRemove, name='role-remove'),
        path('default-check-update/', bundle_views.defaultCheckUpdate, name='default-check-update'),
    ], 'bundle'))),

    path('api/user/', include(([
        path('all/', user_views.all, name='all'),
        path('userDetailChange/', user_views.userDetailChange, name='userDetailChange'),
        path('roleCreate/', user_views.roleCreate, name='roleCreate'),
        path('<int:pk>/дэлгэрэнгүй/', user_views.дэлгэрэнгүй, name='дэлгэрэнгүй'),
        path('userCount/', user_views.userCount, name='userCount'),
        path('paginatedList/', user_views.paginatedList, name='paginatedList'),
    ], 'user'))),

    path('api/суурь-давхарга/', include(([
        path('', суурь_давхарга.жагсаалт, name=''),
        path('wms-preview/<int:pk>/<str:url_type>/', суурь_давхарга.wms_preview, name='wms-preview'),
        path('үүсгэх/', суурь_давхарга.үүсгэх, name='үүсгэх'),
        path('swap/', суурь_давхарга.swap, name='swap'),
        path('<int:pk>/detail/', суурь_давхарга.detail, name='detail'),
        path('<int:pk>/устгах/', суурь_давхарга.устгах, name='устгах'),
    ], 'суурь-давхарга'))),

    path('api/org/', include(([
        path('level-<int:level>/', org_views.all, name='all'),
        path('level-<int:level>/<int:pk>/', org_views.detail),
        path('level-<int:level>/<int:pk>/employee-add/', org_views.employee_add, name='employee-add'),
        path('employee-remove-<int:pk>/', org_views.employee_remove, name='employee-remove'),
        path('employee-token-refresh-<int:pk>/', org_views.employee_token_refresh, name='employee-token-refresh'),
        path('employee-detail-<int:pk>/', org_views.employee_detail, name='employee-detail'),
        path('level-<int:level>/employee-update-<int:pk>/', org_views.employee_update, name='employee-update'),
        path('level-<int:level>/org-add/', org_views.org_add, name='org-add'),
        path('level-<int:level>/org-remove/', org_views.org_remove, name='org-remove'),
        path('level-<int:level>/<int:pk>/employeeList/', org_views.employee_list),
        path('level-<int:level>/org-list/', org_views.org_list, name='orgList'),
        path('org-count/', org_views.count_org),
        path('perm-get-list/', org_views.perm_get_list),
        path('create-perm/', org_views.create_perm),
        path('inspire-roles/<int:pk>/', org_views.get_inspire_roles),
        path('inspire-roles/<int:pk>/save/', org_views.save_inspire_roles),
        path('level-<int:level>/<int:pk>/gov-perm/', org_views.get_gov_roles),
        path('level-<int:level>/<int:pk>/gov-perm/save/', org_views.save_gov_roles),
        path('form-options/<str:option>/', org_views.form_options),
        path('<int:level>/<int:pk>/addresses/', org_views.get_addresses),
        path('<int:pk>/emp-info/', org_views.get_emp_info),
        path('<int:pk>/erguuleg-fields/', org_views.get_erguuleg_fields),
        path('save-erguul/', org_views.save_erguul),
        path('get-erguul/', org_views.get_erguuls),
        path('get-select-values/', org_views.get_select_values),
    ], 'org'))),

    path('api/log/', include(([
        path('login-list/', log_views.login_list, name='login-list'),
        path('crud-list/', log_views.crudList, name='crudList'),
        path('login-date-count/', log_views.login_date_count, name='login-date-count'),
        path('crud-method-count/', log_views.crud_method_count, name='crud-method-count'),
        path('crud-date-count/', log_views.crud_date_count, name='crud-date-count'),
        path('page-date-count/', log_views.page_date_count, name='page-date-count'),
        path('page-user-count/', log_views.page_user_count, name='page-user-count'),
        path('page-list/', log_views.page_list, name='page-list'),
        path('wms_log_list/', log_views.wms_log_list, name='wms_log_list-list'),
        path('wms_date_count/', log_views.wms_date_count, name='wms_date_count'),
    ], 'log'))),

    path('api/систем/', include(([
        path('<int:pk>/дэлгэрэнгүй/', govorg_views.дэлгэрэнгүй, name='дэлгэрэнгүй'),
        path('үүсгэх/', govorg_views.хадгалах),
        path('<int:pk>/хадгалах/', govorg_views.хадгалах),
        path('<int:pk>/att-save/', govorg_views.set_attributes),
        path('<int:pk>/refresh-token/', govorg_views.refresh_token, name='refresh-token'),
        path('<int:pk>/устгах/', govorg_views.устгах, name='устгах'),
        path('<int:pk>/тоо/', govorg_views.тоо, name='тоо'),
        path('govorgList/<int:org_id>/', govorg_views.govorgList, name='govorgList'),
    ], 'govorg'))),

    path('api/config/', include(([
        path('disk/', config_views.disk, name='disk'),
        path('postresqlVersion/', config_views.postresqlVersion, name='postresqlVersion'),
        path('geoserver-version/', config_views.geoserver_version),
        path('site/', config_views.site_configs),
        path('site/save/', config_views.site_configs_save),
        path('geoserver/', config_views.geoserver_configs),
        path('geoserver/save/', config_views.geoserver_configs_save),
        path('system/', config_views.system_configs),
        path('system/save/', config_views.system_configs_save),
        path('email/', config_views.email_configs),
        path('email/save/', config_views.email_configs_save),
        path('qgis/', config_views.qgis_configs),
        path('qgis/save/', config_views.qgis_configs_save),
        path('dan/', config_views.dan_configs),
        path('dan/save/', config_views.dan_configs_save),
        path('payment/', config_views.payment_configs),
        path('payment/save/', config_views.payment_configs_save),
        path('covid/', config_views.covid_configs),
        path('covid/save/', config_views.covid_configs_save),
    ], 'config'))),

    path('api/error500/', include(([
        path('paginatedList/', config_views.paginatedList, name='paginatedList'),
    ], 'error500'))),

    path('payment/', include(([
        path('purchase-all/', payment_views.purchase_all, name='purchase-all'),
        path('payment-list/', payment_views.paymentList, name='paymentList'),
        path('purchase-awah/', payment_views.purchase, name='purchase'),
    ], 'payment'))),

    path('gis/', include(([
        path('table_list/', backend.gis.views.table_list),
        path('field_list/<str:schema>/<str:table>/', backend.gis.views.field_list),
    ], 'gis'))),

    path('dedsan-butests/', include(([
        path('all/', dedsan_butets.bundleButetsAll),
        path('check-style-name/', dedsan_butets.check_styles_name),
        path('prop/<str:code>/', dedsan_butets.Property),
        path('editName/', dedsan_butets.Edit_name),
        path('get-fields/', dedsan_butets.getFields),
        path('save/', dedsan_butets.save),
        path('property-fields/<int:fid>/', dedsan_butets.propertyFields),
        path('property-fields/save/', dedsan_butets.propertyFieldsSave),
        path('remove/', dedsan_butets.remove),
        path('erese/', dedsan_butets.erese),
        path('getDatas/<str:name>/', dedsan_butets.Get_Datas),
        path('style-data/', dedsan_butets.get_style_data),
        path('overlaps-feature-get/<str:feature_id>/', dedsan_butets.feature_overlaps_get),
        path('overlaps-feature-set/', dedsan_butets.feature_overlaps_set),
    ], 'dedsan-butests'))),

    path('geoserver/rest/', include(([
        path('layers/', geoserver_views.layers),
        path('group_list/', geoserver_views.layer_groups),
        path('remove_layer_group/', geoserver_views.remove_layer_group),
        path('get_group_detial/', geoserver_views.get_group_detial),
        path('get_layers/', geoserver_views.get_layer_detial),
        path('create_layer_group/', geoserver_views.create_layer_group),
        path('get_group_cache_list/', geoserver_views.get_group_cache),
        path('create_group_cache/<str:group_name>/', geoserver_views.create_group_cache),
    ], 'geoserver'))),

    re_path('^.*', webapp_views.index, name='webapp'),
]
