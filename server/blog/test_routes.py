import json
import pytest
from blog import app, db

client = app.test_client()

# default user_id's
user_id = 'U13325696915855394160' # Mahesh
admin_id = 'A11065529445829722718' # Varun

# Function to get Headers after login for user
def get_headers_for_user():
    data = {
        'email': 'mahesh@gmail.com',
        'password': '123456',
        'remember': True
    }
    response = client.post('/login', data=json.dumps(data), content_type='application/json')
    response = json.loads(response.get_data(as_text=True))
    token = response['token']
    headers = {
        'Authorization': f'Bearer {token}',
        'content-type': 'application/json'
    }
    return headers


# Function to get Headers after login for admin
def get_headers_for_admin():
    data = {
        'email': 'varun@adm.co',
        'password': '123456',
        'remember': True
    }
    response = client.post('/admin/login', data=json.dumps(data), content_type='application/json')
    response = json.loads(response.get_data(as_text=True))
    token = response['token']
    headers = {
        'Authorization': f'Bearer {token}',
        'content-type': 'application/json'
    }
    return headers

# Home Page
def test_home():
    # Test with default values for page and per_page
    response = client.get('/')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['status'] == True
    assert len(data['posts']) == 10
    assert data['total_posts'] >= 0

    # Test with custom values for page and per_page
    response = client.get('/home?page=2&per_page=5')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['status'] == True
    assert len(data['posts']) == 5
    assert data['total_posts'] >= 0

    # Test with invalid values for page and per_page
    response = client.get('/home?page=0&per_page=-1')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 400
    assert data['status'] == False
    assert 'message' in data
    

# Registration
def test_register():
    # Test with valid data
    data = {
        'name': 'James',
        'email': 'james@gmail.com',
        'password': 'password',
        'confirmPassword': 'password'
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 201
    assert b'Registration successful' in response.data
    #Test with duplicate email addresses
    data = {
        'name': 'Michel Roy',
        'email': 'michel1@example.com',
        'password': 'password',
        'confirmPassword': 'password'
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400
    assert b'Email is already registered.' in response.data
    # Test with wrong password
    data = {
        'name': 'Michel Roy',
        'email': 'michel1@example.com',
        'password': 'password',
        'confirmPassword': 'wrongpassword'
    }
    response = client.post('/register', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 400
    assert b'Password mismatch' in response.data


# Login    
def test_login():
    # Test with valid credentials
    data = {
        'email': 'mahesh@gmail.com',
        'password': '123456',
        'remember': True
    }
    response = client.post('/login', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 200
    assert b'Login successful' in response.data
    assert b'token' in response.data
    
    # Test with invalid credentials
    data = {
        'email': 'mahesh@gmail.com',
        'password': '1234585'
    }
    response = client.post('/login', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 401
    assert b'Incorrect Email or Password' in response.data
    assert b'token' not in response.data
    
    # Test for blocked user
    data = {
        'email': 'sun@gmail.com',
        'password': '123456'
    }
    response = client.post('/login', data=json.dumps(data), content_type='application/json')
    assert response.status_code == 403
    assert b'Your account is blocked' in response.data
    assert b'token' not in response.data


# Logout
def test_logout():
    # Test with successful login and with headers
    response = client.post('/logout', headers=get_headers_for_user())
    assert response.status_code == 200
    assert b'Logout successfully' in response.data
    # Test without headers
    response = client.post('/logout')
    assert response.status_code == 401
    assert b'Missing Authorization Header' in response.data


# Get Account details
def test_account_get_method():
    # Existing user
    response = client.get(f'/account/{user_id}', headers=get_headers_for_user())
    assert response.status_code == 200
    assert b'message' and b'member' in response.data
    # Non-Existing User
    response = client.get(f'/account/{user_id}1', headers=get_headers_for_user())
    assert response.status_code == 404
    assert b'No such member exists' in response.data
    # Without headers
    response = client.get(f'/account/{user_id}')
    assert response.status_code == 401
    assert b'Missing Authorization Header' in response.data
    # Existing Admin
    response = client.get(f'/account/{admin_id}', headers=get_headers_for_admin())
    assert response.status_code == 200
    assert b'message' and b'member' in response.data
    # Non-Existing User
    response = client.get(f'/account/{admin_id}1', headers=get_headers_for_admin())
    assert response.status_code == 404
    assert b'No such member exists' in response.data
    # Without headers
    response = client.get(f'/account/{admin_id}')
    assert response.status_code == 401
    assert b'Missing Authorization Header' in response.data
    

# Update account details
def test_account_put_method():
    # update account details - author
    admin_data = {
        'name': 'Varun K'
    }
    response = client.put(f'/account/{admin_id}', data=json.dumps(admin_data), headers=get_headers_for_admin())
    assert response.status_code == 403
    assert b'Access Denied' in response.data
    # update account details - user
    user_data = {
        'name': 'Mahesh KR'
    }
    response = client.put(f'/account/{user_id}', data=json.dumps(user_data), headers=get_headers_for_user())
    assert response.status_code == 200
    assert b'Details updated successfully' in response.data
    # update account details without headers - user
    user_data = {
        'name': 'Mahesh KR'
    }
    response = client.put(f'/account/{user_id}', data=json.dumps(user_data))
    assert response.status_code == 401
    assert b'Missing Authorization Header' in response.data
    

# Add Post
def test_add_post():
    # valid data
    data = {
        'title': 'Unit Testing I',
        'content': 'Hello there, these are some test cases for flask backend' 
    }
    response = client.post('/add_post', data=json.dumps(data), headers=get_headers_for_user())
    assert response.status_code == 201
    assert b'message' and b'postId' in response.data
    
    # duplicate title
    data = {
        'title': 'Post Title',
        'content': 'Post content goes here'
    }
    response = client.post('/add_post', data=json.dumps(data), headers=get_headers_for_user())
    assert response.status_code == 400
    assert b'Title should be unique' in response.data
    
    # Add Post by Admin
    data = {
        'title': 'Post Title',
        'content': 'Post content goes here'
    }
    response = client.post('/add_post', data=json.dumps(data), headers=get_headers_for_admin())
    assert response.status_code == 403
    assert b'Access Denied' in response.data
    
    # Without passing Header
    response = client.post('/add_post', data=json.dumps(data))
    assert response.status_code == 401
    assert b'Missing Authorization Header' in response.data


# Read Post
def test_read_post():
    # With a random post id - User
    response = client.get('/post/2', headers=get_headers_for_user())
    json_response = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert len(json_response['post']) == 1
    
    # With a random post id - Admin
    response = client.get('/post/2', headers=get_headers_for_admin())
    json_response = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert len(json_response['post']) == 1
    
    # With invalid post id - User
    response = client.get('/post/post_id', headers=get_headers_for_user())
    assert response.status_code == 404
    assert b'Not Found' in response.data
    
    # With invalid post id - Admin
    response = client.get('/post/post_id', headers=get_headers_for_admin())
    assert response.status_code == 404
    assert b'Not Found' in response.data
    
    # Without headers
    response = client.get('/post/2')
    assert response.status_code == 401
    assert b'Missing Authorization' in response.data


# Update Post
def test_update_post():
    data = {
        'content': 'updated content, done by using update_post API, PUT method'
    }
    # User updating his own post
    response = client.put('/post/update/44', data=json.dumps(data), headers=get_headers_for_user())
    assert response.status_code == 200
    assert b'Article updated' in response.data
    
    # user updating another user's post
    response = client.put('/post/update/12', data=json.dumps(data), headers=get_headers_for_user())
    assert response.status_code == 403
    assert b'Unauthorized Access' in response.data
    
    # Updating post by Admin
    response = client.put('/post/update/44', data=json.dumps(data), headers=get_headers_for_admin())
    assert response.status_code == 403
    assert b'Unauthorized Access' in response.data

    # post id not exists
    response = client.put('/post/update/postid', data=json.dumps(data), headers=get_headers_for_user())
    assert response.status_code == 404
    assert b'Not Found' in response.data


# Delete Post
def test_delete_post():
    # authorized user
    response = client.delete('/post/delete/44', headers=get_headers_for_user())
    assert response.status_code == 200
    assert b'deleted successfully' in response.data
    
    # Admin
    response = client.delete('/post/delete/44', headers=get_headers_for_admin())
    assert response.status_code == 200
    assert b'deleted successfully' in response.data  
    
    # unauthorized user
    response = client.delete('/post/delete/2', headers=get_headers_for_user())
    assert response.status_code == 403
    assert b'Access denied' in response.data
    
    # Without headers
    response = client.delete('/post/delete/44')
    assert response.status_code == 401
    assert b'Missing Authorization' in response.data
    
    # Post id not exists
    response = client.delete('/post/delete/postid', headers=get_headers_for_admin())
    assert response.status_code == 404
    assert b'Not Found' in response.data