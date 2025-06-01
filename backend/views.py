from flask import Blueprint, send_from_directory, current_app
import os

views_bp = Blueprint('views', __name__)


# Rutas archivos HTML
@views_bp.route('/')
def index():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'index.html')

@views_bp.route('/register.html')
def register_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'register.html')

@views_bp.route('/login.html')
def login_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'login.html')

@views_bp.route('/anunciar_coche.html')
def anunciar_coche_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'anunciar_coche.html')

@views_bp.route('/perfil.html')
def perfil_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'perfil.html')

@views_bp.route('/coches.html')
def coches_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'coches.html')

@views_bp.route('/detalle_coche.html')
def detalle_coche_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'detalle_coche.html')

@views_bp.route('/mis_coches.html')
def mis_coches_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'mis_coches.html')

@views_bp.route('/editar_coche.html')
def editar_coche_page():
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend'), 'editar_coche.html')

# Rutas archivos JS
@views_bp.route('/css/<path:filename>')
def serve_css(filename):
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend', 'css'), filename)

@views_bp.route('/js/<path:filename>')
def serve_js(filename):
    project_root = os.path.dirname(current_app.root_path)
    return send_from_directory(os.path.join(project_root, 'frontend', 'js'), filename)

#Ruta para servir archivos de la carpeta 'uploads' (las fotos de los coches)
@views_bp.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    project_root = os.path.dirname(current_app.root_path)
    upload_directory = os.path.join(project_root, current_app.config['UPLOAD_FOLDER'])
    return send_from_directory(upload_directory, filename)