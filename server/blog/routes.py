from flask import render_template, redirect, url_for, flash, request, jsonify
from sqlalchemy import text, or_
from blog.forms import Register, Login, Account, PostForm, SearchForm, AdminRegister, AdminLogin
from blog.models import add_user, add_admin, User, Post, Comment, Like, Admin
from blog import app, bcrypt, db
from flask_login import login_required, login_user, logout_user, current_user
import jwt
from datetime import datetime, timedelta


# Function to check whether user is logged in or not
@app.route('/check_login', methods=['GET'])
def check_login():
    if current_user.is_authenticated:
        return jsonify({ 'status': current_user.is_authenticated, 'userId': current_user.id, 'is_admin': check_access() })
    else:
        return jsonify({ 'status': False, 'userId': None })


# Function to check weather the logged in user is admin or not
# By checking 'is_admin' attribute and its value
def check_access():
    if hasattr(current_user, 'is_admin') and current_user.is_admin == True:
        return True
    else:
        return False


# Home page of the web app
# Showing all the posts in home page
@app.route('/')
@app.route('/home')
def home():
    try:
        posts = Post.query.order_by(Post.id.desc())
        post_list = []
        for post in posts:
            post_dict = {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': post.author.name,
                'created_at': post.created_at,
                'user_id': post.user_id
            }
            post_list.append(post_dict)
        return jsonify(post_list), 200
    except Exception as e:
        return jsonify({ 'status': False, 'message': str(e) }), 500


# Register User API
# Function used to registration end-user for the web application
@app.route('/register', methods=['POST', 'GET'])
def register():
    try:
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        confirm_password = request.json.get('confirmPassword')
        #validation part
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({ 'status': False, 'message': 'Email is already registered.'}), 400
        
        if password == confirm_password:
            add_user(name, email, password)
            return jsonify({ 'status': True, 'message': 'Registration successful' }), 201
        else:
            return jsonify({ 'status': False, 'message': 'Password mismatch' }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({ 'status': False, 'message': str(e) }), 500


# User Login API
@app.route('/login', methods=['POST', 'GET'])
def login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        remember = request.json.get('remember')

        document = User.query.filter_by(email=email).first()
        if document and bcrypt.check_password_hash(document.password, password):
            if document.is_blocked == 1:
                return jsonify({ 'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = jwt.encode({
                    'userId': document.id,
                    'admin': check_access(),
                    'expiration': str(datetime.utcnow() + timedelta(minutes=120))
                }, app.config['SECRET_KEY'])
                return jsonify({ 'status': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({ 'status': False, 'message': 'Incorrect Email or Password' }), 401
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# Logout API
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        if current_user.is_authenticated:
            logout_user()
            return jsonify({ 'status': True, 'message': 'Logout successfully'} ), 200
        else:
            return jsonify({ 'status': False, 'message': 'Please Login'}), 400
    except Exception as e:
        return jsonify({ 'status': False, 'message': str(e) }), 500


# User Account details and Update Account API
@app.route('/account', methods=['POST', 'GET'])
@login_required
def account():
    try:
        # Create an instance of the Account form
        form = Account()
        # Prepopulate the form fields with the user's current details
        if request.method == 'GET':
            form.name.data = current_user.name
            form.email.data = current_user.email
        # Update the user's account details if the form is submitted and validated
        elif form.validate_on_submit():
            current_user.name = form.name.data
            current_user.email = form.email.data
            if form.old_password.data:
                if bcrypt.check_password_hash(current_user.password, form.old_password.data):
                    current_user.password = bcrypt.generate_password_hash(form.new_password.data)
                else:
                    flash('Password does not match', 'danger')
                    return render_template('account.html', title='Account', form=form)
            if current_user.name == form.name.data and current_user.email == form.email.data:
                flash('No changes were made', 'danger')
                return render_template('account.html', title='Account', form=form)
            db.session.commit()
            flash('Your account details have been updated', 'success')
            return redirect(url_for('account'), 301)
    except Exception as e:
        db.session.rollback()
        flash('Error updating your account details', 'danger')
        return render_template('500_error.html', title='Internal Server Error')
    return render_template('account.html', title='Account', form=form)


# App post API
@app.route('/add_post', methods=['POST', 'GET'])
@login_required
def add_post():
    try:
        title = request.json.get('title')
        content = request.json.get('content') #validation

        document = Post.query.filter_by(title=title).first()
        if document:
            return jsonify({ 'status': False, 'message': 'Title should be unique/This title is already exists' })

        post = Post(title=title, content=content, author=current_user)

        db.session.add(post)
        db.session.commit()

        return jsonify({ 'status': True, 'message': 'Article added successfully' }), 201
    except Exception as e:
        return jsonify({ 'status': False, 'message': str(e) }), 500


# Read post data API
@app.route('/post/<int:post_id>', methods=['GET'])
# @login_required
def read_post(post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            return jsonify({ 'message': 'No such post found'} ), 404
        post_dict = post.to_dict()
        return jsonify({ 'message': 'Post exists', 'post': post_dict} ), 200
    except Exception as e:
        return jsonify({ 'error': str(e) })


# Update post API
@app.route('/post/update/<int:post_id>', methods=['POST', "GET"])
@login_required
def update_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        if post.author != current_user:
            return render_template('403_error.html', title='Unauthorized')
        form = PostForm()
        if request.method == 'GET':
            form.title.data = post.title
            form.content.data = post.content
        elif request.method == 'POST':
            post.title = form.title.data
            post.content = form.content.data
            db.session.commit()
            flash('The Article has been updated', 'success')
            return redirect(url_for('read_post', post_id=post.id), 301)
        return render_template('add_update_post.html', title=post.title, form=form, type='update')
    except Exception as e:
        db.session.rollback()
        flash('Error updating the article', 'danger')
        return redirect(url_for('home')), 500


# Delete post API
@app.route('/post/delete/<int:post_id>', methods=['POST'])
@login_required
def delete_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        if post.author != current_user and current_user.is_admin != 1:
            return render_template('403_error.html', title='Unauthorized')
        db.session.delete(post)
        db.session.commit()
        flash('The article has been deleted', 'success')
        return redirect(url_for('home'))
    except Exception as e:
        db.session.rollback()
        flash('Error updating the article', 'danger')
        return render_template('500_error.html',)


# Add comment to post API
@app.route('/add_comment/<int:post_id>', methods=['POST'])
@login_required
def add_comment(post_id):
    try:
        if check_access() == True:
            return render_template('403_error.html')
        text = request.form.get('text')
        if not text:
            flash('Comment cannot be empty', 'danger')
            return redirect(url_for('read_post', post_id=post_id), 301)
        post = Post.query.filter_by(id=post_id).first()
        if post:
            comment = Comment(text=text, commented_by=current_user.id, post_id=post_id)
            db.session.add(comment)
            db.session.commit()
            flash('Comment added successfully', 'success')
            return redirect(url_for('read_post', post_id=post_id), 301)
        else:
            flash('Post does not exist', 'error')
            return redirect(url_for('read_post', post_id=post_id), 301)
    except Exception as e:
        db.session.rollback()
        return render_template('500_error.html', title='Server error')


# Delete commment API
@app.route('/delete_comment/<int:comment_id>', methods=['POST'])
@login_required
def delete_comment(comment_id):
    try:
        # Query comment by ID
        comment = Comment.query.filter_by(id=comment_id).first()
        # Check if comment exists
        if not comment:
            # Return error message with status code 404
            flash('Comment does not exist', 'danger')
            return redirect(url_for('read_post', post_id=comment.post_id), 301)
        # Check if user is authorized to delete comment
        if current_user.id == comment.author and current_user.id == comment.post.author:
            # Return error message with status code 403 (forbidden)
            flash('You are not allowed to delete this comment', 'danger')
            return redirect(url_for('read_post', post_id=comment.post_id), 301)
        # Delete comment from database and commit changes
        db.session.delete(comment)
        db.session.commit()
        flash('Comment deleted successfully', 'success')
        return redirect(url_for('read_post', post_id=comment.post_id), 301)
    except Exception as e:
        db.session.rollback()
        flash('Something went wrong')
        return redirect(url_for('read_post', post_id=comment.post.id)), 500


# Likes API - like or unlike the article
@app.route('/like_post/<int:post_id>', methods=['POST'])
@login_required
def like_post(post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        like = Like.query.filter_by(liked_by=current_user.id, post_id=post_id).first()

        if check_access():
            return jsonify({'error': 'Access denied', 'likes': len(post.likes)})
        # Check if post exists
        if not post:
            # Return error message with status code 404
            return jsonify({'error': 'Post does not exist'}, 404)
        # Check if user has already liked the post
        if like:
            # Unlike post and commit changes to database
            db.session.delete(like)
            db.session.commit()
        else:
            # Like post and commit changes to database
            like = Like(liked_by=current_user.id, post_id=post_id)
            db.session.add(like)
            db.session.commit()
        # Return updated like count and whether user has liked the post
        return jsonify({'likes': len(post.likes), 'liked': current_user.id in map(lambda x: x.liked_by, post.likes)})
    except Exception as e:
        db.session.rollback()
        return render_template('500_error.html')


# API to get all the posts of logged in users
@app.route('/user/all_posts', methods=['GET'])
@login_required
def my_posts():
    try:
        # Query all posts by the current user
        posts = Post.query.filter_by(user_id=current_user.id).all()
        # Return rendered template with posts
        return render_template('all_posts.html', posts=posts)
    except Exception as e:
        return render_template('500_error.html', title='Server error')


# API to get all posts of other users
@app.route('/users/<string:user_id>/posts', methods=['GET'])
@login_required
def users_posts(user_id):
    try:
        # Query all posts by the specified user
        posts = Post.query.filter_by(user_id=user_id).all()
        # Return rendered template with posts
        return render_template(url_for('all_posts.html', posts=posts), 301)
    except Exception as e:
        return render_tamplate('500_error.html')



# Search API for posts or users
@app.route('/search', methods=['GET'])
@login_required
def search():
    q = request.args.get('q')
    posts = Post.query
    users= User.query
    if q:
        try:
            posts = posts.filter(
                or_(Post.content.like('%' + q + '%'),
                Post.title.like('%' + q + '%'))
            ).order_by(text('Post.title')).all()

            users = users.filter(
                or_(User.name.like('%' + q + '%'),
                User.email.like('%' + q + '%'))
            ).order_by(text('User.name')).all()

            return render_template('search.html', users=users, posts=posts, q=q)
        except Exception as e:
            return render_template('500_error.html')
    else:
        flash('Invalid Data for search', 'danger')
        return redirect(url_for('home'))


# Admin Registration API
# Only a admin can register other admins
@app.route('/admin/register', methods=['POST'])
@login_required
def admin_register():
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    confirm_password = request.json.get('confirmPassword')
    #validation part
    try:
        if not check_access():
            return jsonify({'status': False, 'message': 'Access denied'})
        user = Admin.query.filter_by(email=email).first()
        if user:
            return jsonify({ 'status': False, 'message': 'Email is already registered.'}), 400
        
        if password == confirm_password:
            add_admin(name, email, password)
            return jsonify({ 'status': True, 'message': 'Registration successful' }), 201
        else:
            return jsonify({ 'status': False, 'message': 'Password mismatch' }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({ 'status': False, 'message': str(e) }), 500


# Admin login API
@app.route('/admin/login', methods=['POST', 'GET'])
def admin_login():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        remember = request.json.get('remember')

        document = Admin.query.filter_by(email=email).first()
        if document and bcrypt.check_password_hash(document.password, password):
            if document.is_blocked == 1:
                return jsonify({ 'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = jwt.encode({
                    'userId': document.id,
                    'admin': check_access(),
                    'expiration': str(datetime.utcnow() + timedelta(minutes=120))
                }, app.config['SECRET_KEY'])
                return jsonify({ 'status': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({ 'status': False, 'message': 'Incorrect Email or Password' }), 401
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# Fetch all users API, which is available to admins only
@app.route('/admin/all_users', methods=['GET'])
@login_required
def all_users():
    try:
        if check_access():
            users = User.query.all()
            users = [user.to_dict() for user in users]
            return jsonify({'status': True, 'users': users})
        else:
            return jsonify({ 'status': False, 'message': 'Access denied' })
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# Fetch all users API, which is available to admins only
@app.route('/admin/all_admins', methods=['GET'])
@login_required
def all_admins():
    try:
        if check_access():
            admins = Admin.query.all()
            admins = [admin.to_dict() for admin in admins]
            return jsonify({'status': True, 'admins': admins})
        else:
            return jsonify({ 'status': False, 'message': 'Access denied' })
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# Fetch all posts API, which is available to admins only
@app.route('/admin/all_posts', methods=['GET'])
@login_required
def all_posts():
    if check_access():
        try:
            posts = Post.query.all()
            posts = [post.to_dict() for post in posts]
            return jsonify({'status': True, 'posts': posts})
        except Exception as e:
            return jsonify({ 'status': False, 'message':str(e) }), 500
    else:
        return redirect(url_for('home'), 301)


# Block/Unblock user API
@app.route('/admin/block_user/<string:user_id>', methods=['POST'])
@login_required
def block_user(user_id):
    if check_access():
        try:
            user = User.query.filter_by(id=user_id).first()
            admin = Admin.query.filter_by(id=user_id).first()
            if user:
                if user.is_blocked == False:
                    user.is_blocked = True
                    db.session.commit()
                    flash('User blocked successfully', 'success')
                    return redirect(url_for('home'))
                else:
                    user.is_blocked = False
                    db.session.commit()
                    flash('User unblocked successfully', 'success')
                    return redirect(url_for('home'))
            elif admin:
                if admin.is_blocked == False:
                    admin.is_blocked = True
                    db.session.commit()
                    flash('User blocked successfully', 'success')
                    return redirect(url_for('home'))
                else:
                    admin.is_blocked = False
                    db.session.commit()
                    flash('User unblocked successfully', 'success')
                    return redirect(url_for('home'))
            else:
                return render_template('404_error.html'), 404
        except Exception as e:
            db.session.rollback()
            flash('Failed to block/unblock user', 'danger')
            return render_template('500_error.html')
    else:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('home'), 301)
