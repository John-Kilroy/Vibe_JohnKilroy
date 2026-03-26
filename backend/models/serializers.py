# models/serializers.py
# MongoDB documents use BSON ObjectId for _id.
# These helpers convert raw Mongo dicts into clean JSON-safe dicts
# that the frontend can consume.

from bson import ObjectId
from datetime import datetime


def _str(value) -> str:
    """Stringify an ObjectId or any value."""
    return str(value) if isinstance(value, ObjectId) else value


def serialize_user(doc: dict) -> dict:
    return {
        "user_id":    _str(doc["_id"]),
        "name":       doc["name"],
        "email":      doc["email"],
        "role":       doc.get("role", "customer"),
        "created_at": doc.get("created_at", datetime.utcnow()).isoformat(),
    }


def serialize_account(doc: dict) -> dict:
    return {
        "account_id":   _str(doc["_id"]),
        "user_id":      _str(doc["user_id"]),
        "balance":      round(float(doc.get("balance", 0)), 2),
        "account_type": doc["account_type"],
        "created_at":   doc.get("created_at", datetime.utcnow()).isoformat(),
    }


def serialize_transaction(doc: dict) -> dict:
    return {
        "txn_id":     _str(doc["_id"]),
        "account_id": _str(doc["account_id"]),
        "type":       doc["txn_type"],
        "amount":     round(float(doc["amount"]), 2),
        "date":       doc.get("created_at", datetime.utcnow()).isoformat(),
    }
