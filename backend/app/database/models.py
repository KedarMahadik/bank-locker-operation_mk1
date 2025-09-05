from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    """
    SQLAlchemy model for the 'users' table.
    This table stores core user information and their application status.
    Bank details and nominees are now in separate tables.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True)
    
    face_embedding = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    hashed_pin = Column(String, nullable=True)
    temp_image_path = Column(String, nullable=True)
    is_first_login = Column(Boolean, default=True)
    status = Column(String, default="PENDING_APPROVAL")
    
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

    # Relationships to other tables
    locker = relationship("Locker", back_populates="owner", uselist=False)
    bank_details = relationship("BankDetail", back_populates="user", uselist=False)
    nominees = relationship("Nominee", back_populates="user")

class BankDetail(Base):
    """
    NEW: SQLAlchemy model for the 'bank_details' table.
    Stores sensitive user bank information, linked to a user.
    """
    __tablename__ = "bank_details"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String)
    ifsc_code = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="bank_details")

class Nominee(Base):
    """
    NEW: SQLAlchemy model for the 'nominees' table.
    Stores nominee information, linked to a user.
    """
    __tablename__ = "nominees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    # MODIFIED: Renamed 'relationship' to 'relation' to avoid conflict
    relation = Column(String)
    phone = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="nominees")

class Locker(Base):
    """ SQLAlchemy model for the 'lockers' table. """
    __tablename__ = "lockers"

    id = Column(Integer, primary_key=True, index=True)
    locker_number = Column(String, unique=True, index=True)
    is_occupied = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="locker")

class Admin(Base):
    """ SQLAlchemy model for the 'admins' table. """
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)