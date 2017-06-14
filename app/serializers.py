from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist

from models import VulnContainer
from app.auxiliary.ColorLogger import ColorLogger

# config clogger
clogger = ColorLogger(conf='app/extra.conf')

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
    Combine the VulnContainer Model with Container object of docker, and transform the data to serialization
    '''
    id = serializers.CharField()
    name = serializers.CharField()
    status =serializers.CharField()
    description = serializers.SerializerMethodField()
    vuln_num = serializers.SerializerMethodField()
    rep_steps = serializers.SerializerMethodField()
    access_ip = serializers.SerializerMethodField()
    exposed_port = serializers.SerializerMethodField()

    # Get the vulnerability description from the database by container id
    def get_description(self, container):
        try:
            description = VulnContainer.objects.get(container_id=container.id).description
        except ObjectDoesNotExist as err:
            clogger.debug(err)
            clogger.error('No descritpion yet! ')
            description = '-'

        return description

    def get_access_ip(self, container):
        try:
            bridge_name = container.attrs['NetworkSettings']['Networks'].keys()[0]
            access_ip = container.attrs['NetworkSettings']['Networks'][bridge_name]['IPAddress']
        except KeyError:
            access_ip = 'error!'
        return access_ip

    def get_exposed_port(self, container):
        try:
            exposed_port = container.attrs['NetworkSettings']['Ports']
        except AttributeError:
            exposed_port = ''

        return exposed_port

    def get_vuln_num(self, container):
        try:
            vuln_num = VulnContainer.objects.get(container_id=container.id).vuln_num
        except ObjectDoesNotExist as err:
            clogger.debug(err)
            clogger.error('No vulnerability number yet! ')
            vuln_num = '-'

        return vuln_num

    def get_rep_steps(self, container):
        try:
            rep_steps = VulnContainer.objects.get(container_id=container.id).rep_steps
        except ObjectDoesNotExist as err:
            clogger.debug(err)
            clogger.error('No repetition of steps yet! ')
            rep_steps = '-'

        return rep_steps

