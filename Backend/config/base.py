# config/base.py
import os
from datetime import timedelta

class BaseConfig:
    DEBUG = False
    TESTING = False
    # SQLAlchemy 基本設定
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # 資料庫連線池設定
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': int(os.environ.get('DB_POOL_SIZE', 10)),  # 連線池大小
        'max_overflow': int(os.environ.get('DB_MAX_OVERFLOW', 20)),  # 最大溢出連線數
        'pool_timeout': int(os.environ.get('DB_POOL_TIMEOUT', 30)),  # 連線超時（秒）
        'pool_recycle': int(os.environ.get('DB_POOL_RECYCLE', 3600)),  # 連線回收時間（秒）
        'pool_pre_ping': os.environ.get('DB_POOL_PRE_PING', 'true').lower() == 'true',  # 連線前檢查
        'echo': os.environ.get('DB_ECHO', 'false').lower() == 'true'  # SQL 語句回顯（除錯用）
    }
    
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
        # 印出資料庫連線池設定
        pool_config = app.config['SQLALCHEMY_ENGINE_OPTIONS']
        print(f"🗄️ 資料庫連線池設定:")
        print(f"   - Pool Size: {pool_config['pool_size']}")
        print(f"   - Max Overflow: {pool_config['max_overflow']}")
        print(f"   - Pool Timeout: {pool_config['pool_timeout']}s")
        print(f"   - Pool Recycle: {pool_config['pool_recycle']}s")
        print(f"   - Pool Pre-ping: {pool_config['pool_pre_ping']}")
        print(f"   - SQL Echo: {pool_config['echo']}")
        
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