from sqlalchemy import Column, Integer, String, DateTime, DECIMAL
from sqlalchemy.sql import func
from app.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente     = Column(Integer,      primary_key=True, autoincrement=True)
    id_restaurante = Column(Integer,      nullable=False)
    nombre         = Column(String(100),  nullable=False)
    telefono       = Column(String(20),   nullable=False)
    direccion      = Column(String(500),  nullable=True)
    total_pedidos  = Column(Integer,      nullable=False, default=0)
    total_gastado  = Column(DECIMAL(10,2),nullable=False, default=0.00)
    ultima_visita  = Column(DateTime,     nullable=True)
    fecha_registro = Column(DateTime,     nullable=False, server_default=func.now())