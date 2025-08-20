# pip install virtualenv
# python3 -m virtualenv myenv
# .\myenv\Scripts\activate

# 先載入 .env，再載入 Config，確保環境變數在設定載入前就位
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from config import Config

from flask_cors import CORS

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
from routes.admin.admin import admin_bp
from routes.admin.promote import promote_bp
from routes.test import test_utils
from routes.friend import friend_bp
from routes.crawler import crawler_bp

def setup_database(app, retries=5, wait=2):
    db.init_app(app)

    for i in range(retries):
        try:
            with app.app_context():
                # 嘗試資料庫操作
                db.create_all()
                # 延遲導入避免循環導入
                from celery_worker.crawler.logic import init_schedule_state
                init_schedule_state()
                print("✅ 資料庫初始化成功")
                return
        except OperationalError as e:
            print(f"🔁 第 {i+1} 次重試：資料庫未就緒，等待 {wait} 秒...")
            time.sleep(wait)
        except Exception as e:
            print(f"⚠️ 初始化資料庫時發生錯誤：{e}")
            time.sleep(wait)

    # 不要讓應用退出，改為背景持續重試
    print("⚠️ 多次重試後仍無法初始化資料庫，將在背景持續重試，不阻塞啟動")

    import threading

    def background_retry():
        attempt = retries
        while True:
            attempt += 1
            try:
                with app.app_context():
                    db.create_all()
                    from celery_worker.crawler.logic import init_schedule_state
                    init_schedule_state()
                    print("✅ 背景資料庫初始化成功")
                    return
            except Exception as e:
                print(f"🔁 背景第 {attempt} 次重試失敗：{e}，等待 {wait} 秒...")
                time.sleep(wait)

    threading.Thread(target=background_retry, daemon=True).start()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 初始化配置（設定資料庫連線等）
    Config.init_app(app)

    # 獲取環境變數
    env = os.getenv('FLASK_ENV', 'development')
    
    # 設定 URL 相關環境變數
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:4200")
    api_url = os.getenv("API_URL", "http://localhost:5000")
    
    # 將 URL 設定加入 app config
    app.config['FRONTEND_URL'] = frontend_url
    app.config['API_URL'] = api_url
    
    print(f"🌐 前端 URL: {frontend_url}")
    print(f"🔗 API URL: {api_url}")

    # 顯示 Redis/Celery 連線資訊
    redis_url_env = os.getenv('REDIS_URL', '')
    celery_broker_url = app.config.get('CELERY_BROKER_URL')
    celery_result_backend = app.config.get('CELERY_RESULT_BACKEND')
    print(f"🧰 REDIS_URL (env): {redis_url_env or '(not set)'}")
    print(f"📬 Celery Broker URL: {celery_broker_url}")
    print(f"📦 Celery Result Backend: {celery_result_backend}")
    
    # 資料庫連線由配置檔案自動處理
    if env == 'test':
        print("🧪 測試環境：使用 SQLite 資料庫")
    else:
        print(f"🗄️ 資料庫連線：{app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # 初始化資料庫
    setup_database(app)

    # 初始化 JWT
    JWTManager(app)

    # 初始化郵件
    init_mail(app)

    # 設定 CORS - 使用環境變數中的前端 URL
    CORS(app, origins=[frontend_url]) # 只允許前端 URL 的跨域請求
    
    # 註冊藍圖
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api')
    app.register_blueprint(todo_bp, url_prefix='/api')
    app.register_blueprint(me_bp, url_prefix='/api')
    app.register_blueprint(avatar_bp, url_prefix='/api')
    app.register_blueprint(square_bp, url_prefix='/api')
    app.register_blueprint(changepassword_bp, url_prefix='/api')
    app.register_blueprint(crawler_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(promote_bp, url_prefix='/api')
    app.register_blueprint(friend_bp, url_prefix='/api')
    
    # 在開發和測試環境掛載測試工具
    if env in ['development', 'test']:
        app.register_blueprint(test_utils, url_prefix='/api')

    @app.route("/healthz", methods=["GET"])
    def healthz():
        return "ok", 200

    return app

if __name__ == '__main__':
    app = create_app() # 建立 Flask 應用程式
    app.run(threaded=True, debug=True) # 啟動 Flask 應用程式