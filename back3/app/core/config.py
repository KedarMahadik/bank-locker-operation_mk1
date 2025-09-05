from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Manages and validates the application's environment variables and settings.
    
    This class uses Pydantic's BaseSettings to automatically read variables
    from the .env file and the system environment.
    """
    
    # --- Database Configuration ---
    DATABASE_URL: str

    # --- Security & JWT Configuration ---
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- Service-Specific Configuration ---
    FACE_MATCH_THRESHOLD: float = 0.5
    OTP_EXPIRY_MINUTES: int = 5


    # --- Payment Gateway Configuration ---
    # REMOVE STRIPE and ADD RAZORPAY
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    # --- Third-Party Services (Twilio) ---
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    TWILIO_VERIFY_SID: str = ""

    # --- Development & Testing ---
    EMERGENCY_OTP: Optional[str] = None

    # This tells Pydantic where to find the .env file.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')


# Create a single, importable instance of the Settings class.
settings = Settings()