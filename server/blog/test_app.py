import json
from blog import app

def test_home():
    client = app.test_client()

    # Test with default values for page and per_page
    response = client.get('/')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['status'] == True
    assert len(data['posts']) == 10
    assert data['total_posts'] >= 0

    # Test with custom values for page and per_page
    response = client.get('/?page=2&per_page=5')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200
    assert data['status'] == True
    assert len(data['posts']) == 5
    assert data['total_posts'] >= 0

    # Test with invalid values for page and per_page
    response = client.get('/?page=0&per_page=-1')
    data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 422
    assert data['status'] == False
    assert 'message' in data
