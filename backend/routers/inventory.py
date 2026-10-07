from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/", response_model=List[schemas.InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(models.Inventory).all()

@router.get("/{item_id}", response_model=schemas.InventoryResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    return item

@router.post("/", response_model=schemas.InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(item_in: schemas.InventoryCreate, db: Session = Depends(get_db)):
    item = models.Inventory(**item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=schemas.InventoryResponse)
def update_inventory_item(item_id: int, item_in: schemas.InventoryCreate, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    
    for key, value in item_in.dict().items():
        setattr(item, key, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    db.delete(item)
    db.commit()
    return None

