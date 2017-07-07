# -*- coding:utf-8 -*-
import os
import json
import ConfigParser
import re

import docker
from django.shortcuts import render
from django.http import StreamingHttpResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from dwebsocket import accept_websocket

from app.handler.BaseHandler import BaseHandler
from app.handler.PlatformNodeHandler import PlatformNodeHandeler
from app.handler.VulhubHandler import Vulhub
from app.serializers import PlatformNodeSerailizer
from app.serializers import VulnContainerSerializer
from app.auxiliary.ColorLogger import ColorLogger
from app.models import VulnContainer



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
        # vulhub_tree = ''
        if action == 'tree':
            vulhub_tree = vulhub.get_vulhub_dict()
            return Response(vulhub_tree)

        if action == 'update':
            status = vulhub.update_repo()
            return Response({'status': status})

        if action == 'create':
            return render(request, template_name='create_vulhub_case.html')

        if action == 'setup':
            self.setup_case(request, vulhub, node_id)



    def post(self, request, node_id, action):
        config = ConfigParser.ConfigParser()
        config.read('app/extra.conf')
        dir_name = config.get('step_files', 'path')

        if action == 'setup':
            case_path = request.data['case_path']
            vuln_num = request.data['vuln_num']
            desc = request.data['desc']
            rep_file = request.data['rep_file']
            vulhub = Vulhub(vulhub_conf='app/extra.conf')

            docker_node = BaseHandler(pltfnode_id=node_id).get_docker_client()
            before = len(docker_node.containers.list(all=True))

            data = {}
            data['status'] = 'failed'
            if vulhub.setup_case(case_path):
                docker_node = BaseHandler(pltfnode_id=node_id).get_docker_client()
                after = len(docker_node.containers.list(all=True))
                new_cases = docker_node.containers.list(limit=(after-before))

                rep_file = str(VulnContainer.object.last().id+(after-before)) \
                           + os.path.splitext(rep_file)[-1]
                for case in new_cases:
                    vulhub_case = VulnContainer(container_id=case.id, vuln_num=vuln_num,
                                                description=desc, rep_steps=rep_file)
                    vulhub_case.save()

                data['status'] = 'ok'

            return Response(data)

        if action == 'upload':
            upload_file = request.FILES.get('rep_steps', None)

            data = {}
            data['status'] = 'failed'
            if not upload_file:
                data['reason'] = 'No file to upload!'
                return Response(data)

            local_file_name = str(VulnContainer.objects.last().id) + os.path.splitext(upload_file.name)[-1]
            rep_steps_file = open(os.path.join(dir_name,local_file_name), 'wb')
            for chunk in upload_file.chunks():
                rep_steps_file.write(chunk)

            rep_steps_file.close()
            data['status'] = 'ok'

            return Response(data)

        if action == 'save':
            vuln_num = request.data['vuln_num']
            desc = request.data['desc']
            rep_file = request.data['rep_file']

            docker_node = BaseHandler(pltfnode_id=node_id).get_docker_client()
            new_cases = docker_node.containers.list(limit=1)

            rep_file = str(VulnContainer.objects.last().id + 1) \
                       + os.path.splitext(rep_file)[-1]
            for case in new_cases:
                vulhub_case = VulnContainer(container_id=case.id, vuln_num=vuln_num,
                                            description=desc, rep_steps=rep_file)
                vulhub_case.save()

            data = {}
            data['status'] = 'ok'

            return Response(data)

    @staticmethod
    @accept_websocket
    def setup_case(request, vulhub, node_id):
        log = {}
        if request.is_websocket():
            for msg in request.websocket:
                msg_json = json.loads(msg)
                build_popen = vulhub.case_build(msg_json['case_path'])
                if build_popen:
                    while True:
                        info = build_popen.stdout.readline().strip()
                        err = build_popen.stderr.readline().strip()

                        if info:
                            if info.find('Successfully built') > -1:
                                log['build_success'] = 'ok'
                            log['info'] = info
                            request.websocket.send(json.dumps(log))
                        else:
                            if err:
                                log['err'] = err
                                request.websocket.send(json.dumps(log))
                            else:
                                break
                else:
                    log['build_success'] = 'ok'
                    request.websocket.send(json.dumps(log))

                up_popen = vulhub.case_up(msg_json['case_path'])
                if up_popen:
                    while True:
                        info = up_popen.stderr.readline().strip()

                        if info:
                            log['info'] = info
                            if re.match(r'.*Creating.*done', info):
                                log['up_success'] = 'ok'
                            request.websocket.send(json.dumps(log))
                        else:
                            break


