# -*- coding:utf-8 -*-

import psutil
import platform
import docker

class PlatformNode(object):
    '''
    PlatformNode represents the docker node
    '''

    def __init__(self):
        self.os_type = platform.uname()[0]
        self.sys_name = platform.uname()[1]
        self.cpu_count = psutil.cpu_count()
        self.total_mem = psutil.virtual_memory().total

        docker_node = docker.DockerClient(base_url='unix://var/run/docker.sock')
        self.docker_version = docker_node.version()
        
    def getNodeInfo(self):

        node_info = {'os_type': self.os_type, 'sys_name': self.sys_name,
                     'arch': str(self.docker_version[u'Arch']), 'cpu_count': self.cpu_count,
                     'total_mem': int(self.total_mem / 1024 / 1024),
                     'docker_version': str(self.docker_version[u'Version'])}
        return node_info

