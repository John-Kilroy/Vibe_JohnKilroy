# services/admin_service.py  –  Admin CRUD for customers and accounts
from repositories.user_repository import user_repository
from repositories.account_repository import account_repository
from repositories.transaction_repository import transaction_repository
from models.serializers import serialize_user, serialize_account

VALID_ACCOUNT_TYPES = ("SAVINGS", "CHECKING", "FIXED_DEPOSIT")


class AdminService:

    # ── Customers ─────────────────────────────────────────────

    def get_all_customers(self) -> list[dict]:
        users = user_repository.find_all()
        result = []
        for u in users:
            s = serialize_user(u)
            accounts = account_repository.find_by_user_id(s["user_id"])
            s["account_count"] = len(accounts)
            result.append(s)
        return result

    def get_customer(self, user_id: str) -> dict:
        user = user_repository.find_by_id(user_id)
        if not user:
            raise LookupError(f"Customer {user_id} not found.")
        s = serialize_user(user)
        accounts = account_repository.find_by_user_id(user_id)
        s["accounts"] = [serialize_account(a) for a in accounts]
        return s

    def update_customer(self, user_id: str, data: dict) -> dict:
        user = user_repository.find_by_id(user_id)
        if not user:
            raise LookupError(f"Customer {user_id} not found.")

        allowed = {}
        if "name" in data and data["name"].strip():
            allowed["name"] = data["name"].strip()
        if "email" in data and data["email"].strip():
            # Check email not taken by someone else
            existing = user_repository.find_by_email(data["email"].strip())
            if existing and str(existing["_id"]) != user_id:
                raise ValueError("Email already in use by another account.")
            allowed["email"] = data["email"].strip()

        if not allowed:
            raise ValueError("No valid fields to update.")

        updated = user_repository.update(user_id, allowed)
        return serialize_user(updated)

    def delete_customer(self, user_id: str) -> None:
        user = user_repository.find_by_id(user_id)
        if not user:
            raise LookupError(f"Customer {user_id} not found.")

        # Cascade: delete transactions → accounts → user
        account_ids = account_repository.get_account_ids_for_user(user_id)
        for aid in account_ids:
            transaction_repository.delete_by_account_id(aid)
        account_repository.delete_by_user_id(user_id)
        user_repository.delete(user_id)

    # ── Accounts ──────────────────────────────────────────────

    def get_customer_accounts(self, user_id: str) -> list[dict]:
        user = user_repository.find_by_id(user_id)
        if not user:
            raise LookupError(f"Customer {user_id} not found.")
        accounts = account_repository.find_by_user_id(user_id)
        return [serialize_account(a) for a in accounts]

    def update_account(self, account_id: str, data: dict) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")

        allowed = {}
        if "account_type" in data:
            if data["account_type"].upper() not in VALID_ACCOUNT_TYPES:
                raise ValueError("account_type must be SAVINGS, CHECKING, or FIXED_DEPOSIT.")
            allowed["account_type"] = data["account_type"].upper()
        if "balance" in data:
            try:
                allowed["balance"] = round(float(data["balance"]), 2)
            except (TypeError, ValueError):
                raise ValueError("balance must be a number.")

        if not allowed:
            raise ValueError("No valid fields to update.")

        updated = account_repository.update(account_id, allowed)
        return serialize_account(updated)

    def delete_account(self, account_id: str) -> None:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")
        transaction_repository.delete_by_account_id(account_id)
        account_repository.delete(account_id)


admin_service = AdminService()
