# repositories/user_repository.py
from datetime import datetime, timezone
from bson import ObjectId
from config.database import users_col


class UserRepository:

    def find_by_id(self, user_id: str) -> dict | None:
        return users_col.find_one({"_id": ObjectId(user_id)})

    def find_by_email(self, email: str) -> dict | None:
        return users_col.find_one({"email": email})

    def create(self, name: str, email: str) -> dict:
        doc = {
            "name":       name,
            "email":      email,
            "created_at": datetime.now(timezone.utc),
        }
        result = users_col.insert_one(doc)
        return self.find_by_id(str(result.inserted_id))


user_repository = UserRepository()
