# back/app/routers/payment.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import razorpay

from app.database import database, models
from app.security import auth
from app.services import payment_service
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()

class OrderRequest(BaseModel):
    amount: float

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order", summary="Create Razorpay Payment Order")
def create_order(
    request: OrderRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Creates a Razorpay order for the logged-in user.
    """
    order_details = payment_service.create_payment_order(user_id=current_user.id, amount_inr=request.amount)
    if not order_details:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create payment order.")
    return order_details

@router.post("/verify-payment", summary="Verify Razorpay Payment Signature")
def verify_payment(
    request: PaymentVerificationRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Verifies the payment signature returned by Razorpay to confirm payment.
    """
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        })
        # If verification is successful, you can update the user's status here
        # Note: The webhook is the more reliable method for final activation.
        return {"status": "success", "message": "Payment verified successfully."}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment signature.")