# -*- coding:utf-8 -*-
import ConfigParser
import psutil
import platform
from requests.exceptions import ConnectionError

import docker
from django.core.exceptions import ObjectDoesNotExist
from ..auxiliary.ColorLogger import ColorLogger
from app.models import PlatformNode

# config clogger
config = ConfigParser.ConfigParser()
config.read('app/extra.conf')
clogger = ColorLogger(level=config.get('logger', 'level'))

class PlatformNodeHandeler(object):
    '''
    PlatformNodeHandler collects environment info of the platform node
    '''

    def __init__(self, pltfnode_id):
        self.os_type = platform.uname()[0]
        self.sys_name = platform.uname()[1]
        self.cpu_count = psutil.cpu_count()
        self.total_mem = psutil.virtual_memory().total

        # Determine whether the service is started
        try:
            pltfnode_conn = PlatformNode.objects.get(id=pltfnode_id)
            docker_node = docker.DockerClient(base_url=pltfnode_conn.connection)
            self.arch = str(docker_node.version()[u'Arch'])
            self.docker_version = str(docker_node.version()[u'Version'])
        except ObjectDoesNotExist as err:
            clogger.debug(err)
            clogger.error('No such platform node!')
        except ConnectionError as err:
            clogger.debug(err)
            clogger.error('Docker service may be not started!')


