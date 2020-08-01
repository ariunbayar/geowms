from django.urls import re_path, path, include

from backend.bundle import views as bundle_views
from backend.webapp import views as webapp_views
from backend.wms import views as wms_views
from backend.user import views as user_views
from backend.govorg import views as govorg_views
from backend.суурь_давхарга import views as суурь_давхарга
from backend.config import views as config_views
from backend.org import views as org_views


app_name = 'backend'
urlpatterns = [

    path('wms/', include(([
        path('all/', wms_views.all, name='all'),
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
        path('level-<int:level>/org-add/', org_views.org_add, name='org-add'),
    ], 'org'))),

    path('api/систем/', include(([
        path('', govorg_views.жагсаалт, name=''),
        path('үүсгэх/', govorg_views.үүсгэх, name='үүсгэх'),
        path('<int:pk>/дэлгэрэнгүй/', govorg_views.дэлгэрэнгүй, name='дэлгэрэнгүй'),
        path('<int:pk>/хадгалах/', govorg_views.хадгалах, name='хадгалах'),
        path('<int:pk>/шинэ_токен/', govorg_views.шинэ_токен, name='шинэ_токен'),
        path('<int:pk>/устгах/', govorg_views.устгах, name='устгах'),
        path('тоо/', govorg_views.тоо, name='тоо'),
    ], 'govorg'))),

    path('api/config/', include(([
        path('all/', config_views.all, name='all'),
        path('<int:pk>/detail/', config_views.detail, name='detail'),
        path('<int:pk>/update/', config_views.update, name='update'),
        path('<int:pk>/delete/', config_views.delete, name='delete'),
        path('create/', config_views.create, name='create'),
        path('disk/', config_views.disk, name='disk'),
    ], 'config'))),

    re_path('^.*', webapp_views.index, name='webapp'),

]
