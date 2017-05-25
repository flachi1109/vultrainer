from rest_framework import serializers
from models import VulnContainer

class PlatformNodeSerailizer(serializers.Serializer):
    '''
    Transfrom the platform node obejct to serialization
    '''
    os_type = serializers.CharField()
    cpu_count = serializers.CharField()
    sys_name = serializers.CharField()
    total_mem = serializers.CharField()
    arch = serializers.CharField()
    docker_version = serializers.CharField()

class VulnContainerSerializer(serializers.Serializer):
    '''
    Join the VulnContainer Model with Container object of docker, and transform the data to serialization
    '''
    id = serializers.CharField()
    name = serializers.CharField()
    status =serializers.CharField()
    description = serializers.SerializerMethodField()
    access_ip = serializers.SerializerMethodField()
    exposed_port = serializers.SerializerMethodField()

    # Get the vulnerability description from the database by container id
    def get_description(self, container):
        description = VulnContainer.objects.get(container_id=container.id).description
        return description

    def get_access_ip(self, container):
        access_ip = container.attrs['NetworkSettings']['Networks']['bridge']['IPAddress']
        return access_ip

    def get_exposed_port(self, container):
        try:
            inner_port = container.attrs['NetworkSettings']['Ports'].keys()[0]
            outter_port = container.attrs['NetworkSettings']['Ports'][inner_port]['HostPort']
            exposed_port = inner_port + ':' + outter_port
        except AttributeError:
            exposed_port = ''

        return exposed_port