# -*- coding:utf-8 -*-
import ConfigParser

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

    node_name = models.CharField(max_length=30, null=False)
    connection = models.CharField(max_length=50, null=False)

class VulnContainer(models.Model):
    '''
    VulnContainer represents the vulnerability information of containers
    '''
    container_id = models.CharField(max_length=64, null=False)
    vuln_num = models.CharField(max_length=32, null=True)
    description = models.CharField(max_length=500, null=True)
    rep_steps = models.CharField(max_length=20, null=True)

