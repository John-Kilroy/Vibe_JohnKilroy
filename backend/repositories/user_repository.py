# repositories/user_repository.py
from datetime import datetime, timezone
from bson import ObjectId
from config.database import users_col


class UserRepository:

    def find_by_id(self, user_id: str) -> dict | None:
        return users_col.find_one({"_id": ObjectId(user_id)})

    def find_by_email(self, email: str) -> dict | None:
        return users_col.find_one({"email": email})

    def find_all(self) -> list[dict]:
        return list(users_col.find({"role": {"$ne": "admin"}}).sort("created_at", -1))

    def create(self, name: str, email: str) -> dict:
        doc = {
            "name":       name,
            "email":      email,
            "created_at": datetime.now(timezone.utc),
        }
        result = users_col.insert_one(doc)
        return self.find_by_id(str(result.inserted_id))

    def create_with_auth(self, name: str, email: str, password_hash: str, role: str = "customer") -> dict:
        doc = {
            "name":          name,
            "email":         email,
            "password_hash": password_hash,
            "role":          role,
            "created_at":    datetime.now(timezone.utc),
        }
        result = users_col.insert_one(doc)
        return self.find_by_id(str(result.inserted_id))

    def update(self, user_id: str, data: dict) -> dict | None:
        users_col.update_one({"_id": ObjectId(user_id)}, {"$set": data})
        return self.find_by_id(user_id)

    def delete(self, user_id: str) -> None:
        users_col.delete_one({"_id": ObjectId(user_id)})


user_repository = UserRepository()
