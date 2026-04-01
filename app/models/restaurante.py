from sqlalchemy import Column, Integer, String, TinyInteger, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Restaurante(Base):
    __tablename__ = "restaurantes"
    __table_args__ = {'mysql_charset': 'utf8mb4', 'mysql_collate': 'utf8mb4_unicode_ci'}

    id_restaurante = Column(Integer, primary_key=True, autoincrement=True)
    nombre         = Column(String(100), nullable=False)
    direccion      = Column(String(200), nullable=False)
    telefono       = Column(String(20),  nullable=False)
    telefono2      = Column(String(20),  nullable=True)
    whatsapp       = Column(String(20),  nullable=True)
    horario        = Column(String(100), nullable=True)
    activo         = Column(Integer,     nullable=False, default=1)
    fecha_creacion = Column(DateTime,    nullable=False, server_default=func.now())