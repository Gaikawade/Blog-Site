from flask import request
from app import app, db
from Models.author_model import Author


@app.route('/create-author', methods=['POST'])
def create_author():
    data = request.get_json()

    new_author = Author(fname=data['fname'], lname=data['lname'],
                        email=data['email'], password=data['password'])
    db.session.add(new_author)
    db.session.commit()
    return 'success', 201

