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

    container_id = models.CharField(max_length=64, null=False)
    description = models.CharField(max_length=500, null=False)

