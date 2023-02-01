from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

app = Flask(__name__)

app.config['SECRET_KEY'] = '897ry8fu76y7u3d@j#4rfr&'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/blog-site'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

bcrypt = Bcrypt(app)

from blog import routes