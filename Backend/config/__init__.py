# config/__init__.py
import os

env_name = os.getenv('FLASK_ENV', os.getenv('ENV', 'development')).lower()

# 接受常見別名
if env_name in ('prod', 'production'):
    from config.prod import ProductionConfig as Config
elif env_name in ('test', 'testing'):
    from config.test import TestingConfig as Config
else:
    from config.dev import DevelopmentConfig as Config