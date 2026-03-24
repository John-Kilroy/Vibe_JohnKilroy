from flask import Flask, jsonify, request
app = Flask(__name__)

users = [
    {"id": 1, "name": "Rohit"},
    {"id": 2, "name": "Alex"}
]

@app.route('/')
def home():
    return "Welcome to Flask API!"

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    return jsonify(user if user else {"error": "User not found"})

@app.route('/users', methods=['POST'])
def add_user():
    new_user = request.json
    users.append(new_user)
    return jsonify(new_user), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    for user in users:
        if user["id"] == user_id:
            user["name"] = request.json.get("name", user["name"])
            return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global users
    users = [u for u in users if u["id"] != user_id]
    return jsonify({"message": "User deleted"})

if __name__ == '__main__':
    app.run(debug=True)
