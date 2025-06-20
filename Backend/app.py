# pip install virtualenv
# python3 -m virtualenv myenv
# .\myenv\Scripts\activate

# To fix after creating virtual environment in Windows:
# Ctrl + Shift + P
# Python: Select Interpreter
# Enter interpreter path
# .\myenv\Scripts\python.exe

from flask import Flask

from flask_cors import CORS

# 時間相關套件
from datetime import timedelta

# 環境變數相關套件
import os

# 資料庫相關套件
from models import db

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

# 載入 .env 環境變數
from dotenv import load_dotenv
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # 設定資料庫連線（使用 SQL Server）
    server = os.getenv("DB_SERVER")
    port = os.getenv("DB_PORT", "1433")  # 預設 SQL Server 埠號
    database = os.getenv("DB_NAME")
    username = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    # 設定資料庫連線
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mssql+pyodbc://{username}:{password}@{server},{port}/{database}"
        "?driver=ODBC+Driver+17+for+SQL+Server"
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
    db.init_app(app)
    with app.app_context():
        db.create_all()
        init_schedule_state() # 初始化排程器狀態

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

    start_scheduler(app) # 啟動排程器

    return app

if __name__ == '__main__':
    app = create_app() # 建立 Flask 應用程式
    app.run(debug=True) # 啟動 Flask 應用程式