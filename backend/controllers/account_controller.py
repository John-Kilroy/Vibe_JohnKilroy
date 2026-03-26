# controllers/account_controller.py  –  Flask Blueprint (REST layer)
from flask import Blueprint, request, jsonify
from bson.errors import InvalidId
from services.account_service import account_service
from repositories.account_repository import account_repository
from utils.auth import require_auth

account_bp = Blueprint("accounts", __name__, url_prefix="/api/accounts")


# ── Error helpers ─────────────────────────────────────────────
def _bad_request(msg: str):
    return jsonify({"error": msg}), 400

def _not_found(msg: str):
    return jsonify({"error": msg}), 404

def _forbidden(msg: str = "Access denied."):
    return jsonify({"error": msg}), 403

def _server_error(msg: str):
    return jsonify({"error": msg}), 500


def _check_account_access(account_id: str):
    """Returns an error response if the current user cannot access this account.
    Admins can access any account; customers only their own."""
    try:
        account = account_repository.find_by_id(account_id)
    except Exception:
        return _not_found(f"Account {account_id} not found.")

    if not account:
        return _not_found(f"Account {account_id} not found.")

    current = request.current_user
    if current["role"] != "admin" and str(account["user_id"]) != current["user_id"]:
        return _forbidden()

    return None  # access granted


# ── POST /api/accounts  –  Create account ────────────────────
@account_bp.post("/")
@require_auth
def create_account():
    body         = request.get_json(silent=True) or {}
    account_type = body.get("account_type", "").strip().upper()

    if not account_type:
        return _bad_request("account_type is required.")

    current = request.current_user

    try:
        # Customers create accounts under their own user record
        if current["role"] == "customer":
            result = account_service.create_account_for_user(current["user_id"], account_type)
        else:
            # Admin can create for any user by providing name + email
            name  = body.get("name", "").strip()
            email = body.get("email", "").strip()
            if not name or not email:
                return _bad_request("name and email are required.")
            result = account_service.create_account(name, email, account_type)
        return jsonify(result), 201
    except ValueError as e:
        return _bad_request(str(e))
    except Exception as e:
        return _server_error(str(e))


# ── GET /api/accounts/<id>  –  Get account details ───────────
@account_bp.get("/<account_id>")
@require_auth
def get_account(account_id: str):
    err = _check_account_access(account_id)
    if err: return err

    try:
        result = account_service.get_account(account_id)
        return jsonify(result)
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))


# ── POST /api/accounts/<id>/deposit  –  Deposit money ────────
@account_bp.post("/<account_id>/deposit")
@require_auth
def deposit(account_id: str):
    err = _check_account_access(account_id)
    if err: return err

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
@require_auth
def withdraw(account_id: str):
    err = _check_account_access(account_id)
    if err: return err

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
        return jsonify({"error": str(e)}), 422
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))


# ── GET /api/accounts/<id>/transactions  –  History ──────────
@account_bp.get("/<account_id>/transactions")
@require_auth
def get_transactions(account_id: str):
    err = _check_account_access(account_id)
    if err: return err

    try:
        result = account_service.get_transactions(account_id)
        return jsonify(result)
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return _server_error(str(e))
