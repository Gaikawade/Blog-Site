from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:mahesh123@localhost/flask'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Author(db.Model):
  __tablename__ = 'author'
  author_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  fname = db.Column(db.String(255), nullable=False)
  lname = db.Column(db.String(255), nullable=False)
  email = db.Column(db.String(255), unique=True, nullable=False)
  password = db.Column(db.String(255), nullable=False)
  created_at = db.Column(db.DateTime, nullable=False)

  def __init__(self, **kwargs):
    self.fname = kwargs.get('fname')
    self.lname = kwargs.get('lname')
    self.email = kwargs.get('email')
    self.password = kwargs.get('password')
    self.created_at = datetime.now(pytz.timezone('Asia/Kolkata'))
    db.create_all()


@app.route('/create-author', methods=['POST'])
def create_author():
  data = request.get_json()
  # new = author_model.Author()
  
  # doc = db.session.query(author_model.Author).filter_by(email=data['email'])
  # if doc:
  #   return str(doc)
  #   # return 'Email is already in use'

  new_author = Author(fname=data['fname'], lname=data['lname'], email=data['email'], password=data['password'])
  db.session.add(new_author)
  db.session.commit()
  return new_author, 201

if __name__ == '__main__':
  app.run(debug=True)