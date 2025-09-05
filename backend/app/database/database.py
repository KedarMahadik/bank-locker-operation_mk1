from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create the SQLAlchemy engine using the DATABASE_URL from our settings.
# The `connect_args` is needed only for SQLite to allow multi-threaded access,
# which is required by FastAPI.
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Each instance of the SessionLocal class will be a database session.
# This is the factory that will create the individual connections for each request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This Base class will be used by our ORM models (in models.py) to inherit from.
Base = declarative_base()

# This is a FastAPI dependency that provides a database session for each API request.
def get_db():
    """
    Yields a database session to the API endpoint and ensures it's
    properly closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()