from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from models import User

def get_current_user_from_token():
    identity = get_jwt_identity()
    if not identity:
        return None
    return User.query.filter_by(username=identity).first()

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = get_current_user_from_token()
        if not user:
            return jsonify({'error': '使用者不存在'}), 401
        if user.role not in ['admin', 'superadmin']:
            return jsonify({'error': '需要管理員權限'}), 403
        return fn(*args, **kwargs)
    return wrapper

def superadmin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = get_current_user_from_token()
        if not user:
            return jsonify({'error': '使用者不存在'}), 401
        if user.role != 'superadmin':
            return jsonify({'error': '需要最高管理員權限'}), 403
        return fn(*args, **kwargs)
    return wrapper
