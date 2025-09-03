from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the database engine and models
from app.database.database import engine
from app.database import models

# Import the API routers
from app.routers import auth, locker

# Create all database tables based on the models
# This command runs on startup and creates the tables if they don't exist.
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application
app = FastAPI(
    title="Bank Locker System API",
    description="Securely access your bank locker using Face and OTP authentication.",
    version="1.0.0"
)

# Set up CORS (Cross-Origin Resource Sharing) middleware
# This allows your frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API routers from other files
# This makes the endpoints in auth.py and locker.py part of the main app.
app.include_router(auth.router, tags=["Authentication"])
app.include_router(locker.router, tags=["Locker Operations"])

# Create a simple root endpoint for a health check
@app.get("/", tags=["Health Check"])
def read_root():
    """
    A simple endpoint to confirm that the API is running.
    """
    return {"status": "Bank Locker API is running"}