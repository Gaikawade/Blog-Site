from flask import request, render_template, flash
from app import app, db
from Models.author_model import Author
import re

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST' and 'first_name' in request.form and 'last_name' in request.form and 'email' in request.form and 'password' in request.form:
        fname = request.form['first_name']
        lname = request.form['last_name']
        email = request.form['email']
        password = request.form['password']

        doc = db.session.query(Author).filter_by(email=email)
        print(doc)
        if doc:
          flash("Email already registered")
          
        new_author = Author(fname=fname, lname=lname, email=email, password=password)
        db.session.add(new_author)
        db.session.commit()
    elif request.method == 'POST':
        flash('Please fill out the following fields')
    return render_template('register.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    return 'login'
