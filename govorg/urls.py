from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views
from govorg.backend.org_request import views as org_request_views
from  govorg.backend.govorg_inspire import views as govorg_inspire_views

urlpatterns = [
    path('api/', include(([

        path('employee/', employee_views.employees, name='employees'),
        path('system/', system_views.systemList, name='system'),
        path('bundle/', bundle_views.bundle, name='bundle'),
        path('inspire/', include(([
            path('', govorg_inspire_views.changeset_all),
            path('<int:pid>/<int:fid>/getRoles/', govorg_inspire_views.getRoles),
            path('table_list/', govorg_inspire_views.bundleButetsAll),
            path('<int:pid>/<int:fid>/rows/', govorg_inspire_views.rows),
            path('<int:pid>/<int:fid>/geom-type/', govorg_inspire_views.geom_type),
            path('<int:pid>/<int:fid>/add/', govorg_inspire_views.add),
            path('<int:pid>/<str:fid>/save/', govorg_inspire_views.save),
            path('create/', govorg_inspire_views.create),
            path('createDel/', govorg_inspire_views.createDel),
            path('createUpd/', govorg_inspire_views.createUpd),
            path('<str:pk>/<str:fid>/detail/', govorg_inspire_views.detail),
            path('<int:tid>/<int:pid>/<int:fid>/detail/', govorg_inspire_views.detailNone),
            path('<int:pid>/<int:fid>/remove/', govorg_inspire_views.delete),
            path('<int:fid>/geom-update/', govorg_inspire_views.updateGeom),
            path('<int:fid>/add-geom/', govorg_inspire_views.geomAdd),
            path('send-data/<int:tid>/<int:fid>/', govorg_inspire_views.FileUploadSaveData),
        ], 'inspire'))),

        path('org-request/', include(([
            path('', org_request_views.getAll),
            path('change-request/', org_request_views.getChangeAll),
            path('<int:pk>/delete/', org_request_views.requestDelete),
            path('<int:pk>/approve/', org_request_views.requestApprove),
        ], 'org-request'))),

    ], 'back_org'))),


    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
