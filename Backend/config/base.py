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
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024 # 5MB

    # JWT 設定
    JWT_SECRET_KEY = 'super-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)

    SUPERADMIN_EMAIL = os.environ.get('SUPERADMIN_EMAIL')
    
    # URL 設定（依環境變數，可由 app 直接使用）
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:4200')
    API_URL = os.environ.get('API_URL', 'http://localhost:5000')

    # Celery / Redis 設定（統一由 REDIS_URL 控制）
    CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://redis:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://redis:6379/0')
    
    @classmethod
    def init_app(cls, app):
        """初始化應用程式配置"""
        # 資料庫連線設定
        database_url = os.environ.get('DATABASE_URL')
        
        if database_url:
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        else:
            # 使用個別參數組合
            db_server = os.environ.get('DB_SERVER', 'localhost')
            db_port = os.environ.get('DB_PORT', '5432')
            db_name = os.environ.get('DB_NAME', 'jackandbeanstalks')
            db_user = os.environ.get('DB_USER', 'postgres')
            db_password = os.environ.get('DB_PASSWORD', '')
            
            app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{db_user}:{db_password}@{db_server}:{db_port}/{db_name}"