from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

me_bp = Blueprint('me', __name__)

# GET：取得目前登入使用者資訊
@me_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_identity = get_jwt_identity()
    user = User.query.filter_by(username=current_identity).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'nickname': user.nickname,
        'created_at': user.created_at.isoformat(),
        'avatar_url': user.avatar_url,
        'role': user.role,
    })

# PUT：更新使用者資訊
@me_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    current_identity = get_jwt_identity()
    user = User.query.filter_by(username=current_identity).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    user.email = data.get('email', user.email)
    user.nickname = data.get('nickname', user.nickname)
    db.session.commit()

    return jsonify({'message': 'Profile updated'})

# GET：根據用戶 ID 獲取用戶資料
@me_bp.route('/public/<int:user_id>', methods=['GET'])
@jwt_required()
def public_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用戶不存在'}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'nickname': user.nickname,
        'email': user.email,
        'avatar_url': user.avatar_url,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })