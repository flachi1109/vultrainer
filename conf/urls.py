
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
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
# from django.contrib import admin

from app import views

# will be deleted
from app import tests

urlpatterns = [
    url(r'^index/', views.reps_index),
    # will be deleted
    url(r'^test/', tests.test_docker),
    url(r'^index_test/', tests.dev_index),
]

# add static resource url
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
