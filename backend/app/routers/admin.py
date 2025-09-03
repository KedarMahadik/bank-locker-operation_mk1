from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# --- Project Imports ---
from app.database import models
from app.database.database import get_db
from app.schemas import admin as admin_schema
from app.schemas import token as token_schema
from app.security import auth
from app.services import payment_service, email_service

# --- Password Hashing Setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Router Initialization ---
router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# --- Background Task Definition ---
def process_user_activation(user_id: int, db: Session):
    """
    This function runs in the background after an admin approves a user.
    It follows the logic from your detailed document.
    """
    print(f"--- BACKGROUND TASK STARTED for User ID: {user_id} ---")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.status != "PENDING_APPROVAL":
        print(f"Error: User {user_id} not found or not in correct state.")
        return

    # In a real app, you would add logic here to generate the face embedding
    # from a stored photo and then delete the photo file.
    # face_service.generate_and_save_embedding(user_id, db)
    
    # 1. Call the payment service to get a payment link
    payment_url = payment_service.create_payment_session(user_id=user.id, user_email=user.email)

    if payment_url:
        # 2. Email the payment link to the user
        email_service.send_payment_request_email(email=user.email, name=user.full_name, payment_url=payment_url)

        # 3. Update the user's status to PENDING_PAYMENT
        user.status = "PENDING_PAYMENT"
        db.commit()
        print(f"--- User {user_id} status updated to PENDING_PAYMENT ---")
    else:
        print(f"--- FAILED to create payment link for User ID: {user_id} ---")
        # You could add logic here to set user status to an error state
        
    print(f"--- BACKGROUND TASK FINISHED for User ID: {user_id} ---")


# --- API Endpoints ---

@router.post("/login")
def login_admin(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Admin login endpoint. Uses the secure HttpOnly cookie method for the token.
    """
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not pwd_context.verify(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = auth.create_access_token(data={"sub": admin.email, "role": "admin"})
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite='lax',
        secure=True # Set to False if not using HTTPS in development
    )
    return {"message": "Admin login successful"}


@router.get("/requests", response_model=List[admin_schema.PendingApplicationSummary])
def get_pending_requests(db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    """
    Protected endpoint to fetch all user applications with 'PENDING_APPROVAL' status.
    """
    pending_users = db.query(models.User).filter(models.User.status == "PENDING_APPROVAL").all()
    return pending_users


@router.post("/approve/{user_id}", status_code=status.HTTP_202_ACCEPTED)
def approve_request(user_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    """
    Protected endpoint to approve a user's application.
    This triggers the automated activation process in the background.
    """
    user_request = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_request or user_request.status != "PENDING_APPROVAL":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pending application not found.")
    
    # Add the heavy processing to a background task so the admin gets an immediate response
    background_tasks.add_task(process_user_activation, user_id, db)
    
    return {"message": "Approval successful. User activation process has been initiated."}