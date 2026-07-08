from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Todo
from routes.auth.utils import get_current_user_from_token

todo_bp = Blueprint('todo', __name__)

# Todos API

# C 新增待辦事項
@todo_bp.route('/todos', methods=['POST'])
@jwt_required()# 登入保護
def add_todo():
    user = get_current_user_from_token()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json(silent=True) or {}
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Todo text is required'}), 400

    new_todo = Todo(text=text, user_id=user.id)

    db.session.add(new_todo)
    db.session.commit()

    return jsonify({'id': new_todo.id, 'text': new_todo.text, 'done': new_todo.done})

# R 取得所有待辦事項
@todo_bp.route('/todos', methods=['GET'])
@jwt_required()# 登入保護
def get_todos():
    user = get_current_user_from_token()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    todos = Todo.query.filter_by(user_id=user.id).all()

    return jsonify([{'id': t.id,
                     'text': t.text,
                     'done': t.done }for t in todos])

# U 更新待辦事項
@todo_bp.route('/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()# 登入保護
def update_todo(todo_id):
    user = get_current_user_from_token()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()

    if not todo:
        return jsonify({'error': 'Not found'}), 404
    
    data = request.get_json(silent=True) or {}
    text = data.get('text')
    if text is not None:
        text = text.strip()
        if not text:
            return jsonify({'error': 'Todo text cannot be empty'}), 400
        todo.text = text
    todo.done = data.get('done', todo.done)
    db.session.commit()

    return jsonify({'id': todo.id, 'text': todo.text, 'done': todo.done})

# D 刪除待辦事項
@todo_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()# 登入保護
def delete_todo(todo_id):
    user = get_current_user_from_token()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()
    
    if not todo:
            return jsonify({'error': 'Not found'}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Deleted'})
