# -*- coding:utf-8 -*-

from django.test import TestCase
from django.shortcuts import render

from auxiliary.ColorLogger import ColorLogger
import docker


clogger = ColorLogger()

# Create your views here.

def test(request):


    return render(request, 'index.html')