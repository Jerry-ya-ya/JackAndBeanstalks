# config/base.py
import os
from datetime import timedelta

class BaseConfig:
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # 設定上傳檔案的路徑
    UPLOAD_FOLDER = 'static/uploads/avatar'
    
    # 設定上傳檔案的大小限制 (5MB)
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

    # JWT 設定
    JWT_SECRET_KEY = 'super-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)

    SUPERADMIN_EMAIL = os.environ.get('SUPERADMIN_EMAIL')

    # CELERY_TASK_TRACK_STARTED = True
    # CELERY_TASK_TIME_LIMIT = 300  # 5分鐘