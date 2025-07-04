from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['role'] not in ['admin', 'superadmin']:
            return jsonify({'error': '需要管理員權限'}), 403
        return fn(*args, **kwargs)
    return wrapper

def superadmin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['role'] != 'superadmin':
            return jsonify({'error': '需要最高管理員權限'}), 403
        return fn(*args, **kwargs)
    return wrapper