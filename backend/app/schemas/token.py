from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """
    Schema for the access token sent to the client.
    This is the "ID card" the user receives after a successful login.
    """
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """
    Schema for the data encoded within the JWT.
    This is the information stored inside the "ID card,"
    typically the user's identifier (like their email or ID).
    """
    email: Optional[str] = None