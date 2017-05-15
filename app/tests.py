from django.test import TestCase
from django.shortcuts import render

from auxiliary import ColorLogger
import docker


# Create your views here.
def test_docker(request):

    return render(request, 'index.html', {'testvar':'abc'})
