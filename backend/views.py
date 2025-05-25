from flask import Blueprint, send_from_directory

views_bp = Blueprint('views', __name__)

@views_bp.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@views_bp.route('/register.html')
def register_page():
    return send_from_directory('../frontend', 'register.html')

@views_bp.route('/login.html')
def login_page():
    return send_from_directory('../frontend', 'login.html')

@views_bp.route('/anunciar_coche.html')
def anunciar_coche_page():
    return send_from_directory('../frontend', 'anunciar_coche.html')

@views_bp.route('/perfil.html')
def perfil_page():
    return send_from_directory('../frontend', 'perfil.html')

@views_bp.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('../frontend/css', filename)

@views_bp.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../frontend/js', filename)