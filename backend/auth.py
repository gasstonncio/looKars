from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required
from . import db
from .models import Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    if Usuario.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    new_user = Usuario()
    new_user.username = username
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    user = Usuario.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

    login_user(user) # Inicia sesión al usuario con Flask-Login
    return jsonify({'message': 'Login successful'}), 200

@auth_bp.route('/logout') # Ruta para cerrar sesion
@login_required #Requiere que el usuario este logueado para cerrar sesion
def logout():
    logout_user() # Cierra la sesión del usuario con Flask-Login
    return jsonify({'message': 'Logged out successfully'}), 200