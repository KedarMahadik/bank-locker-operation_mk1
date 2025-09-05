from fastapi import Depends, HTTPException, status, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.database import database, models
from app.schemas import token as token_schema

# This new function is the core of the fix.
# It correctly reads the auth token from the browser's cookies.
def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # The cookie value is "Bearer <token>", so we extract just the token part.
    if token.startswith("Bearer "):
        return token.split("Bearer ")[1]
    return token

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a new JSON Web Token (JWT) access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str, credentials_exception) -> token_schema.TokenData:
    """Decodes and verifies a JWT's signature, expiration, and role."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        return token_schema.TokenData(email=email, role=role)
    except JWTError:
        raise credentials_exception

def get_current_user(token: str = Depends(get_token_from_cookie), db: Session = Depends(database.get_db)):
    """
    A dependency that protects routes and gets the current logged-in entity.
    It now uses the cookie for authentication and handles both users and admins.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    
    if token_data.role == "admin":
        admin = db.query(models.Admin).filter(models.Admin.email == token_data.email).first()
        if admin is None:
            raise credentials_exception
        # Return a "user-like" object that the frontend can consistently use
        return models.User(
            id=admin.id, email=admin.email, full_name="Administrator", 
            is_first_login=False, status="ACTIVE", phone_number=""
        )
    
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(token: str = Depends(get_token_from_cookie), db: Session = Depends(database.get_db)) -> models.Admin:
    """A dependency to protect admin-only routes."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials for admin",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    if token_data.role != "admin":
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin")
    admin = db.query(models.Admin).filter(models.Admin.email == token_data.email).first()
    if admin is None:
        raise credentials_exception
    return admin

