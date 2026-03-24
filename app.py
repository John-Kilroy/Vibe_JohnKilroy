from flask import Flask, jsonify, request
from pydantic import ValidationError
from repository import get_all_employees, create_employee
from schemas import EmployeeCreate

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

# Accounts and transactions
accounts = []
transactions = []
next_account_id = 1

@app.route('/api/accounts', methods=['POST'])
def create_account():
    global next_account_id
    payload = request.json or {}
    user_id = payload.get('userId')
    account_type = payload.get('accountType')
    if user_id is None or account_type is None:
        return jsonify({"error": "userId and accountType are required"}), 400

    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    account = {
        "accountId": next_account_id,
        "userId": user_id,
        "userName": user['name'],
        "accountType": account_type,
        "balance": 0.0
    }
    next_account_id += 1
    accounts.append(account)
    return jsonify(account), 201

@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def get_account(account_id):
    account = next((a for a in accounts if a['accountId'] == account_id), None)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify({
        "accountId": account['accountId'],
        "userName": account['userName'],
        "balance": account['balance']
    })

@app.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def deposit_money(account_id):
    payload = request.json or {}
    amount = payload.get('amount')
    if amount is None or amount <= 0:
        return jsonify({"error": "amount must be > 0"}), 400

    account = next((a for a in accounts if a['accountId'] == account_id), None)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    account['balance'] += float(amount)
    txn = {
        "accountId": account_id,
        "type": "DEPOSIT",
        "amount": float(amount),
        "date": str(__import__('datetime').datetime.utcnow().date())
    }
    transactions.append(txn)
    return jsonify({"message": "Deposit successful", "balance": account['balance']}), 200

@app.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def withdraw_money(account_id):
    payload = request.json or {}
    amount = payload.get('amount')
    if amount is None or amount <= 0:
        return jsonify({"error": "amount must be > 0"}), 400

    account = next((a for a in accounts if a['accountId'] == account_id), None)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    if account['balance'] < float(amount):
        return jsonify({"error": "Insufficient funds"}), 400

    account['balance'] -= float(amount)
    txn = {
        "accountId": account_id,
        "type": "WITHDRAW",
        "amount": float(amount),
        "date": str(__import__('datetime').datetime.utcnow().date())
    }
    transactions.append(txn)
    return jsonify({"message": "Withdrawal successful", "balance": account['balance']}), 200

@app.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def transaction_history(account_id):
    account = next((a for a in accounts if a['accountId'] == account_id), None)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    account_transactions = [t for t in transactions if t['accountId'] == account_id]
    return jsonify(account_transactions), 200

@app.route("/employees", methods=["GET"])
def get_employees():
    try:
        employees = get_all_employees()
        return jsonify([{
            "id": e.id,
            "name": e.name,
            "department": e.department,
            "salary": float(e.salary)
        } for e in employees])
    except Exception as ex:
        return jsonify({"error": "Unable to fetch employees", "detail": str(ex)}), 500

@app.route("/employees", methods=["POST"])
def add_employee():
    payload = request.json or {}
    try:
        employee_data = EmployeeCreate(**payload)
    except ValidationError as err:
        return jsonify({"error": "Invalid payload", "detail": err.errors()}), 400

    try:
        emp = create_employee(
            employee_data.name,
            employee_data.department,
            employee_data.salary,
        )
        return jsonify({"id": emp.id}), 201
    except Exception as ex:
        return jsonify({"error": "Failed to create employee", "detail": str(ex)}), 500

if __name__ == '__main__':
    app.run(debug=True)