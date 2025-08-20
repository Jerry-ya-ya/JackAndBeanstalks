# config/dev.py
from config.base import BaseConfig

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    # Celery 連線設定繼承 BaseConfig（REDIS_URL）