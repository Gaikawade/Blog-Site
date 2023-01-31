from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, NumberRange

class Register(FlaskForm):
  name = StringField('Name', validators=[DataRequired(), Length(min=3, max=30)],
                     render_kw={"class":"form-control", "placeholder":"Name"})
  age = IntegerField('Age', validators=[DataRequired(), NumberRange(min=16, max=99)],
                     render_kw={"class":"form-control", "placeholder":"Age"})
  email = StringField('Email', validators=[DataRequired(), Email()],
                    render_kw={"class":"form-control", "placeholder":"Email"})
  password = StringField('Password', validators=[DataRequired()],
                    render_kw={"class":"form-control", "placeholder":"Password"})
  confirm_password = StringField('Confirm Password', validators=[DataRequired(), EqualTo('password')],
                    render_kw={"class":"form-control", "placeholder":"Confirm Password"})
  submit = SubmitField('Sign up')