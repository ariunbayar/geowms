
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

import backend.urls
import frontend.urls
import api.urls


urlpatterns = [

    path('admin/', admin.site.urls),
    path('back/', include(backend.urls)),
    path('api/', include(api.urls)),
    path('', include(frontend.urls)),

    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + urlpatterns
