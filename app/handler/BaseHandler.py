# -*- coding:utf-8 -*-
from requests.exceptions import ConnectionError

import docker
from app.models import PlatformNode
from django.core.exceptions import ObjectDoesNotExist
from ..auxiliary.ColorLogger import ColorLogger

class BaseHandler(object):
    '''
    A Basic class to get a connection for the docker client
    '''
    def __init__(self, pltfnode_id, clogger_conf='app/extra.conf'):
        # config color logger
        self.clogger = ColorLogger(conf=clogger_conf)

        # Check whether the service is started
        # Check whether the platform is exist
        try:
            self.pltfnode_conn = PlatformNode.objects.get(id=pltfnode_id)
            self.docker_node = docker.DockerClient(base_url=self.pltfnode_conn.connection)
        except ObjectDoesNotExist as err:
            self.clogger.debug(err)
            self.clogger.error('No such platform node!')
        except ConnectionError as err:
            self.clogger.debug(err)
            self.clogger.error('Docker service may be not started!')

    def get_docker_client(self):
        return self.docker_node

