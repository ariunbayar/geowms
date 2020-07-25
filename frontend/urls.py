from django.urls import re_path, path, include

from frontend.bundle import views as bundle_views
from frontend.mobile import views as mobile_views
from frontend.суурь_давхарга import views as суурь_давхарга
from frontend.secure import views as secure_views
from frontend.page import views as page_views


urlpatterns = [

    path('', include(([
        path('', bundle_views.all, name='all'),
        path('дэд-сан/<int:pk>/', bundle_views.detail, name='detail'),
        path('дэд-сан/<int:pk>/давхаргууд/', bundle_views.wms_layers, name='wms-layers'),
        path('purchase/', bundle_views.purchase, name='purchase'),
        path('success/', bundle_views.success, name='success'),
        path('failed/', bundle_views.failed, name='failed'),
    ], 'bundle'))),

    path('', include(([
        path('register', secure_views.register, name='register'),
        path('loginUser/', secure_views.loginUser, name='loginUser'),
        path('login/', secure_views.login, name='login'),
        path('login/dan/', secure_views.login_dan, name='login-dan'),
        path('logout/', secure_views.logout, name='logout'),
        path('dictionaryRequest', secure_views.dictionaryRequest, name='dictionaryRequest'),
        path('dictionaryResponse', secure_views.dictionaryResponse, name='dictionaryResponse'),
        path('dictionary', secure_views.dictionary, name='dictionary'),
    ], 'secure'))),

    path('m/', include(([
        path('', mobile_views.all, name='all'),
        path('дэд-сан/<int:pk>/', mobile_views.detail, name='detail'),
        path('дэд-сан/<int:pk>/давхаргууд/', mobile_views.wms_layers, name='wms-layers'),
    ], 'mobile'))),

    path('суурь-давхарга/', include(([
        path('', суурь_давхарга.all, name='all'),
    ], 'суурь-давхарга'))),


    path('p/', include(([
        path('үйлчилгээ/', page_views.service, name='service'),
        path('тусламж/', page_views.help, name='help'),
        path('статистик/', page_views.statistics, name='statistics'),
    ], 'page'))),

]
