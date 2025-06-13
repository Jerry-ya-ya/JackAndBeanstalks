from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint('auth', __name__)

# User API
# 註冊新用戶
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    email = data.get('email')
    nickname = data.get('nickname')
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    hashed_pw = generate_password_hash(password)
    new_user = User(
        username=username,
        password=hashed_pw,
        email=email,
        nickname=nickname
        )

    db.session.add(new_user)
    db.session.commit()
        
    token = create_access_token(identity=username)
    return jsonify({'access_token': token})

# 登入功能
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
        
    if user and check_password_hash(user.password, password):
        token = create_access_token(identity=username)
        return jsonify({
            'access_token':token,
            'username': username,
            'message': 'Login successful'
            })
    return jsonify({'error': 'Invalid credentials'}), 401