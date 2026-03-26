# controllers/customer_controller.py  –  /api/customer routes (authenticated customers)
from flask import Blueprint, request, jsonify
from services.admin_service import admin_service
from utils.auth import require_auth

customer_bp = Blueprint("customer", __name__, url_prefix="/api/customer")


# ── GET /api/customer/accounts ────────────────────────────────
# Returns all accounts belonging to the logged-in customer
@customer_bp.get("/accounts")
@require_auth
def get_my_accounts():
    user_id = request.current_user["user_id"]
    try:
        accounts = admin_service.get_customer_accounts(user_id)
        return jsonify(accounts)
    except LookupError:
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
