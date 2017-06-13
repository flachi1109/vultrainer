# -*- coding:utf-8 -*-
import time
import ConfigParser

import docker
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics

from app.handler.BaseHandler import BaseHandler
from app.handler.PlatformNodeHandler import PlatformNodeHandeler
from app.handler.VulhubHandler import Vulhub
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

class VulnContainerView(APIView):
    '''
    Operate the vulnerable containers.Return the status of operated containers and the operation result.
    '''
    def get(self, request, node_id,container_id, action):
        docker_node = BaseHandler(pltfnode_id=node_id).get_docker_client()
        data = {}

        try:
            current_container = docker_node.containers.list(all=True, filters={'id':container_id})[0]

            if action == 'start':
                current_container.start()
            if action == 'stop':
                current_container.stop()
            if action == 'pause':
                current_container.pause()
            if action == 'resume':
                current_container.unpause()
            if action == 'kill':
                current_container.kill()
            if action == 'restart':
                current_container.restart()
            if action == 'remove':
                current_container.remove()

            data['result'] = True

        except IndexError:
            clogger.info('No such container! Container id: %s' % container_id)

        except docker.errors.APIError as err:
            data['result'] = False
            clogger.debug('%s container %s failed!The reason is:\n%s' % (action, container_id, err))
            clogger.info('%s container %s failed!' % (action, container_id))

        return Response(data)

class VulhubOperateView(APIView):

    def get(self, request, node_id, action):
        vulhub = Vulhub(vulhub_conf='app/extra.conf')
        vulhub_tree = ''
        if action == 'tree':
            vulhub_tree = vulhub.get_vulhub_dict()

        return Response(vulhub_tree)

