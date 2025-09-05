from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

# --- Project Imports ---
from app.database import database, models
from app.routers import auth, locker, admin, webhooks, payment

# --- Database Table Creation ---
# This line tells SQLAlchemy to create all the tables defined in your
# models.py file if they don't already exist.
models.Base.metadata.create_all(bind=database.engine)

# --- FastAPI Application Instance ---
app = FastAPI(
    title="Bank Locker System API",
    description="Securely access your bank locker using Face and OTP authentication.",
    version="1.0.0"
)

# --- CORS Middleware ---
# This allows your React frontend (running on a different port) to make
# requests to this backend.
app.add_middleware(
    CORSMiddleware,
    # For production, you should restrict this to your frontend's actual domain
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include API Routers ---
# This is where you connect all the endpoint files from your routers/ folder.
# Adding a prefix makes all routes in that file start with the same path.
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(locker.router, prefix="/api/locker", tags=["Locker Operations"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"]) # <-- Add this line


# --- Startup Event for Initial Data ---
@app.on_event("startup")
def create_initial_data():
    """
    This function runs once when the application starts up. It's used here
    to create a default admin user and some lockers if the database is empty.
    """
    db = database.SessionLocal()
    try:
        # Create a default admin user if one doesn't exist
        if db.query(models.Admin).count() == 0:
            print("Creating default admin user...")
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            hashed_password = pwd_context.hash("AdminPassword123")
            db.add(models.Admin(email="admin@lockbank.com", hashed_password=hashed_password))
            db.commit()
            print("--- Default Admin created ---")
            print("  Email: admin@lockbank.com")
            print("  Password: AdminPassword123")
            print("---------------------------")
            
        # Create initial lockers if they don't exist
        if db.query(models.Locker).count() == 0:
            print("Creating initial set of 10 lockers...")
            for i in range(1, 11):
                db.add(models.Locker(locker_number=f"LKR{100+i}", is_occupied=False))
            db.commit()
            print("--- 10 initial lockers created ---")

    finally:
        db.close()


# --- Root Endpoint ---
@app.get("/api", tags=["Health Check"])
def read_root():
    """
    A simple endpoint to confirm that the API is running.
    """
    return {"status": "Bank Locker API is running"}