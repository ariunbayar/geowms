from django.urls import re_path, path, include

from frontend.bundle import views as bundle_views
from frontend.mobile import views as mobile_views
from frontend.суурь_давхарга import views as суурь_давхарга
from frontend.secure import views as secure_views
from frontend.payment import views as payment_views
from frontend.page import views as page_views
from frontend.profile import views as profile_views


urlpatterns = [

    path('', include(([
        path('', bundle_views.all, name='all'),
        path('дэд-сан/<int:pk>/', bundle_views.detail, name='detail'),
        path('дэд-сан/<int:pk>/давхаргууд/', bundle_views.wms_layers, name='wms-layers'),
    ], 'bundle'))),

    path('', include(([
        path('register', secure_views.register, name='register'),
        path('loginUser/', secure_views.loginUser, name='loginUser'),
        path('login/', secure_views.login, name='login'),
        path('login/dan/', secure_views.login_dan, name='login-dan'),
        path('logout/', secure_views.logout, name='logout'),
        path('oauth2/', secure_views.oauth2, name='oauth2'),
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


    path('payment/', include(([
        path('dictionaryRequest/', payment_views.dictionaryRequest, name='dictionaryRequest'),
        path('dictionaryResponse/', payment_views.dictionaryResponse, name='dictionaryResponse'),
    ], 'payment'))),

    path('profile/api/', include(([
        path('', profile_views.history, name='history'),
        path('all/', profile_views.all, name='all'),
    ], 'profile'))),

    re_path('^.*', profile_views.history, name='history'),

    re_path('^.*', payment_views.index, name='payment'),
]
