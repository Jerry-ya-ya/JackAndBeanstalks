# models.py
# 定義資料庫模型
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

date_format = datetime.now(timezone.utc)

db = SQLAlchemy()

# 關聯表：表示誰加了誰
friend_association = Table(
    'friend_association',
    db.Model.metadata,
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('friend_id', Integer, ForeignKey('user.id'))
)

# 定義使用者模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now()) # 註冊時間

    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    avatar_url = db.Column(db.String(255))
    nickname = db.Column(db.String(80))
    role = db.Column(db.String(20), default='user')  # 'user', 'admin', 'superadmin'

    email = db.Column(db.String(120), unique=True)
    email_verified = db.Column(db.Boolean, default=False)
    
    todos = db.relationship('Todo', backref='user', lazy=True) # 一對多關聯

    friends = relationship(
        'User',
        secondary=friend_association,
        primaryjoin=id == friend_association.c.user_id,
        secondaryjoin=id == friend_association.c.friend_id,
        backref='added_by'  # 可以反查「被誰加為好友」
    )
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nickname': self.nickname,
            'role': self.role,
            'email_verified': self.email_verified,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    from_user = db.relationship('User', foreign_keys=[from_user_id], backref='sent_requests')
    to_user = db.relationship('User', foreign_keys=[to_user_id], backref='received_requests')

    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    from_user = db.relationship('User', foreign_keys=[from_user_id], backref='sent_requests')
    to_user = db.relationship('User', foreign_keys=[to_user_id], backref='received_requests')

# 定義 Todo 模型
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) # 將來可用來綁定使用者

# 定義新聞模型
class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ScheduleState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_name = db.Column(db.String(50), unique=True, nullable=False)
    last_run = db.Column(db.DateTime)
    next_run = db.Column(db.DateTime)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref='posts')