from django.shortcuts import render

from auxiliary import ColorLogger
import docker


# Create your views here.
def test_docker(request):
    # client = docker.DockerClient(base_url='unix://var/run/docker.sock')
    #
    # clogger = ColorLogger()
    #
    # clogger.debug(client.containers)
    return render(request, 'test.html')
