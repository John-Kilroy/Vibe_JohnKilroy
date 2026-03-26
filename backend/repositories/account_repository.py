# repositories/account_repository.py
from datetime import datetime, timezone
from bson import ObjectId
from config.database import accounts_col


class AccountRepository:

    def find_by_id(self, account_id: str) -> dict | None:
        return accounts_col.find_one({"_id": ObjectId(account_id)})

    def find_by_user_id(self, user_id: str) -> list[dict]:
        return list(accounts_col.find({"user_id": ObjectId(user_id)}))

    def create(self, user_id: str, account_type: str) -> dict:
        doc = {
            "user_id":      ObjectId(user_id),
            "balance":      0.0,
            "account_type": account_type,
            "created_at":   datetime.now(timezone.utc),
        }
        result = accounts_col.insert_one(doc)
        return self.find_by_id(str(result.inserted_id))

    def update_balance(self, account_id: str, new_balance: float) -> dict:
        accounts_col.update_one(
            {"_id": ObjectId(account_id)},
            {"$set": {"balance": new_balance}},
        )
        return self.find_by_id(account_id)

    def update(self, account_id: str, data: dict) -> dict | None:
        accounts_col.update_one({"_id": ObjectId(account_id)}, {"$set": data})
        return self.find_by_id(account_id)

    def delete(self, account_id: str) -> None:
        accounts_col.delete_one({"_id": ObjectId(account_id)})

    def delete_by_user_id(self, user_id: str) -> None:
        accounts_col.delete_many({"user_id": ObjectId(user_id)})

    def get_account_ids_for_user(self, user_id: str) -> list[str]:
        docs = accounts_col.find({"user_id": ObjectId(user_id)}, {"_id": 1})
        return [str(d["_id"]) for d in docs]


account_repository = AccountRepository()
