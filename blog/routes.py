from flask import render_template, redirect, url_for, flash, request, abort, jsonify
from blog.forms import Register, Login, Account, PostForm
from blog.models import add_user, User, Post, Comment, Like
from blog import app, bcrypt, db
from flask_login import login_required, login_user, logout_user, current_user

@app.route('/')
@app.route('/home')
def home():
    posts = Post.query.order_by(-Post.created_at).all()
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


# @app.route('/posts')
# @login_required
# def posts():
#     return render_template('posts.html', title='Posts')


@app.route('/add_post', methods=['POST', 'GET'])
@login_required
def add_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        print(post)
        flash('Post added successfully', 'success')
        return redirect(url_for('home'))
    return render_template('add_update_post.html', title='Add Post', form=form)


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
        flash('Successfully logged out', 'success')
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
    return render_template('read_post.html', title=post.title, post=post)


@app.route('/post/update/<int:post_id>', methods=['POST', "GET"])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    form = PostForm()
    if request.method =='GET':
        form.title.data = post.title
        form.content.data = post.content
    elif request.method == 'POST':
        post.title = form.title.data
        post.content = form.content.data
        db.session.commit()
        flash('The Article has been updated', 'success')
        return redirect(url_for('read_post', post_id=post.id))
    return render_template('add_update_post.html', title=post.title, form=form)


@app.route('/post/delete/<int:post_id>', methods=['POST', "GET"])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author != current_user:
        abort(403)
    db.session.delete(post)
    db.session.commit()
    flash('The article has been deleted', 'success')
    return redirect(url_for('home'))


@app.route('/add_comment/<int:post_id>', methods=['POST', 'GET'])
@login_required
def add_comment(post_id):
    text = request.form.get('text')
    if not text:
        flash('Comment cannot be empty', 'danger')
    else:
        post = Post.query.filter_by(id=post_id)
        if post:
            comment = Comment(text=text, commented_by=current_user.id, post_id=post_id)
            db.session.add(comment)
            db.session.commit()
            flash('Comment added successfully', 'success')
        else:
            flash('Post does not exist', 'error')

    # if myposts in request.url:
    return redirect(url_for('read_post', post_id=post_id))


@app.route('/delete_comment/<int:comment_id>', methods=['GET'])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.filter_by(id=comment_id).first()
    
    if not comment:
        flash('Comment does not exist', 'danger')
    elif current_user.id == comment.author and current_user.id == comment.post.author:
        flash('You are not allowed to delete this comment', 'danger')
    else:
        db.session.delete(comment)
        db.session.commit()
    return redirect(url_for('read_post', post_id=comment.post_id))


@app.route('/like_post/<int:post_id>', methods=['POST'])
@login_required
def like_post(post_id):
    post = Post.query.filter_by(id=post_id).first()
    like = Like.query.filter_by(liked_by=current_user.id, post_id=post_id).first()
    
    if not post:
        return jsonify({'error': 'Post does not exist'}, 404)
    elif like:
        db.session.delete(like)
        db.session.commit()
    else:
        like = Like(liked_by=current_user.id, post_id=post_id)
        db.session.add(like)
        db.session.commit()
        
    return jsonify({'likes': len(post.likes), 'liked': current_user.id in map(lambda x: x.liked_by, post.likes)})


@app.route('/user/all_posts')
@login_required
def my_posts():
    posts = Post.query.filter_by(user_id=current_user.id).all()
    return render_template('all_posts.html', posts=posts)


@app.route('/users/<int:user_id>/posts')
@login_required
def users_posts(user_id):
    posts = Post.query.filter_by(user_id=user_id).all()
    return render_template('all_posts.html', posts=posts)