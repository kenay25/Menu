from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UsuarioLogin(BaseModel):
    email: str
    password: str


class UsuarioRespuesta(BaseModel):
    id_usuario: int
    nombre: str
    email: str
    rol: str
    activo: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioRespuesta