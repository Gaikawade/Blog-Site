# Blogging Site using Flask and SQLAlchemy
This is a simple blogging site built using the Flask web framework and SQLAlchemy ORM. It allows users to create accounts, write blog posts, and view posts written by other users.

## Features
* User authentication and authorization
* Create, edit, and delete blog posts
* View posts written by other users
* Comment on blog posts
* Like blog posts

## Technologies Used
* Flask: A lightweight web framework written in Python
* SQLAlchemy: A Object Relation Mapping (ORM) database
* Flask-Login: User session management
* Flask-WTF: Form validation
* Bootstrap: Front-end framework for responsive design

## Requirements
To run this application, you will need:

* Python 3.6 or higher
* Flask 2.0 or higher
* SQLAlchemy 1.4 or higher

## Create a virtual environment:
```python3 -m venv venv```

## Activate the virtual environment:
`source venv/bin/activate`

## Install the required packages:
`pip install -r requirements.txt`

## Run the application
`py app.py`

Open your web browser and go to **http://localhost:5000.**

## Usage

When you first open the application, you will see the home page. From there, you can:

* Create an account or log in if you already have one
* View blog posts written by other users
* Click on a post to view its details, including comments and likes
* Create a new blog post
* Edit or delete blog posts that you have created
* Add comments to blog posts
* Like blog posts
* For Admin's
    * Register an admin
    * Delete posts and comments
    * Block and Unblock users
