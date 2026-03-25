# repositories/user_repository.py
from config.database import get_connection
import hashlib


class UserRepository:

    def find_by_id(self, user_id: int) -> dict | None:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def find_by_email(self, email: str) -> dict | None:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def create(self, name: str, email: str) -> dict:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO users (name, email) VALUES (%s, %s)",
                (name, email),
            )
            conn.commit()
            new_id = cursor.lastrowid
            return self.find_by_id(new_id)
        finally:
            cursor.close()
            conn.close()

    def _hash_password(self, password: str) -> str:
        """Hash password using SHA256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, name: str, email: str, password: str) -> dict:
        """Register a new user with password"""
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            hashed_password = self._hash_password(password)
            
            # Check if user already exists
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                raise ValueError(f"User with email '{email}' already exists")
            
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                (name, email, hashed_password),
            )
            conn.commit()
            new_id = cursor.lastrowid
            return self.find_by_id(new_id)
        finally:
            cursor.close()
            conn.close()

    def verify_user(self, email: str, password: str) -> dict | None:
        """Verify user credentials and return user if valid"""
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            
            if not user:
                return None
            
            # Check if password_hash exists in the record
            if 'password_hash' not in user or not user.get('password_hash'):
                return None
            
            hashed_password = self._hash_password(password)
            if user.get('password_hash') == hashed_password:
                return user
            
            return None
        finally:
            cursor.close()
            conn.close()


user_repository = UserRepository()
