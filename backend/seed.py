"""
seed.py  –  Populate MongoDB with demo data.
Run once after starting MongoDB:
    python seed.py
"""
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db     = client[os.getenv("MONGO_DB", "simple_bank")]

# ── Wipe existing data (dev only) ─────────────────────────────
db.users.drop()
db.accounts.drop()
db.transactions.drop()

# ── Seed users ────────────────────────────────────────────────
alice_id = db.users.insert_one({
    "name":       "Alice Johnson",
    "email":      "alice@example.com",
    "created_at": datetime.now(timezone.utc),
}).inserted_id

bob_id = db.users.insert_one({
    "name":       "Bob Smith",
    "email":      "bob@example.com",
    "created_at": datetime.now(timezone.utc),
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

print("✅  Seeded: 2 users, 2 accounts, 3 transactions")
print(f"   Alice account ID : {alice_acc_id}")
print(f"   Bob   account ID : {bob_acc_id}")
