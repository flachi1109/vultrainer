from rest_framework import serializers

class PlatformNodeSerailizer(serializers.Serializer):
    os_type = serializers.CharField()
    cpu_count = serializers.CharField()
    sys_name = serializers.CharField()
    total_mem = serializers.CharField()
    docker_version = serializers.CharField()
