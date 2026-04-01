from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {'mysql_charset': 'utf8mb4', 'mysql_collate': 'utf8mb4_unicode_ci'}

    id_usuario     = Column(Integer,     primary_key=True, autoincrement=True)
    id_restaurante = Column(Integer,     nullable=False)
    nombre         = Column(String(100), nullable=False)
    email          = Column(String(100), nullable=False, unique=True)
    telefono       = Column(String(20),  nullable=True)
    password_hash  = Column(String(255), nullable=False)
    rol            = Column(Enum("admin", "cocina", "caja"), nullable=False, default="caja")
    activo         = Column(Integer,     nullable=False, default=1)
    ultimo_acceso  = Column(DateTime,    nullable=True)
    fecha_creacion = Column(DateTime,    nullable=False, server_default=func.now())
    