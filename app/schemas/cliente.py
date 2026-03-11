from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClienteBuscar(BaseModel):
    telefono: str


class ClienteActualizar(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None


class ClienteRespuesta(BaseModel):
    id_cliente:    int
    nombre:        str
    telefono:      str
    direccion:     Optional[str]
    total_pedidos: int
    total_gastado: float
    ultima_visita: Optional[datetime]

    class Config:
        from_attributes = True