from pydantic import BaseModel, EmailStr
from datetime import datetime
from .user import UserResponse # We can reuse the UserResponse schema

class AdminLoginRequest(BaseModel):
    """
    Schema for validating the admin's login request.
    """
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    """
    Schema for returning basic admin information after a successful login.
    """
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class PendingApplicationSummary(BaseModel):
    """
    Schema for displaying a summary of a pending application on the admin dashboard.
    """
    id: int
    full_name: str
    email: EmailStr
    # submission_date: datetime # This would require a submission_date column in your User model

    class Config:
        from_attributes = True


class ApplicationDetailsResponse(UserResponse):
    """

    Schema for returning the full details of a single user application for admin review.
    It inherits all fields from UserResponse and can be expanded if needed.
    """
    # You can add more fields here if the admin needs to see more than what UserResponse provides
    pass