# -*- coding:utf-8 -*-
from django.conf.urls import url,include
from django.views.generic import TemplateView

from app import views

dashboard_url = [
    url(r'^$', TemplateView.as_view(template_name='test.html')),
]

urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
]
