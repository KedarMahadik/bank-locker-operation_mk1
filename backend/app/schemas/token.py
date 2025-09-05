from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """
    Schema for the access token sent to the client.
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Schema for the data encoded within the JWT.
    """
    # --- MODIFICATION: Added role field ---
    email: Optional[str] = None
    role: Optional[str] = None