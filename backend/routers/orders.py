import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.post("/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    subtotal = sum(item.quantity * item.unit_price for item in order_in.items)
    delivery_fee = 0 if subtotal >= 15 else 1.25
    discount_amount = 0
    if order_in.discount_code:
        promo_rules = {
            "WELCOME10": (10, 0),
            "COFFEE15": (15, 10),
            "SWEET20": (20, 20),
        }
        promo = promo_rules.get(order_in.discount_code.strip().upper())
        if not promo:
            raise HTTPException(status_code=400, detail="Invalid promo code")
        percent, minimum = promo
        if subtotal < minimum:
            raise HTTPException(status_code=400, detail=f"This code requires a minimum order of ${minimum:.2f}")
        discount_amount = subtotal * percent / 100

    total_amount = max(0, subtotal - discount_amount + delivery_fee)

    new_order = models.Order(
        order_number=order_number,
        customer_id=order_in.customer_id,
        customer_name=order_in.customer_name,
        total_amount=total_amount,
        status="Pending",
        payment_status="Unpaid",
        notes=order_in.notes
    )
    db.add(new_order)
    db.flush()

    for item in order_in.items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            subtotal=item.quantity * item.unit_price
        )
        db.add(order_item)

    # Update customer order count if customer_id exists
    if order_in.customer_id:
        cust = db.query(models.Customer).filter(models.Customer.id == order_in.customer_id).first()
        if cust:
            cust.total_orders += 1

    db.commit()
    db.refresh(new_order)
    return new_order

@router.put("/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, order_in: schemas.OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    if order_in.status is not None:
        order.status = order_in.status
    if order_in.payment_status is not None:
        order.payment_status = order_in.payment_status

    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    db.delete(order)
    db.commit()
    return None

