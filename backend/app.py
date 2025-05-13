import app
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coches.db'
db = SQLAlchemy(app)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
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
    # Tu código para el registro de usuarios va aquí
    pass

@app.route('/login', methods=['POST'])
def login():
    # Tu código para el inicio de sesión de usuarios va aquí
    pass

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

if __name__ == '__main__':
    app.run(debug=True)
