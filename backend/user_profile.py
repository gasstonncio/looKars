from flask import Blueprint, request, jsonify
from flask_login import current_user # Necesario para acceder al usuario logueado
from . import db # Importa la instancia de db
from .utils import requires_auth # Importa el decorador de autenticación

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/perfil', methods=['GET', 'POST'])
@requires_auth
def perfil():
    if request.method == 'GET':
        return jsonify({
            'username': current_user.username,
            'nombre': current_user.nombre,
            'apellidos': current_user.apellidos,
            'email': current_user.email,
            'telefono': current_user.telefono
        }), 200
    elif request.method == 'POST':
        current_user.nombre = request.json.get('nombre', current_user.nombre)
        current_user.apellidos = request.json.get('apellidos', current_user.apellidos)
        current_user.email = request.json.get('email', current_user.email)
        current_user.telefono = request.json.get('telefono', current_user.telefono)
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    return jsonify(message="Method Not Allowed"), 405