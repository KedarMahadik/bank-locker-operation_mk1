import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Response
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# --- Project Imports ---
from app.database import models, database
from app.schemas import admin as admin_schema
from app.security import auth
from app.services import face_service, payment_service, email_service

# --- Setup ---
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Background Task Definition (No changes here) ---
def process_user_activation(user_id: int, db: Session):
    # ... (this function remains the same)
    print(f"--- BACKGROUND TASK STARTED for User ID: {user_id} ---")
    user = db.query(models.User).filter(models.User.id == user_id, models.User.status == "PENDING_APPROVAL").first()
    if not user:
        print(f"Error: User {user_id} not found or not in PENDING_APPROVAL state.")
        return

    try:
        if user.temp_image_path and os.path.exists(user.temp_image_path):
            with open(user.temp_image_path, "rb") as f:
                image_bytes = f.read()
            embedding = face_service.get_face_embedding(image_bytes)
            
            if embedding is None:
                raise Exception("No face found in image during background processing.")

            user.face_embedding = ",".join(map(str, embedding))
            os.remove(user.temp_image_path)
            user.temp_image_path = None
        else:
            raise Exception("Temporary image file not found.")
            
        payment_url = payment_service.create_payment_session(user_id=user.id, user_email=user.email)
        if not payment_url:
            raise Exception("Failed to create Stripe payment session.")

        email_service.send_payment_request_email(email=user.email, name=user.full_name, payment_url=payment_url)

        user.status = "PENDING_PAYMENT"
        db.commit()
        
        print(f"--- User {user_id} status updated to PENDING_PAYMENT ---")

    except Exception as e:
        print(f"--- An error occurred during background processing for User ID {user_id}: {e} ---")
        user.status = "REVIEW_FAILED"
        db.commit()
        db.rollback()
    finally:
        print(f"--- BACKGROUND TASK FINISHED for User ID: {user_id} ---")


# --- API Endpoints ---

# === MODIFIED ADMIN LOGIN ENDPOINT ===
@router.post("/login")
def login_admin(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    """
    Admin login endpoint. Returns a user-like object to be compatible with the AuthContext.
    """
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not pwd_context.verify(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token = auth.create_access_token(data={"sub": admin.email, "role": "admin"})
    
    response.set_cookie(
        key="access_token", value=f"Bearer {access_token}", httponly=True
    )
    
    # Create a user-like object for the frontend AuthContext
    admin_user_object = {
        "id": admin.id,
        "email": admin.email,
        "full_name": "Administrator",
        "is_first_login": False, # Admins don't have a first-login flow
        "status": "ACTIVE"
    }

    # Return the same structure as the regular user login
    return {"access_token": access_token, "token_type": "bearer", "user": admin_user_object}


@router.get("/requests", response_model=List[admin_schema.PendingApplicationSummary])
def get_pending_requests(db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    # ... (this function remains the same)
    pending_users = db.query(models.User).filter(models.User.status == "PENDING_APPROVAL").all()
    return pending_users


@router.get("/requests/{user_id}", response_model=admin_schema.ApplicationDetailsResponse)
def get_application_details(user_id: int, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    # ... (this function remains the same)
    application = db.query(models.User).filter(models.User.id == user_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")
    return application


@router.get("/requests/{user_id}/image")
def get_application_image(user_id: int, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    # ... (this function remains the same)
    application = db.query(models.User).filter(models.User.id == user_id).first()
    if not application or not application.temp_image_path or not os.path.exists(application.temp_image_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found for this application.")
    
    return FileResponse(application.temp_image_path)


@router.post("/approve/{user_id}", status_code=status.HTTP_202_ACCEPTED)
def approve_request(user_id: int, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    # ... (this function remains the same)
    user_request = db.query(models.User).filter(models.User.id == user_id, models.User.status == "PENDING_APPROVAL").first()
    if not user_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pending application not found.")
    
    background_tasks.add_task(process_user_activation, user_id, db)
    
    return {"message": "Approval successful. User activation process has been initiated."}
