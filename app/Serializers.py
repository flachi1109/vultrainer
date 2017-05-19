from rest_framework import serializers
from app.models import PlatformNode

import configargparse
from auxiliary.ColorLogger import ColorLogger
clogger =ColorLogger()

class PlatformNodeSerializer(serializers.Serializer):
    os_type = serializers.CharField()
    cpu_count = serializers.CharField()
