from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Post, User
from datetime import datetime

post_bp = Blueprint('post', __name__)

@post_bp.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'error': '內容不能為空'}), 400

    post = Post(content=content, user_id=user.id)
    db.session.add(post)
    db.session.commit()

    return jsonify({'message': '貼文已新增'})

@post_bp.route('/post', methods=['GET'])
@jwt_required()
def get_all_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()

    return jsonify([
        {
            'id': p.id, 
            'content': p.content, 
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M'),
            'user_id': p.user_id,
            'user': {
                'id': p.user.id,
                'username': p.user.username,
                'nickname': p.user.nickname,
                'avatar_url': p.user.avatar_url,
                'role': p.user.role
            }
        }
        for p in posts
    ])

@post_bp.route('/post/me', methods=['GET'])
@jwt_required()
def get_my_posts():
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    posts = Post.query.filter_by(user_id=user.id).order_by(Post.created_at.desc()).all()

    return jsonify([
        {'id': p.id, 'content': p.content, 'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')}
        for p in posts
    ])