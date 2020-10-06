from django.urls import re_path, path, include

from govorg.backend.org import views as org_views
from govorg.backend.bundle import views as bundle_views
from govorg.backend.employee import views as employee_views
from govorg.backend.system import views as system_views
from govorg.backend.bair_zuin_zurag import views as bair_zuin_zurag_views
from govorg.backend.barilga_suurin_gazar import views as barilga_suurin_gazar_views
from govorg.backend.ded_butets import views as ded_butets_veiws
from govorg.backend.teevriin_suljee import views as teevriin_suljee_views

import govorg.backend.barilga_suurin_gazar.views

urlpatterns = [
    path('api/', include(([
        path('employee/', employee_views.employees, name='employees'),
        path('system/', system_views.systemList, name='system'),
        path('bundle/', bundle_views.bundle, name='bundle'),
        path('bair_zuin_zurag/', include(([
            path('', govorg.backend.bair_zuin_zurag.views.changeset_all),
            path('table_list/', govorg.backend.bair_zuin_zurag.views.table_list),
        ], 'bair_zuin_zurag'))),
        path('barilga_suurin_gazar/', include(([
            path('', govorg.backend.barilga_suurin_gazar.views.changeset_all),
            path('table_list/', govorg.backend.barilga_suurin_gazar.views.table_list),
            path('<int:oid>/rows/', govorg.backend.barilga_suurin_gazar.views.rows),
        ], 'barilga_suurin_gazar'))),
        path('ded_butets/', include(([
            path('', govorg.backend.ded_butets.views.changeset_all),
            path('table_list/', govorg.backend.ded_butets.views.table_list),
        ], 'ded_butets'))),
        path('teevriin_suljee/', include(([
            path('', govorg.backend.teevriin_suljee.views.changeset_all),
            path('table_list/', govorg.backend.teevriin_suljee.views.table_list),
        ], 'teevriin_suljee'))),
        path('testGet/', teevriin_suljee_views.testGet, name='testGet'),
    ], 'back_org'))),


    path('', include(([
        path('', org_views.frontend, name='frontend'),
    ], 'org'))),

    re_path('^.*', org_views.frontend, name='org'),
]
