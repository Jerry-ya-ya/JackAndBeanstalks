# config/__init__.py
import os

ENV = os.getenv('FLASK_ENV', 'development')

# 使用標準的 import 語句，避免動態導入的複雜性
if ENV == 'prod':   
    from config.prod import ProductionConfig as Config
elif ENV == 'test':
    from config.test import TestingConfig as Config
else:
    from config.dev import DevelopmentConfig as Config