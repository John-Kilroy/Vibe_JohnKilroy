# config/database.py  –  MongoDB connection via PyMongo
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
_db     = _client[os.getenv("MONGO_DB", "simple_bank")]

# Collections (equivalent to SQL tables)
users_col        = _db["users"]
accounts_col     = _db["accounts"]
transactions_col = _db["transactions"]
