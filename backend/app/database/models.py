from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    """
    SQLAlchemy model for the 'users' table.
    This table stores all registered user information and their application status.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True)
    
    # MODIFIED: Now nullable, as it's generated only after admin approval.
    face_embedding = Column(String, nullable=True)
    
    # Fields for the temporary storage of the One-Time Password.
    otp = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

    # NEW: Fields from the user details form, nullable as they are added during registration.
    account_number = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)

    # NEW: To track the application and user status through the approval process.
    status = Column(String, default="PENDING_APPROVAL") # e.g., PENDING_APPROVAL, PENDING_PAYMENT, ACTIVE

    # NEW: To store the user's secure 4-digit PIN
    hashed_pin = Column(String, nullable=True)
    # Relationship to the Locker model remains the same.
    locker = relationship("Locker", back_populates="owner", uselist=False)

class Locker(Base):
    """
    SQLAlchemy model for the 'lockers' table.
    This table stores information about each locker.
    """
    __tablename__ = "lockers"

    id = Column(Integer, primary_key=True, index=True)
    locker_number = Column(String, unique=True, index=True)
    is_occupied = Column(Boolean, default=False)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="locker")

# NEW: Model for Admin users
class Admin(Base):
    """
    SQLAlchemy model for the 'admins' table.
    This table stores credentials for admin panel users.
    """
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)