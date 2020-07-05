
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

import backend.urls
import frontend.urls


urlpatterns = [

    path('admin/', admin.site.urls),
    path('', include(frontend.urls)),
    path('back/', include(backend.urls)),

    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
