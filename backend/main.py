from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models, schemas, auth as auth, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="tally-optics-backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

@app.post("/auth/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.post("/inventory/", response_model=schemas.InventoryResponse)
def create_inventory_item(item: schemas.InventoryCreate, 
                          db: Session = Depends(database.get_db), 
                          current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.InventoryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/inventory/", response_model=List[schemas.InventoryResponse])
def read_inventory(skip: int = 0, limit: int = 100, type: str = None, 
                   db: Session = Depends(database.get_db),
                   current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.InventoryItem).filter(models.InventoryItem.is_deleted == False)
    if type:
        query = query.filter(models.InventoryItem.type == type)
    return query.offset(skip).limit(limit).all()


@app.post("/orders/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, 
                 db: Session = Depends(database.get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    
    total_cost = order.frame_cost + order.glass_cost - order.discount
    balance = total_cost - order.advance
    
    order_count = db.query(models.Order).count() + 1
    generated_order_no = f"{datetime.now().year}_{order_count}"

    db_order = models.Order(
        **order.dict(),
        order_no=generated_order_no,
        total_cost=total_cost,
        balance=balance
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders/", response_model=List[schemas.OrderResponse])
def read_orders(skip: int = 0, limit: int = 100, 
                db: Session = Depends(database.get_db),
                current_user: models.User = Depends(auth.get_current_user)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    return orders

@app.get("/orders/{order_id}", response_model=schemas.OrderResponse)
def read_order(order_id: int, 
               db: Session = Depends(database.get_db),
               current_user: models.User = Depends(auth.get_current_user)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order