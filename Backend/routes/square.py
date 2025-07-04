from flask import Blueprint, jsonify
from models import User
from flask_jwt_extended import jwt_required

square_bp = Blueprint('square', __name__)

@square_bp.route('/square', methods=['GET'])
@jwt_required()
def get_square():
    # 這裡可以根據需要從資料庫中獲取用戶資料
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'nickname': user.nickname,
        'avatar_url': user.avatar_url,
        'role': user.role
    } for user in users]

    return jsonify(user_list)