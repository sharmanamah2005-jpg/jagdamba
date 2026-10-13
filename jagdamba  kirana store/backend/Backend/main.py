import os
import uuid
from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field

from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import PyMongoError
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
DATABASE_NAME = os.getenv("DATABASE_NAME", "jagdamba_kirana").strip()

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI is missing. Add your MongoDB connection string to backend/.env."
    )

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=8000)
db = client[DATABASE_NAME]
orders_collection = db["orders"]
products_collection = db["products"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        client.admin.command("ping")
        products_collection.create_index([("name", ASCENDING)])
        products_collection.create_index([("category", ASCENDING)])
        print(f"Connected to MongoDB database: {DATABASE_NAME}")
    except Exception as exc:
        print("MongoDB connection failed. Check your .env URI, network access, and DNS.")
        print(f"Details: {exc}")
    yield
    client.close()


app = FastAPI(
    title="Jagdamba Kirana Store API",
    description="Backend API for products in the Jagdamba Kirana Store website.",
    version="1.0.0",
    lifespan=lifespan,
)

# Local development only. Restrict origins to your real domain before deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "null",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=60)
    price: float = Field(gt=0)
    image: str = Field(default="", max_length=1000)
    description: str = Field(default="", max_length=500)
    stock: int = Field(default=0, ge=0)
    unit: str = Field(default="1 pack", max_length=30)
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    category: Optional[str] = Field(default=None, min_length=2, max_length=60)
    price: Optional[float] = Field(default=None, gt=0)
    image: Optional[str] = Field(default=None, max_length=1000)
    description: Optional[str] = Field(default=None, max_length=500)
    stock: Optional[int] = Field(default=None, ge=0)
    unit: Optional[str] = Field(default=None, max_length=30)
    featured: Optional[bool] = None


def serialize_product(product: dict) -> dict:
    product["id"] = str(product.pop("_id"))
    return product


@app.get("/")
def home():
    return {"message": "Welcome to Jagdamba Kirana Store API", "docs": "/docs"}


@app.get("/api/health")
def health_check():
    try:
        client.admin.command("ping")
        return {"status": "ok", "database": DATABASE_NAME, "mongodb": "connected"}
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="MongoDB is not reachable. Check your connection settings.") from exc


@app.get("/api/products")
def get_products(
    search: Optional[str] = Query(default=None, max_length=100),
    category: Optional[str] = Query(default=None, max_length=60),
    sort: str = Query(default="name", pattern="^(name|price_asc|price_desc|newest)$"),
    limit: int = Query(default=100, ge=1, le=200),
):
    filters = {}
    if search and search.strip():
        filters["name"] = {"$regex": search.strip(), "$options": "i"}
    if category and category.strip() and category.strip().lower() != "all":
        filters["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}

    sort_options = {
        "name": [("name", ASCENDING)],
        "price_asc": [("price", ASCENDING)],
        "price_desc": [("price", DESCENDING)],
        "newest": [("_id", DESCENDING)],
    }
    try:
        products = list(products_collection.find(filters).sort(sort_options[sort]).limit(limit))
        return {"items": [serialize_product(p) for p in products], "count": len(products)}
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Could not retrieve products from MongoDB.") from exc


@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")
    product = products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return serialize_product(product)


@app.post("/api/products", status_code=201)
def create_product(payload: ProductCreate):
    product = payload.model_dump()
    product["name"] = product["name"].strip()
    product["category"] = product["category"].strip()
    try:
        result = products_collection.insert_one(product)
        created = products_collection.find_one({"_id": result.inserted_id})
        return serialize_product(created)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Could not save product to MongoDB.") from exc


@app.patch("/api/products/{product_id}")
def update_product(product_id: str, payload: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No update fields were provided.")
    for key in ("name", "category"):
        if key in updates and isinstance(updates[key], str):
            updates[key] = updates[key].strip()
    try:
        result = products_collection.update_one({"_id": ObjectId(product_id)}, {"$set": updates})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found.")
        return serialize_product(products_collection.find_one({"_id": ObjectId(product_id)}))
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Could not update product in MongoDB.") from exc


@app.delete("/api/products/{product_id}")
def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")
    try:
        result = products_collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found.")
        return {"message": "Product deleted successfully", "id": product_id}
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Could not delete product from MongoDB.") from exc


# 1. Order request models

class OrderItemInput(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=100)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=10, max_length=15)
    address: str = Field(min_length=10, max_length=500)
    items: list[OrderItemInput] = Field(min_length=1, max_length=50)
    payment_method: Literal["cod", "upi"]


# 2. Place a new order

@app.post("/api/orders", status_code=201)
def create_order(payload: OrderCreate):

    # Validate product IDs and combine duplicate products.
    quantities = {}

    for item in payload.items:
        if not ObjectId.is_valid(item.product_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid product ID."
            )

        quantities[item.product_id] = (
            quantities.get(item.product_id, 0) + item.quantity
        )

    if any(qty > 100 for qty in quantities.values()):
        raise HTTPException(
            status_code=400,
            detail="Maximum quantity per product is 100."
        )

    # Get product details and trusted prices from MongoDB.
    order_items = []
    total = 0.0

    try:
        for product_id, quantity in quantities.items():

            product = products_collection.find_one({
                "_id": ObjectId(product_id)
            })

            if not product:
                raise HTTPException(
                    status_code=400,
                    detail="A product no longer exists."
                )

            price = float(product["price"])

            if price <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid product price."
                )

            line_total = round(price * quantity, 2)

            order_items.append({
                "product_id": product_id,
                "name": product["name"],
                "unit": product.get("unit", "1 pack"),
                "price": price,
                "quantity": quantity,
                "line_total": line_total
            })

            total += line_total

    except PyMongoError as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve products from MongoDB."
        ) from exc

    # Reserve stock before saving the order.
    reserved = []

    try:
        for item in order_items:

            result = products_collection.update_one(
                {
                    "_id": ObjectId(item["product_id"]),
                    "stock": {"$gte": item["quantity"]}
                },
                {
                    "$inc": {"stock": -item["quantity"]}
                }
            )

            if result.modified_count != 1:
                raise HTTPException(
                    status_code=409,
                    detail=(
                        f"Insufficient stock for {item['name']}. "
                        "Refresh your cart and try again."
                    )
                )

            reserved.append(item)

        order_number = "JG-" + uuid.uuid4().hex[:10].upper()

        order = {
            "order_number": order_number,
            "customer_name": payload.customer_name.strip(),
            "phone": payload.phone.strip(),
            "address": payload.address.strip(),
            "items": order_items,
            "subtotal": round(total, 2),
            "delivery_fee": 0.0,
            "total": round(total, 2),
            "payment_method": payload.payment_method,
            "payment_status": "pending",
            "order_status": "pending",
            "created_at": datetime.now(timezone.utc)
        }

        orders_collection.insert_one(order)

        return {
            "order_number": order_number,
            "total": order["total"],
            "payment_method": order["payment_method"],
            "payment_status": order["payment_status"],
            "order_status": order["order_status"],
            "message": "Order placed successfully."
        }

    except Exception:
        # Restore stock if order creation fails.
        for item in reserved:
            try:
                products_collection.update_one(
                    {"_id": ObjectId(item["product_id"])},
                    {
                        "$inc": {"stock": item["quantity"]}
                    }
                )
            except PyMongoError:
                print(
                    "WARNING: Could not restore stock for product:",
                    item["product_id"]
                )

        raise


# 3. Order lookup endpoint
# Public order lookup is disabled for customer privacy.

@app.get("/api/orders/{order_number}")
def get_order(order_number: str):
    raise HTTPException(
        status_code=501,
        detail=(
            "Order lookup is disabled until customer "
            "authentication is implemented."
        )
    )
