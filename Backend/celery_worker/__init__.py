from celery import Celery
from celery.schedules import crontab
import os

# 確保環境變數設定正確
ENV = os.getenv('FLASK_ENV', 'development')

if ENV == 'prod':   
    from config.prod import ProductionConfig as Config
elif ENV == 'test':
    from config.test import TestingConfig as Config
else:
    from config.dev import DevelopmentConfig as Config

celery = Celery(
    'jackandbeanstalks',
    broker=Config.CELERY_BROKER_URL,
    backend=Config.CELERY_RESULT_BACKEND,
    include=['celery_worker.task']  # 包含任務模組
)

# Celery 設定
celery.conf.update(
    timezone='Asia/Taipei',
    enable_utc=False,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    # Beat 排程設定
    beat_schedule={
        'hello-every-10-mins': {
            'task': 'celery_worker.task.hello',
            'schedule': 600.0
        },
        'crawler-every-15-mins': {
            'task': 'celery_worker.task.scheduled_crawl_task',
            'schedule': crontab(minute='*/15'),  # 每 15 分鐘執行一次
        },
    }
)

# 綁定 Flask context 給 Celery 任務使用
class ContextTask(celery.Task):
    def __call__(self, *args, **kwargs):
        # 延遲導入 Flask app 避免循環導入
        try:
            from flask import current_app
            with current_app.app_context():
                return self.run(*args, **kwargs)
        except RuntimeError:
            # 如果沒有 Flask context，直接執行任務
            return self.run(*args, **kwargs)

celery.Task = ContextTask

# 導出 celery 實例
__all__ = ['celery']
