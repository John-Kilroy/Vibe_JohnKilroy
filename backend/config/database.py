# config/database.py  –  MySQL connection pool
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

load_dotenv()

_pool = pooling.MySQLConnectionPool(
    pool_name="bank_pool",
    pool_size=10,
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "simple_bank"),
)


def get_connection():
    """Return a connection from the pool."""
    return _pool.get_connection()
