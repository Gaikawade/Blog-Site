# Importing all required modules
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from dotenv import load_dotenv
import os

load_dotenv()

# creating a new instance of Flask
app = Flask(__name__)

#The secret key is used to sign cookies and other sensitive data
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
# This variable tells SQLAlchemy how to connect to the app's database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
# This variable tells SQLAlchemy whether to track modifications to the app's database models
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('TRACK_MODIFICATION')

db = SQLAlchemy(app)

bcrypt = Bcrypt(app)
# LoginManager object is used to handle user authentication
# Creating a new LoginManager instance which assiciates with Flask instance 'app'
login_manager = LoginManager(app)
# set the login_view attribute of the LoginManager instance to the name of the view function which handles user logins
login_manager.login_view = 'login'
# This line sets the message that will be displayed to the user when they try to access a protected page without being logged in
login_manager.login_message = 'Please Login!'
# sets the category of the falsh messages that will be displayed to user
login_manager.login_message_category = 'warning'

# importing routes
from blog import routes