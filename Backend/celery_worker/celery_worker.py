from celery import Celery
import os

# 從環境變數或使用預設值
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://redis:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://redis:6379/0')

celery = Celery(
    'jackandbeanstalks',
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
)

# Celery 設定
celery.conf.update(
    timezone='Asia/Taipei',
    enable_utc=False,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
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