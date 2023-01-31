from flask import render_template
from app import app

from Views import author_views

@app.route('/')
def homepage():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
