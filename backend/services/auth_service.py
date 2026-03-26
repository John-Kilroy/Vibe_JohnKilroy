# services/auth_service.py  –  Registration and login
import bcrypt
from repositories.user_repository import user_repository
from models.serializers import serialize_user
from utils.auth import create_token


class AuthService:

    def register(self, name: str, email: str, password: str) -> dict:
        if not name or not name.strip():
            raise ValueError("Name is required.")
        if not email or not email.strip():
            raise ValueError("Email is required.")
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")

        if user_repository.find_by_email(email.strip()):
            raise ValueError("An account with this email already exists.")

        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        user = user_repository.create_with_auth(
            name.strip(), email.strip(), password_hash, role="customer"
        )
        s = serialize_user(user)
        token = create_token(s["user_id"], s["role"], s["name"], s["email"])
        return {"token": token, "user": s}

    def login(self, email: str, password: str) -> dict:
        if not email or not password:
            raise ValueError("Email and password are required.")

        user = user_repository.find_by_email(email.strip())
        if not user or "password_hash" not in user:
            raise PermissionError("Invalid email or password.")

        if not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
            raise PermissionError("Invalid email or password.")

        s = serialize_user(user)
        token = create_token(s["user_id"], s["role"], s["name"], s["email"])
        return {"token": token, "user": s}


auth_service = AuthService()
