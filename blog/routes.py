from flask import render_template, redirect, url_for, flash
from blog.forms import Register, Login
from blog.models import add_user, User
from blog import app, bcrypt

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
        add_user(form)
        flash('Registration successful', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='RegisterPage', form=form)


@app.route('/posts')
def posts():
    return render_template('posts.html', title='Posts')


@app.route('/add_post')
def add_post():
    return render_template('add_post.html', title='Add Post')

@app.route('/login', methods=['POST', 'GET'])
def login():
    form = Login()
    if form.validate_on_submit():
        document = User.query.filter_by(email=form.email.data).first()
        if document and bcrypt.check_password_hash(document.password, form.password.data):
            flash('Login successful', 'success')
            return redirect(url_for('posts'))
        else:
            flash('Login failed', 'error')
    return render_template('login.html', title='Login', form=form)