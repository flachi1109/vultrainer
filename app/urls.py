# -*- coding:utf-8 -*-
from django.conf.urls import url,include
from django.views.generic import TemplateView

from app.views import PlatformNodeViews
from app.views import VulnContainerListViews
from app.views import VulnContainerView

dashboard_url = [
    url(r'^nodeinfo', PlatformNodeViews.as_view()),

]

vuln_container_url = [
    url(r'^all$', VulnContainerListViews.as_view()),
    url(r'^(?P<container_id>\w+)/(?P<action>\w+)', VulnContainerView.as_view()),
]

urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
    url(r'^vulnContainer/', include(vuln_container_url))
]
