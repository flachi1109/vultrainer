# -*- coding:utf-8 -*-
from django.shortcuts import render

from models import PlatformNode
from auxiliary.ColorLogger import ColorLogger

import docker

clogger = ColorLogger()

def reps_index(request):
    '''
    Response to the "index" url
    :return: index.html page
    '''
    plat_node = PlatformNode()
    node_info = plat_node.getNodeInfo()

    return render(request, 'index.html', {'node_info': node_info})