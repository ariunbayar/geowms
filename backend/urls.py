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
        path('paginatedList/', wms_views.paginatedList, name='paginatedList'),
        path('get-geo/', wms_views.get_geo, name='get-geo'),
        path('save-geo/', wms_views.save_geo, name='save-geo'),
    ], 'wms'))),

    path('bundle/', include(([
        path('all/', bundle_views.all, name='all'),
        path('module-check/', bundle_views.moduleCheck, name='module-check'),
        path('update/', bundle_views.update, name='update'),
        path('move/', bundle_views.move, name='move'),
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
        path('wms-preview/<int:pk>/', суурь_давхарга.wms_preview, name='wms-preview'),
        path('үүсгэх/', суурь_давхарга.үүсгэх, name='үүсгэх'),
        path('move/', суурь_давхарга.move, name='move'),
        path('<int:pk>/detail/', суурь_давхарга.detail, name='detail'),
        path('<int:pk>/устгах/', суурь_давхарга.устгах, name='устгах'),
    ], 'суурь-давхарга'))),

    path('api/org/', include(([
        path('level-<int:level>/', org_views.all, name='all'),
        path('level-<int:level>/<int:pk>/', org_views.detail),
        path('level-<int:level>/<int:pk>/roles/', org_views.roles, name='roles'),
        path('level-<int:level>/<int:pk>/Inspireroles/', org_views.Inspireroles, name='Inspireroles'),
        path('level-<int:level>/<int:pk>/roles-save/', org_views.roles_save, name='roles-save'),
        path('level-<int:level>/<int:pk>/roles-add/', org_views.rolesAdd, name='roles-add'),
        path('level-<int:level>/<int:pk>/employee-add/', org_views.employee_add, name='employee-add'),
        path('level-<int:level>/<int:pk>/employee-remove/', org_views.employee_remove, name='employee-remove'),
        path('level-<int:level>/<int:pk>/employee-more-<int:emp>/', org_views.employee_more, name='employee-more'),
        path('level-<int:level>/<int:pk>/employee-update/', org_views.employee_update, name='employee-update'),
        path('level-<int:level>/org-add/', org_views.org_add, name='org-add'),
        path('level-<int:level>/org-remove/', org_views.org_remove, name='org-remove'),
        path('level-<int:level>/<int:pk>/employeeList/', org_views.employeeList, name='employeeList'),
        path('level-<int:level>/org-list/', org_views.org_list, name='orgList'),
        path('org-count/', org_views.countOrg, name='org-count'),
        path('perm-get-list/', org_views.permGetList, name='perm-get-list'),
        path('create-perm/', org_views.createPerm, name='create-perm'),
        path('get-role-name/', org_views.getgetRolesNames, name='get-role-name'),
        path('inspire-roles/<int:pk>/', org_views.getInspireRoles, name='inspire-roles'),
        path('inspire-roles/<int:pk>/save/', org_views.saveInspireRoles, name='inspire-roles-save'),

        path('level-<int:level>/<int:pk>/gov-perm/', org_views.getGovRoles, name='get-gov-roles'),
        path('level-<int:level>/<int:pk>/gov-perm/save/', org_views.saveGovRoles, name='save-gov-roles'),

        path('getAimags/', org_views.getAimags, name='getAimags'),
        path('getSumuud/', org_views.getSumuud, name='getSumuud'),
        path('getBaguud/', org_views.getBaguud, name='getBaguud'),
        path('geo_id_display/', org_views.geo_id_display, name='geo_id_display'),


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
        path('үүсгэх/', govorg_views.үүсгэх, name='үүсгэх'),
        path('<int:pk>/дэлгэрэнгүй/', govorg_views.дэлгэрэнгүй, name='дэлгэрэнгүй'),
        path('<int:pk>/хадгалах/', govorg_views.хадгалах, name='хадгалах'),
        path('<int:pk>/шинэ_токен/', govorg_views.шинэ_токен, name='шинэ_токен'),
        path('<int:pk>/устгах/', govorg_views.устгах, name='устгах'),
        path('<int:pk>/тоо/', govorg_views.тоо, name='тоо'),
        path('govorgList/', govorg_views.govorgList, name='govorgList'),
    ], 'govorg'))),

    path('api/config/', include(([
        path('disk/', config_views.disk, name='disk'),
        path('postresqlVersion/', config_views.postresqlVersion, name='postresqlVersion'),
        path('geoserver-version/', config_views.geoserver_version),
        path('site/', config_views.site_configs),
        path('site/save/', config_views.site_configs_save),
        path('geoserver/', config_views.geoserver_configs),
        path('geoserver/save/', config_views.geoserver_configs_save),
    ], 'config'))),

    path('api/error500/', include(([
        path('paginatedList/', config_views.paginatedList, name='paginatedList'),
    ], 'error500'))),

    path('payment/', include(([
        path('purchase-all/', payment_views.purchaseAll, name='purchase-all'),
        path('payment-list/', payment_views.paymentList, name='paymentList'),
        path('purchase-awah/', payment_views.purchase, name='purchase'),
    ], 'payment'))),

    path('gis/', include(([
        path('table_list/', backend.gis.views.table_list),
        path('field_list/<str:schema>/<str:table>/', backend.gis.views.field_list),
    ], 'gis'))),

    path('dedsan-butests/', include(([
        path('all/', dedsan_butets.bundleButetsAll),
        path('prop/<str:code>/', dedsan_butets.Property),
        path('editName/', dedsan_butets.Edit_name),
        path('get-fields/', dedsan_butets.getFields),
        path('save/', dedsan_butets.save),
        path('property-fields/<int:fid>/', dedsan_butets.propertyFields),
        path('property-fields/save/', dedsan_butets.propertyFieldsSave),
        path('remove/', dedsan_butets.remove),
        path('erese/', dedsan_butets.erese),
        path('getDatas/<str:name>/', dedsan_butets.Get_Datas),
    ], 'dedsan-butests'))),

    path('geoserver/rest/', include(([
        path('layers/', geoserver_views.layers),
    ], 'geoserver'))),

    re_path('^.*', webapp_views.index, name='webapp'),
]
