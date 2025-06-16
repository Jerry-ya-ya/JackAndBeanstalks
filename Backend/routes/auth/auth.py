from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User
from routes.auth.email import generate_confirmation_token, mail, confirm_token
from flask_mail import Message
import os

auth_bp = Blueprint('auth', __name__)

# 註冊新用戶
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    nickname = data.get('nickname')

    if not all([username, password, email]):
        return jsonify({'error': '請填寫所有必填欄位'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_pw = generate_password_hash(password)
    new_user = User(
        username=username,
        password=hashed_pw,
        email=email,
        nickname=nickname,
        email_verified=False  # 確保新用戶的 email_verified 為 False
    )

    db.session.add(new_user)
    db.session.commit()

    # 生成確認令牌並發送驗證郵件
    token = generate_confirmation_token(email)
    verify_link = f'http://127.0.0.1:5000/api/verify-email/{token}'
    
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
        'require_verification': True  # 告訴前端需要驗證
    })

# 登入功能
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
        
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': '帳號或密碼錯誤'}), 401

    if not user.email_verified:
        return jsonify({'error': '請先驗證你的 Email'}), 403  # 👈 阻止登入

    token = create_access_token(identity=username)
    return jsonify({
        'access_token': token,
        'is_verified': True,  # 明確標示用戶已驗證
        'require_verification': False  # 告訴前端不需要驗證
    })