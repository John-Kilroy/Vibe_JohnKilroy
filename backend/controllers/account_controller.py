# controllers/account_controller.py  –  Flask Blueprint (REST layer)
from flask import Blueprint, request, jsonify
from bson.errors import InvalidId
from services.account_service import account_service

account_bp = Blueprint("accounts", __name__, url_prefix="/api/accounts")


# ── Error helpers ─────────────────────────────────────────────
def _bad_request(msg: str):
    return jsonify({"error": msg}), 400

def _not_found(msg: str):
    return jsonify({"error": msg}), 404

def _unprocessable(msg: str):
    return jsonify({"error": msg}), 422

def _server_error(msg: str):
    return jsonify({"error": msg}), 500


# ── POST /api/accounts  –  Create account ────────────────────
@account_bp.post("/")
def create_account():
    body = request.get_json(silent=True) or {}
    name         = body.get("name", "").strip()
    email        = body.get("email", "").strip()
    account_type = body.get("account_type", "").strip().upper()

    if not name or not email or not account_type:
        return _bad_request("name, email, and account_type are required.")

    try:
        result = account_service.create_account(name, email, account_type)
        return jsonify(result), 201
    except ValueError as e:
        return _bad_request(str(e))
    except Exception as e:
        return _server_error(str(e))


# ── GET /api/accounts/<id>  –  Get account details ───────────
@account_bp.get("/<account_id>")
def get_account(account_id: str):
    try:
        result = account_service.get_account(account_id)
        return jsonify(result)
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))


# ── POST /api/accounts/<id>/deposit  –  Deposit money ────────
@account_bp.post("/<account_id>/deposit")
def deposit(account_id: str):
    body   = request.get_json(silent=True) or {}
    amount = body.get("amount")

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return _bad_request("amount must be a number.")

    try:
        result = account_service.deposit(account_id, amount)
        return jsonify(result)
    except ValueError as e:
        return _bad_request(str(e))
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))


# ── POST /api/accounts/<id>/withdraw  –  Withdraw money ──────
@account_bp.post("/<account_id>/withdraw")
def withdraw(account_id: str):
    body   = request.get_json(silent=True) or {}
    amount = body.get("amount")

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return _bad_request("amount must be a number.")

    try:
        result = account_service.withdraw(account_id, amount)
        return jsonify(result)
    except ValueError as e:
        return _bad_request(str(e))
    except ArithmeticError as e:
        return _unprocessable(str(e))
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))


# ── GET /api/accounts/<id>/transactions  –  History ──────────
@account_bp.get("/<account_id>/transactions")
def get_transactions(account_id: str):
    try:
        result = account_service.get_transactions(account_id)
        return jsonify(result)
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))
