# -*- coding:utf-8 -*-
from django.conf.urls import url,include
from django.views.generic import TemplateView

from app.views import PlatformNodeViews

dashboard_url = [
    url(r'^nodeinfo', PlatformNodeViews.as_view()),

]

urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
]
