"""
seed.py  –  Populate MongoDB with demo data.
Run once after starting MongoDB:
    python seed.py
"""
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db     = client[os.getenv("MONGO_DB", "simple_bank")]

# ── Wipe existing data (dev only) ─────────────────────────────
db.users.drop()
db.accounts.drop()
db.transactions.drop()

# ── Seed admin user ───────────────────────────────────────────
admin_id = db.users.insert_one({
    "name":          "Admin",
    "email":         "admin@novabanc.com",
    "password_hash": bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode(),
    "role":          "admin",
    "created_at":    datetime.now(timezone.utc),
}).inserted_id

# ── Seed customer users ────────────────────────────────────────
alice_id = db.users.insert_one({
    "name":          "Alice Johnson",
    "email":         "alice@example.com",
    "password_hash": bcrypt.hashpw(b"alice123", bcrypt.gensalt()).decode(),
    "role":          "customer",
    "created_at":    datetime.now(timezone.utc),
}).inserted_id

bob_id = db.users.insert_one({
    "name":          "Bob Smith",
    "email":         "bob@example.com",
    "password_hash": bcrypt.hashpw(b"bob12345", bcrypt.gensalt()).decode(),
    "role":          "customer",
    "created_at":    datetime.now(timezone.utc),
}).inserted_id

# ── Seed accounts ─────────────────────────────────────────────
alice_acc_id = db.accounts.insert_one({
    "user_id":      alice_id,
    "balance":      1500.00,
    "account_type": "SAVINGS",
    "created_at":   datetime.now(timezone.utc),
}).inserted_id

bob_acc_id = db.accounts.insert_one({
    "user_id":      bob_id,
    "balance":      800.00,
    "account_type": "CHECKING",
    "created_at":   datetime.now(timezone.utc),
}).inserted_id

# ── Seed transactions ─────────────────────────────────────────
db.transactions.insert_many([
    {
        "account_id": alice_acc_id,
        "txn_type":   "DEPOSIT",
        "amount":     1500.00,
        "created_at": datetime.now(timezone.utc),
    },
    {
        "account_id": bob_acc_id,
        "txn_type":   "DEPOSIT",
        "amount":     1000.00,
        "created_at": datetime.now(timezone.utc),
    },
    {
        "account_id": bob_acc_id,
        "txn_type":   "WITHDRAWAL",
        "amount":     200.00,
        "created_at": datetime.now(timezone.utc),
    },
])

print("Seeded successfully!")
print()
print("Admin login:")
print("  Email   : admin@novabanc.com")
print("  Password: admin123")
print()
print("Customer logins:")
print("  alice@example.com / alice123")
print("  bob@example.com   / bob12345")
print()
print(f"Alice account ID: {alice_acc_id}")
print(f"Bob   account ID: {bob_acc_id}")
