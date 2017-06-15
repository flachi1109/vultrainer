import os
import ConfigParser
import subprocess

from ..auxiliary.ColorLogger import ColorLogger

class Vulhub(object):
    '''
    Operate vulhub project on github
    '''
    def __init__(self, vulhub_conf, clogger_conf='app/extra.conf'):
        # config color logger
        self.clogger = ColorLogger(conf=clogger_conf)

        config = ConfigParser.ConfigParser()
        config.read(vulhub_conf)
        self.vulhub_dir = config.get('vulhub', 'path')
        self.availCases = {}

    def get_vulhub_dict(self):
        '''
        :return: vulhub file tree
        '''
        for parent, dirs, files in os.walk(self.vulhub_dir):
            for file in files:
                if file == 'docker-compose.yml': #the case must have this file in its dir
                    dir_case_name = os.path.split(parent)
                    if self.availCases.has_key(dir_case_name[0]):
                        self.availCases[dir_case_name[0]].append(dir_case_name[1])
                    else:
                        self.availCases[dir_case_name[0]] = [dir_case_name[1]]

        return self.__make_tree_list()

    def __make_tree_list(self):
        '''
        :return: generate vulhub files tree
        '''
        tree_list = []
        for dir, case_names in self.availCases.items():
            dir = dir[len(self.vulhub_dir)+1:]
            dir_list = dir.split('/')

            tree_list.append(self.__make_dict(dir_list, case_names))

        return tree_list

    def __make_dict(self, dir_list, case_names):
        '''
        :param dir_list:
        :param case_names:
        :return: Get file dict of specific format by recursion
        '''
        dir_dic = {}
        if len(dir_list) == 1:
            if dir_list[0] == '':
                dir_dic['name'] = 'single'
            else:
                dir_dic['name'] = dir_list[0]
            dir_dic['children'] = []
            for case_name in case_names:
                case_dic = {}
                case_dic['name'] = case_name
                case_dic['children'] = []
                case_dic['full_path'] = dir_list[0]+'/'+case_name \
                    if dir_list[0] == '' \
                    else '/'+dir_list[0]+'/'+case_name
                dir_dic['children'].append(case_dic)

        else:
            dir_dic['name'] = dir_list[0]
            dir_list = dir_list[1:]
            dir_dic['children'] = [self.__make_dict(dir_list, case_names)]

        return dir_dic

    def update_repo(self):
        '''
        update the vulhub git repo
        :return: if update success return ok
        '''
        status = 'failed'

        cwd = os.getcwd()
        os.chdir(self.vulhub_dir)
        popen = subprocess.Popen(['git', 'pull', 'origin', 'master'], stdout=subprocess.PIPE, shell=False)
        stdout, stderr = popen.communicate()

        if stdout.find('Already up-to-date') > -1:
            status = 'ok'

        os.chdir(cwd)

        return status

    def setup_case(self, case_path):
        cwd = os.getcwd()
        os.chdir(os.path.join(self.vulhub_dir, case_path))

        def file_gen():
            with open('README.md', 'r') as readme_file:
                for line in readme_file:
                    yield line

        build_flag = 0
        up_flag = 0
        for line in file_gen():
            if build_flag and up_flag:
                break
            if line.find('docker-compose build'):
                build_flag = 1
                continue

            if line.find('docker-compose up -d'):
                build_flag = 1
                continue

        build_suc_flag = 0
        up_suc_flag = 0

        if build_flag:
            popen = subprocess.Popen(['docker-compose', 'build'], stdout=subprocess.PIPE, shell=False)
            stdout, stderr = popen.communicate()
            if stdout.find('Successfully built'):
                build_suc_flag = 1
        if up_flag:
            popen = subprocess.Popen(['docker-compose', 'up', '-d'], stdout=subprocess.PIPE, shell=False)
            stdout, stderr = popen.communicate()
            if stderr is not None:
                up_suc_flag = 1

        os.chdir(cwd)

        if build_suc_flag and up_suc_flag:
            return True
        else:
            return False
