from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

user_bp = Blueprint('user', __name__)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

@user_bp.route('/users', methods=['GET'])
def get_users():
    """Lista todos os usuários"""
    try:
        users = User.query.all()
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
