"""vultrainer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.conf.urls.static import static
from django.conf.urls import handler404
from django.conf import settings
from django.views.generic import TemplateView
# from django.contrib import admin

from app.views import VulnContainerListViews

# will be deleted
from app import tests

urlpatterns = [
    # html templates url
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^dashboard/', TemplateView.as_view(template_name='dashboard.html')),
    url(r'^vulnContainer/', TemplateView.as_view(template_name='vuln_container.html')),

    # API url
    url(r'(?P<node_id>\d+)/', include('app.urls')),

    # will be deleted
    url(r'^test/', TemplateView.as_view(template_name='test2.html')),
    url(r'^viewset/', VulnContainerListViews.as_view()),
    url(r'^websocket/', tests.echo),
]


# add static resource url
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
