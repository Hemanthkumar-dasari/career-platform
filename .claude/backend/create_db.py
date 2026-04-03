import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Railway provides DATABASE_URL automatically
DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for pymysql
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)