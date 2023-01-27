import pytz
from datetime import datetime
from app import db


class Author(db.Model):
    __tablename__ = 'author'
    author_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(255), nullable=False)
    lname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, **kwargs):
        self.fname = kwargs.get('fname')
        self.lname = kwargs.get('lname')
        self.email = kwargs.get('email')
        self.password = kwargs.get('password')
        self.created_at = datetime.now(pytz.timezone('Asia/Kolkata'))
        db.create_all()
