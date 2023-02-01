from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Regexp, Length, Email, EqualTo, ValidationError
from blog.models import User

name_regex = r'^[a-zA-Z]+ ?[a-zA-Z ]*$'

def form_css(placeholder):
    return {'class': 'form-control', 'placeholder': placeholder}

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
    
    confirm_password = PasswordField(
        'Confirm Password',
        validators=[DataRequired(), EqualTo('password')],
        render_kw=form_css('Confirm Password')
    )
    
    submit = SubmitField('Sign up')


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


class Account(FlaskForm):
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
    
    submit = SubmitField('Update details')
    