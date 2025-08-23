from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User
from routes.auth.email import generate_confirmation_token, mail
from flask_mail import Message
import os
from flask import current_app
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# 註冊新用戶
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    hashed_pw = generate_password_hash(password)
    email = data.get('email')
    nickname = data.get('nickname')
    created_at = datetime.now()

    if not all([username, password, email]):
        return jsonify({'error': '請填寫所有必填欄位'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    # 判斷是否是唯一超管 email
    if email == current_app.config['SUPERADMIN_EMAIL']:
        role = 'superadmin'
    else:
        role = 'user'
    
    new_user = User(
        username=username,
        password=hashed_pw,
        email=email,
        nickname=nickname,
        email_verified=False,  # 確保新用戶的 email_verified 為 False
        role=role,
        created_at=created_at
    )

    db.session.add(new_user)
    db.session.commit()

    # 生成確認令牌並發送驗證郵件
    token = generate_confirmation_token(email)
    api_url = current_app.config.get('API_URL', 'http://localhost:5000').rstrip('/')
    verify_link = f"{api_url}/api/verify-email/{token}"
    
    # 使用環境變數中的郵件地址
    sender_email = os.getenv('MAIL_USERNAME')
    msg = Message(
        subject='驗證你的帳號',
        sender=sender_email,
        recipients=[email]
    )
    msg.body = f'請點擊連結完成驗證：{verify_link}'
    mail.send(msg)
        
    return jsonify({
        'message': '註冊成功，請檢查您的郵箱完成驗證',
        'email': email,
        'is_verified': False,  # 明確標示用戶尚未驗證
        'require_verification': True,  # 告訴前端需要驗證
        'role': role,
        'created_at': created_at.isoformat()
    })

# 登入功能
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    
    user = User.query.filter_by(username=username).first()
        
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': '帳號或密碼錯誤'}), 401

    if not user.email_verified:
        return jsonify({'error': '請先驗證你的 Email'}), 403  # 👈 阻止登入

    token = create_access_token(identity=username, additional_claims={'role': user.role})
    return jsonify({
        'access_token': token,
        'is_verified': True,  # 明確標示用戶已驗證
        'require_verification': False,  # 告訴前端不需要驗證
        'role': user.role,
    })