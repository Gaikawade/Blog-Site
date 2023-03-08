from flask import jsonify, request
from blog import app
from functools import wraps
import jwt
from .models import User

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
            return jsonify({'message' : 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id = data['userId']).first()
            if not current_user:
                return jsonify({ 'status': False, 'message': 'Invalid token' }), 400
        except Exception as e:
            return jsonify({ 'message' : 'Token is invalid !!' }), 401
        # returns the current logged in users context to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated