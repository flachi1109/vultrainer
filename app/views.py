# -*- coding:utf-8 -*-
import ConfigParser

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response

from app.serializers import PlatformNodeSerailizer
from app.auxiliary.ColorLogger import ColorLogger

import docker

# config clogger
config = ConfigParser.ConfigParser()
config.read('app/extra.conf')
clogger = ColorLogger(level=config.get('logger', 'level'))


class PlatformNodeViewsSet(viewsets.ModelViewSet):
    serializer_class = PlatformNodeSerailizer

    def get_node_info(self):

