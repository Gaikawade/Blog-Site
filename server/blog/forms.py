from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Regexp, Length, Email, EqualTo, ValidationError
from blog.models import User, Admin

name_regex = r'^[a-zA-Z]+ ?[a-zA-Z ]*$'

# function to define the class of a field
def form_css(placeholder):
    return {'class': 'form-control', 'placeholder': placeholder}


# Registration Form
class Register(FlaskForm):
    name = StringField(
        'Name',
        validators=[DataRequired(), Length(min=3, max=30), Regexp(name_regex)],
        render_kw=form_css('Name')
    )
    email = StringField(
        'Email',
        validators=[DataRequired(), Email()],
        render_kw=form_css('Email')
    )
    def validate_email(self, email):
        document = User.query.filter_by(email=email.data).first()
        if document:
            raise ValidationError("Email address already registered")
    password = PasswordField(
        'Password',
        validators=[DataRequired()],
        render_kw=form_css('Password')
    )
    confirmPassword = PasswordField(
        'Confirm Password',
        validators=[DataRequired(), EqualTo('password')],
        render_kw=form_css('Confirm Password')
    )
    submit = SubmitField('Sign up')


# Login Form
class Login(FlaskForm):
    email = StringField(
        'Email',
        validators=[DataRequired(), Email()],
        render_kw=form_css('Email')
    )
    password = PasswordField(
        'Password',
        validators=[DataRequired()],
        render_kw=form_css('Password')
    )
    submit = SubmitField('Login')
    remember = BooleanField('Remember Me')



# Account Form for view or update details
class Account(FlaskForm):
    name = StringField(
        'Name',
        validators=[DataRequired(), Length(min=2, max=30), Regexp(name_regex)],
        render_kw=form_css('Name')
    )
    email = StringField(
        'Email',
        validators=[DataRequired(), Email()],
        render_kw=form_css('Email')
    )
    def validate_email(self, email):
      document = User.query.filter_by(email=email.data).count()
      if document > 1:
        raise ValidationError("Email address already registered")
    old_password = PasswordField(
        'Old Password',
        render_kw=form_css('Old Password')
    )
    new_password = PasswordField(
        'New Password',
        render_kw=form_css('New Password')
    )
    confirm_new_password = PasswordField(
        'Confirm New Password',
        validators=[EqualTo('new_password')],
        render_kw=form_css('Confirm New Password')
    )
    
    submit = SubmitField('Update details')


# Posting Article form
class PostForm(FlaskForm):
    title = StringField(
        'Title',
        validators=[DataRequired(), Length(max=120)],
        render_kw=form_css('Title')
    )
    content = TextAreaField(
        'Article Content',
        validators=[DataRequired()],
        render_kw={'class': 'form-control vh-100', 'placeholder': 'Article Content'},
    )
    submit = SubmitField('Post')


# Form for searching operaion
class SearchForm(FlaskForm):
    searched = StringField(
        'q',
        validators=[DataRequired()],
        render_kw=form_css('Search')
    )
    submit = SubmitField(
        'Submit',
        render_kw={'class': 'btn btn-outline-primary'}
    )


# Admin Registration  Form
class AdminRegister(FlaskForm):
    name = StringField(
        'Name',
        validators=[DataRequired(), Length(min=3, max=30), Regexp(name_regex)],
        render_kw=form_css('Name')
    )
    email = StringField(
        'Email',
        validators=[DataRequired(), Email()],
        render_kw=form_css('Email')
    )
    def validate_email(self, email):
        document = Admin.query.filter_by(email=email.data).first()
        if document:
            raise ValidationError("Email address already registered")
    password = PasswordField(
        'Password',
        validators=[DataRequired()],
        render_kw=form_css('Password')
    )
    confirm_password = PasswordField(
        'Confirm Password',
        validators=[DataRequired(), EqualTo('password')],
        render_kw=form_css('Confirm Password')
    )
    submit = SubmitField('Register Admin')


# Admin Login Form
class AdminLogin(FlaskForm):
    email = StringField(
        'Email',
        validators=[DataRequired(), Email()],
        render_kw=form_css('Email')
    )
    password = PasswordField(
        'Password',
        validators=[DataRequired()],
        render_kw=form_css('Password')
    )
    submit = SubmitField('Login')
    remember = BooleanField('Remember Me')