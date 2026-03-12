from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, date
from app.database import get_db
from app.models.pedido import Pedido, DetallePedido
from app.models.cliente import Cliente
from app.models.usuario import Usuario
from app.routers.deps import requerir_admin
from fastapi import HTTPException, status
from app.core.security import hashear_password

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

# ── Pedidos ──────────────────────────────────────────────────

@router.get("/pedidos")
def listar_pedidos_admin(
    estado: str = None,
    limite: int = 50,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Lista pedidos con filtro opcional por estado."""
    query = db.query(Pedido).filter(
        Pedido.id_restaurante == usuario.id_restaurante
    )
    if estado:
        query = query.filter(Pedido.estado == estado)
    pedidos = query.order_by(Pedido.fecha_pedido.desc()).limit(limite).all()

    return [
        {
            "id_pedido": p.id_pedido,
            "nombre_cliente": p.nombre_cliente,
            "telefono_cliente": p.telefono_cliente,
            "tipo_entrega": p.tipo_entrega,
            "direccion_entrega": p.direccion_entrega,
            "estado": p.estado,
            "total": float(p.total),
            "notas": p.notas,
            "fecha_pedido": p.fecha_pedido.isoformat(),
        }
        for p in pedidos
    ]


@router.get("/pedidos/{id_pedido}/detalle")
def detalle_pedido_admin(
    id_pedido: int,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Detalle completo de un pedido."""
    pedido = db.query(Pedido).filter(
        Pedido.id_pedido == id_pedido,
        Pedido.id_restaurante == usuario.id_restaurante
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    detalles = db.query(DetallePedido).filter(
        DetallePedido.id_pedido == id_pedido
    ).all()

    return {
        "id_pedido": pedido.id_pedido,
        "nombre_cliente": pedido.nombre_cliente,
        "telefono_cliente": pedido.telefono_cliente,
        "tipo_entrega": pedido.tipo_entrega,
        "direccion_entrega": pedido.direccion_entrega,
        "estado": pedido.estado,
        "total": float(pedido.total),
        "notas": pedido.notas,
        "fecha_pedido": pedido.fecha_pedido.isoformat(),
        "productos": [
            {
                "nombre_producto": d.nombre_producto,
                "cantidad": d.cantidad,
                "precio_unitario": float(d.precio_unitario),
                "costo_extra": float(d.costo_extra),
                "subtotal": float(d.subtotal),
                "modificaciones": d.modificaciones
            }
            for d in detalles
        ]
    }


@router.patch("/pedidos/{id_pedido}/estado")
def cambiar_estado_pedido(
    id_pedido: int,
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Cambia el estado de un pedido."""
    pedido = db.query(Pedido).filter(
        Pedido.id_pedido == id_pedido,
        Pedido.id_restaurante == usuario.id_restaurante
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    estados_validos = ["recibido", "preparando", "listo", "entregado", "cancelado"]
    nuevo_estado = body.get("estado")
    if nuevo_estado not in estados_validos:
        raise HTTPException(status_code=400, detail="Estado inválido")

    pedido.estado = nuevo_estado
    db.commit()
    return {"ok": True, "estado": nuevo_estado}


# ── Estadísticas adicionales ─────────────────────────────────

@router.get("/estadisticas/horas-pico")
def horas_pico(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Pedidos agrupados por hora del día."""
    resultado = db.query(
        func.hour(Pedido.fecha_pedido).label("hora"),
        func.count(Pedido.id_pedido).label("total_pedidos"),
        func.sum(Pedido.total).label("total_ventas")
    ).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        Pedido.estado != "cancelado"
    ).group_by(
        func.hour(Pedido.fecha_pedido)
    ).order_by(
        func.count(Pedido.id_pedido).desc()
    ).all()

    return [
        {
            "hora": r.hora,
            "label": f"{r.hora}:00",
            "total_pedidos": r.total_pedidos,
            "total_ventas": round(float(r.total_ventas), 2)
        }
        for r in resultado
    ]


@router.get("/estadisticas/mes")
def estadisticas_mes(
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Ventas agrupadas por día del mes actual."""
    resultado = db.query(
        cast(Pedido.fecha_pedido, Date).label("fecha"),
        func.count(Pedido.id_pedido).label("total_pedidos"),
        func.sum(Pedido.total).label("total_ventas")
    ).filter(
        Pedido.id_restaurante == usuario.id_restaurante,
        Pedido.estado != "cancelado",
        func.month(Pedido.fecha_pedido) == func.month(func.now()),
        func.year(Pedido.fecha_pedido) == func.year(func.now())
    ).group_by(
        cast(Pedido.fecha_pedido, Date)
    ).order_by(
        cast(Pedido.fecha_pedido, Date).asc()
    ).all()

    return [
        {
            "fecha": str(r.fecha),
            "total_pedidos": r.total_pedidos,
            "total_ventas": round(float(r.total_ventas), 2)
        }
        for r in resultado
    ]


# ── Usuarios ─────────────────────────────────────────────────

@router.post("/usuarios")
def crear_usuario(
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Crea un nuevo usuario del restaurante."""
    email    = body.get("email", "").strip().lower()
    password = body.get("password", "").strip()
    nombre   = body.get("nombre", "").strip()
    rol      = body.get("rol", "caja")
    telefono = body.get("telefono", "").strip() or None

    if not email or not password or not nombre:
        raise HTTPException(status_code=400, detail="Nombre, email y contraseña son obligatorios")

    existente = db.query(Usuario).filter(Usuario.email == email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese email")

    nuevo = Usuario(
        id_restaurante = usuario.id_restaurante,
        email          = email,
        password_hash  = hashear_password(password),
        nombre         = nombre,
        telefono       = telefono,
        rol            = rol,
        activo         = True
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"ok": True, "id_usuario": nuevo.id_usuario}


@router.patch("/usuarios/{id_usuario}")
def editar_usuario(
    id_usuario: int,
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Edita un usuario existente."""
    u = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario,
        Usuario.id_restaurante == usuario.id_restaurante
    ).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if "nombre"   in body: u.nombre  = body["nombre"]
    if "rol"      in body: u.rol     = body["rol"]
    if "activo"   in body: u.activo  = body["activo"]
    if "telefono" in body: u.telefono = body["telefono"]
    if "password" in body and body["password"]:
        u.password_hash = hashear_password(body["password"])

    db.commit()
    return {"ok": True}


@router.delete("/usuarios/{id_usuario}")
def eliminar_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Elimina un usuario (no puede eliminarse a sí mismo)."""
    if id_usuario == usuario.id_usuario:
        raise HTTPException(status_code=400, detail="No puedes eliminarte a ti mismo")

    u = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario,
        Usuario.id_restaurante == usuario.id_restaurante
    ).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(u)
    db.commit()
    return {"ok": True}