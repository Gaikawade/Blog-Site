from flask import render_template, redirect, url_for
from blog.forms import Register
from blog import app

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
