from flask import render_template, redirect, url_for, flash, request, abort, jsonify, Response
from sqlalchemy import text
from blog.forms import Register, Login, Account, PostForm, SearchForm, AdminRegister, AdminLogin
from blog.models import add_user, add_admin, User, Post, Comment, Like, Admin
from blog import app, bcrypt, db
from flask_login import login_required, login_user, logout_user, current_user


def check_access():
    if current_user.is_admin == True:
        return True
    else:
        return False

@app.route('/')
@app.route('/home')
def home():
    try:
        # Query the database for all posts and order them by creation time
        posts = Post.query.order_by(-Post.created_at).all()
        # If the query is successful, render the home template with the posts
        return render_template('home.html', title='HomePage', posts=posts)
    except Exception as e:
        # If an error occurs during the query, log the error and return a 500 Internal Server Error response
        flash(f'Error quering database: {str(e)}', 'danger')
        return abort(500)


@app.route('/about')
def about():
    return render_template('about.html', title='AboutPage')


# Register User API
@app.route('/register', methods=['POST', 'GET'])
def register():
    try: 
        # Create a new instance of the Register form
        form = Register()
        # Validate the form data and add the user to the database if valid
        if form.validate_on_submit():
            add_user(form)
            flash('Registration successful', 'success')
            return redirect(url_for('login'), 301)
    except Exception as e:
        # If an error occurs during the registration process, log the error and return a 500 Internal Server Error response
        flash(f'Error registering user: {str(e)}', 'danger')
        return abort(500)
    # If the form is not valid or the registration process fails, render the register template with the form
    return render_template('register.html', title='RegisterPage', form=form)


# User Login API
@app.route('/login', methods=['POST', 'GET'])
def login():
    try:
        form = Login()
        if form.validate_on_submit():
            document = User.query.filter_by(email=form.email.data).first()
            if document and bcrypt.check_password_hash(document.password, form.password.data):
                if document.is_blocked == 1:
                    flash('Your account is blocked, please contact our support', 'danger')
                else:
                    login_user(document, remember=form.remember.data)
                    flash('Login successful', 'success')
                    return redirect(url_for('home'), 301)
            else:
                flash('Incorrect Email or Password', 'danger')
                return redirect(url_for('login'), 301)
        return render_template('login.html', title='Login Page', form=form), 200
    except Exception as e:
        flash('Error logging in', 'danger')
        return abort(500)


@app.route('/add_post', methods=['POST', 'GET'])
@login_required
def add_post():
    try:
        if check_access() == True:
            return render_template('access_error.html')
        form = PostForm()
        # Check if the form is submitted and valid
        if form.validate_on_submit():
            # Create a new post instance and add it to the database
            post = Post(title=form.title.data, content=form.content.data, author=current_user)
            db.session.add(post)
            print(len(current_user.id))
            db.session.commit()
            # Display a success message and redirect to home page
            flash('Post added successfully', 'success')
            return redirect(url_for('home'), 301)
    except Exception as e:
        # If an error occurs during the post creation process, log the error and return a 500 Internal Server Error response
        flash('Error adding post', 'danger')
        return abort(500)
    # Render the add/update post template with the post form
    return render_template('add_update_post.html', title='Add Post', form=form, type='post')


@app.route('/post/<int:post_id>', methods=['GET'])
@login_required
def read_post(post_id):
    try:
        post = Post.query.filter_by(id=post_id).first()
        if not post:
            # create not found page and render
            return 'None'
        return render_template('read_post.html', title='Read Post', post=post), 200
    except Exception as e:
        flash(f'There was an error reading this post {e}', 'danger')
        return redirect(url_for('home'),301)


@app.route('/logout')
@login_required
def logout():
    try:
        if current_user.is_authenticated:
            logout_user()
            flash('Successfully logged out', 'success')
            return redirect(url_for('home'), 301)
    except Exception as e:
        flash('Error logging out','danger')
    # If the user is not authenticated, redirect to the login page with a status code of 400
    return redirect(url_for('login'), 301)


@app.route('/account', methods=['POST', 'GET'])
@login_required 
def account():
    try:
        if check_access():
            return render_template('access_error.html')
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
            db.session.commit()
            flash('Your account details have been updated', 'success')
            return redirect(url_for('account'), 301)
    except Exception as e:
        flash('Error updating your account details', 'danger')
    # Render the account.html template with the Account form
    return render_template('account.html', title='Account', form=form), 400


@app.route('/post/update/<int:post_id>', methods=['POST', "GET"])
@login_required
def update_post(post_id):
    try:
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
            return redirect(url_for('read_post', post_id=post.id), 301)
        return render_template('add_update_post.html', title=post.title, form=form, type='update'), 200
    except Exception as e:
        flash('Error updating the article', 'danger')
        return redirect(url_for('home')), 500


@app.route('/post/delete/<int:post_id>', methods=['POST'])
@login_required
def delete_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        if post.author != current_user and current_user.is_admin != 1:
            abort(403)
        db.session.delete(post)
        db.session.commit()
        flash('The article has been deleted', 'success')
        return redirect(url_for('home'))
    except Exception as e:
        flash('Error updating the article', 'danger')
        return render_template('500_error.html',)


@app.route('/add_comment/<int:post_id>', methods=['POST'])
@login_required
def add_comment(post_id):
    try:
        if check_access() == True:
            return render_template('access_error.html')
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
        flash('Error in posting a comment', 'danger')
        return e


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
            return redirect(url_for('read_post', post_id=comment.post_id), 301), 403
        # Delete comment from database and commit changes
        db.session.delete(comment)
        db.session.commit()
        # Return success message with status code 200 (OK)
        flash('Comment deleted successfully', 'success'), 200
        return redirect(url_for('read_post', post_id=comment.post_id), 301)
    except Exception as e:
        # Return error message with status code 500
        flash('Something went wrong')
        return redirect(url_for('read_post', post_id=comment.post.id)), 500


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
        return jsonify({'likes': len(post.likes), 'liked': current_user.id in map(lambda x: x.liked_by, post.likes)}), 200
    except Exception as e:
        # Return error message with status code 500 (internal server error)
        return render_template('500_error.html'), 500



@app.route('/user/all_posts')
@login_required
def my_posts():
    try:
        # Query all posts by the current user
        posts = Post.query.filter_by(user_id=current_user.id).all()
        # Return rendered template with posts
        return render_template('all_posts.html', posts=posts)
    except Exception as e:
        # Return error message with status code 500
        return jsonify({'error': f'{str(e)}'}), 500


@app.route('/users/<string:user_id>/posts')
@login_required
def users_posts(user_id):
    try:
        # Query all posts by the specified user
        posts = Post.query.filter_by(user_id=user_id).all()
        # Return rendered template with posts
        return render_template(url_for('all_posts.html', posts=posts), 301)
    except Exception as e:
        # Return error message with status code 500
        return jsonify({'error': f'{str(e)}'}), 500


# Context processors(decorator) allow you to inject variables into the context of all templates (from layout.html to search.html) to access the search parameters
@app.context_processor
def base():
    # Create a new instance of the SearchForm class
    form = SearchForm()
    # Add the form to the template context as a variable named 'form'
    return dict(form=form)


@app.route('/search', methods=['POST'])
@login_required
def search():
    search_form = SearchForm()
    posts = Post.query
    users= User.query
    if search_form.validate_on_submit():
        try:
            searched = search_form.searched.data
            posts = posts.filter(Post.content.like('%' + searched + '%')).order_by(text('Post.title')).all()
            users = users.filter(User.name.like('%' + searched + '%')).order_by(text('User.name')).all()
            return render_template('search.html', users=users, posts=posts, searched=searched, search_form=search_form)
        except Exception as e:
            return render_template('500_error.html')
    else:
        flash('Invalid Data for search term', 'danger')
        return redirect(url_for('home'))


@app.route('/admin/register', methods=['POST', 'GET'])
@login_required
def admin_register():
    form = AdminRegister()
    if form.validate_on_submit():
        try:
            add_admin(form)
            flash('Registration Successful', 'success')
            return redirect(url_for('home'), 301)
        except Exception as e:
            flash('Registration Failed', 'danger')
            return redirect(url_for('admin_register'), 301)
    else:
        # render the registration form for a GET request
        return render_template('register.html', title='Registration Page', form=form)


@app.route('/admin/login', methods=['POST', 'GET'])
def admin_login():
    form = AdminLogin()
    if form.validate_on_submit():
        try:
            document = Admin.query.filter_by(email=form.email.data).first()
            if document and bcrypt.check_password_hash(document.password, form.password.data):
                login_user(document, remember=form.remember.data)
                flash('Login successful', 'success')
                return redirect(url_for('home'), 301)
            else:
                flash('Incorrect Email or Password', 'danger')
                return redirect(url_for('admin_login'), 301)
        except Exception as e:
            flash('Login Failed', 'danger')
            return redirect(url_for('admin_login'), 301)
    return render_template('login.html', form=form, title='Admin Login Page')


@app.route('/admin/all_users', methods=['GET'])
@login_required
def all_users():
    try:
        if current_user.is_admin == True:
            users = User.query.all()
            return render_template('users_and_posts.html', users=users), 200
        else:
            return redirect(url_for('home'), 301)
    except Exception as e:
            flash('Failed to fetch data', 'danger')
            return render_template('500_error.html')


@app.route('/admin/all_posts', methods=['GET'])
@login_required
def all_posts():
    if current_user.is_admin == True:
        try:
            posts = Post.query.all()
            return render_template('users_and_posts.html', posts=posts)
        except Exception as e:
            flash('Failed to fetch data', 'danger')
            return render_template('500_error.html')
    else:
        return redirect(url_for('home'), 301)


@app.route('/admin/block_user/<string:user_id>', methods=['POST'])
@login_required
def block_user(user_id):
    try:
        if current_user.is_admin == True:
            user = User.query.filter_by(id=user_id).first()
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
            else:
                return render_template('404_error.html'), 404
        else:
            flash('Unauthorized access', 'danger')
            return redirect(url_for('home'), 301)
    except Exception as e:
            flash('Failed to block/unblock user', 'danger')
            return render_template('500_error.html')