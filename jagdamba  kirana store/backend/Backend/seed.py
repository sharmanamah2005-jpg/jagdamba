"""Insert sample products if the products collection is empty."""
from database import products_collection, client

sample_products = [
    {"name": "Aashirvaad Atta", "category": "Atta & Rice", "price": 265, "unit": "5 kg", "stock": 25, "image": "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=700&q=80", "description": "Everyday whole wheat flour", "featured": True},
    {"name": "Basmati Rice", "category": "Atta & Rice", "price": 180, "unit": "1 kg", "stock": 30, "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80", "description": "Long-grain aromatic rice", "featured": True},
    {"name": "Toor Dal", "category": "Dals & Pulses", "price": 145, "unit": "1 kg", "stock": 20, "image": "https://images.unsplash.com/photo-1515543904379-3d757bbe2a3e?auto=format&fit=crop&w=700&q=80", "description": "Protein-rich everyday dal", "featured": False},
    {"name": "Sunflower Oil", "category": "Oil & Ghee", "price": 155, "unit": "1 L", "stock": 18, "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80", "description": "Cooking oil for everyday meals", "featured": True},
    {"name": "Masala Chai", "category": "Tea & Coffee", "price": 120, "unit": "250 g", "stock": 40, "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80", "description": "Aromatic tea blend", "featured": False},
    {"name": "Bathing Soap", "category": "Personal Care", "price": 38, "unit": "1 bar", "stock": 50, "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80", "description": "Gentle daily cleansing bar", "featured": False},
]
client.admin.command("ping")
if products_collection.count_documents({}) == 0:
    products_collection.insert_many(sample_products)
    print(f"Inserted {len(sample_products)} sample products.")
else:
    print("Products collection already has data; no sample products inserted.")
client.close()
