from flask import jsonify, request
from blog import app
from functools import wraps
import jwt
from .models import User, Admin

# decorator for verifying the JWT


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'authorization' in request.headers:
            token = request.headers['authorization'].split(' ')[1]
        # return 401 if token is not passed
        if not token:
            return jsonify({'status': False, 'message': 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
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

        except jwt.ExpiredSignatureError:
            return jsonify({'status': False, 'message': 'Token is expired'}), 401

        except jwt.InvalidTokenError:
            return jsonify({'status': False, 'message': 'Invalid token'}), 401
        # returns the current logged in users context to the routes
        return f(current_user, *args, **kwargs)

    return decorated
