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

    # todos = db.relationship('Todo', backref='user', lazy=True) # 一對多關聯

    avatar_url = db.Column(db.String(255))