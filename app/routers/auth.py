from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.core.security import verificar_password, crear_token
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioLogin, Token, UsuarioRespuesta
from app.routers.deps import get_usuario_actual
from app.core.security import hashear_password

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=Token)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    """Inicia sesión y devuelve un token JWT."""

    # Buscar usuario por email
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    if not verificar_password(datos.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )

    # Actualizar último acceso
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()

    # Generar token
    token = crear_token({"sub": usuario.email, "rol": usuario.rol})

    return Token(
        access_token=token,
        token_type="bearer",
        usuario=UsuarioRespuesta.model_validate(usuario)
    )


@router.get("/me", response_model=UsuarioRespuesta)
def mi_perfil(usuario: Usuario = Depends(get_usuario_actual)):
    """Devuelve los datos del usuario autenticado."""
    return usuario

@router.post("/registro", response_model=Token)
def registro(datos: dict, db: Session = Depends(get_db)):
    """Registra un nuevo cliente y devuelve un token JWT."""

    email    = datos.get("email", "").strip().lower()
    password = datos.get("password", "").strip()
    nombre   = datos.get("nombre", "").strip()
    telefono = datos.get("telefono", "").strip() or None

    if not email or not password or not nombre:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Nombre, email y contraseña son obligatorios"
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="La contraseña debe tener al menos 6 caracteres"
        )

    # Verificar que el email no exista ya
    existente = db.query(Usuario).filter(Usuario.email == email).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta con ese email"
        )

    # Crear usuario con rol caja (cliente)
    nuevo = Usuario(
        email         = email,
        password_hash = hashear_password(password),
        nombre        = nombre,
        telefono      = telefono,
        rol           = "caja",
        activo        = True
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    # Generar token automáticamente
    token = crear_token({"sub": nuevo.email, "rol": nuevo.rol})

    return Token(
        access_token=token,
        token_type="bearer",
        usuario=UsuarioRespuesta.model_validate(nuevo)
    )