# models.py
# 定義資料庫模型
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# 定義使用者模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    email = db.Column(db.String(120))
    nickname = db.Column(db.String(80))
    
    created_at = db.Column(db.DateTime, server_default=db.func.now()) # 註冊時間

    todos = db.relationship('Todo', backref='user', lazy=True) # 一對多關聯

    avatar_url = db.Column(db.String(255))

# 定義 Todo 模型
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) # 將來可用來綁定使用者

# 定義新聞模型
class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ScheduleState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_name = db.Column(db.String(50), unique=True, nullable=False)
    last_run = db.Column(db.DateTime)
    next_run = db.Column(db.DateTime)