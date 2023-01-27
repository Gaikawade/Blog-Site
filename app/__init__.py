from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SECRET_KEY'] = 'dsjvneiu923uewvn873584v'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
