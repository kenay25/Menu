from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.pedido import Pedido, DetallePedido
from app.models.cliente import Cliente
from app.schemas.pedido import PedidoEntrada, PedidoRespuesta, PedidoEstado
from app.routers.deps import get_usuario_actual
from decimal import Decimal

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/", response_model=PedidoRespuesta)
def crear_pedido(
    datos: PedidoEntrada,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Crea un nuevo pedido con todos sus productos."""
    from app.routers.admin import pedidos_habilitados
    if not pedidos_habilitados:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Los pedidos están temporalmente deshabilitados. Intenta más tarde."
        )

    nuevo_pedido = Pedido(
        id_restaurante=usuario.id_restaurante,
        nombre_cliente=datos.nombre_cliente,
        telefono_cliente=datos.telefono_cliente,
        tipo_entrega=datos.tipo_entrega,
        direccion_entrega=datos.direccion_entrega,
        entre_calles=datos.entre_calles,
        colonia_entrega=datos.colonia_entrega,
        costo_envio=datos.costo_envio,
        notas=datos.notas,
        tipo_pago=datos.tipo_pago,
        total=datos.total,
        estado="recibido"
    )

    if datos.telefono_cliente:
        cliente = db.query(Cliente).filter(
            Cliente.telefono == datos.telefono_cliente,
            Cliente.id_restaurante == usuario.id_restaurante
        ).first()

        if cliente:
            cliente.total_pedidos += 1
            cliente.total_gastado += Decimal(str(datos.total))
            cliente.ultima_visita = datetime.utcnow()
            nuevo_pedido.id_cliente = cliente.id_cliente
        else:
            nuevo_cliente = Cliente(
                id_restaurante=usuario.id_restaurante,
                nombre=datos.nombre_cliente,
                telefono=datos.telefono_cliente,
                direccion=datos.direccion_entrega,
                total_pedidos=1,
                total_gastado=Decimal(str(datos.total)),
                ultima_visita=datetime.utcnow()
            )
            db.add(nuevo_cliente)
            db.flush()
            nuevo_pedido.id_cliente = nuevo_cliente.id_cliente

    db.add(nuevo_pedido)
    db.flush()

    for producto in datos.productos:
        detalle = DetallePedido(
            id_pedido=nuevo_pedido.id_pedido,
            id_producto=producto.id_producto,
            nombre_producto=producto.nombre_producto,
            precio_unitario=producto.precio_unitario,
            cantidad=producto.cantidad,
            modificaciones=producto.modificaciones,
            costo_extra=producto.costo_extra,
            subtotal=producto.subtotal
        )
        db.add(detalle)

    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido


@router.get("/", response_model=list[PedidoRespuesta])
def listar_pedidos(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Lista todos los pedidos del restaurante ordenados por fecha."""
    pedidos = db.query(Pedido).filter(
        Pedido.id_restaurante == usuario.id_restaurante
    ).order_by(Pedido.fecha_pedido.desc()).all()

    return pedidos


@router.get("/activos", response_model=list[PedidoRespuesta])
def pedidos_activos(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Lista solo los pedidos activos — recibido, preparando, listo."""
    pedidos = db.query(Pedido).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        Pedido.estado.in_(["recibido", "preparando", "listo"])
    ).order_by(Pedido.fecha_pedido.asc()).all()

    return pedidos


@router.get("/{id_pedido}", response_model=PedidoRespuesta)
def obtener_pedido(
    id_pedido: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Obtiene el detalle de un pedido específico."""
    pedido = db.query(Pedido).filter(
        Pedido.id_pedido == id_pedido,
        Pedido.id_restaurante == usuario.id_restaurante
    ).first()

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    return pedido


@router.patch("/{id_pedido}/estado", response_model=PedidoRespuesta)
def cambiar_estado(
    id_pedido: int,
    datos: PedidoEstado,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Cambia el estado de un pedido."""
    estados_validos = ["recibido", "preparando", "listo", "entregado", "cancelado"]

    if datos.estado not in estados_validos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Estado inválido. Opciones: {estados_validos}"
        )

    pedido = db.query(Pedido).filter(
        Pedido.id_pedido == id_pedido,
        Pedido.id_restaurante == usuario.id_restaurante
    ).first()

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado"
        )

    pedido.estado = datos.estado
    db.commit()
    db.refresh(pedido)
    return pedido