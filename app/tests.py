# -*- coding:utf-8 -*-

from django.test import TestCase
from django.shortcuts import render

from modules.PlatformNode import PlatformNode
from auxiliary import ColorLogger
import docker


clogger = ColorLogger()

# Create your views here.

def test_docker(request):

    plat_node = PlatformNode()

    node_info = plat_node.getNodeInfo()

    return render(request, 'test.html', {'testvar': node_info})

def dev_index(request):
    plat_node = PlatformNode()

    node_info = plat_node.getNodeInfo()

    return render(request, 'index.html', {'node_info': node_info})