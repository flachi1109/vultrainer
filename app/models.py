# -*- coding:utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
import psutil
import platform
import docker
from requests.exceptions import ConnectionError

from auxiliary.ColorLogger import ColorLogger

clogger = ColorLogger()


class PlatformNode(models.Model):
    '''
    PlatformNode represents the docker node  which include some vulnerable containers
    '''

    def __init__(self):
        self.os_type = platform.uname()[0]
        self.sys_name = platform.uname()[1]
        self.cpu_count = psutil.cpu_count()
        self.total_mem = psutil.virtual_memory().total

        # Determine whether the service is started
        try:
            docker_node = docker.DockerClient(base_url='unix://var/run/docker.sock')
            self.docker_version = docker_node.version()
        except ConnectionError as err:
            clogger.debug(err)
            clogger.critical('Docker service may be not started')
