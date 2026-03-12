from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.pedido import Pedido, DetallePedido
from app.models.cliente import Cliente
from app.routers.deps import get_usuario_actual

router = APIRouter(prefix="/historial", tags=["Historial"])


@router.get("/telefono/{telefono}")
def historial_por_telefono(
    telefono: str,
    db: Session = Depends(get_db)
):
    """Historial de pedidos por teléfono, sin necesidad de sesión."""
    cliente = db.query(Cliente).filter(
        Cliente.telefono == telefono
    ).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="No encontramos pedidos con ese teléfono")

    pedidos = db.query(Pedido).filter(
        Pedido.telefono_cliente == telefono,
        Pedido.estado != "cancelado"
    ).order_by(Pedido.fecha_pedido.desc()).limit(20).all()

    return {
        "cliente": {
            "nombre": cliente.nombre,
            "telefono": cliente.telefono,
            "total_pedidos": cliente.total_pedidos,
            "total_gastado": float(cliente.total_gastado)
        },
        "pedidos": [_formato_pedido(p, db) for p in pedidos]
    }


@router.get("/mi-historial")
def mi_historial(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Historial del cliente autenticado por su teléfono registrado."""
    if not usuario.telefono:
        raise HTTPException(status_code=404, detail="No tienes teléfono registrado en tu cuenta")

    cliente = db.query(Cliente).filter(
        Cliente.telefono == usuario.telefono
    ).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="No encontramos pedidos en tu cuenta")

    pedidos = db.query(Pedido).filter(
        Pedido.telefono_cliente == usuario.telefono,
        Pedido.estado != "cancelado"
    ).order_by(Pedido.fecha_pedido.desc()).limit(20).all()

    return {
        "cliente": {
            "nombre": cliente.nombre,
            "telefono": cliente.telefono,
            "total_pedidos": cliente.total_pedidos,
            "total_gastado": float(cliente.total_gastado)
        },
        "pedidos": [_formato_pedido(p, db) for p in pedidos]
    }


def _formato_pedido(p, db):
    detalles = db.query(DetallePedido).filter(
        DetallePedido.id_pedido == p.id_pedido
    ).all()

    return {
        "id_pedido": p.id_pedido,
        "fecha": p.fecha_pedido.isoformat(),
        "tipo_entrega": p.tipo_entrega,
        "estado": p.estado,
        "total": float(p.total),
        "notas": p.notas,
        "productos": [
            {
                "nombre": d.nombre_producto,
                "cantidad": d.cantidad,
                "subtotal": float(d.subtotal),
                "modificaciones": d.modificaciones
            }
            for d in detalles
        ]
    }