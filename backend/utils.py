import os
from functools import wraps
from flask import current_app, jsonify
from flask_login import current_user

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify(message="Authentication required"), 401
        return f(*args, **kwargs)
    return decorated_function