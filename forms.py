from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, NumberRange

class Register(FlaskForm):
  name = StringField('Name', validators=[DataRequired(), Length(min=3, max=30)])
  age = IntegerField('Age', validators=[DataRequired(), NumberRange(min=16, max=99)])
  email = StringField('Email', validators=[DataRequired(), Email()])
  password = StringField('Password', validators=[DataRequired()])
  confirm_password = StringField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
  submit = SubmitField('Sign up')