from config.base import BaseConfig
import os

class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    CELERY_BROKER_URL = 'redis://redis-test:6379/0'
    CELERY_RESULT_BACKEND = 'redis://redis-test:6379/0'