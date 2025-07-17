from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from flask import request, jsonify, Blueprint

friend_bp = Blueprint('friend_bp', __name__)

@friend_bp.route('/friends/add', methods=['POST'])
@jwt_required()
def add_friend():
    identity = get_jwt_identity()
    current_user = User.query.filter_by(username=identity).first()

    data = request.get_json()
    friend_username = data.get('friend_username')
    friend = User.query.filter_by(username=friend_username).first()

    if not friend:
        return jsonify({'error': '該用戶不存在'}), 404
    if friend == current_user:
        return jsonify({'error': '不能加自己為好友'}), 400
    if friend in current_user.friends:
        return jsonify({'message': '已是好友'}), 200

    current_user.friends.append(friend)
    db.session.commit()
    return jsonify({'message': f'已加 {friend.username} 為好友'})

@friend_bp.route('/friends/list', methods=['GET'])
@jwt_required()
def get_friends():
    identity = get_jwt_identity()
    user = User.query.filter_by(username=identity).first()
    
    return jsonify([
        {'id': f.id, 'username': f.username, 'email': f.email}
        for f in user.friends
    ])