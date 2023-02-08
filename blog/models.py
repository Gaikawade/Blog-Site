from datetime import datetime
from sqlalchemy import func
from blog import db, bcrypt, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
      return f'name: {self.name}, email: {self.email}'


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
      return f'title: {self.title}, author: {self.author}'

def add_user(form):
    name = form.name.data
    email = form.email.data
    hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
    
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
