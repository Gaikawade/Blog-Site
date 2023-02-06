from flask import render_template, redirect, url_for, flash, request
from blog.forms import Register, Login, Account, PostForm
from blog.models import add_user, User, Post
from blog import app, bcrypt, db
from flask_login import login_required, login_user, logout_user, current_user

@app.route('/')
@app.route('/home')
def home():
    posts = Post.query.all()
    return render_template('home.html', title='HomePage', posts=posts)


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
@login_required
def posts():
    return render_template('posts.html', title='Posts')


@app.route('/add_post', methods=['POST', 'GET'])
def add_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        flash('Post added successfully', 'success')
        return redirect(url_for('home'))
    return render_template('add_post.html', title='Add Post', form=form)


@app.route('/login', methods=['POST', 'GET'])
def login():
    form = Login()
    if form.validate_on_submit():
        document = User.query.filter_by(email=form.email.data).first()
        if document and bcrypt.check_password_hash(document.password, form.password.data):
            login_user(document, remember=form.remember.data)
            flash('Login successful', 'success')
            return redirect(url_for('home'))
        else:
            flash('Login failed', 'danger')
    return render_template('login.html', title='Login Page', form=form)


@app.route('/logout')
@login_required
def logout():
    if current_user.is_authenticated:
        logout_user()
        return redirect(url_for('home'))
    else:
        return redirect(url_for('login'))

@app.route('/account', methods=['POST', 'GET'])
@login_required 
def account():
    form = Account()
    if request.method == 'GET':
        form.name.data = current_user.name
        form.email.data = current_user.email
    elif form.validate_on_submit():
        current_user.name = form.name.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account details have been updated', 'success')
        return redirect(url_for('account'))
    return render_template('account.html', title='Account', form=form)


@app.route('/post/<int:post_id>')
@login_required
def read_post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', title=post.title, post=post)