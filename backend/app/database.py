import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Make default DB to SQLite if DB_CONN variable not set
if 'DB_CONN' in os.environ:
    SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN")
else:
    SQLALCHEMY_DATABASE_URL = 'sqlite:///database.db'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()