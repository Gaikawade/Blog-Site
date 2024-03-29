from datetime import datetime
from blog import db, bcrypt, login_manager
from flask_login import UserMixin
import uuid

# it is a decorator in Flask-Login, and a Flask extension for handling user authentication and session management
@login_manager.user_loader
def load_user(id):
    if id.startswith('U'):
        user = db.session.get(User, id)
        return user
    else:
        admin = db.session.get(Admin, id)
        return admin


# Defining the structure of the 'user' table in the database
class User(db.Model, UserMixin):
    # Specifies the name of the database table 
    __tablename__ = 'user'
    id = db.Column(db.String(40), primary_key=True, default=lambda:'U' + str(uuid.uuid4().int >> 64))
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    is_blocked = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete')
    comments = db.relationship('Comment', backref='author', lazy=True, cascade='all, delete')
    likes = db.relationship('Like', backref='author', lazy=True, cascade='all, delete')

    # String representation of the User object
    def __repr__(self):
      return f'name: {self.name}, email: {self.email}'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_blocked': self.is_blocked,
            'created_at': self.created_at.strftime('%D'),
            # 'posts': [post.to_dict() for post in self.posts if post.used_id == self.id]
        }


# Defining the structure of the 'post' table in the database
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(40), db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete')
    likes = db.relationship('Like', backref='post', lazy=True, cascade='all, delete')

    def __repr__(self):
      return f'title: {self.title}, author: {self.author}'
  
    def to_dict(self):
        return {
            "post": {
                "id": self.id,
                "title": self.title,
                "content": self.content,
                "created_at": self.created_at.strftime('%D')
            },
            "author": self.author.to_dict(),
            'comments': [comment.to_dict() for comment in self.comments[::-1] if comment.post_id == self.id],
            'likes': [like.to_dict() for like in self.likes[::-1] if like.post_id == self.id]
        }


# Defining the structure of the 'comment' table in the database
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    commented_by = db.Column(db.String(40), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    
    def __repr__(self):
        return f'{self.author.name}: {self.text}'
    
    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "created_at": self.created_at.strftime('%D'),
            "commented_by": self.author.to_dict(),
            "post_id": self.post_id
        }


# Defining the structure of the 'like' table in the database
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    liked_by = db.Column(db.String(40), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.strftime('%D'),
            "liked_by": self.author.to_dict(),
            "post_id": self.post_id
        }


# Defining the structure of the 'admin' table in the database
class Admin(db.Model, UserMixin):
    id = db.Column(db.String(40), primary_key=True, default=lambda:'A' + str(uuid.uuid4().int >> 64))
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_admin = db.Column(db.Boolean, default=True)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'{self.name} {self.email}'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_admin': self.is_admin,
            'is_blocked' : self.is_blocked,
            'created_at': self.created_at.strftime('%D')
        }


# Function to add new user to the database
def add_user(name, email, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(name=name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()


# Function to add new admin to the database
def add_admin(name, email, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    admin = Admin(name=name, email=email, password=hashed_password)
    db.session.add(admin)
    db.session.commit()