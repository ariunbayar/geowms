from django.urls import re_path, path, include

from frontend.bundle import views as bundle_views
from frontend.mobile import views as mobile_views
from frontend.суурь_давхарга import views as суурь_давхарга
from frontend.secure import views as secure_views
from frontend.payment import views as payment_views
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
        path('is_user/', bundle_views.is_user, name='is_user'),
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
        path('purchase-draw/', payment_views.purchaseDraw, name='purchase-draw'),
        path('api/download-purchase/<int:pk>/<str:download_type>/', payment_views.download_purchase, name="download_purchase"),
        path('api/test/payment/<int:pk>/', payment_views.test_payment, name="download_purchase"), # test hiij uzehed ene hergte
        path('purchase-from-cart/', payment_views.purchaseFromCart, name='purchase-from-cart'),
        path('download-pdf/<str:pk>/', payment_views.download_pdf, name='download-pdf'),
        path('download-zip/<int:pk>/', payment_views.download_zip, name='download-zip'),
        path('calc-price/', payment_views.calcPrice, name='calculate-price'),
    ], 'payment'))),

    path('qpay/', include(([
        path('create/', qpay_views.create, name='create'),
        path('check/', qpay_views.check, name='check'),
    ], 'qpay'))),

    path('profile/api/', include(([
        path('', profile_views.history, name='history'),
        path('all/', profile_views.all, name='all'),
        path('tseg-ustsan/search/', profile_views.tsegSearch, name='tseg-search'),
        path('tseg-ustsan/add/', profile_views.tsegAdd, name='tseg-add'),
        path('<int:pk>/get-details/', profile_views.getDetail, name='tseg-details'),
        path('info/', profile_views.user_info),
        path('update-password/', profile_views.user_update_password),
    ], 'profile'))),

    re_path('^payment/.*', payment_views.index, name='payment'),
    re_path('^profile/.*', profile_views.history, name='history'),

]
