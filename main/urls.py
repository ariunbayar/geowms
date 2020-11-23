
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

import backend.urls
import frontend.urls
import api.urls
import govorg.urls


urlpatterns = [

    path('back/', include(backend.urls)),
    path('api/', include(api.urls)),
    path('gov/', include(govorg.urls)),
    path('', include(frontend.urls)),
    path('', include('pwa.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + urlpatterns
