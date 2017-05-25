# -*- coding:utf-8 -*-
import psutil
import platform

from app.models import PlatformNode
from BaseHandler import BaseHandler


class PlatformNodeHandeler(BaseHandler):
    '''
    PlatformNodeHandler collects environment info of the platform node
    '''

    def __init__(self, pltfnode_id):

        super(PlatformNodeHandeler,self).__init__(pltfnode_id)

        self.os_type = platform.uname()[0]
        self.sys_name = platform.uname()[1]
        self.cpu_count = psutil.cpu_count()
        self.total_mem = psutil.virtual_memory().total
        self.arch = str(self.docker_node.version()[u'Arch'])
        self.docker_version = str(self.docker_node.version()[u'Version'])


