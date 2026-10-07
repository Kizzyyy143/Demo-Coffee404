import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base, SessionLocal
import models
from auth import get_password_hash
from routers import (
    auth,
    products,
    categories,
    orders,
    customers,
    employees,
    inventory,
    payments,
    reports
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Coffee Shop API",
    description="Full-featured RESTful backend API for Coffee Shop management system",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for product images
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if users already seeded
        if db.query(models.User).count() == 0:
            admin_user = models.User(
                username="admin",
                email="admin@coffeeshop.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Head Barista & Admin",
                role="admin",
                phone="081-234-5678"
            )
            db.add(admin_user)

            # Seed Categories
            cat_coffee = models.Category(name="Espresso & Coffee", description="Rich aromatic brewed coffee and espresso drinks")
            cat_tea = models.Category(name="Teas & Matcha", description="Organic ceremonial grade matchas and fragrant teas")
            cat_pastry = models.Category(name="Bakery & Pastries", description="Freshly baked artisan croissants and treats")
            db.add_all([cat_coffee, cat_tea, cat_pastry])
            db.flush()

            # Seed Products
            sample_products = [
                models.Product(name="Signature Espresso", description="Dark roast with notes of caramel and dark chocolate", price=3.50, category_id=cat_coffee.id, image_url="/images/coffee-1.png", is_available=True),
                models.Product(name="Vanilla Latte", description="Silky steamed milk poured over rich espresso with vanilla syrup", price=4.75, category_id=cat_coffee.id, image_url="/images/coffee-2.png", is_available=True),
                models.Product(name="Iced Americano", description="Crisp chilled espresso with cold filtered water", price=4.00, category_id=cat_coffee.id, image_url="/images/coffee-3.png", is_available=True),
                models.Product(name="Ceremonial Iced Matcha", description="Uji Kyoto ceremonial matcha with choice of fresh oat or dairy milk", price=5.25, category_id=cat_tea.id, image_url="/images/matcha.png", is_available=True),
                models.Product(name="Classic Brown Sugar Milk Tea", description="Black tea brew, creamy milk, and chewy brown sugar pearls", price=4.95, category_id=cat_tea.id, image_url="/images/milk-tea.png", is_available=True),
            ]
            db.add_all(sample_products)

            # Seed Inventory
            sample_inventory = [
                models.Inventory(item_name="Arabica Espresso Beans", category="Beans", quantity=25.0, unit="kg", min_threshold=10.0, cost_per_unit=18.0),
                models.Inventory(item_name="Whole Milk", category="Dairy", quantity=40.0, unit="liters", min_threshold=15.0, cost_per_unit=2.5),
                models.Inventory(item_name="Oat Milk Barista Edition", category="Dairy", quantity=20.0, unit="liters", min_threshold=8.0, cost_per_unit=3.8),
                models.Inventory(item_name="Uji Matcha Powder", category="Tea", quantity=5.0, unit="kg", min_threshold=2.0, cost_per_unit=45.0),
                models.Inventory(item_name="Eco Takeout Cups 12oz", category="Packaging", quantity=350.0, unit="units", min_threshold=100.0, cost_per_unit=0.25),
            ]
            db.add_all(sample_inventory)

            # Seed Employees
            sample_employees = [
                models.Employee(name="Alex River", email="alex@coffeeshop.com", phone="082-111-2233", position="Store Manager", salary=3500.0, shift="Morning"),
                models.Employee(name="Sam Taylor", email="sam@coffeeshop.com", phone="083-444-5566", position="Lead Barista", salary=2800.0, shift="Morning"),
                models.Employee(name="Jordan Lee", email="jordan@coffeeshop.com", phone="084-777-8899", position="Barista", salary=2400.0, shift="Afternoon"),
            ]
            db.add_all(sample_employees)

            # Seed Customer
            sample_customer = models.Customer(
                name="Emily Watson",
                email="emily@example.com",
                phone="089-999-0000",
                address="123 Coffee Ave, Suite 4B",
                total_orders=1
            )
            db.add(sample_customer)

            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Startup seed notice: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "name": "Coffee Shop API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

