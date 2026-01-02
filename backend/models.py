from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="staff") 

class InventoryItem(Base):
    """Represents Frames, GlassTypes, etc."""
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True) 
    description = Column(String)
    cost = Column(Float, default=0.0)
    stock_on_hand = Column(Float, default=0.0)
    is_deleted = Column(Boolean, default=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True)
    order_date = Column(DateTime, default=datetime.utcnow)
    cust_name = Column(String)
    case_no = Column(String)
    mobile = Column(String)
    frame_id = Column(Integer, ForeignKey("inventory.id"))
    gt1_id = Column(Integer, ForeignKey("inventory.id"))
    gt2_id = Column(Integer, ForeignKey("inventory.id"))
    re_sph = Column(String)
    re_cyl = Column(String)
    re_axis = Column(String)
    le_sph = Column(String)
    le_cyl = Column(String)
    le_axis = Column(String)
    add_be = Column(String) 
    frame_cost = Column(Float, default=0.0)
    glass_cost = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    advance = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)
    balance = Column(Float, default=0.0)
    frame = relationship("InventoryItem", foreign_keys=[frame_id])
    gt1 = relationship("InventoryItem", foreign_keys=[gt1_id])
    gt2 = relationship("InventoryItem", foreign_keys=[gt2_id])