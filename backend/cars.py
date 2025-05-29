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
    # Obtener parámetros de búsqueda y filtrado de la URL
    search_term = request.args.get('search', '')
    modelo_filtro = request.args.get('modelo', '')
    descripcion_filtro = request.args.get('descripcion', '')

    # Construir la consulta base
    query = Coche.query

    #Aplicar filtros si existen
    if search_term:
        #Busqueda general en modelo o descripcion
        query = query.filter(
            (Coche.modelo.ilike(f'%{search_term}%')) | # ilike para evitar busqueda key-sensitive
            (Coche.descripcion.ilike(f'%{search_term}%'))
        )
    if modelo_filtro:
        query = query.filter(Coche.modelo.ilike(f'%{modelo_filtro}%'))
    if descripcion_filtro:
        query = query.filter(Coche.descripcion.ilike(f'%{descripcion_filtro}%'))

    #Ejecutar la consulta
    coches = query.all()

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

@cars_bp.route('/coches/<int:car_id>', methods=['GET'])
def get_coche_detalle(car_id):
    coche = Coche.query.get(car_id) # Busca el coche por su ID

    if not coche:
        return jsonify({'message': 'Coche no encontrado'}), 404

    coche_data = {
        'id': coche.id,
        'modelo': coche.modelo,
        'descripcion': coche.descripcion,
        'ruta_foto': coche.ruta_foto,
        'usuario_id': coche.usuario_id,
    }
    return jsonify(coche_data), 200