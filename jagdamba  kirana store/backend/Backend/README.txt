JAGDAMBA KIRANA STORE - PART 2 BACKEND

1. Open a terminal in this backend folder.
2. Create a virtual environment (recommended):
   python -m venv .venv

3. Activate it on Windows:
   .venv\Scripts\activate

4. Install dependencies:
   pip install -r requirements.txt

5. Copy .env.example to a file named .env.
   Replace the example MONGODB_URI with your real MongoDB Atlas connection string.
   Keep the real .env private. Do not upload it publicly.

6. In MongoDB Atlas:
   - Create a database user and use its username/password in the URI.
   - Add your current IP under Network Access for development.
   - URL-encode special characters in the database password if necessary.
   - If you see an SRV/DNS error, verify the cluster hostname and try a network/DNS check.

7. Insert demo products:
   python seed.py

8. Start the backend:
   uvicorn main:app --reload

9. Open:
   API docs: http://127.0.0.1:8000/docs
   Health:   http://127.0.0.1:8000/api/health
   Products: http://127.0.0.1:8000/api/products

IMPORTANT:
- This is a learning/development backend. Product write/update/delete endpoints are not authenticated yet.
- Do not expose it publicly until authentication/authorization and deployment security are added.
- The frontend must be updated in Part 3 to fetch products from http://127.0.0.1:8000/api/products.
