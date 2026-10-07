import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/", response_model=List[schemas.PaymentResponse])
def get_payments(db: Session = Depends(get_db)):
    return db.query(models.Payment).order_by(models.Payment.created_at.desc()).all()

@router.get("/{payment_id}", response_model=schemas.PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")
    return payment

@router.post("/", response_model=schemas.PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payment_in: schemas.PaymentCreate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == payment_in.order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    transaction_id = payment_in.transaction_id or f"TXN-{uuid.uuid4().hex[:10].upper()}"
    new_payment = models.Payment(
        order_id=payment_in.order_id,
        amount=payment_in.amount,
        payment_method=payment_in.payment_method or "Cash",
        status=payment_in.status or "Completed",
        transaction_id=transaction_id
    )
    db.add(new_payment)

    # Mark the corresponding order as Paid if completed
    if new_payment.status == "Completed":
        order.payment_status = "Paid"

    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found")
    db.delete(payment)
    db.commit()
    return None

