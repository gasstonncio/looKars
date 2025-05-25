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