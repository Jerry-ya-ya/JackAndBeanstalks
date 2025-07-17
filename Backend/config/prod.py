# config/prod.py
from config.base import BaseConfig
import os

class ProductionConfig(BaseConfig):
    DEBUG = False
    CELERY_BROKER_URL = os.getenv('REDIS_URL') or 'redis://redis-prod:6379/0'
    CELERY_RESULT_BACKEND = os.getenv('REDIS_URL') or 'redis://redis-prod:6379/0'