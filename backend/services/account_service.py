# services/account_service.py  –  Business Logic Layer
from repositories.user_repository import user_repository
from repositories.account_repository import account_repository
from repositories.transaction_repository import transaction_repository
from models.serializers import (
    serialize_user,
    serialize_account,
    serialize_transaction,
)


class AccountService:

    # ── Create account ────────────────────────────────────────
    def create_account(self, name: str, email: str, account_type: str) -> dict:
        if not name or not name.strip():
            raise ValueError("Name must not be blank.")
        if not email or not email.strip():
            raise ValueError("Email must not be blank.")
        if account_type not in ("SAVINGS", "CHECKING", "FIXED_DEPOSIT"):
            raise ValueError("account_type must be SAVINGS, CHECKING, or FIXED_DEPOSIT.")

        # Reuse existing user or create a new one
        user = user_repository.find_by_email(email)
        if not user:
            user = user_repository.create(name.strip(), email.strip())

        account = account_repository.create(str(user["_id"]), account_type)

        s_user    = serialize_user(user)
        s_account = serialize_account(account)

        return {
            **s_account,
            "user_name": s_user["name"],
            "email":     s_user["email"],
        }

    # ── Get account details ───────────────────────────────────
    def get_account(self, account_id: str) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")

        user      = user_repository.find_by_id(str(account["user_id"]))
        s_user    = serialize_user(user)
        s_account = serialize_account(account)

        return {
            **s_account,
            "user_name": s_user["name"],
            "email":     s_user["email"],
        }

    # ── Deposit ───────────────────────────────────────────────
    def deposit(self, account_id: str, amount: float) -> dict:
        self._validate_amount(amount)

        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")

        new_balance = round(float(account["balance"]) + amount, 2)
        account_repository.update_balance(account_id, new_balance)
        txn = transaction_repository.create(account_id, "DEPOSIT", amount)

        return {
            "account_id":  account_id,
            "new_balance": new_balance,
            "transaction": serialize_transaction(txn),
        }

    # ── Withdraw ──────────────────────────────────────────────
    def withdraw(self, account_id: str, amount: float) -> dict:
        self._validate_amount(amount)

        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")

        current = round(float(account["balance"]), 2)
        if amount > current:
            raise ArithmeticError(
                f"Insufficient funds. Available balance: ${current:.2f}"
            )

        new_balance = round(current - amount, 2)
        account_repository.update_balance(account_id, new_balance)
        txn = transaction_repository.create(account_id, "WITHDRAWAL", amount)

        return {
            "account_id":  account_id,
            "new_balance": new_balance,
            "transaction": serialize_transaction(txn),
        }

    # ── Transaction history ───────────────────────────────────
    def get_transactions(self, account_id: str) -> list[dict]:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise LookupError(f"Account {account_id} not found.")

        txns = transaction_repository.find_by_account_id(account_id)
        return [serialize_transaction(t) for t in txns]

    # ── Helpers ───────────────────────────────────────────────
    @staticmethod
    def _validate_amount(amount: float):
        if not isinstance(amount, (int, float)) or amount <= 0:
            raise ValueError("Amount must be a positive number.")


account_service = AccountService()
