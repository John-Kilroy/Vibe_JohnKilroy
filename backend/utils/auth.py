# utils/auth.py  –  JWT helpers and route decorators
import os
import jwt
from functools import wraps
from flask import request, jsonify
from datetime import datetime, timezone, timedelta

SECRET = os.getenv("JWT_SECRET", "change-me")


def create_token(user_id: str, role: str, name: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "role":    role,
        "name":    name,
        "email":   email,
        "exp":     datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=["HS256"])


def _get_token_from_request():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_request()
        if not token:
            return jsonify({"error": "Authentication required."}), 401
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401
        request.current_user = payload
        return f(*args, **kwargs)
    return wrapper


def require_admin(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _get_token_from_request()
        if not token:
            return jsonify({"error": "Authentication required."}), 401
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "Admin access required."}), 403
        request.current_user = payload
        return f(*args, **kwargs)
    return wrapper
