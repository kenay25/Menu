from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Asegurar charset utf8mb4 para soportar emojis
database_url = settings.DATABASE_URL
if "?" not in database_url:
    database_url += "?charset=utf8mb4"
elif "charset" not in database_url.lower():
    database_url += "&charset=utf8mb4"

engine = create_engine(
    database_url,
    echo=settings.APP_ENV == "development",
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    poolclass=None,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()