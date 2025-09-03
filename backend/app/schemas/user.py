from pydantic import BaseModel, EmailStr
from typing import Optional

# ==================================
# Base Schemas
# ==================================

class UserBase(BaseModel):
    """
    Base schema containing common user attributes.
    """
    full_name: str
    email: EmailStr
    phone_number: str

# ==================================
# Schemas for API Requests (Client -> Server)
# ==================================

class UserCreate(UserBase):
    """
    Schema for registering a new user. It extends UserBase
    and requires a base64 encoded string of the user's photo.
    """
    base64_image: str

class FaceLoginRequest(BaseModel):
    """
    Schema for the first step of login (face verification).
    """
    base64_image: str

class OTPVerifyRequest(BaseModel):
    """
    Schema for the second step of login (OTP verification).
    """
    email: EmailStr
    otp: str

# ==================================
# Schemas for API Responses (Server -> Client)
# ==================================

class UserResponse(UserBase):
    """
    Schema for returning user data to the client. It includes
    the database ID and excludes any sensitive information.
    """
    id: int

    class Config:
        # This configuration allows Pydantic to create the schema
        # from a SQLAlchemy ORM model object.
        from_attributes = True

class LockerOperationResponse(BaseModel):
    """
    The final success response after a user is fully authenticated.
    This schema includes the session token (JWT) that the frontend
    should store and use for future authenticated requests.
    """
    message: str
    locker_number: str
    user_details: UserResponse
    access_token: str
    token_type: str = "bearer"

# NEW: Schema for the final unlock request
class UnlockRequest(BaseModel):
    pin: str
    otp: str