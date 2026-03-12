from sqlalchemy import Column, Integer, String, Numeric, Boolean
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id_producto    = Column(Integer,      primary_key=True, autoincrement=True)
    id_restaurante = Column(Integer,      nullable=False)
    id_categoria   = Column(Integer,      nullable=True)
    nombre         = Column(String(100),  nullable=False)
    precio         = Column(Numeric(10,2),nullable=False)
    disponible     = Column(Boolean,      nullable=False, default=True)