from flask import Flask, render_template, url_for, redirect
from forms import Register
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = '897ry8fu76y7u3d@j#4rfr&'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
      return f'name: {self.name}, email: {self.email}, age: {self.age}'


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.String(2000), nullable=False)
    date = db.Column(db.Date, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', title='HomePage')


@app.route('/about')
def about():
    return render_template('about.html', title='AboutPage')


@app.route('/register', methods=['POST', 'GET'])
def register():
    form = Register()
    if form.validate_on_submit():
        return redirect(url_for('home'))
    return render_template('register.html', title='RegisterPage', form=form)


@app.route('/posts')
def posts():
    return render_template('posts.html', title='Posts')


@app.route('/add_post')
def add_post():
    return render_template('add_post.html', title='Add Post')


if __name__ == '__main__':
    app.run(debug=True)
