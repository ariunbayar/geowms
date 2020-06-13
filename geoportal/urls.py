from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from geoportal_app import views, sub_url
import secure.views
import backend.urls
import frontend.urls



urlpatterns = [

    path('admin/', admin.site.urls),
    path('login/', secure.views.login, name='login'),
    path('login/dan/', secure.views.login_dan, name='login-dan'),
    path('logout/', secure.views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('service', views.service, name='service'),
    path('meta-data', views.metaData, name='meta-data'),
    path('help', views.help, name='help'),
    path('statistics', views.statistics, name='statistics'),
    path('', include(frontend.urls)),
    path('back/', include(backend.urls)),
    path('sub/', include(sub_url)),

    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
