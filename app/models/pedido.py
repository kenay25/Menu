from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, DECIMAL, JSON, Float
from sqlalchemy.sql import func
from app.database import Base


class Pedido(Base):
    __tablename__ = "pedidos"
    __table_args__ = {'mysql_charset': 'utf8mb4', 'mysql_collate': 'utf8mb4_unicode_ci'}

    id_pedido           = Column(Integer,      primary_key=True, autoincrement=True)
    id_restaurante      = Column(Integer,      nullable=False)
    id_cliente          = Column(Integer,      nullable=True)
    nombre_cliente      = Column(String(100),  nullable=False)
    telefono_cliente    = Column(String(20),   nullable=True)
    tipo_entrega        = Column(Enum("sucursal", "domicilio"), nullable=False, default="sucursal")
    direccion_entrega   = Column(Text,         nullable=True)
    entre_calles        = Column(Text,         nullable=True)
    colonia_entrega     = Column(Text,         nullable=True)
    costo_envio         = Column(Float,        nullable=True, default=0.0)
    notas               = Column(Text,         nullable=True)
    tipo_pago           = Column(String(20),   nullable=True, default='efectivo')
    total               = Column(DECIMAL(10,2),nullable=False, default=0.00)
    estado              = Column(Enum("recibido", "preparando", "listo", "entregado", "cancelado"), nullable=False, default="recibido")
    fecha_pedido        = Column(DateTime,     nullable=False, server_default=func.now())
    fecha_actualizacion = Column(DateTime,     nullable=False, server_default=func.now(), onupdate=func.now())


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"
    __table_args__ = {'mysql_charset': 'utf8mb4', 'mysql_collate': 'utf8mb4_unicode_ci'}

    id_detalle      = Column(Integer,      primary_key=True, autoincrement=True)
    id_pedido       = Column(Integer,      nullable=False)
    id_producto     = Column(Integer,      nullable=False)
    nombre_producto = Column(String(100),  nullable=False)
    precio_unitario = Column(DECIMAL(10,2),nullable=False)
    cantidad        = Column(Integer,      nullable=False, default=1)
    modificaciones  = Column(JSON,         nullable=True)
    costo_extra     = Column(DECIMAL(10,2),nullable=False, default=0.00)
    subtotal        = Column(DECIMAL(10,2),nullable=False, default=0.00)