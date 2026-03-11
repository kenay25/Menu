from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, date
from app.database import get_db
from app.models.pedido import Pedido, DetallePedido
from app.models.cliente import Cliente
from app.models.usuario import Usuario
from app.routers.deps import requerir_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/estadisticas/hoy")
def estadisticas_hoy(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Estadísticas del día actual."""
    hoy = date.today()

    pedidos_hoy = db.query(Pedido).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        cast(Pedido.fecha_pedido, Date) == hoy,
        Pedido.estado != "cancelado"
    ).all()

    total_ventas = sum(float(p.total) for p in pedidos_hoy)
    total_pedidos = len(pedidos_hoy)
    ticket_promedio = total_ventas / total_pedidos if total_pedidos > 0 else 0

    return {
        "fecha": hoy.isoformat(),
        "total_pedidos": total_pedidos,
        "total_ventas": round(total_ventas, 2),
        "ticket_promedio": round(ticket_promedio, 2),
        "a_domicilio": sum(1 for p in pedidos_hoy if p.tipo_entrega == "domicilio"),
        "en_sucursal": sum(1 for p in pedidos_hoy if p.tipo_entrega == "sucursal"),
        "entregados": sum(1 for p in pedidos_hoy if p.estado == "entregado"),
        "en_proceso": sum(1 for p in pedidos_hoy if p.estado in ["recibido", "preparando", "listo"]),
    }


@router.get("/estadisticas/semana")
def estadisticas_semana(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Ventas agrupadas por día de los últimos 7 días."""
    resultado = db.query(
        cast(Pedido.fecha_pedido, Date).label("fecha"),
        func.count(Pedido.id_pedido).label("total_pedidos"),
        func.sum(Pedido.total).label("total_ventas")
    ).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        Pedido.estado != "cancelado",
        Pedido.fecha_pedido >= func.date_sub(func.now(), func.interval(7, "DAY"))
    ).group_by(
        cast(Pedido.fecha_pedido, Date)
    ).order_by(
        cast(Pedido.fecha_pedido, Date).desc()
    ).all()

    return [
        {
            "fecha": str(r.fecha),
            "total_pedidos": r.total_pedidos,
            "total_ventas": round(float(r.total_ventas), 2)
        }
        for r in resultado
    ]


@router.get("/productos/mas-vendidos")
def productos_mas_vendidos(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Top 10 productos más vendidos."""
    resultado = db.query(
        DetallePedido.nombre_producto,
        func.sum(DetallePedido.cantidad).label("veces_pedido"),
        func.sum(DetallePedido.subtotal).label("ingresos")
    ).join(
        Pedido, Pedido.id_pedido == DetallePedido.id_pedido
    ).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        Pedido.estado != "cancelado"
    ).group_by(
        DetallePedido.nombre_producto
    ).order_by(
        func.sum(DetallePedido.cantidad).desc()
    ).limit(10).all()

    return [
        {
            "producto": r.nombre_producto,
            "veces_pedido": r.veces_pedido,
            "ingresos": round(float(r.ingresos), 2)
        }
        for r in resultado
    ]


@router.get("/clientes/top")
def mejores_clientes(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Top 10 mejores clientes por total gastado."""
    clientes = db.query(Cliente).filter(
        Cliente.id_restaurante == usuario.id_restaurante,
        Cliente.total_pedidos > 0
    ).order_by(
        Cliente.total_gastado.desc()
    ).limit(10).all()

    return [
        {
            "nombre": c.nombre,
            "telefono": c.telefono,
            "total_pedidos": c.total_pedidos,
            "total_gastado": float(c.total_gastado),
            "ultima_visita": c.ultima_visita.isoformat() if c.ultima_visita else None
        }
        for c in clientes
    ]


@router.get("/usuarios")
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Lista todos los usuarios del restaurante."""
    usuarios = db.query(Usuario).filter(
        Usuario.id_restaurante == usuario.id_restaurante
    ).all()

    return [
        {
            "id_usuario": u.id_usuario,
            "nombre": u.nombre,
            "email": u.email,
            "rol": u.rol,
            "activo": u.activo,
            "ultimo_acceso": u.ultimo_acceso.isoformat() if u.ultimo_acceso else None
        }
        for u in usuarios
    ]