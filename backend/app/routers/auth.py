import base64
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# --- Project Imports ---

# Database connection and models
from app.database.database import get_db
from app.database import models

# Pydantic schemas for data validation
from app.schemas.user import UserCreate, UserResponse, FaceLoginRequest

# Core services for business logic
from app.services import face_service, otp_service

# Configuration settings
from app.core.config import settings

# --- Router Initialization ---
router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint to register a new user.
    It takes user details and a photo, creates a face embedding,
    and saves the user to the database.
    """
    # Check if a user with the given email or phone number already exists.
    db_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.phone_number == user_data.phone_number)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email or phone number already exists."
        )

    # Decode the base64 image string into bytes.
    try:
        image_bytes = base64.b64decode(user_data.base64_image.split(',')[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid base64 image format.")

    # Call the face_service to generate an embedding from the image.
    embedding = face_service.get_face_embedding(image_bytes)
    if embedding is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No face detected or image quality is poor. Please try again."
        )
    # Convert the numpy array embedding to a comma-separated string for DB storage.
    embedding_str = ",".join(map(str, embedding))

    # Create a new User model instance and save it to the database.
    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        face_embedding=embedding_str
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Assign the first available locker to the new user.
    available_locker = db.query(models.Locker).filter(models.Locker.is_occupied == False).first()
    if available_locker:
        available_locker.is_occupied = True
        available_locker.user_id = new_user.id
        db.commit()

    return new_user

@router.post("/login/face", summary="Step 1: Face Authentication")
def login_with_face(request: FaceLoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint for the first step of authentication.
    It verifies the user's face and, if successful, sends an OTP.
    """
    try:
        image_bytes = base64.b64decode(request.base64_image.split(',')[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid base64 image format.")

    login_embedding = face_service.get_face_embedding(image_bytes)
    if login_embedding is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No face detected in the provided image.")
        
    all_users_with_embeddings = db.query(models.User).filter(models.User.face_embedding != None).all()
    matched_user = None

    # Iterate through all registered users to find a facial match.
    for user in all_users_with_embeddings:
        distance = face_service.compare_faces(user.face_embedding, login_embedding)
        # Check if the calculated distance is below our defined threshold.
        if distance < settings.FACE_MATCH_THRESHOLD:
            matched_user = user
            break # Stop searching once a match is found.
    
    if not matched_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Face not recognized. Authentication failed.")

    # If a match is found, generate an OTP using the otp_service.
    otp = otp_service.generate_otp()
    
    # Save the OTP and its expiry time to the user's record in the database.
    matched_user.otp = otp
    matched_user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    db.commit()

    # Send the OTP to the user's phone number.
    otp_service.send_otp_sms(matched_user.phone_number, otp)

    return {"message": "Face authentication successful. An OTP has been sent to your registered phone number.", "email": matched_user.email}