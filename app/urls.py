# -*- coding:utf-8 -*-
from django.conf.urls import url,include
from django.views.generic import TemplateView

from app.views import PlatformNodeViews

dashboard_url = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^nodeinfo', PlatformNodeViews.as_view()),

    url(r'^test', TemplateView.as_view(template_name='test.html')),
]

urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
]
