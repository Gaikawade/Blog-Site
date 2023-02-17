from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)

app.config['SECRET_KEY'] = '897ry8fu76y7u3d@j#4rfr&'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please Login!'
login_manager.login_message_category = 'warning'

from blog import routes