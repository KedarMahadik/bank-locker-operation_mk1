from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

# --- Project Imports ---
from app.core.config import settings
from app.database import database, models
from app.schemas import token as token_schema

# MODIFIED: A reusable scheme for documentation purposes.
# It tells the interactive docs that a token is needed and where to get it from.
reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a new JWT (JSON Web Token) access token.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def verify_token(token: str, credentials_exception) -> token_schema.TokenData:
    """
    Decodes and verifies a JWT.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
        token_data = token_schema.TokenData(email=email)
        return token_data
    except JWTError:
        raise credentials_exception

def get_current_admin(token: str = Depends(reusable_oauth2), db: Session = Depends(database.get_db)) -> models.Admin:
    """
    A FastAPI dependency to protect routes and get the current logged-in admin.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials for admin",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(token, credentials_exception)
    admin = db.query(models.Admin).filter(models.Admin.email == token_data.email).first()
    
    if admin is None:
        raise credentials_exception
        
    return admin

# NEW: The dependency for protecting regular user routes.
def get_current_user(token: str = Depends(reusable_oauth2), db: Session = Depends(database.get_db)) -> models.User:
    """
    A FastAPI dependency to protect routes and get the current logged-in user.
    This is used by endpoints like /locker/verify-face and /locker/unlock.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials for user",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = verify_token(token, credentials_exception)
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    
    if user is None:
        raise credentials_exception
        
    return user