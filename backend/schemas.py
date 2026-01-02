from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class InventoryCreate(BaseModel):
    type: str 
    description: str
    cost: float
    stock_on_hand: float

class InventoryResponse(InventoryCreate):
    id: int
    is_deleted: bool
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    cust_name: str
    case_no: Optional[str] = None
    mobile: str
    frame_id: int
    gt1_id: int
    gt2_id: int
    re_sph: Optional[str] = None
    re_cyl: Optional[str] = None
    re_axis: Optional[str] = None
    le_sph: Optional[str] = None
    le_cyl: Optional[str] = None
    le_axis: Optional[str] = None
    add_be: Optional[str] = None
    frame_cost: float
    glass_cost: float
    discount: float
    advance: float

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    order_no: str
    order_date: datetime
    total_cost: float
    balance: float
    class Config:
        from_attributes = True