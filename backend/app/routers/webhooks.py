import stripe
import secrets
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# --- Project Imports ---
from app.core.config import settings
from app.database import models, database
from app.services import email_service

# --- Setup ---
router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Background Task Definition ---
def finalize_user_activation(user_id: int, db: Session):
    """
    This background task runs after a successful payment webhook is received.
    It activates the user's account, assigns a locker, and emails their credentials.
    """
    print(f"--- FINALIZING ACTIVATION for User ID: {user_id} ---")
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user or user.status != "PENDING_PAYMENT":
        print(f"Error: User {user_id} not found or not in PENDING_PAYMENT state.")
        return

    # 1. Generate Secure Temporary Password
    temp_password = secrets.token_urlsafe(10)
    hashed_password = pwd_context.hash(temp_password)

    # 2. Assign an available locker
    available_locker = db.query(models.Locker).filter(models.Locker.is_occupied == False).first()
    if not available_locker:
        print(f"CRITICAL ERROR: No available lockers for User ID: {user_id}")
        # In a real app, you would send an alert to an admin here.
        return
    
    available_locker.is_occupied = True
    available_locker.user_id = user.id

    # 3. Update User Record
    user.hashed_password = hashed_password
    user.status = "ACTIVE"
    user.is_first_login = True # Ensure the first-login flow is triggered
    
    db.commit()

    # 4. Send Final Credentials Email
    email_service.send_welcome_credentials_email(
        email=user.email,
        name=user.full_name,
        locker_number=available_locker.locker_number,
        temp_password=temp_password # Send the plain-text password to the user
    )
    print(f"--- ACTIVATION COMPLETE for User ID: {user_id} ---")

# --- Webhook Endpoint ---
@router.post("/stripe")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    """
    Listens for and processes incoming webhooks from Stripe.
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe webhook secret is not configured.")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('client_reference_id')
        
        if user_id:
            # Add the final activation logic to a background task
            background_tasks.add_task(finalize_user_activation, int(user_id), db)

    return {"status": "success"}