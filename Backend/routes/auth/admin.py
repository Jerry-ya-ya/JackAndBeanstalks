from flask import Blueprint, request, jsonify
from flask_jwt_extended import current_user, jwt_required
from models import User, db

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/create-admin', methods=['POST'])
@jwt_required()
def create_admin():
    if not current_user.is_superadmin():
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(email=email, role='admin')
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": f"Admin {email} created"})