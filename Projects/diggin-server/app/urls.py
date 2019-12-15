from django.contrib import admin
from django.urls import path, include
from app.core.api.common import *
from app.core.api.gmail_pass_changer import password_changed
from app.core.api.profile_crawler import *
from app.campaigns.api import *
from app.campaigns_people.api import *
from app.campaigns_company.api import *
import app.admin_views as admin_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from app.admins.api import *
from app.page_visitor.api import *

urlpatterns = [
    path('grappelli/', include('grappelli.urls')),
    path('root/', admin.site.urls),
    path('root/queue/', include('django_rq.urls')),
    path('root/upload/gmails', admin_views.upload_gmails),
    path('root/upload/proxies', admin_views.upload_proxies),
    path('root/upload/images', admin_views.load_photos),
    path('root/planner/', admin_views.add_planner),
    #
    path('api/planner', create_plan),
    #
    path('api/core/common/job/<uuid:job_id>/', get_job),
    path('api/core/common/job/<uuid:job_id>/start/', start_job),
    path('api/core/common/job/<uuid:job_id>/end/', end_job),
    path('api/core/common/job/<uuid:job_id>/event/', job_event),
    path('api/core/common/job/<uuid:job_id>/cookies/set/', update_cookies),
    path('api/core/common/job/<uuid:job_id>/proxy/dead/', report_dead_proxy),
    path('api/core/common/job/<uuid:job_id>/email/dead/', report_dead_email),
    #
    path('api/core/common/account/<uuid:job_id>/event/', account_event),
    #
    path('api/core/gmail/passchanged/<uuid:job_id>/', password_changed),
    #
    path('api/core/crawler/profile/', profile_result),
    #
    path('api/core/campaign/crawler/<uuid:job_id>/status/', update_status),
    path('api/core/campaign/crawler/<uuid:job_id>/add/', add_data),
    path('api/core/campaign/crawler/<uuid:job_id>/worker-job/', create_worker_job),
    #
    path('api/core/campaign_people/crawler/<uuid:job_id>/status/', update_campaign_people_status),
    path('api/core/campaign_people/crawler/<uuid:job_id>/add/', add_campaign_people_data),
    path('api/core/campaign_people/crawler/<uuid:job_id>/worker-job/', create_campaign_people_worker_job),
    #
    path('api/core/campaign_company/crawler/<uuid:job_id>/status/', update_campaign_company_status),
    path('api/core/campaign_company/crawler/<uuid:job_id>/add/', add_campaign_company_data),
    path('api/core/campaign_company/crawler/<uuid:job_id>/worker-job/', create_campaign_company_worker_job),
    #
    path('api/visitor/<uuid:job_id>/status/', update_visitor_status),
]

urlpatterns += staticfiles_urlpatterns()
