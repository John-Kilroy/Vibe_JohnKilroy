# repositories/account_repository.py
from config.database import get_connection


class AccountRepository:

    def find_by_id(self, account_id: int) -> dict | None:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM accounts WHERE account_id = %s", (account_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def find_by_user_id(self, user_id: int) -> list[dict]:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM accounts WHERE user_id = %s", (user_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def create(self, user_id: int, account_type: str) -> dict:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO accounts (user_id, account_type) VALUES (%s, %s)",
                (user_id, account_type),
            )
            conn.commit()
            return self.find_by_id(cursor.lastrowid)
        finally:
            cursor.close()
            conn.close()

    def update_balance(self, account_id: int, new_balance: float) -> dict:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "UPDATE accounts SET balance = %s WHERE account_id = %s",
                (new_balance, account_id),
            )
            conn.commit()
            return self.find_by_id(account_id)
        finally:
            cursor.close()
            conn.close()

    def update_account_type(self, account_id: int, new_account_type: str) -> dict:
        """Update the account type"""
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "UPDATE accounts SET account_type = %s WHERE account_id = %s",
                (new_account_type, account_id),
            )
            conn.commit()
            return self.find_by_id(account_id)
        finally:
            cursor.close()
            conn.close()

    def delete(self, account_id: int) -> bool:
        """Delete an account"""
        conn = get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM accounts WHERE account_id = %s", (account_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()


account_repository = AccountRepository()
