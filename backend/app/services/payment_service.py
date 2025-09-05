import stripe
from app.core.config import settings

def create_payment_session(user_id: int, user_email: str) -> str:
    """
    Creates a payment session for the user.
    
    In a real application, this communicates with Stripe to generate a unique,
    secure payment link. For development, it returns a mock URL.

    Args:
        user_id: The user's unique ID from our database.
        user_email: The user's email address.

    Returns:
        A URL string for the payment page.
    """
    # Check if a real Stripe API key is configured.
    if settings.STRIPE_API_KEY:
        # --- PRODUCTION CODE: UNCOMMENT TO USE REAL STRIPE PAYMENTS ---
        # stripe.api_key = settings.STRIPE_API_KEY
        # try:
        #     checkout_session = stripe.checkout.Session.create(
        #         line_items=[
        #             {
        #                 'price_data': {
        #                     'currency': 'inr',
        #                     'product_data': {
        #                         'name': 'Bank Locker Annual Fee',
        #                     },
        #                     'unit_amount': 50000, # Amount in paise (e.g., 500.00 INR)
        #                 },
        #                 'quantity': 1,
        #             },
        #         ],
        #         mode='payment',
        #         success_url='http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
        #         cancel_url='http://localhost:3000/payment/cancel',
        #         # This is crucial: it links the Stripe session back to our user.
        #         client_reference_id=str(user_id) 
        #     )
        #     return checkout_session.url
        # except Exception as e:
        #     print(f"Error creating Stripe session: {e}")
        #     return None
        pass # Fall through to mock implementation for now

    # --- DEVELOPMENT CODE: MOCK PAYMENT LINK ---
    print("--- MOCK PAYMENT SERVICE ---")
    print(f"  Creating mock payment link for User ID: {user_id}")
    mock_url = f"http://localhost:3000/payment/success?mock_session_id=cs_test_{user_id}"
    print(f"  Mock URL: {mock_url}")
    print("--------------------------")
    return mock_url