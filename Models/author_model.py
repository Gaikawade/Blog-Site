from datetime import datetime
from app import db


class Author(db.Model):
    __tablename__ = 'author'
    author_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, **kwargs):
        self.first_name = kwargs.get('fname')
        self.last_name = kwargs.get('lname')
        self.email = kwargs.get('email')
        self.password = kwargs.get('password')
        self.created_at = datetime.now()
        db.create_all()
