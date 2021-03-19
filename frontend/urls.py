from django.urls import re_path, path, include

from frontend.bundle import views as bundle_views
from frontend.mobile import views as mobile_views
from frontend.суурь_давхарга import views as суурь_давхарга
from frontend.secure import views as secure_views
from frontend.payment import views as payment_views
from frontend.covid import views as covid_views
from frontend.open_layer import views as open_layer_views
from frontend.page import views as page_views
from frontend.profile import views as profile_views
from frontend.qpay import views as qpay_views

urlpatterns = [

    path('', include(([
        path('', bundle_views.all, name='all'),
        path('api/aimag/', bundle_views.aimag, name='aimag'),
        path('api/sum/', bundle_views.sumfind, name='sum'),
        path('дэд-сан/<int:pk>/', bundle_views.detail, name='detail'),
        path('дэд-сан/<int:pk>/давхаргууд/', bundle_views.wms_layers, name='wms-layers'),
        path('get_user/', bundle_views.get_user, name='get_user'),
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
        path('purchase-draw/', payment_views.purchase_draw, name='purchase-draw'),
        path('api/download-purchase/<int:pk>/', payment_views.download_purchase, name="download_purchase"),
        path('purchase-from-cart/', payment_views.purchase_from_cart),
        path('download-pdf/<int:pk>/<str:pdf_id>/', payment_views.download_pdf, name='download-pdf'),
        path('download-zip/<int:pk>/', payment_views.download_zip, name='download-zip'),
        path('calc-price/', payment_views.calc_price, name='calculate-price'),
        path('check-enable-pdf/', payment_views.check_button_ebable_pdf),
        path('check-enable-pdf-id/', payment_views.check_button_ebable_pdf_geo_id),
        path('get-popup-info/', payment_views.get_popup_info),
        path('get-feature-info/', payment_views.get_feature_info),
        path('get-geom/', payment_views.get_geom),
        path('get-contain-geoms/', payment_views.get_contain_geoms),
    ], 'payment'))),

    path('qpay/', include(([
        path('create/', qpay_views.create, name='create'),
        path('check/', qpay_views.check, name='check'),
    ], 'qpay'))),

    path('covid/', include(([
        path('get-nema/<int:bundle_id>/', covid_views.get_nema),
        path('get-nema/<int:bundle_id>/all/', covid_views.get_nema_all),
    ], 'covid'))),

    path('profile/api/', include(([
        path('', profile_views.history, name='history'),
        path('all/', profile_views.all, name='all'),
        path('tseg-ustsan/search/', profile_views.tsegSearch, name='tseg-search'),
        path('tseg-ustsan/add/', profile_views.tsegAdd, name='tseg-add'),
        path('<int:pk>/get-details/', profile_views.get_detail, name='tseg-details'),
        path('check-email/', profile_views.check_email, name='check-email'),
        path('set-email/', profile_views.set_email, name='set-email'),
        path('info/', profile_views.user_info),
        path('update-password/', profile_views.user_update_password),
    ], 'profile'))),

    re_path('^payment/.*', payment_views.index, name='payment'),
    re_path('^covid/.*', covid_views.index, name='covid'),
    re_path('^open-layer/.*', open_layer_views.index, name='open-layer'),
    re_path('^profile/.*', profile_views.history, name='history'),

]
