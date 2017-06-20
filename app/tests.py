# -*- coding:utf-8 -*-
import subprocess

from django.test import TestCase
from django.http import HttpResponse
from django.shortcuts import render

from auxiliary.ColorLogger import ColorLogger
import docker
from dwebsocket import require_websocket
from dwebsocket import accept_websocket


clogger = ColorLogger()

# Create your views here.
@accept_websocket
def echo(request):
    if not request.is_websocket():
        try:
            msg = request.get['msg']
            return HttpResponse(msg)
        except:
            return HttpResponse('error')
    else:
        for msg in request.websocket:
            if msg == 'Hello':
                request.websocket.send('Yes!')
                popen = subprocess.Popen('cat static_src/vultrainer_all.js ', stdout=subprocess.PIPE, shell=True)
                while True:
                    log = popen.stdout.readline().strip()
                    if log:
                        # request.websocket.send('abc')
                        request.websocket.send(log)
                # for log in popen.stdout.readline().strip():
                #     request.websocket.send(log)

            else:
                request.websocket.send('NO!')
        # if request.websocket:
        #     popen = subprocess.Popen(['tail', '/var/log/auth.log'], stdout=subprocess.PIPE, shell=True)
        #     for msg in popen.stdout.readline().strip():
        #         request.websocket.send(msg)

def test(request):

    return render(request, 'index.html')