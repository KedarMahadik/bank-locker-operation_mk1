from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import base64

# --- Project Imports ---
from app.database import models, database
from app.schemas import user as user_schema
from app.security import auth
from app.services import face_service, otp_service
from app.core.config import settings

# --- Router Initialization and Setup ---
router = APIRouter(
    prefix="/locker",
    tags=["Locker Operations"]
)
# Context for verifying the user's PIN
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- API Endpoints ---

@router.post("/verify-face", summary="Locker Access: Step 1 - Face Verification")
def verify_user_face(
    request: user_schema.FaceLoginRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Protected endpoint to verify a user's face against their stored embedding.
    If successful, it sends an OTP for the next step.
    A valid user JWT is required to access this.
    """
    if not current_user.face_embedding:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has no face embedding on record.")

    try:
        image_bytes = base64.b64decode(request.base64_image.split(',')[1])
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid base64 image format.")

    login_embedding = face_service.get_face_embedding(image_bytes)
    if login_embedding is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No face detected in the provided image.")

    # Compare the live face with the logged-in user's stored embedding
    distance = face_service.compare_faces(current_user.face_embedding, login_embedding)
    
    if distance > settings.FACE_MATCH_THRESHOLD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Face not recognized.")

    # --- Success: Face is verified ---
    # Generate and send a new OTP for the final step
    otp = otp_service.generate_otp()
    current_user.otp = otp
    current_user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    db.commit()

    otp_service.send_otp_sms(current_user.phone_number, otp)

    return {"message": "Face verified successfully. An OTP has been sent for the final step."}


# In backend/app/routers/locker.py

@router.post("/unlock", summary="Locker Access: Step 2 - PIN & OTP Verification")
def unlock_locker(
    request: user_schema.UnlockRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Protected endpoint to unlock the locker.
    Requires a valid PIN and OTP. Includes an emergency OTP bypass for development.
    """
    # --- Emergency OTP Check (Bypass for Devs/Testing) ---
    if settings.EMERGENCY_OTP and request.otp == settings.EMERGENCY_OTP:
        print("--- EMERGENCY OTP USED ---")
        # Still verify the PIN for security
        if not current_user.hashed_pin or not pwd_context.verify(request.pin, current_user.hashed_pin):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid PIN.")
    else:
        # --- Normal OTP Verification ---
        if not (current_user.otp and current_user.otp_expiry):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No OTP was generated.")
        if datetime.now(timezone.utc) > current_user.otp_expiry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired.")
        if current_user.otp != request.otp:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP.")

        # --- PIN Verification ---
        if not current_user.hashed_pin or not pwd_context.verify(request.pin, current_user.hashed_pin):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid PIN.")

    # --- Success: All checks passed ---
    # Clear the real OTP if it was used
    current_user.otp = None
    current_user.otp_expiry = None
    db.commit()

    print(f"--- UNLOCK SIGNAL SENT for locker: {current_user.locker.locker_number} belonging to {current_user.email} ---")

    return {"status": "success", "message": "Access Granted. Locker is unlocked."}