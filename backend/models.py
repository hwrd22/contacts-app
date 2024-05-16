from config import db

class User(db.Model):
  user_id = db.Column(db.String(36), primary_key = True)
  username = db.Column(db.String(50), unique = True, nullable = False)
  email = db.Column(db.String(120), unique = True, nullable = False)
  password = db.Column(db.String(255), nullable = False)
  contacts = db.relationship('Contact', backref='user', lazy=True)

  def to_json(self):
    return {
      "user_id": self.user_id,
      "username": self.username,
      "email": self.email,
      "password": self.password
    }
  
class Contact(db.Model):
  contact_id = db.Column(db.String(36), primary_key = True)
  first_name = db.Column(db.String(80), unique = False, nullable = False)
  last_name = db.Column(db.String(80), unique = False, nullable = False)
  email = db.Column(db.String(120), unique = True, nullable = False)
  user_id = db.Column(db.String(36), db.ForeignKey('user.user_id'), nullable=False)

  def to_json(self):
    return {
      "contact_id": self.contact_id,
      "firstName": self.first_name,
      "lastName": self.last_name,
      "email": self.email,
      "user_id": self.user_id
    }
