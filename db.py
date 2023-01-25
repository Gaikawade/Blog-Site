from flask_sqlalchemy import SQLAlchemy
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)