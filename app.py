from flask import Flask, render_template, url_for, redirect
from forms import Register

app = Flask(__name__)
app.config['SECRET_KEY'] = '897ry8fu76y7u3d@j#4rfr&'

@app.route('/')
@app.route('/home')
def home():
  return render_template('home.html', title='HomePage')

@app.route('/about')
def about():
  return render_template('about.html', title='AboutPage')

@app.route('/register', methods=['POST', 'GET'])
def register():
  form = Register()
  if form.validate_on_submit():
    return redirect(url_for('home'))
  return render_template('register.html', title='RegisterPage', form=form)

if __name__ == '__main__':
  app.run(debug=True)