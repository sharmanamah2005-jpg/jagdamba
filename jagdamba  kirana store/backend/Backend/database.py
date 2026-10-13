"""Small MongoDB connection helper for scripts such as seed.py."""
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
DATABASE_NAME = os.getenv("DATABASE_NAME", "jagdamba_kirana").strip()

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is missing. Add it to backend/.env.")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=8000)
db = client[DATABASE_NAME]
products_collection = db["products"]
