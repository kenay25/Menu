from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DetallePedidoEntrada(BaseModel):
    id_producto:     int
    nombre_producto: str
    precio_unitario: float
    cantidad:        int
    modificaciones:  Optional[dict]
    costo_extra:     float
    subtotal:        float


class PedidoEntrada(BaseModel):
    nombre_cliente:    str
    telefono_cliente:  Optional[str]
    tipo_entrega:      str
    direccion_entrega: Optional[str]
    entre_calles:      Optional[str]
    colonia_entrega:   Optional[str]
    costo_envio:       float = 0.0
    notas:             Optional[str]
    total:             float
    productos:         List[DetallePedidoEntrada]


class PedidoEstado(BaseModel):
    estado: str


class PedidoRespuesta(BaseModel):
    id_pedido:          int
    nombre_cliente:     str
    telefono_cliente:   Optional[str]
    tipo_entrega:       str
    direccion_entrega:  Optional[str]
    entre_calles:       Optional[str]
    colonia_entrega:    Optional[str]
    costo_envio:        float
    notas:              Optional[str]
    total:              float
    estado:             str
    fecha_pedido:       datetime
    fecha_actualizacion:datetime

    class Config:
        from_attributes = True