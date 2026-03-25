# repositories/transaction_repository.py
from config.database import get_connection


class TransactionRepository:

    def create(self, account_id: int, txn_type: str, amount: float) -> dict:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO transactions (account_id, txn_type, amount) VALUES (%s, %s, %s)",
                (account_id, txn_type, amount),
            )
            conn.commit()
            new_id = cursor.lastrowid
            cursor.execute("SELECT * FROM transactions WHERE txn_id = %s", (new_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def find_by_account_id(self, account_id: int) -> list[dict]:
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM transactions WHERE account_id = %s ORDER BY created_at DESC",
                (account_id,),
            )
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()


transaction_repository = TransactionRepository()
