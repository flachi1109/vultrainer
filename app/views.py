# -*- coding:utf-8 -*-
import time
import os
import ConfigParser

import docker
from django.shortcuts import render
from django.http import StreamingHttpResponse, HttpResponse
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
    def get(self, request, node_id, container_id, action):
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

    def post(self, request, node_id, container_id, action):

        config = ConfigParser.ConfigParser()
        config.read('app/extra.conf')
        dir_name = config.get('step_files', 'path')

        def file_iterator(file_name, chunk_size=512):
            with open(file_name, 'rb') as f:
                while True:
                    c = f.read(chunk_size)
                    if c:
                        yield c
                    else:
                        break
            f.close()

        if action == 'download':
            file_name = request.data['file_name']
            # file_name = dir_name + '/' + file_name
            file_name = os.path.join(dir_name, file_name)
            response = StreamingHttpResponse(file_iterator(file_name))
            response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            response['Content-Disposition'] = 'attachment;filename="{0}"'.format(file_name)

            return response



class VulhubOperateView(APIView):

    def get(self, request, node_id, action):
        vulhub = Vulhub(vulhub_conf='app/extra.conf')
        vulhub_tree = ''
        if action == 'tree':
            vulhub_tree = vulhub.get_vulhub_dict()
            return Response(vulhub_tree)

        if action == 'update':
            status = vulhub.update_repo()
            return Response({'status': status})

        if action == 'create':
            return render(request, template_name='create_vulhub_case.html')


    def post(self, request, node_id, action):
        config = ConfigParser.ConfigParser()
        config.read('app/extra.conf')
        dir_name = config.get('step_files', 'path')

        if action == 'setup':
            case_path = request.data['case_path']
            vuln_num = request.data['vuln_num']
            desc = request.data['desc']

            vulhub = Vulhub(vulhub_conf='app/extra.conf')




        if action == 'upload':
            upload_file = request.FILES.get('rep_steps', None)

            if not upload_file:
                return HttpResponse('No file to upload!')

            rep_steps_file = open(os.path.join(dir_name,upload_file.name), 'wb')
            for chunk in upload_file.chunks():
                rep_steps_file.write(chunk)

            rep_steps_file.close()

            return HttpResponse('Upload Done!')
