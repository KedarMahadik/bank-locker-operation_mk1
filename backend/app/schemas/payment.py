# back/app/services/payment_service.py
import razorpay
from app.core.config import settings

def create_payment_order(user_id: int, amount_inr: float) -> dict:
    """
    Creates a payment order using Razorpay and returns order details.
    Amount should be in INR (e.g., 500.00).
    """
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise Exception("Razorpay credentials are not configured.")

    try:
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Amount must be in the smallest currency unit (paise for INR)
        amount_in_paise = int(amount_inr * 100)
        
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_locker_{user_id}",
            "notes": {
                "user_id": str(user_id)
            }
        }
        
        order = client.order.create(data=order_data)
        
        return {
            "order_id": order['id'],
            "amount": order['amount'],
            "currency": order['currency'],
            "key": settings.RAZORPAY_KEY_ID
        }
    except Exception as e:
        print(f"Error creating Razorpay order: {e}")
        return None