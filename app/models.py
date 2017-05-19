# -*- coding:utf-8 -*-
import ConfigParser
import psutil
import platform
from requests.exceptions import ConnectionError

import docker
# from __future__ import unicode_literals
from django.db import models

from auxiliary.ColorLogger import ColorLogger

# config clogger
config = ConfigParser.ConfigParser()
config.read('app/extra.conf')
clogger = ColorLogger(level=config.get('logger', 'level'))

class PlatformNode(models.Model):
    '''
    PlatformNode represents the docker node which include vulnerable containers
    '''

    def __init__(self):
        self.os_type = platform.uname()[0]
        self.sys_name = platform.uname()[1]
        self.cpu_count = psutil.cpu_count()
        self.total_mem = psutil.virtual_memory().total

        # Determine whether the service is started
        try:
            docker_node = docker.DockerClient(base_url='unix://var/run/docker.sock')
            self.arch = str(docker_node.version()[u'Arch'])
            self.docker_version = str(docker_node.version()[u'Version'])
        except ConnectionError as err:
            clogger.debug(err)
            clogger.critical('Docker service may be not started')


