import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Make default DB to SQLite if DB_CONN variable not set
#if 'DB_CONN' in os.environ:
#    SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN", 'sqlite:///database.db')
#else:
#    SQLALCHEMY_DATABASE_URL = 'sqlite:///database.db'

SQLALCHEMY_DATABASE_URL = os.environ.get("DB_CONN", 'sqlite:///database.db')

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()