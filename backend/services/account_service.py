# services/account_service.py  –  Business Logic Layer
from fastapi import HTTPException, status
from repositories.user_repository import user_repository
from repositories.account_repository import account_repository
from repositories.transaction_repository import transaction_repository


class AccountService:

    # ── Create account ────────────────────────────────────────
    def create_account(self, name: str, email: str, account_type: str) -> dict:
        # Reuse existing user or create a new one
        user = user_repository.find_by_email(email)
        if not user:
            user = user_repository.create(name, email)

        account = account_repository.create(user["user_id"], account_type)

        return self._build_account_response(account, user)

    # ── Create account for authenticated user ──────────────────
    def create_account_for_user(self, user_id: int, account_type: str) -> dict:
        """Create an account for an authenticated user"""
        user = user_repository.find_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User #{user_id} not found.",
            )
        
        account = account_repository.create(user_id, account_type)
        return self._build_account_response(account, user)

    # ── Get account details ───────────────────────────────────
    def get_account(self, account_id: int) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Account #{account_id} not found.",
            )
        user = user_repository.find_by_id(account["user_id"])
        return self._build_account_response(account, user)

    # ── Deposit ───────────────────────────────────────────────
    def deposit(self, account_id: int, amount: float) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail=f"Account #{account_id} not found.")

        new_balance = round(float(account["balance"]) + amount, 2)
        account_repository.update_balance(account_id, new_balance)
        txn = transaction_repository.create(account_id, "DEPOSIT", amount)

        return {
            "account_id": account_id,
            "new_balance": new_balance,
            "transaction": self._build_txn_response(txn),
        }

    # ── Withdraw ──────────────────────────────────────────────
    def withdraw(self, account_id: int, amount: float) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail=f"Account #{account_id} not found.")

        current_balance = round(float(account["balance"]), 2)
        if amount > current_balance:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Insufficient funds. Available balance: ${current_balance:.2f}",
            )

        new_balance = round(current_balance - amount, 2)
        account_repository.update_balance(account_id, new_balance)
        txn = transaction_repository.create(account_id, "WITHDRAWAL", amount)

        return {
            "account_id": account_id,
            "new_balance": new_balance,
            "transaction": self._build_txn_response(txn),
        }

    # ── Transaction history ───────────────────────────────────
    def get_transactions(self, account_id: int) -> list[dict]:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail=f"Account #{account_id} not found.")

        txns = transaction_repository.find_by_account_id(account_id)
        return [self._build_txn_response(t) for t in txns]

    # ── List accounts for a user ──────────────────────────────
    def get_user_accounts(self, user_id: int) -> list[dict]:
        accounts = account_repository.find_by_user_id(user_id)
        return [self._build_account_list_response(acc) for acc in accounts]

    # ── Update account type ───────────────────────────────────
    def update_account(self, account_id: int, account_type: str) -> dict:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail=f"Account #{account_id} not found.")

        updated = account_repository.update_account_type(account_id, account_type)
        user = user_repository.find_by_id(updated["user_id"])
        return self._build_account_response(updated, user)

    # ── Delete account ────────────────────────────────────────
    def delete_account(self, account_id: int) -> bool:
        account = account_repository.find_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail=f"Account #{account_id} not found.")

        return account_repository.delete(account_id)

    # ── Private helpers ───────────────────────────────────────
    @staticmethod
    def _build_account_response(account: dict, user: dict) -> dict:
        return {
            "account_id":   account["account_id"],
            "user_id":      user["user_id"],
            "user_name":    user["name"],
            "email":        user["email"],
            "account_type": account["account_type"],
            "balance":      round(float(account["balance"]), 2),
            "created_at":   account["created_at"],
        }

    @staticmethod
    def _build_account_list_response(account: dict) -> dict:
        return {
            "account_id": account["account_id"],
            "account_type": account["account_type"],
            "balance": round(float(account["balance"]), 2),
            "created_at": account["created_at"],
        }

    @staticmethod
    def _build_txn_response(txn: dict) -> dict:
        return {
            "txn_id":     txn["txn_id"],
            "account_id": txn["account_id"],
            "type":       txn["txn_type"],
            "amount":     round(float(txn["amount"]), 2),
            "date":       txn["created_at"],
        }


account_service = AccountService()
