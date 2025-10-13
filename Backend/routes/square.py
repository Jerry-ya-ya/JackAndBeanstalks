from flask import Blueprint, jsonify, request
from models import User
from flask_jwt_extended import jwt_required

square_bp = Blueprint('square', __name__)

@square_bp.route('/square', methods=['GET'])
@jwt_required()
def get_square():
    # 從 query string 讀排序條件，預設 id ASC
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')

    # 決定要排序的欄位
    if sort_by == 'id':
        sort_column = User.id
    elif sort_by == 'created_at':
        sort_column = User.created_at
    elif sort_by == 'updated_at':
        sort_column = User.updated_at
    else:
        sort_column = User.id  # fallback

    # 決定升冪還是降冪
    if order == 'desc':
        users = User.query.order_by(sort_column.desc()).all()
    else:
        users = User.query.order_by(sort_column.asc()).all()

    user_list = [{
        'id': user.id,
        'username': user.username,
        'nickname': user.nickname,
        'avatar_url': user.avatar_url,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    } for user in users]

    return jsonify(user_list)