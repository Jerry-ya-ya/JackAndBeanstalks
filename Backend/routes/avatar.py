import os

from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, User

avatar_bp = Blueprint('avatar', __name__)

@avatar_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    current_identity = get_jwt_identity()
    user = User.query.filter_by(username=current_identity).first()

    # 設定上傳檔案的類型
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    # 檢查副檔名
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # 確保上傳目錄存在
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'avatar')
        os.makedirs(upload_folder, exist_ok=True)
        
        filename = secure_filename(f"{user.username}_{file.filename}")
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # 使用正斜線作為 URL 路徑
        user.avatar_url = f'/static/uploads/avatar/{filename}'
        db.session.commit()

        return jsonify({'message': 'Avatar uploaded', 'avatar_url': user.avatar_url})

    return jsonify({'error': 'Invalid file type'}), 400