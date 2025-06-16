from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

changepassword_bp = Blueprint('changepassword', __name__)

@changepassword_bp.route('/changepassword', methods=['PUT'])
@jwt_required()
def changepassword():
    current_identity = get_jwt_identity()
    user = User.query.filter_by(username=current_identity).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    old_pw = data.get('old_password')
    new_pw = data.get('new_password')

    if not check_password_hash(user.password, old_pw):
        return jsonify({'error': '舊密碼錯誤'}), 400

    user.password = generate_password_hash(new_pw)
    db.session.commit()

    return jsonify({'message': '密碼修改成功'})