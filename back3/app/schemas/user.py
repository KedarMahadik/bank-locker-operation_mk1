from pydantic import BaseModel, EmailStr
from typing import Optional

# --- Base & General Response Schemas ---

class UserBase(BaseModel):
    """
    Base schema with common user attributes.
    """
    full_name: str
    email: EmailStr
    phone_number: str

class UserResponse(UserBase):
    """
    UPDATED: Schema for returning user data. Now includes the status and
    the critical is_first_login flag for frontend logic.
    """
    id: int
    is_first_login: bool
    status: str

    class Config:
        from_attributes = True

# --- Registration Flow Schemas ---

class UserApplicationCreate(UserBase):
    """
    NEW: A comprehensive schema for the final registration submission,
    including bank details and the face photo.
    """
    account_number: str
    ifsc_code: str
    base64_image: str

# --- Login and Account Setup Schemas ---

class LoginResponse(BaseModel):
    """
    NEW: The response model for a successful login. It provides the token
    and the user object, which contains the is_first_login flag.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AccountSetupRequest(BaseModel):
    """
    NEW: The schema for the one-time account setup where the user
    sets their permanent password and PIN.
    """
    new_password: str
    new_pin: str

# --- Locker Access Flow Schemas ---

class FaceLoginRequest(BaseModel):
    """
    KEPT: Schema for the face verification step at the locker.
    """
    base64_image: str

class UnlockRequest(BaseModel):
    """
    KEPT: Schema for the final unlock request, requiring a PIN and OTP.
    """
    pin: str
    otp: str