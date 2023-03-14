from flask import jsonify, request, redirect, url_for, make_response
from functools import wraps
from datetime import datetime
import jwt
from blog import app
from .models import User, Admin

# decorator for verifying the JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'authorization' in request.headers:
            token = request.headers['authorization'].split(' ')[1]
        if not token:
            return jsonify({'status': False, 'message': 'Token is missing !!'}), 401

        try:
            decoded_token = jwt.decode(
                token, app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            user_id = decoded_token['userId']
            current_user = User.query.filter_by(id=user_id).first()

            if not current_user:
                current_user = Admin.query.filter_by(id=user_id).first()

            if not current_user:
                return jsonify({'status': False, 'message': 'Invalid token'}), 400
            return f(current_user, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({'status': False, 'message': 'Token is expired'}), 401

        except jwt.InvalidTokenError:
            return jsonify({'status': False, 'message': 'Invalid token'}), 401

    return decorated
