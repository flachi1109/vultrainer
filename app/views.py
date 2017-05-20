# -*- coding:utf-8 -*-
import ConfigParser

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.handler.PlatformNodeHandler import PlatformNodeHandeler
from app.serializers import PlatformNodeSerailizer
from app.auxiliary.ColorLogger import ColorLogger


# config clogger
config = ConfigParser.ConfigParser()
config.read('app/extra.conf')
clogger = ColorLogger(level=config.get('logger', 'level'))


class PlatformNodeViews(APIView):
    '''
    :return platform node's information of performance
    '''
    def get(self, request, node_id):
        platform_node_info = PlatformNodeHandeler(node_id)
        platform_node_seriarlizer = PlatformNodeSerailizer(platform_node_info)

        return Response(platform_node_seriarlizer.data)
    def post(self, request):
        self.get(request)

