from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Manages and validates the application's environment variables and settings.
    
    This class uses Pydantic's BaseSettings to automatically read variables
    from the .env file and the system environment.
    """
    
    # --- Database Configuration ---
    # Loaded from your .env file
    DATABASE_URL: str

    # --- Security & JWT Configuration ---
    # SECRET_KEY is loaded from your .env file
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- Service-Specific Configuration ---
    # Core application settings with sensible defaults
    FACE_MATCH_THRESHOLD: float = 0.5
    OTP_EXPIRY_MINUTES: int = 5

    # --- Optional Third-Party Services ---
    # Loaded from .env and are optional. If blank, the app uses mock services.
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    STRIPE_API_KEY: str = ""
    
    # --- Development & Testing ---
    # A static OTP for bypassing real verification in development, loaded from .env
    EMERGENCY_OTP: Optional[str] = None

    # This special variable tells Pydantic where to find the .env file.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')


# Create a single, importable instance of the Settings class.
# All other parts of the application will import this `settings` object.
settings = Settings()