from flask import request, jsonify
from config import app, db
from models import Contact, User
import uuid
import hashlib
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Utility
def hash_password(password):
  # Hash the password using SHA-256
  hashed_password = hashlib.sha256(password.encode()).hexdigest()
  return hashed_password

# User Routes
@app.route("/api/create_user", methods=["POST"])
def create_user():
  user_id = uuid.uuid4()
  username = request.json.get("username")
  email = request.json.get("email")
  password = request.json.get("password")

  new_user = User(user_id = user_id, username = username, email = email, password = password)

  try:
    db.session.add(new_user)
    db.session.commit()
  except Exception as err:
    return jsonify({"message": err}), 400
  
  return jsonify({"message": "User created"}), 201


@app.route("/api/login", methods=["POST"])
def login():
  username = request.get("username")
  password = request.get("password")

  if not username:
    return jsonify({"error": "Missing username"}), 400
  
  if not password:
    return jsonify({"error": "Missing password"}), 400
  
  hashed_password = hash_password(password)
  
  user = User.query.filter_by(username = username).first()

  if user and hashed_password == user.password:
    access_token = create_access_token(identity=user.user_id)
    return jsonify({"message": "Login successful", "access_token": access_token}), 200
  else:
    return jsonify({"error": "Invalid username or password", "userExists": user != None, "passwordMatching" : hashed_password == user.password}), 401
  

# Checking for duplicates
@app.route("/api/get_user_email/<string:email>")
def get_user_by_email(email):
  user = User.query.filter_by(email = email).first()
  if user:
    return jsonify({"exists": True}), 200
  return jsonify({"exists": False}), 200


@app.route("/api/get_user_username/<string:username>")
def get_user_by_username(username):
  user = User.query.filter_by(username = username).first()
  if user:
    return jsonify({"exists": True}), 200
  return jsonify({"exists": False}), 200


# Getting User details for the frontend
@app.route("/api/get_user", methods=["GET"])
@jwt_required()
def get_user():
  current_user_id = get_jwt_identity()
  user = User.query.get(current_user_id)
  return jsonify({"user": user}), 200


# Contact Routes
@app.route("/api/test/all_contacts", methods=["GET"])
def get_all_contacts():
  contacts = Contact.query.all()
  json_contacts = list(map(lambda x: x.to_json(), contacts))
  return jsonify({"contacts": json_contacts}), 200


@app.route("/api/get_contacts", methods=["POST"])
@jwt_required()
def get_contacts():
  current_user_id = get_jwt_identity()
  contacts = Contact.query.filter_by(user_id = current_user_id)
  json_contacts = list(map(lambda x: x.to_json(), contacts))
  return jsonify({"contacts": json_contacts}), 200

@app.route("/api/create_contact", methods=["POST"])
@jwt_required()
def create_contact():
  contact_id = uuid.uuid4()
  first_name = request.json.get("firstName")
  last_name = request.json.get("lastName")
  email = request.json.get("email")

  if not first_name or not last_name or not email:
    return jsonify({"message": "You must include a first name, last name, and email."}), 400
  
  new_contact = Contact(contact_id = contact_id, first_name = first_name, last_name = last_name, email = email)

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
  contact.email = data.get("email", contact.email)

  db.session.commit()

  return jsonify({"message": "User updated."}), 200

@app.route("/api/get_email/<string:emailAddress>", methods = ["GET"])
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
    return jsonify({"message": "User not found."}), 404
  
  db.session.delete(contact)
  db.session.commit()

  return jsonify({"message": "User deleted."}), 200

if __name__ == "__main__":
  with app.app_context():
    db.create_all()

  app.run(debug=True)
