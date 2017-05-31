# -*- coding:utf-8 -*-
import ConfigParser

import docker
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

from app.handler.BaseHandler import BaseHandler
from app.handler.PlatformNodeHandler import PlatformNodeHandeler
from app.serializers import PlatformNodeSerailizer
from app.serializers import VulnContainerSerializer
from app.auxiliary.ColorLogger import ColorLogger



# config clogger
clogger = ColorLogger(conf='app/extra.conf')


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

class VulnContainerListViews(generics.ListCreateAPIView):
    '''
    :returns all containers' info and their description
    '''
    serializer_class = VulnContainerSerializer

    def list(self, request, node_id):
        docker_node = BaseHandler(pltfnode_id=node_id).get_docker_client()
        self.queryset = docker_node.containers.list(all=True)
        container_list = self.get_queryset()
        serializer = VulnContainerSerializer(container_list, many=True)

        return Response(serializer.data)