from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename

from . import db
from .models import Coche
from .utils import allowed_file
import os

cars_bp = Blueprint('cars', __name__)

@cars_bp.route('/anunciar_coche', methods=['POST'])
@login_required
def anunciar_coche():
    #Acceso a UPLOAD_FOLDER y ALLOWED_EXTENSIONS desde la configuracion de la app
    upload_folder = current_app.config['UPLOAD_FOLDER']

    if 'foto' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['foto']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        ruta_foto = os.path.join(upload_folder, filename)

        #Comprobar si carpeta de subidas existe
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        file.save(ruta_foto)
        modelo = request.form['modelo']
        descripcion = request.form['descripcion']
        nuevo_coche = Coche(modelo=modelo, descripcion=descripcion, ruta_foto=ruta_foto, usuario_id=current_user.id)
        db.session.add(nuevo_coche)
        db.session.commit()
        return jsonify({'message': 'Car uploaded successfully'}), 201
    else:
        return jsonify({'message': 'Invalid file type'}), 400

@cars_bp.route('/coches', methods=['GET'])
def get_coches():
    search_term = request.args.get('search', '')
    modelo_filtro = request.args.get('modelo', '')
    descripcion_filtro = request.args.get('descripcion', '')
    limit = request.args.get('limit', type=int) # Nuevo: Obtener el límite como entero

    query = Coche.query

    if search_term:
        query = query.filter(
            (Coche.modelo.ilike(f'%{search_term}%')) |
            (Coche.descripcion.ilike(f'%{search_term}%'))
        )
    if modelo_filtro:
        query = query.filter(Coche.modelo.ilike(f'%{modelo_filtro}%'))
    if descripcion_filtro:
        query = query.filter(Coche.descripcion.ilike(f'%{descripcion_filtro}%'))

    if limit is not None: # Aplicar el límite si se proporciona
        query = query.limit(limit)

    coches = query.all()

    coches_list = []
    for coche in coches:
        vendedor_username = coche.usuario.username if coche.usuario else 'Desconocido'
        coches_list.append({
            'id': coche.id,
            'modelo': coche.modelo,
            'descripcion': coche.descripcion,
            'ruta_foto': coche.ruta_foto,
            'usuario_id': coche.usuario_id,
            'vendedor_username': vendedor_username
        })
    return jsonify(coches_list), 200

@cars_bp.route('/coches/<int:car_id>', methods=['GET'])
def get_coche_detalle(car_id):
    coche = Coche.query.get(car_id) # Busca el coche por su ID

    if not coche:
        return jsonify({'message': 'Coche no encontrado'}), 404

    vendedor_username = coche.usuario.username if coche.usuario else 'Desconocido'

    coche_data = {
        'id': coche.id,
        'modelo': coche.modelo,
        'descripcion': coche.descripcion,
        'ruta_foto': coche.ruta_foto,
        'usuario_id': coche.usuario_id,
        'vendedor_username': vendedor_username,
    }
    return jsonify(coche_data), 200

#Ruta para obtener los coches subidos por el usuario actual
@cars_bp.route('/mis_coches', methods=['GET'])
@login_required
def get_mis_coches():
    # Filtra los coches por el usuario_id del usuario logueado
    coches = Coche.query.filter_by(usuario_id=current_user.id).all()
    coches_list = []
    for coche in coches:
        coches_list.append({
            'id': coche.id,
            'modelo': coche.modelo,
            'descripcion': coche.descripcion,
            'ruta_foto': coche.ruta_foto,
            'usuario_id': coche.usuario_id
        })
    return jsonify(coches_list), 200

#Ruta para editar un coche
@cars_bp.route('/coches/<int:car_id>/editar', methods=['GET', 'PUT', 'POST'])
@login_required
def editar_coche(car_id):
    coche = Coche.query.get(car_id)

    if not coche:
        return jsonify({'message': 'Coche no encontrado'}), 404

    #Verificar que el usuario logueado es el propietario del coche
    if coche.usuario_id != current_user.id:
        return jsonify({'message': 'No autorizado para editar este coche'}), 403 # 403 Forbidden

    if request.method == 'GET':
        #Devolver los datos actuales del coche para rellenar el formulario de edicion
        coche_data = {
            'id': coche.id,
            'modelo': coche.modelo,
            'descripcion': coche.descripcion,
            'ruta_foto': coche.ruta_foto,
            'usuario_id': coche.usuario_id
        }
        return jsonify(coche_data), 200

    elif request.method in ['PUT', 'POST']:
        #Actualizar los datos del coche
        data = request.get_json()

        coche.modelo = data.get('modelo', coche.modelo)
        coche.descripcion = data.get('descripcion', coche.descripcion)


        db.session.commit()
        return jsonify({'message': 'Coche actualizado exitosamente'}), 200

#Ruta para eliminar un coche
@cars_bp.route('/coches/<int:car_id>/eliminar', methods=['DELETE'])
@login_required
def eliminar_coche(car_id):
    coche = Coche.query.get(car_id)

    if not coche:
        return jsonify({'message': 'Coche no encontrado'}), 404

    #Verificar que el usuario logueado es el propietario del coche
    if coche.usuario_id != current_user.id:
        return jsonify({'message': 'No autorizado para eliminar este coche'}), 403

    db.session.delete(coche)
    db.session.commit()

    #Eliminar la foto del sistema de archivos
    if os.path.exists(coche.ruta_foto):
        os.remove(coche.ruta_foto)

    return jsonify({'message': 'Coche eliminado exitosamente'}), 200