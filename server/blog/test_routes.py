import json
import pytest
from blog import app, db

client = app.test_client()

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
        'title': 'New Post Title',
        'content': 'Post content goes here'
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
    