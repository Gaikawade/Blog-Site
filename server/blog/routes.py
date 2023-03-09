from flask import request, jsonify
from sqlalchemy import text, or_
from blog.models import add_user, add_admin, User, Post, Comment, Like, Admin
from blog import app, bcrypt, db
from flask_login import login_required, login_user, logout_user, current_user
import jwt
from datetime import datetime, timedelta
from .auth import token_required


# Function to check whether user is logged in or not
@app.route('/check_login', methods=['GET'])
def check_login():
    if current_user.is_authenticated:
        return jsonify({'status': current_user.is_authenticated, 'userId': current_user.id, 'isAdmin': check_access()})
    else:
        return jsonify({'status': False, 'userId': None, 'isAdmin': False})


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
        posts = [post.to_dict() for post in posts]
        return jsonify({'status': True, 'posts': posts}), 200
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Register User API
# Function used to registration end-user for the web application
@app.route('/register', methods=['POST', 'GET'])
def register():
    try:
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        confirm_password = request.json.get('confirmPassword')
        # validation part
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({'status': False, 'message': 'Email is already registered.'}), 400

        if password == confirm_password:
            add_user(name, email, password)
            return jsonify({'status': True, 'message': 'Registration successful'}), 201
        else:
            return jsonify({'status': False, 'message': 'Password mismatch'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


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
                return jsonify({'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = jwt.encode({
                    'userId': document.id,
                    'isAdmin': check_access(),
                    'exp': datetime.utcnow() + timedelta(minutes=30)
                }, app.config['SECRET_KEY'])
                response = jsonify({'status': True, 'message': 'Login successful', 'token': token})
                response.headers['Authorization'] = f'Bearer {token}'
                return response, 200
        else:
            return jsonify({'status': False, 'message': 'Incorrect Email or Password'}), 401
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Logout API
@app.route('/logout', methods=['POST'])
@token_required
def logout(current):
    try:
        if current:
            logout_user()
            return jsonify({'status': True, 'message': 'Logout successfully', 'user': current.to_dict()}), 200
        else:
            return jsonify({'status': False, 'message': 'Please Login'}), 400
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# User Account details and Update Account API
@app.route('/account/<string:user_id>', methods=['GET', 'PUT'])
@token_required
def account(logged_in_user ,user_id):
    member = ''
    try:
        if user_id.startswith('A'):
            member = Admin.query.filter_by(id=user_id).first()
        else:
            member = User.query.filter_by(id=user_id).first()
        
        if not member:
            return jsonify({'stauts': False, 'message': 'No such member exists '}), 404

        if request.method == 'GET':
            result = member.to_dict()
            return jsonify({
                'status': True,
                'member': result,
                'message': 'Data fetched successfully'
            }), 200

        elif request.method == 'PUT':
            name = request.json.get('name')
            email = request.json.get('email')
            
            member.name = name
            member.email = email
            db.session.commit()
            return jsonify({ 'status': True, 'message': 'Details updated successfully'}), 200
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# App post API
@app.route('/add_post', methods=['POST'])
@token_required
def add_post(logged_in_user):
    try:
        title = request.json.get('title')
        content = request.json.get('content')  # validation

        document = Post.query.filter_by(title=title).first()
        if document:
            return jsonify({'status': False, 'message': 'Title should be unique/This title is already exists'}), 400

        post = Post(title=title, content=content, author=logged_in_user)

        db.session.add(post)
        db.session.commit()

        return jsonify({'status': True, 'message': 'Article added successfully', 'postId': post.id}), 201
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Read post data API
@app.route('/post/<int:post_id>', methods=['GET'])
@token_required
def read_post(logged_in_user, post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            return jsonify({ 'status': False, 'message': 'No such post found'}), 404
        post_dict = post.to_dict()
        return jsonify({ 'status': True, 'message': 'Post exists', 'post': post_dict}), 200
    except Exception as e:
        return jsonify({ 'stauts': False,'error': str(e)})


# Update post API
@app.route('/post/update/<int:post_id>', methods=['PUT'])
@token_required
def update_post(logged_in_user, post_id):
    try:
        post = Post.query.get_or_404(post_id)
        if post.author != current_user:
            return jsonify({'status': False, 'message': 'Unauthorized Access'}), 403

        title = request.json.get('title')
        content = request.json.get('content')
        post.title = title
        post.content = content
        db.session.commit()

        return jsonify({'status': True, 'message': 'Article updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


# Delete post API
@app.route('/post/delete/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(logged_in_user, post_id):
    try:
        post = Post.query.get_or_404(post_id)
        if post.author != current_user and current_user.is_admin != 1:
            return jsonify({'status': False, 'message': 'Access denied'}), 403
        db.session.delete(post)
        db.session.commit()
        return jsonify({'status': True, 'message': 'The article has been deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


# Add comment to post API
@app.route('/add_comment/<int:post_id>', methods=['POST'])
@token_required
def add_comment(logged_in_user, post_id):
    try:
        if check_access() == True:
            return jsonify({'status': False, 'message': 'Access denied'}), 403
        text = request.json.get('text')
        commented_by = request.json.get('commented_by')

        post = Post.query.filter_by(id=post_id).first()
        if post:
            comment = Comment(
                text=text, commented_by=commented_by, post_id=post_id)
            db.session.add(comment)
            db.session.commit()
            return jsonify({'status': True, 'message': 'Comment added successfully'}), 201
        else:
            return jsonify({'status': False, 'message': 'Post does not exist'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


# Delete commment API
@app.route('/delete_comment/<int:comment_id>', methods=['DELETE'])
@token_required
def delete_comment(logged_in_user, comment_id):
    try:
        # Query comment by ID
        comment = Comment.query.filter_by(id=comment_id).first()
        # Check if comment exists
        if not comment:
            return jsonify({'status': False, 'message': 'Comment not found'}), 404
        # Check if user is authorized to delete comment
        if current_user.id == comment.author and current_user.id == comment.post.author:
            # Return error message with status code 403 (forbidden)
            return jsonify({'status': False, 'message': 'Unauthorized access'}), 403
        # Delete comment from database and commit changes
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'status': True, 'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'stauts': False, 'message': str(e)}), 500


# Likes API - like or unlike the article
@app.route('/like_post/<int:post_id>', methods=['POST'])
@token_required
def like_post(logged_in_user, post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        like = Like.query.filter_by(
            liked_by=current_user.id, post_id=post_id).first()

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
        return jsonify({ 'status': False, 'message': str(e)})


# API to get all posts of ramdom users with their user id
@app.route('/user/<string:user_id>/posts', methods=['GET'])
@token_required
def users_posts(logged_in_user ,user_id):
    try:
        # Query all posts by the specified user
        posts = Post.query.filter_by(user_id=user_id).order_by(
            Post.created_at.desc()).all()
        posts = [post.to_dict() for post in posts]
        # Return rendered template with posts
        return jsonify({'status': True, 'posts': posts})
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Search API for posts or users
@app.route('/search', methods=['GET'])
@token_required
def search(logged_in_user):
    q = request.args.get('q')
    posts = Post.query
    users = User.query
    admins = Admin.query
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

            admins= admins.filter(
                or_(Admin.name.like('%' + q + '%'),
                    Admin.email.like('%' + q + '%'))
            ).order_by(text('Admin.name')).all()
            
            posts = [post.to_dict() for post in posts]
            users = [user.to_dict() for user in users]
            admins = [admin.to_dict() for admin in admins]
            
            return jsonify({
                'status': True,
                'message': 'Data fetched successfully',
                'posts': posts,
                'users': users,
                'admins': admins
                })
        except Exception as e:
            return jsonify({ 'status': False, 'message': str(e) })
    else:
        return jsonify({ 'status': Fasle, 'message': 'Please provide a term to perform search operation' })


# Admin Registration API
# Only a admin can register other admins
@app.route('/admin/register', methods=['POST'])
@login_required
def admin_register():
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    confirm_password = request.json.get('confirmPassword')
    # validation part
    try:
        if not check_access():
            return jsonify({'status': False, 'message': 'Access denied'})
        user = Admin.query.filter_by(email=email).first()
        if user:
            return jsonify({'status': False, 'message': 'Email is already registered.'}), 400

        if password == confirm_password:
            add_admin(name, email, password)
            return jsonify({'status': True, 'message': 'Registration successful'}), 201
        else:
            return jsonify({'status': False, 'message': 'Password mismatch'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


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
                return jsonify({'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = jwt.encode({
                    'userId': document.id,
                    'isAdmin': check_access(),
                    'expiration': str(datetime.utcnow() + timedelta(minutes=120))
                }, app.config['SECRET_KEY'])
                return jsonify({'status': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'status': False, 'message': 'Incorrect Email or Password'}), 401
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Fetch all users API, which is available to admins only
@app.route('/admin/all_users', methods=['GET'])
@token_required
def all_users(logged_in_user):
    if check_access():
        try:
            users = User.query.order_by(User.created_at.desc())
            users = [user.to_dict() for user in users]
            return jsonify({'status': True, 'users': users}), 200
        except Exception as e:
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Access denied'}), 403


# Fetch all users API, which is available to admins only
@app.route('/admin/all_admins', methods=['GET'])
@token_required
def all_admins(logged_in_user):
    if check_access():
        try:
            admins = Admin.query.order_by(Admin.created_at.desc())
            admins = [admin.to_dict() for admin in admins]
            return jsonify({'status': True, 'admins': admins}), 200
        except Exception as e:
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Access denied'}), 403


# Fetch all posts API, which is available to admins only
@app.route('/admin/all_posts', methods=['GET'])
@token_required
def all_posts(logged_in_user):
    if check_access():
        try:
            posts = Post.query.order_by(Post.created_at.desc())
            # if not posts:
            #     return jsonify({ 'status': False, 'message': ''})
            posts = [post.to_dict() for post in posts]
            return jsonify({'status': True, 'posts': posts}), 200
        except Exception as e:
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Access denied'}), 403


# Block/Unblock user API
@app.route('/admin/block_user/<string:user_id>', methods=['PUT'])
@login_required
def block_user(user_id):
    if check_access():
        member = None
        try:
            # Query DB with user_id in Admin and User tables
            if user_id.startswith('U'):
                member = User.query.filter_by(id=user_id).first()
            else:
                member = Admin.query.filter_by(id=user_id).first()
            # If user/admin found
            if member:
                if member.is_blocked == False:
                    member.is_blocked = True
                    db.session.commit()
                    return jsonify({'stuatus': True, 'message': 'User blocked successfully', 'operation': 'Blocked'}), 200
                else:
                    member.is_blocked = False
                    db.session.commit()
                    return jsonify({'stuatus': True, 'message': 'User Un-blocked successfully', 'operation': 'Un-Blocked'}), 200
            # if no user/admin found
            else:
                return jsonify({'status': False, 'message': 'No results found'}), 404
        except Exception as e:
            db.session.rollback()
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Unauthorized access'}), 401
