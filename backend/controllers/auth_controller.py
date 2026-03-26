# controllers/auth_controller.py  –  /api/auth routes
from flask import Blueprint, request, jsonify
from services.auth_service import auth_service
from utils.auth import require_auth
from models.serializers import serialize_user
from repositories.user_repository import user_repository

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _bad_request(msg: str):
    return jsonify({"error": msg}), 400


# ── POST /api/auth/register ───────────────────────────────────
@auth_bp.post("/register")
def register():
    body     = request.get_json(silent=True) or {}
    name     = body.get("name", "")
    email    = body.get("email", "")
    password = body.get("password", "")

    try:
        result = auth_service.register(name, email, password)
        return jsonify(result), 201
    except ValueError as e:
        return _bad_request(str(e))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── POST /api/auth/login ──────────────────────────────────────
@auth_bp.post("/login")
def login():
    body     = request.get_json(silent=True) or {}
    email    = body.get("email", "")
    password = body.get("password", "")

    try:
        result = auth_service.login(email, password)
        return jsonify(result)
    except ValueError as e:
        return _bad_request(str(e))
    except PermissionError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── GET /api/auth/me ──────────────────────────────────────────
@auth_bp.get("/me")
@require_auth
def me():
    user_id = request.current_user["user_id"]
    user = user_repository.find_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(serialize_user(user))
