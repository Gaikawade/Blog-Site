from datetime import datetime
from sqlalchemy import func
from blog import db, bcrypt, login_manager
from flask_login import UserMixin
import uuid

@login_manager.user_loader
def load_user(id):
    # First, try to load the user as a regular user
    user = User.query.get(id)
    if user:
        return user
    # If the user is not found, try to load the user as an admin
    admin = Admin.query.get(id)
    if admin:
        return admin

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    # id = db.Column(db.String(20), primary_key=True, default='U' + str(uuid.uuid4().int >> 64))
    id = db.Column(db.String(80), primary_key=True, default='U' + str(uuid.uuid4().int >> 64))
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete')
    comments = db.relationship('Comment', backref='author', lazy=True, cascade='all, delete')
    likes = db.relationship('Like', backref='author', lazy=True, cascade='all, delete')

    def __repr__(self):
      return f'name: {self.name}, email: {self.email}'


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(20), db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship('Comment', backref='post', lazy=True)
    likes = db.relationship('Like', backref='post', lazy=True)

    def __repr__(self):
      return f'title: {self.title}, author: {self.author}'


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    commented_by = db.Column(db.String(20), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    
    def __repr__(self):
        return f'{self.author.name}: {self.text}'


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    liked_by = db.Column(db.String(20), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)


class Admin(db.Model, UserMixin):
    id = db.Column(db.String(20), primary_key=True, default='A' + str(uuid.uuid4().int >> 64))
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_admin = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'{self.name} {self.email}'


def add_user(form):
    name = form.name.data
    email = form.email.data
    hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()


def add_admin(form):
    name = form.name.data
    email = form.email.data
    password = bcrypt.generate_password_hash(form.password.data).decode('utf8')
    admin = Admin(name=name, email=email, password=password)
    db.session.add(admin)
    db.session.commit()