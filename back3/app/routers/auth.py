import base64
import os
import uuid
import io
import magic
from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# --- Project Imports ---
from app.database import database, models
from app.schemas import user as user_schema
from app.security import auth

# --- Setup ---
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
IMAGE_UPLOAD_DIR = "temp_uploads"

# --- API Endpoints ---
# No changes needed for /me, /logout, or /register
@router.get("/me", response_model=user_schema.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    return {"message": "Logout successful"}

@router.post("/register", response_model=user_schema.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user_application(user_data: user_schema.UserApplicationCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")

    try:
        if not os.path.exists(IMAGE_UPLOAD_DIR):
            os.makedirs(IMAGE_UPLOAD_DIR)
        
        image_bytes = base64.b64decode(user_data.base64_image.split(',')[1])
        
        file_type = magic.from_buffer(image_bytes, mime=True)
        if not file_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        filename = f"{uuid.uuid4()}.jpg"
        file_path = os.path.join(IMAGE_UPLOAD_DIR, filename)
        image.save(file_path, "jpeg")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Image processing failed: {e}")

    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        temp_image_path=file_path
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_bank_details = models.BankDetail(
        account_number=user_data.account_number,
        ifsc_code=user_data.ifsc_code,
        user_id=new_user.id
    )
    db.add(new_bank_details)
    db.commit()
    
    return new_user

# === MODIFIED LOGIN FUNCTION ===
@router.post("/login", response_model=user_schema.LoginResponse)
def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    """
    Handles both user and admin login and returns a consistent response object.
    """
    is_admin_login = form_data.username.startswith('admin@')

    if is_admin_login:
        admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
        if not admin or not pwd_context.verify(form_data.password, admin.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect admin credentials")
        
        # *** THE CRITICAL FIX IS HERE ***
        # Instead of a dictionary, create a proper UserResponse object for the admin.
        user_object_for_response = user_schema.UserResponse(
            id=admin.id,
            email=admin.email,
            full_name="Administrator",
            is_first_login=False,
            status="ACTIVE",
            phone_number="" # Add a placeholder for fields not on the admin model
        )
        access_token = auth.create_access_token(data={"sub": admin.email, "role": "admin"})

    else: # It's a regular user login
        user = db.query(models.User).filter(models.User.email == form_data.username).first()
        if not user or not user.hashed_password or not pwd_context.verify(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if user.status != "ACTIVE":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is not active.")
        
        user_object_for_response = user
        access_token = auth.create_access_token(data={"sub": user.email})

    response.set_cookie(
        key="access_token", 
        value=f"Bearer {access_token}", 
        httponly=True,
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_object_for_response}


@router.post("/account/setup", status_code=status.HTTP_204_NO_CONTENT)
def setup_permanent_credentials(
    request: user_schema.AccountSetupRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not current_user.is_first_login:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account already set up.")

    current_user.hashed_password = pwd_context.hash(request.new_password)
    current_user.hashed_pin = pwd_context.hash(request.new_pin)
    current_user.is_first_login = False
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)