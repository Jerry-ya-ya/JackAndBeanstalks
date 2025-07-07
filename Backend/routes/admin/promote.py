from flask import Blueprint, jsonify, request
from models import User
from models import db
from routes.admin.decorators import superadmin_required
from flask_jwt_extended import get_jwt_identity

promote_bp = Blueprint('promote', __name__)

@promote_bp.route('/superadmin/promote', methods=['GET'])
@superadmin_required
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@promote_bp.route('/superadmin/promote/<int:user_id>', methods=['PUT'])
@superadmin_required
def promote_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用戶不存在'}), 404

    if user.role == 'admin':
        return jsonify({'message': '該用戶已是管理員'}), 200

    user.role = 'admin'
    db.session.commit()

    return jsonify({'message': f'已將 {user.username} 晉升為管理員'})

@promote_bp.route('/superadmin/demote/<int:user_id>', methods=['PUT'])
@superadmin_required
def demote_user(user_id):
    acting_username = get_jwt_identity()  # 直接取得目前操作者的 username

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用戶不存在'}), 404

    if user.username == acting_username:
        return jsonify({'error': '不能降級自己'}), 400

    if user.role != 'admin':
        return jsonify({'message': '該用戶不是管理員'}), 200

    user.role = 'user'
    db.session.commit()
    return jsonify({'message': f'{user.username} 已降級為一般使用者'})