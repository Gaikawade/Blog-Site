from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Regexp, Length, Email, EqualTo, ValidationError
from blog.models import User, Admin

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
      document = User.query.filter_by(email=email.data).count()
      if document > 1:
        raise ValidationError("Email address already registered")
    submit = SubmitField('Update details')

class PostForm(FlaskForm):
    title = StringField(
        'Title',
        validators=[DataRequired(), Length(max=120)],
        render_kw=form_css('Title')
    )
    content = TextAreaField(
        'Article Content',
        validators=[DataRequired()],
        render_kw=form_css('Article Content') #Add row for larger text area
    )
    submit = SubmitField('Post')


class SearchForm(FlaskForm):
    searched = StringField(
        'Searched',
        validators=[DataRequired()],
        render_kw=form_css('Search')
    )
    submit = SubmitField(
        'Submit',
        render_kw={'class': 'btn btn-outline-primary'}
    )


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