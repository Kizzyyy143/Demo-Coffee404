from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from database import get_db
import models
import schemas

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/dashboard", response_model=schemas.DashboardReport)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_sales = db.query(func.sum(models.Order.total_amount)).filter(
        models.Order.status != "Cancelled"
    ).scalar() or 0.0

    total_orders = db.query(models.Order).count()
    total_customers = db.query(models.Customer).count()
    total_products = db.query(models.Product).count()
    
    low_stock_count = db.query(models.Inventory).filter(
        models.Inventory.quantity <= models.Inventory.min_threshold
    ).count()

    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(5).all()

    return {
        "total_sales": float(total_sales),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "recent_orders": recent_orders
    }

@router.get("/top-products")
def get_top_selling_products(limit: int = 5, db: Session = Depends(get_db)):
    results = (
        db.query(
            models.OrderItem.product_name,
            func.sum(models.OrderItem.quantity).label("total_sold"),
            func.sum(models.OrderItem.subtotal).label("total_revenue")
        )
        .group_by(models.OrderItem.product_name)
        .order_by(func.sum(models.OrderItem.quantity).desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "product_name": row[0],
            "total_sold": row[1],
            "total_revenue": float(row[2] or 0.0)
        }
        for row in results
    ]

@router.get("/sales-summary")
def get_sales_summary(db: Session = Depends(get_db)):
    status_counts = (
        db.query(models.Order.status, func.count(models.Order.id))
        .group_by(models.Order.status)
        .all()
    )
    return {status: count for status, count in status_counts}

