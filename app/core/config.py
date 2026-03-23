from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 días

    # Admin inicial
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_NOMBRE: str = "Kenay"

    # Backups
    BACKUP_DIR: str = "backups"
    MAX_BACKUPS: int = 5
    BACKUP_HORA: int = 2

    # App
    APP_ENV: str = "development"

    # CORS - Dominios permitidos (separados por coma)
    CORS_ORIGINS: str = "https://laesquinadelsushi.vercel.app"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 30  # Peticiones por minuto por IP
    RATE_LIMIT_LOGIN_PER_MINUTE: int = 5  # Intentos de login por minuto

    def get_cors_origins(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()