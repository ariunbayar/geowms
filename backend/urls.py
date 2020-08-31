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
from backend.forms import views as forms_views


app_name = 'backend'
urlpatterns = [

    path('wms/', include(([
        path('all/', wms_views.all, name='all'),
        path('pagination/', wms_views.pagination, name='pagination'),
        path('create/', wms_views.create, name='create'),
        path('update/', wms_views.update, name='update'),
        path('delete/', wms_views.delete, name='delete'),
        path('wmsLayerall/', wms_views.wms_layer_all, name='layer-all'),
        path('titleUpdate/', wms_views.titleUpdate, name='titleUpdate'),
        path('layerAdd/', wms_views.layerAdd, name='layerAdd'),
        path('layerRemove/', wms_views.layerRemove, name='layerRemove'),
        path('move/', wms_views.move, name='move'),
        path('activeUpdate/', wms_views.activeUpdate, name='activeUpdate'),
        path('<int:pk>/updatemore/', wms_views.updateMore, name='updatemore'),
        path('WMS/<int:wms_id>/', wms_views.proxy, name='proxy'),
        path('paginatedList/', wms_views.paginatedList, name='paginatedList'),
    ], 'wms'))),

    path('bundle/', include(([
        path('all/', bundle_views.all, name='all'),
        path('create/', bundle_views.create, name='create'),
        path('update/', bundle_views.update, name='update'),
        path('remove/', bundle_views.remove, name='remove'),
        path('move/', bundle_views.move, name='move'),
        path('<int:pk>/updatemore/', bundle_views.updateMore, name='updatemore'),
        path('roleCreate/', bundle_views.roleCreate, name='roleCreate'),
        path('roleRemove/', bundle_views.roleRemove, name='roleRemove'),
        path('defaultCheckUpdate/', bundle_views.defaultCheckUpdate, name='defaultCheckUpdate'),
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
        path('үүсгэх/', суурь_давхарга.үүсгэх, name='үүсгэх'),
        path('move/', суурь_давхарга.move, name='move'),
        path('<int:pk>/detail/', суурь_давхарга.detail, name='detail'),
        path('<int:pk>/устгах/', суурь_давхарга.устгах, name='устгах'),
    ], 'суурь-давхарга'))),

    path('api/org/', include(([
        path('level-<int:level>/', org_views.all, name='all'),
        path('level-<int:level>/<int:pk>/roles/', org_views.roles, name='roles'),
        path('level-<int:level>/<int:pk>/roles-save/', org_views.roles_save, name='roles-save'),
        path('level-<int:level>/<int:pk>/employees/', org_views.employees, name='employees'),
        path('level-<int:level>/<int:pk>/employee-add/', org_views.employee_add, name='employee-add'),
        path('level-<int:level>/<int:pk>/employee-remove/', org_views.employee_remove, name='employee-remove'),
        path('level-<int:level>/<int:pk>/employee-more-<int:emp>/', org_views.employee_more, name='employee-more'),
        path('level-<int:level>/<int:pk>/employee-update/', org_views.employee_update, name='employee-update'),
        path('level-<int:level>/org-add/', org_views.org_add, name='org-add'),
        path('level-<int:level>/org-remove/', org_views.org_remove, name='org-remove'),
         path('level-<int:level>/<int:pk>/', org_views.OrgAll, name='OrgAll'),
        path('level-<int:level>/org-list/', org_views.orgList, name='orgList'),
        path('level-<int:level>/<int:pk>/employeeSearch/', org_views.employeeSearch, name='employeeSearch'),
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
    ], 'log'))),

    path('api/систем/', include(([
        path('', govorg_views.жагсаалт, name=''),
        path('үүсгэх/', govorg_views.үүсгэх, name='үүсгэх'),
        path('<int:pk>/дэлгэрэнгүй/', govorg_views.дэлгэрэнгүй, name='дэлгэрэнгүй'),
        path('<int:pk>/хадгалах/', govorg_views.хадгалах, name='хадгалах'),
        path('<int:pk>/шинэ_токен/', govorg_views.шинэ_токен, name='шинэ_токен'),
        path('<int:pk>/устгах/', govorg_views.устгах, name='устгах'),
        path('<int:pk>/тоо/', govorg_views.тоо, name='тоо'),
        path('govorgSearch/', govorg_views.govorgSearch, name='govorgSearch'),
    ], 'govorg'))),

    path('api/config/', include(([
        path('all/', config_views.all, name='all'),
        path('<int:pk>/detail/', config_views.detail, name='detail'),
        path('<int:pk>/update/', config_views.update, name='update'),
        path('<int:pk>/delete/', config_views.delete, name='delete'),
        path('create/', config_views.create, name='create'),
        path('disk/', config_views.disk, name='disk'),
    ], 'config'))),

    path('payment/', include(([
        path('purchase-all/', payment_views.purchaseAll, name='purchase-all'),
        path('payment-list/', payment_views.paymentList, name='paymentList'),
        path('purchase/', payment_views.purchase, name='purchase'),
        path('purchase-draw/', payment_views.purchaseDraw, name='purchase-draw'),
    ], 'payment'))),

    path('tuuhen_ov/', include(([
        path('', forms_views.all, name='all'),
        path('about/', forms_views.about, name='about'),
        path('update/', forms_views.update, name='update'),
        path('remove/', forms_views.remove, name='remove'),
        path('create/', forms_views.create, name='create'),
        path('tseg-personal/', forms_views.tsegPersonal, name='tseg-personal'),

        path('tseg-personal/update/', forms_views.tsegPersonalUpdate, name='tsegPersonalUpdate'),

        path('tseg-personal/all/', forms_views.tsegPersonalAll, name='tseg-personal-all'),
        path('tseg-personal/remove/', forms_views.tsegPersonalRemove, name='tseg-personal-remove'),
        path('tseg-ustsan/', forms_views.tsegUstsan, name='tseg-ustsan'),
        path('tseg-ustsan_all/', forms_views.tsegUstsanAll, name='tseg-ustsan_all'),
        path('tseg-ustsan_remove/', forms_views.tsegUstsanRemove, name='tseg-ustsan_remove'),
        path('tseg-ustsan_edit/', forms_views.tsegUstsanEdit, name='tsegUstsanEdit'),
        path('dursgalt-gazar/create/', forms_views.dursgaltGazarCreate, name='dursgalt-gazar-create'),
        path('dursgalt-gazar/all/', forms_views.dursgaltGazarAll, name='dursgalt-gazar-all'),
        path('dursgalt-gazar/remove/', forms_views.dursgaltGazarRemove, name='dursgalt-gazar-remove'),
        path('dursgalt-gazar/about/', forms_views.dursgaltGazarAbout, name='dursgalt-gazar-about'),
        path('dursgalt-gazar/huree-create/', forms_views.hureeCreate, name='dursgalt-gazar-huree-create'),
        path('dursgalt-gazar/huree-all/', forms_views.hureeAll, name='dursgalt-gazar-huree-all'),
        path('dursgalt-gazar/ayul-create/', forms_views.ayulHureeCreate, name='dursgalt-gazar-ayul-create'),
        path('dursgalt-gazar/ayul-all/', forms_views.ayulAll, name='dursgalt-gazar-ayul-all'),

    ], 'tuuhen_ov'))),

    re_path('^.*', webapp_views.index, name='webapp'),
]