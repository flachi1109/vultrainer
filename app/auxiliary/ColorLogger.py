import logging


class ColorLogger(object):
    def __init__(self, level=logging.DEBUG):
        self.level = level
        self.color = {'red': '\033[1;31m', 'green': '\033[1;32m', 'yellow': '\033[1;33m', 'blue': '\033[1;34m',
                      'purple': '\033[1;35m', 'default': '\033[0m'}
        self.logger = logging.getLogger('test_logger')
        self.logger.setLevel(self.level)
        self.console_handler = logging.StreamHandler()
        self.console_handler.setLevel(self.level)
        self.logger.addHandler(self.console_handler)

        self.fmt_str = '[%(asctime)s] [%(levelname)s] %(message)s'

    def set_formatter(self, fmt_str):
        self.fmt_str = fmt_str

    def set_color(self, color):
        self.fmt = logging.Formatter(self.color[color] + self.fmt_str + self.color['default'])
        self.console_handler.setFormatter(self.fmt)

    def debug(self, message):
        self.set_color('green')
        self.logger.debug(message)

    def info(self, message):
        self.set_color('blue')
        self.logger.info(message)

    def warning(self, message):
        self.set_color('yellow')
        self.logger.warning(message)

    def error(self, message):
        self.set_color('red')
        self.logger.error(message)

    def critical(self, message):
        self.set_color('purple')
        self.logger.critical(message)