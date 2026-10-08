from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict, Any, Literal

from database import get_db
import models
import schemas

router = APIRouter(prefix="/reports", tags=["Reports"])

ReportPeriod = Literal["all", "day", "week", "month", "year"]
PERIOD_LENGTHS = {
    "day": timedelta(days=1),
    "week": timedelta(days=7),
    "month": timedelta(days=30),
    "year": timedelta(days=365),
}


def _period_start(period: ReportPeriod):
    duration = PERIOD_LENGTHS.get(period)
    return datetime.utcnow() - duration if duration else None


@router.get("/dashboard", response_model=schemas.DashboardReport)
def get_dashboard_metrics(period: ReportPeriod = "all", db: Session = Depends(get_db)):
    period_start = _period_start(period)
    revenue_filters = (
        models.Order.status != "Cancelled",
        models.Order.payment_status != "Refunded",
    )
    revenue_query = db.query(models.Order).filter(*revenue_filters)
    if period_start:
        revenue_query = revenue_query.filter(models.Order.created_at >= period_start)
    total_sales = revenue_query.with_entities(func.sum(models.Order.total_amount)).scalar() or 0.0
    total_sales = float(Decimal(str(total_sales)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
    revenue_order_count = revenue_query.count()

    orders_query = db.query(models.Order)
    if period_start:
        orders_query = orders_query.filter(models.Order.created_at >= period_start)
    total_orders = orders_query.count()
    total_customers = db.query(models.Customer).count()
    total_products = db.query(models.Product).count()
    
    low_stock_count = db.query(models.Inventory).filter(
        models.Inventory.quantity <= models.Inventory.min_threshold
    ).count()

    recent_orders = orders_query.order_by(models.Order.created_at.desc()).limit(5).all()

    return {
        "total_sales": float(total_sales),
        "revenue_order_count": revenue_order_count,
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "recent_orders": recent_orders
    }

@router.get("/top-products")
def get_top_selling_products(
    limit: int = 5,
    period: ReportPeriod = "all",
    db: Session = Depends(get_db),
):
    period_start = _period_start(period)
    product_sales_query = (
        db.query(
            models.OrderItem.product_name,
            func.sum(models.OrderItem.quantity).label("total_sold"),
            func.sum(models.OrderItem.subtotal).label("total_revenue")
        )
        .join(models.Order, models.Order.id == models.OrderItem.order_id)
        .filter(
            models.Order.status != "Cancelled",
            models.Order.payment_status != "Refunded",
        )
    )
    if period_start:
        product_sales_query = product_sales_query.filter(models.Order.created_at >= period_start)

    results = (
        product_sales_query
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
def get_sales_summary(period: ReportPeriod = "all", db: Session = Depends(get_db)):
    period_start = _period_start(period)
    status_query = db.query(models.Order.status, func.count(models.Order.id))
    if period_start:
        status_query = status_query.filter(models.Order.created_at >= period_start)
    status_counts = status_query.group_by(models.Order.status).all()
    return {status: count for status, count in status_counts}

