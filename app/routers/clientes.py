from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteBuscar, ClienteRespuesta
from app.routers.deps import get_usuario_actual

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("/buscar/{telefono}")
def buscar_cliente(telefono: str, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    # Buscar con y sin código de país
    tel_limpio = telefono.lstrip('52') if telefono.startswith('52') and len(telefono) > 10 else telefono
    tel_con_codigo = '52' + tel_limpio if not tel_limpio.startswith('52') else tel_limpio
    
    cliente = db.query(Cliente).filter(
        Cliente.telefono.in_([telefono, tel_limpio, tel_con_codigo])
    ).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@router.get("/", response_model=list[ClienteRespuesta])
def listar_clientes(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Lista todos los clientes del restaurante."""
    clientes = db.query(Cliente).filter(
        Cliente.id_restaurante == usuario.id_restaurante
    ).order_by(Cliente.total_gastado.desc()).all()

    return clientes


@router.put("/{id_cliente}", response_model=ClienteRespuesta)
def actualizar_cliente(
    id_cliente: int,
    datos: ClienteBuscar,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Actualiza los datos de un cliente."""
    cliente = db.query(Cliente).filter(
        Cliente.id_cliente == id_cliente,
        Cliente.id_restaurante == usuario.id_restaurante
    ).first()

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    for key, value in datos.model_dump(exclude_unset=True).items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)
    return cliente