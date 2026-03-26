# controllers/admin_controller.py  –  /api/admin routes (admin only)
from flask import Blueprint, request, jsonify
from bson.errors import InvalidId
from services.admin_service import admin_service
from utils.auth import require_admin

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _bad_request(msg: str):
    return jsonify({"error": msg}), 400

def _not_found(msg: str):
    return jsonify({"error": msg}), 404


# ── GET /api/admin/customers ──────────────────────────────────
@admin_bp.get("/customers")
@require_admin
def list_customers():
    try:
        return jsonify(admin_service.get_all_customers())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── GET /api/admin/customers/<id> ─────────────────────────────
@admin_bp.get("/customers/<user_id>")
@require_admin
def get_customer(user_id: str):
    try:
        return jsonify(admin_service.get_customer(user_id))
    except (LookupError, InvalidId):
        return _not_found(f"Customer {user_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── PUT /api/admin/customers/<id> ─────────────────────────────
@admin_bp.put("/customers/<user_id>")
@require_admin
def update_customer(user_id: str):
    body = request.get_json(silent=True) or {}
    try:
        return jsonify(admin_service.update_customer(user_id, body))
    except ValueError as e:
        return _bad_request(str(e))
    except (LookupError, InvalidId):
        return _not_found(f"Customer {user_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── DELETE /api/admin/customers/<id> ──────────────────────────
@admin_bp.delete("/customers/<user_id>")
@require_admin
def delete_customer(user_id: str):
    try:
        admin_service.delete_customer(user_id)
        return jsonify({"message": "Customer deleted."}), 200
    except (LookupError, InvalidId):
        return _not_found(f"Customer {user_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── GET /api/admin/customers/<id>/accounts ────────────────────
@admin_bp.get("/customers/<user_id>/accounts")
@require_admin
def get_customer_accounts(user_id: str):
    try:
        return jsonify(admin_service.get_customer_accounts(user_id))
    except (LookupError, InvalidId):
        return _not_found(f"Customer {user_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── PUT /api/admin/accounts/<id> ──────────────────────────────
@admin_bp.put("/accounts/<account_id>")
@require_admin
def update_account(account_id: str):
    body = request.get_json(silent=True) or {}
    try:
        return jsonify(admin_service.update_account(account_id, body))
    except ValueError as e:
        return _bad_request(str(e))
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── DELETE /api/admin/accounts/<id> ───────────────────────────
@admin_bp.delete("/accounts/<account_id>")
@require_admin
def delete_account(account_id: str):
    try:
        admin_service.delete_account(account_id)
        return jsonify({"message": "Account deleted."}), 200
    except (LookupError, InvalidId):
        return _not_found(f"Account {account_id} not found.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500
