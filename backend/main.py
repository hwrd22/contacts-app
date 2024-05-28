from flask import request, jsonify
from config import app, db
from models import Contact, User
import uuid
import hashlib
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

# Utility
def hash_password(password):
  # Hash the password using SHA-256
  hashed_password = hashlib.sha256(password.encode()).hexdigest()
  return hashed_password

# User Routes
@app.route("/api/create_user", methods=["POST"])
def create_user():
  user_id = str(uuid.uuid4())
  username = request.json.get("username")
  email = request.json.get("email")
  password = hash_password(request.json.get("password"))

  new_user = User(user_id = user_id, username = username, email = email, password = password)

  try:
    db.session.add(new_user)
    db.session.commit()
  except Exception as err:
    return jsonify({"message": err}), 400
  
  return jsonify({"message": "User created"}), 201


@app.route("/api/login", methods=["POST"])
def login():
  username = request.json.get("username")
  password = request.json.get("password")

  if not username:
    return jsonify({"error": "Missing username"}), 400
  
  user = User.query.filter_by(username = username).first()
  if user == None:
    return jsonify({"userExists": False}), 401
  
  if not password:
    return jsonify({"error": "Missing password"}), 400
  
  hashed_password = hash_password(password)
  
  if hashed_password == user.password:
    access_token = create_access_token(identity=user.user_id, expires_delta=timedelta(minutes=15))
    return jsonify({"access_token": access_token}), 200
  else:
    return jsonify({"userExists": True, "passwordMatching" : False}), 401
  

# Checking for duplicates
@app.route("/api/get_user_email/<string:email>")
def get_user_by_email(email):
  user = User.query.filter_by(email = email).first()
  if user:
    print(user)
    return jsonify({"exists": True}), 200
  return jsonify({"exists": False}), 200


@app.route("/api/get_user_username/<string:username>")
def get_user_by_username(username=None):
  user = User.query.filter_by(username = username).first()
  if user:
    print(user)
    return jsonify({"exists": True}), 200
  return jsonify({"exists": False}), 200


# Getting User details for the frontend
@app.route("/api/get_user", methods=["GET"])
@jwt_required()
def get_user():
  token = request.headers.get('Authorization').split(' ')[1]
  user_id = get_jwt_identity()
  user = User.query.get(user_id)
  return jsonify({"user": user.to_json()}), 200

# Checking if password matches for the frontend
@app.route("/api/check_password", methods=["POST"])
@jwt_required()
def check_password():
  token = request.headers.get('Authorization').split(' ')[1]
  user_id = get_jwt_identity()
  user = User.query.get(user_id)
  password = request.json.get("password")
  hashed_password = hash_password(password)

  if (hashed_password == user.password):
    return jsonify({"matches": True}), 200

  return jsonify({"matches": False}), 200

@app.route("/api/update_user", methods=["PATCH"])
@jwt_required()
def update_user():
  token = request.headers.get('Authorization').split(' ')[1]
  user_id = get_jwt_identity()
  user = User.query.get(user_id)
  data = request.json
  password = data.get("password")
  if password != "":
    hashed_password = hash_password(password)
    user.password = (hashed_password)

  user.username = data.get("username", user.username)

  db.session.commit()
  return jsonify({"message": "User updated."}), 200


# Token Refresh route
@app.route("/api/refresh", methods=["GET"])
@jwt_required()
def refresh_token():
  token = request.headers.get('Authorization').split(' ')[1]
  user_id = get_jwt_identity()
  new_token = create_access_token(identity=user_id, expires_delta=timedelta(minutes=15))
  return jsonify({'access_token': new_token}), 200


# Contact Routes
@app.route("/api/get_contacts", methods=["GET"])
@jwt_required()
def get_contacts():
  current_user_id = get_jwt_identity()
  contacts = Contact.query.filter_by(user_id = current_user_id)
  json_contacts = list(map(lambda x: x.to_json(), contacts))
  return jsonify({"contacts": json_contacts}), 200

@app.route("/api/create_contact", methods=["POST"])
@jwt_required()
def create_contact():
  current_user_id = get_jwt_identity()

  contact_id = str(uuid.uuid4())
  first_name = request.json.get("firstName")
  last_name = request.json.get("lastName")
  nickname = request.json.get("nickname")
  phone_number = request.json.get("phoneNumber")
  email = request.json.get("email")
  company = request.json.get("company")

  if not first_name or not last_name or not email:
    return jsonify({"message": "You must include a first name, last name, and email."}), 400
  
  new_contact = Contact(contact_id = contact_id, first_name = first_name, last_name = last_name, nickname = nickname, phone_number = phone_number , email = email, company = company, user_id = current_user_id)

  try:
    db.session.add(new_contact)  # Adding the new contact to the database
    db.session.commit()  # Saving the changes
  except Exception as err:
    return jsonify({"message": err}), 400

  return jsonify({"message": "Contact created!"}), 201

@app.route("/api/update_contact/<string:contact_id>", methods = ["PATCH"])
@jwt_required()
def update_contact(contact_id):
  contact = Contact.query.get(contact_id)
  if not contact:
    return jsonify({"message": "User not found."}), 404
  
  data = request.json
  contact.first_name = data.get("firstName", contact.first_name)  # Checks if the contact's first name was changed. If so, use that value. Else, stick with the existing one.
  contact.last_name = data.get("lastName", contact.last_name)
  contact.nickname = data.get("nickname", contact.nickname)
  contact.phone_number = data.get("phoneNumber", contact.phone_number)
  contact.email = data.get("email", contact.email)
  contact.company = data.get("company", contact.company)

  db.session.commit()

  return jsonify({"message": "User updated."}), 200

@app.route("/api/get_contact_email/<string:emailAddress>", methods = ["GET"])
@jwt_required()
def check_if_email_exists(emailAddress):
  current_user_id = get_jwt_identity()
  contact = Contact.query.filter_by(email = emailAddress, user_id = current_user_id).first()
  print(contact)
  if contact != None:
    return jsonify({"exists": True}), 200
  return jsonify({"exists": False}), 200

@app.route("/api/delete_contact/<string:contact_id>", methods = ["DELETE"])
@jwt_required()
def delete_contact(contact_id):
  contact = Contact.query.get(contact_id)
  if not contact:
    return jsonify({"message": "Contact not found."}), 404
  
  db.session.delete(contact)
  db.session.commit()

  return jsonify({"message": "Contact deleted."}), 200

if __name__ == "__main__":
  with app.app_context():
    db.create_all()

  app.run(debug=True)
