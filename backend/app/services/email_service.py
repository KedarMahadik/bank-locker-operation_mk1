from pydantic import EmailStr

# In a real application, you would install and import a library like fastapi-mail.
# from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# You would also load email settings from your core.config file.
# from app.core.config import settings

def send_welcome_email(email: EmailStr, name: str):
    """
    Mocks sending a welcome email to a newly registered user.

    Args:
        email: The recipient's email address.
        name: The recipient's name.
    """
    subject = "Welcome to the Bank Locker System!"
    body = f"""
    Hello {name},

    Thank you for registering with the Secure Bank Locker System.
    Your account has been created successfully.

    Best regards,
    The Bank Locker Team
    """

    # --- DEVELOPMENT CODE: MOCK EMAIL SENDING ---
    # This block simulates sending an email by printing the details to the console.
    print("-------------------------------------------------")
    print(f" MOCK EMAIL SERVICE ")
    print(f"  Recipient: {email}")
    print(f"  Subject  : {subject}")
    print(f"  Body     :\n{body}")
    print("-------------------------------------------------")

    # --- PRODUCTION CODE: EXAMPLE WITH fastapi-mail ---
    # conf = ConnectionConfig(
    #     MAIL_USERNAME=settings.MAIL_USERNAME,
    #     MAIL_PASSWORD=settings.MAIL_PASSWORD,
    #     MAIL_FROM=settings.MAIL_FROM,
    #     MAIL_PORT=settings.MAIL_PORT,
    #     MAIL_SERVER=settings.MAIL_SERVER,
    #     MAIL_STARTTLS=True,
    #     MAIL_SSL_TLS=False,

    # )
    # message = MessageSchema(
    #     subject=subject,
    #     recipients=[email],
    #     body=body,
    #     subtype="html"
    # )
    # fm = FastMail(conf)
    # await fm.send_message(message) # Note: this would make the function async

    return {"status": "Email sent successfully (mocked)."}

# Add this function to backend/app/services/email_service.py

def send_payment_request_email(email: str, name: str, payment_url: str):
    """
    Mocks sending an email to the user with their payment link after approval.
    """
    subject = "Your LockBank Application has been Approved!"
    body = f"""
    Hello {name},

    Congratulations! Your application has been approved by our team.
    The final step is to complete the payment for your locker.

    Please use the following secure link to complete your payment: {payment_url}

    This link will expire in 24 hours.

    Best regards,
    The Bank Locker Team
    """
    print("-------------------------------------------------")
    print(f" MOCK EMAIL SERVICE - PAYMENT REQUEST ")
    print(f"  Recipient: {email}")
    print(f"  Subject  : {subject}")
    print("-------------------------------------------------")
    return {"status": "Payment request email sent successfully (mocked)."}