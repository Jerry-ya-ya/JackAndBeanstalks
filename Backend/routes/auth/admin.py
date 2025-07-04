from flask import Blueprint, request, jsonify
from flask_jwt_extended import current_user, jwt_required
from models import User, db

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')