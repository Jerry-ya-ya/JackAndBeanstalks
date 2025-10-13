from config.base import BaseConfig
import os

class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    # 測試環境可用獨立的 REDIS_URL_TEST，否則退回 REDIS_URL，再退回本地預設
    CELERY_BROKER_URL = os.environ.get('REDIS_URL_TEST', os.environ.get('REDIS_URL', 'redis://redis:6379/0'))
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL_TEST', os.environ.get('REDIS_URL', 'redis://redis:6379/0'))
    
    @classmethod
    def init_app(cls, app):
        """測試環境不需要重新設定資料庫連線"""
        pass