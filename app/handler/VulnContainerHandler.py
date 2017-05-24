# -*- coding:utf-8 -*-
from BaseHandler import BaseHandler

class VulnContainerHandler(BaseHandler):
    def __init__(self, pltfnode_id, clogger_conf='app/extra.conf'):
        super(VulnContainerHandler, self).__init__(pltfnode_id, clogger_conf)
