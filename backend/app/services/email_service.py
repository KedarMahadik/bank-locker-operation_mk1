from pydantic import EmailStr

# --- Mock Email Functions ---

def send_email_verification_link(email: EmailStr, name: str, verification_link: str):
    """
    Mocks sending the initial email verification link during registration.
    (Corresponds to Phase 1, Step 3 of your document) [cite_start][cite: 133]
    """
    subject = "[LockBank] Please Verify Your Email Address"
    body = f"""
    Hello {name},

    Thank you for starting your registration with LockBank.
    Please click the link below to verify your email address and continue:
    {verification_link}

    This link is valid for 30 minutes.

    Best regards,
    The LockBank Team
    """
    print("-------------------------------------------------")
    print(f" MOCK EMAIL SERVICE - EMAIL VERIFICATION ")
    print(f"  Recipient: {email}")
    print(f"  Subject  : {subject}")
    print(f"  Link     : {verification_link}") # For easy testing
    print("-------------------------------------------------")
    return {"status": "Verification email sent successfully (mocked)."}


def send_payment_request_email(email: str, name: str, payment_url: str):
    """
    Mocks sending an email to the user with their payment link after approval.
    (Corresponds to Phase 2, Step 8 of your document) [cite_start][cite: 416]
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


def send_welcome_credentials_email(email: str, name: str, locker_number: str, temp_password: str):
    """
    Mocks sending the final welcome email with locker and temporary credential details.
    (Corresponds to Phase 2, Step 10 of your document) [cite_start][cite: 530]
    """
    subject = "Welcome to LockBank! Your Locker is Ready"
    body = f"""
    Hello {name},

    Your payment has been successfully processed and your account is now active!

    Here are your access details:
    Locker Number: {locker_number}
    Your Email: {email}
    Temporary Password: {temp_password}

    Please log in using this temporary password. You will be required to set a new
    [cite_start]permanent password and a 4-digit PIN immediately for security. [cite: 541]

    Best regards,
    The Bank Locker Team
    """
    print("-------------------------------------------------")
    print(f" MOCK EMAIL SERVICE - WELCOME CREDENTIALS ")
    print(f"  Recipient: {email}")
    print(f"  Subject  : {subject}")
    print(f"  Locker # : {locker_number}")
    print(f"  Temp Pwd : {temp_password}") # For easy testing
    print("-------------------------------------------------")
    return {"status": "Welcome email sent successfully (mocked)."}