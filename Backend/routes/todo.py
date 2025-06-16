from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Todo

todo_bp = Blueprint('todo', __name__)

# Todos API

# C 新增待辦事項
@todo_bp.route('/todos', methods=['POST'])
@jwt_required()# 登入保護
def add_todo():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    data = request.get_json()
    new_todo = Todo(text=data['text'], user_id=user.id)

    db.session.add(new_todo)
    db.session.commit()

    return jsonify({'id': new_todo.id, 'text': new_todo.text, 'done': new_todo.done})

# R 取得所有待辦事項
@todo_bp.route('/todos', methods=['GET'])
@jwt_required()# 登入保護
def get_todos():
    current_user = get_jwt_identity()

    user = User.query.filter_by(username=current_user).first()
    todos = Todo.query.filter_by(user_id=user.id).all()

    return jsonify([{'id': t.id,
                     'text': t.text,
                     'done': t.done }for t in todos])

# U 更新待辦事項
@todo_bp.route('/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()# 登入保護
def update_todo(todo_id):
    current_user = get_jwt_identity()

    user = User.query.filter_by(username=current_user).first()
    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()

    if not todo:
        return jsonify({'error': 'Not found'}), 404
    
    data = request.get_json()
    todo.text = data.get('text', todo.text)
    todo.done = data.get('done', todo.done)
    db.session.commit()

    return jsonify({'id': todo.id, 'text': todo.text, 'done': todo.done})

# D 刪除待辦事項
@todo_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()# 登入保護
def delete_todo(todo_id):
    current_user = get_jwt_identity()

    user = User.query.filter_by(username=current_user).first()
    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()
    
    if not todo:
            return jsonify({'error': 'Not found'}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Deleted'})