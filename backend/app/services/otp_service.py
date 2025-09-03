import random
import string
from app.core.config import settings

# Import the Twilio client. This part is optional and only needed
# if you want to send real SMS messages.
# from twilio.rest import Client

def generate_otp(length: int = 6) -> str:
    """
    Generates a random, numeric One-Time Password of a given length.
    
    Args:
        length: The desired length of the OTP. Defaults to 6.

    Returns:
        A string containing the random numeric OTP.
    """
    # Define the character set to be only digits.
    characters = string.digits
    
    # Generate a random string of the specified length from the character set.
    otp = "".join(random.choice(characters) for _ in range(length))
    
    return otp

def send_otp_sms(phone_number: str, otp: str) -> bool:
    """
    Sends the OTP to the user's phone number via SMS.
    
    This function is designed to work with Twilio but defaults to printing
    the OTP to the console for easy development and testing.

    Args:
        phone_number: The recipient's phone number.
        otp: The OTP to be sent.
        
    Returns:
        True if the OTP was "sent" successfully, False otherwise.
    """
    # Check if Twilio credentials are available in our settings.
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        # --- PRODUCTION CODE: UNCOMMENT TO SEND REAL SMS ---
        # try:
        #     client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        #     message_body = f"Your Bank Locker verification code is: {otp}"
            
        #     message = client.messages.create(
        #         body=message_body,
        #         from_=settings.TWILIO_PHONE_NUMBER,
        #         to=phone_number
        #     )
        #     print(f"OTP sent successfully to {phone_number}. Message SID: {message.sid}")
        #     return True
        # except Exception as e:
        #     print(f"Failed to send OTP via Twilio: {e}")
        #     return False
        pass # Pass here to fall through to the mock implementation for now.

    # --- DEVELOPMENT CODE: MOCK SMS SENDING ---
    # If no credentials, or for testing, we print the OTP to the console.
    print("-------------------------------------------------")
    print(f" MOCK OTP SERVICE ")
    print(f"  Recipient: {phone_number}")
    print(f"  OTP Code : {otp}")
    print("-------------------------------------------------")
    return True