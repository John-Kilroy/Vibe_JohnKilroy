# repositories/transaction_repository.py
from datetime import datetime, timezone
from bson import ObjectId
from config.database import transactions_col


class TransactionRepository:

    def create(self, account_id: str, txn_type: str, amount: float) -> dict:
        doc = {
            "account_id": ObjectId(account_id),
            "txn_type":   txn_type,        # "DEPOSIT" | "WITHDRAWAL"
            "amount":     amount,
            "created_at": datetime.now(timezone.utc),
        }
        result = transactions_col.insert_one(doc)
        return transactions_col.find_one({"_id": result.inserted_id})

    def find_by_account_id(self, account_id: str) -> list[dict]:
        return list(
            transactions_col.find(
                {"account_id": ObjectId(account_id)}
            ).sort("created_at", -1)     # newest first
        )

    def delete_by_account_id(self, account_id: str) -> None:
        transactions_col.delete_many({"account_id": ObjectId(account_id)})


transaction_repository = TransactionRepository()
