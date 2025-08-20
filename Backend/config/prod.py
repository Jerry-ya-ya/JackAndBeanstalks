# config/prod.py
from config.base import BaseConfig
import os

class ProductionConfig(BaseConfig):
    DEBUG = False
    # Celery 連線設定繼承 BaseConfig（REDIS_URL）