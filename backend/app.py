from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user
from functools import update_wrapper, wraps

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coches.db'
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    nombre = db.Column(db.String(80), nullable=True)
    apellidos = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    telefono = db.Column(db.String(20), nullable=True)
    coches = relationship('Coche', backref='usuario', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Coche(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    modelo = db.Column(db.String(80), nullable=False)
    descripcion = db.Column(db.String(200), nullable=False)
    ruta_foto = db.Column(db.String(120), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():

    pass

@app.route('/login', methods=['POST'])
def login():

    pass

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify(message="Authentication required"), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/anunciar_coche', methods=['POST'])
@login_required
def anunciar_coche():
    if 'foto' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['foto']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        ruta_foto = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(ruta_foto)
        modelo = request.form['modelo']
        descripcion = request.form['descripcion']
        nuevo_coche = Coche(modelo=modelo, descripcion=descripcion, ruta_foto=ruta_foto, usuario_id=current_user.id)
        db.session.add(nuevo_coche)
        db.session.commit()
        return jsonify({'message': 'Car uploaded successfully'}), 201
    else:
        return jsonify({'message': 'Invalid file type'}), 400

@app.route('/perfil', methods=['GET', 'POST'])
@requires_auth
def perfil():
    if request.method == 'GET':
        # Devuelve la información del perfil del usuario logueado
        return jsonify({
            'username': current_user.username,
            'nombre': current_user.nombre,
            'apellidos': current_user.apellidos,
            'email': current_user.email,
            'telefono': current_user.telefono
        }), 200
    elif request.method == 'POST':
        # Actualiza la información del perfil del usuario logueado
        current_user.nombre = request.json.get('nombre', current_user.nombre)
        current_user.apellidos = request.json.get('apellidos', current_user.apellidos)
        current_user.email = request.json.get('email', current_user.email)
        current_user.telefono = request.json.get('telefono', current_user.telefono)
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    return jsonify(message="Method Not Allowed"), 405


if __name__ == '__main__':
    app.run(debug=True)
