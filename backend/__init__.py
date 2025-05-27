import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .views import views_bp

db = SQLAlchemy()
login_manager = LoginManager() #Gestionar el login de usuarios

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    #Configuracion de la carpeta de subida y extensiones permitidas
    UPLOAD_FOLDER = 'uploads'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'} # Añade esta config aquí

    #Configuracion de la bbdd
    instance_folder_path = app.instance_path
    if not os.path.exists(instance_folder_path):
        os.makedirs(instance_folder_path)
    database_path = os.path.join(instance_folder_path, 'coches.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #Para evitar warnings
    app.config['SECRET_KEY'] = '2a4c6e8f1b3d5a7f9e0d1c2b3a4e5f6d7c8b9a0e1f2d3c4b5a6f7e8d9c0b1a2f' #Clave que no debe estar en el código, normalmente se obtendría de manera externa

    db.init_app(app) #Inicializar SQLAlchemy con la app

    login_manager.init_app(app) #Inicializar Flask-Login con la app
    login_manager.login_view = 'login' #Ruta para redirigir si no está logueado

    # Importamos aquí para evitar importaciones circulares en Flask-SQLAlchemy
    from .models import Usuario, Coche

    @login_manager.user_loader
    def load_user(user_id):
        return Usuario.query.get(int(user_id))

    from .auth import auth_bp
    from .cars import cars_bp
    from .user_profile import profile_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(cars_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(views_bp)

    # Si no existen, crear las tablas de la base de datos
    with app.app_context():
        db.create_all()

   # app.static_folder = os.path.join(app.root_path, app.config['UPLOAD_FOLDER']) No funciona

    return app