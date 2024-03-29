from flask import request, jsonify
from sqlalchemy import text, or_
from blog.models import add_user, add_admin, User, Post, Comment, Like, Admin
from blog import app, bcrypt, db
from flask_login import login_user, logout_user, current_user, login_required
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import jwt
from datetime import datetime, timedelta


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
@app.route('/', methods=["GET"])
@app.route('/home', methods=["GET"])
def home():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        if page < 1 and per_page < 1:
            return jsonify({'status': False, 'message': 'Invalid page number'}), 400
        offset = (page - 1) * per_page
        posts = Post.query.order_by(Post.id.desc()).limit(per_page).offset(offset)
        posts = [post.to_dict() for post in posts]
        total_posts = Post.query.count()
        return jsonify({'status': True, 'posts': posts, 'total_posts': total_posts}), 200
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Register User API
# Function used to registration end-user for the web application
@app.route('/register', methods=['POST'])
def register():
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    confirm_password = request.json.get('confirmPassword')
    try:
        if password == confirm_password:
            user = User.query.filter_by(email=email).first()
            if user:
                return jsonify({'status': False, 'message': 'Email is already registered.'}), 400
            add_user(name, email, password)
            return jsonify({'status': True, 'message': 'Registration successful'}), 201
        else:
            return jsonify({'status': False, 'message': 'Password mismatch'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


# User Login API
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    remember = request.json.get('remember')
    try:
        document = User.query.filter_by(email=email).first()
        if document and bcrypt.check_password_hash(document.password, password):
            if document.is_blocked == 1:
                return jsonify({'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = create_access_token({
                    'userId': document.id,
                    'isAdmin': check_access()
                }, expires_delta=timedelta(hours=0.5))
                response = jsonify({'status': True, 'message': 'Login successful', 'token': token})
                response.headers['Authorization'] = f'Bearer {token}'
                return response, 200
        else:
            return jsonify({'status': False, 'message': 'Incorrect Email or Password'}), 401
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Logout API
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        logout_user()
        return jsonify({'status': True, 'message': 'Logout successfully' }), 200
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# User Account details and Update Account API
@app.route('/account/<string:user_id>', methods=['GET', 'PUT'])
@jwt_required()
def account(user_id):
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

        elif request.method == 'PUT' and check_access():
            return jsonify({'status': False, 'message': "Access Denied"}), 403

        elif request.method == 'PUT':
            name = request.json.get('name')
            email = request.json.get('email')
            
            if name:
                member.name = name
            if email:
                member.email = email
            db.session.commit()
            result = member.to_dict()
            return jsonify({ 'status': True, 'message': 'Details updated successfully', 'member': result}), 200
    except Exception as e:
        return jsonify({ 'status': False, 'message':str(e) }), 500


# App post API
@app.route('/add_post', methods=['POST'])
@jwt_required()
def add_post():
    try:
        token = get_jwt_identity()
        if token['userId'].startswith('A'):
            return jsonify({'status': False, 'message': 'Access Denied' }), 403
        
        title = request.json.get('title')
        content = request.json.get('content')

        document = Post.query.filter_by(title=title).first()
        if document:
            return jsonify({'status': False, 'message': 'Title should be unique/This title is already exists'}), 400
        author = db.session.get(User, token['userId'])
        post = Post(title=title, content=content, author=author)

        db.session.add(post)
        db.session.commit()

        return jsonify({'status': True, 'message': 'Article added successfully', 'postId': post.id}), 201
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Read post data API
@app.route('/post/<int:post_id>', methods=['GET'])
@jwt_required()
def read_post(post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            return jsonify({ 'status': False, 'message': 'No such post found'}), 404
        post_dict = [post.to_dict()]
        return jsonify({ 'status': True, 'message': 'Post exists', 'post': post_dict}), 200
    except Exception as e:
        return jsonify({ 'stauts': False,'error': str(e)}), 500


# Update post API
@app.route('/post/update/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    try:
        post = db.session.get(Post, post_id)
        if not post:
            return jsonify({'status': False, 'message': 'Not Found'}), 404
        if post.author != current_user:
            return jsonify({'status': False, 'message': 'Unauthorized Access'}), 403

        title = request.json.get('title')
        content = request.json.get('content')
        
        if not title and not content:
            return ({'status': False, 'message': 'Please provide some data to update'}), 400
        
        if title:
            post.title = title
        if content:
            post.content = content

        db.session.commit()

        return jsonify({'status': True, 'message': 'Article updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': False, 'message': str(e)}), 500


# Delete post API
@app.route('/post/delete/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    try:
        post = db.session.get(Post, post_id)
        if not post:
            return jsonify({'status': False, 'message': 'Post not found'}), 404

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
@jwt_required()
def add_comment(post_id):
    try:
        if check_access():
            return jsonify({'status': False, 'message': 'Access denied'}), 403
        text = request.json.get('text')
        commented_by = request.json.get('commented_by')
        
        if not text or not commented_by:
            return jsonify({'status': False, 'message': 'Provide the required data'}), 400

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
@jwt_required()
def delete_comment(comment_id):
    try:
        comment = Comment.query.filter_by(id=comment_id).first()
        if not comment:
            return jsonify({'status': False, 'message': 'Comment not found'}), 404
        if current_user != comment.author and current_user != comment.post.author and not current_user.is_admin:
            return jsonify({'status': False, 'message': 'Unauthorized access'}), 403
        # db.session.delete(comment)
        # db.session.commit()
        return jsonify({'status': True, 'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'stauts': False, 'message': str(e)}), 500


# Likes API - like or unlike the article
@app.route('/like_post/<int:post_id>', methods=['POST'])
@jwt_required()
def like_post(post_id):
    try:
        if check_access():
            return jsonify({'error': 'Access denied', 'likes': len(post.likes)}), 403
        
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            return jsonify({'error': 'Post does not exist'}, 404)
        
        like = Like.query.filter_by(
            liked_by=current_user.id, post_id=post_id).first()

        if like:
            db.session.delete(like)
            db.session.commit()
        else:
            like = Like(liked_by=current_user.id, post_id=post_id)
            db.session.add(like)
            db.session.commit()
        return jsonify({'likes': len(post.likes), 'liked': current_user.id in map(lambda x: x.liked_by, post.likes)})
    except Exception as e:
        db.session.rollback()
        return jsonify({ 'status': False, 'message': str(e)})


# API to get all posts of ramdom users with their user id
@app.route('/user/<string:user_id>/posts', methods=['GET'])
@jwt_required()
def users_posts(user_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    try:
        if page < 1 and per_page < 1:
            return jsonify({'status': False, 'message': 'Invalid page number'}), 400
        
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"status": False, 'message': 'No such user exists'}), 400
        
        offset = (page - 1) * per_page
        posts = Post.query.filter_by(user_id=user_id).order_by(Post.created_at.desc()).limit(per_page).offset(offset)
        posts = [post.to_dict() for post in posts]
        total_posts = Post.query.filter_by(user_id=user_id).count()
        return jsonify({'status': True, 'posts': posts, 'total_posts': total_posts}), 200
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Search API for posts or users
@app.route('/search', methods=['GET'])
@jwt_required()
def search():
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
            
            response = {
                    'status': True,
                    'message': 'Data fetched successfully',
                    'posts': posts,
                    'users': users,
                }
            
            if check_access():
                response['admins'] = admins
            
            return jsonify(response), 200
        except Exception as e:
            return jsonify({ 'status': False, 'message': str(e) }), 500
    else:
        return jsonify({ 'status': False, 'message': 'Please provide a term to perform search operation' }), 400


# Admin Registration API
# Only a admin can register other admins
@app.route('/admin/register', methods=['POST'])
@jwt_required()
def admin_register():
    if not request.get_json():
        return jsonify({'status': False, 'message': 'Please provide data'}), 400
    
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')
    confirm_password = request.json.get('confirmPassword')
    
    try:
        if not check_access():
            return jsonify({'status': False, 'message': 'Access denied'}), 403
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
@app.route('/admin/login', methods=['POST'])
def admin_login():
    if not request.get_json():
        return jsonify({'status': False, 'message': 'Please provide data'}), 400
    
    email = request.json.get('email')
    password = request.json.get('password')
    remember = request.json.get('remember')
    try:
        document = Admin.query.filter_by(email=email).first()
        if document and bcrypt.check_password_hash(document.password, password):
            if document.is_blocked == 1:
                return jsonify({'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                login_user(document, remember=remember)
                token = create_access_token({
                    'userId': document.id,
                    'isAdmin': check_access()
                }, expires_delta=timedelta(hours=0.5))
                return jsonify({'status': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'status': False, 'message': 'Incorrect Email or Password'}), 401
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)}), 500


# Fetch all users API, which is available to admins only
@app.route('/admin/all_users', methods=['GET'])
@jwt_required()
def all_users():
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
@jwt_required()
def all_admins():
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
@jwt_required()
def all_posts():
    if check_access():
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            if page < 1 or per_page < 1:
                return jsonify({'status': False, 'message': 'Invalid page number'}), 400
            offset = (page - 1) * per_page
            posts = Post.query.order_by(Post.created_at.desc()).limit(per_page).offset(offset)
            posts = [post.to_dict() for post in posts]
            total_posts = Post.query.count()
            return jsonify({'status': True, 'posts': posts, 'total_posts': total_posts}), 200
        except Exception as e:
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Access denied'}), 403


# Block/Unblock user API
@app.route('/admin/block_user/<string:user_id>', methods=['PUT'])
@jwt_required()
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
                return jsonify({'status': False, 'message': 'No member found'}), 404
        except Exception as e:
            db.session.rollback()
            return jsonify({'status': False, 'message': str(e)}), 500
    else:
        return jsonify({'status': False, 'message': 'Access denied'}), 403


@app.route('/change_password/<string:user_id>', methods=['POST'])
@jwt_required()
def change_password(user_id):
    member = None
    old_password = request.json.get('oldPassword')
    new_password = request.json.get('newPassword')
    try:
        if user_id.startswith('U'):
            member = User.query.filter_by(id=user_id).first()
        else:
            member = Admin.query.filter_by(id=user_id).first()

        if not member:
            return jsonify({'status': False, 'message': 'No member found'}), 404

        if bcrypt.check_password_hash(member.password, old_password):
            if member.is_blocked == 1:
                return jsonify({'status': False, 'message': 'Your account is blocked, please contact our support team'}), 403
            else:
                password = bcrypt.generate_password_hash(new_password).decode('utf-8')
                member.password = password
                db.session.commit()
                return jsonify({'status': True, 'message': 'Password changed successfully'}), 200
        else:
            return jsonify({'status': False, 'message': 'Wrong Old Password'}), 400
    except Exception as e:
        return jsonify({ 'status': False, 'message': str(e) }), 500