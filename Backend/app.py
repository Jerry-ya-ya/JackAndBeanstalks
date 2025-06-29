# pip install virtualenv
# python3 -m virtualenv myenv
# .\myenv\Scripts\activate

# To fix after creating virtual environment in Windows:
# Ctrl + Shift + P
# Python: Select Interpreter
# Enter interpreter path
# .\myenv\Scripts\python.exe

from flask import Flask
from config import Config

from flask_cors import CORS

# 時間相關套件
from datetime import timedelta

# 環境變數相關套件
import os

# 資料庫相關套件
from models import db
from sqlalchemy.exc import OperationalError
import time

# JWT 相關套件
from flask_jwt_extended import JWTManager

# 匯入 blueprint
from routes.auth.auth import auth_bp
from routes.auth.email import email_bp, init_mail
from routes.todo import todo_bp
from routes.me import me_bp
from routes.avatar import avatar_bp
from routes.square import square_bp
from routes.changepassword import changepassword_bp
from routes.crawler import crawler_bp

from routes.crawler.schedule import start_scheduler
from routes.crawler.logic import init_schedule_state

from routes.test import test_utils

# 載入 .env 環境變數
from dotenv import load_dotenv
load_dotenv()

def setup_database(app, retries=5, wait=2):
    db.init_app(app)

    for i in range(retries):
        try:
            with app.app_context():
                # 嘗試資料庫操作
                db.create_all()
                init_schedule_state()
                print("✅ 資料庫初始化成功")
                return
        except OperationalError as e:
            print(f"🔁 第 {i+1} 次重試：資料庫未就緒，等待 {wait} 秒...")
            time.sleep(wait)
    raise Exception("❌ 多次重試後仍無法初始化資料庫")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 獲取環境變數
    env = os.getenv('FLASK_ENV', 'development')
    
    # 設定資料庫連線（使用 SQL Server）
    server = os.getenv("DB_SERVER")
    port = os.getenv("DB_PORT")
    database = os.getenv("DB_NAME")
    username = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    # 根據環境設定不同的資料庫連線
    if env == 'test':
        # 測試環境使用 SQLite（不覆蓋 TestingConfig 的設定）
        print("🧪 測試環境：使用 SQLite 資料庫")
    else:
        # 開發和生產環境使用 PostgreSQL
        app.config['SQLALCHEMY_DATABASE_URI'] = (
            f"postgresql+psycopg2://{username}:{password}@{server}:{port}/{database}"
        )
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # 設定上傳檔案的路徑
    UPLOAD_FOLDER = 'static/uploads/avatar'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    # 設定上傳檔案的大小限制 (5MB)
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB

    # JWT 設定
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

    # 初始化資料庫
    setup_database(app)

    # 初始化 JWT
    JWTManager(app)

    # 初始化郵件
    init_mail(app)

    # 設定 CORS
    CORS(app) # 不建議上線使用，會開放所有來源
    
    # 註冊藍圖
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api')
    app.register_blueprint(todo_bp, url_prefix='/api')
    app.register_blueprint(me_bp, url_prefix='/api')
    app.register_blueprint(avatar_bp, url_prefix='/api')
    app.register_blueprint(square_bp, url_prefix='/api')
    app.register_blueprint(changepassword_bp, url_prefix='/api')
    app.register_blueprint(crawler_bp, url_prefix='/api')

    # 在開發和測試環境掛載測試工具
    if env in ['development', 'test']:
        app.register_blueprint(test_utils, url_prefix='/api')

    start_scheduler(app) # 啟動排程器
    return app

if __name__ == '__main__':
    app = create_app() # 建立 Flask 應用程式
    app.run(threaded=True, debug=True) # 啟動 Flask 應用程式