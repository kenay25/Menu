from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.producto import Producto
from app.routers.deps import requerir_admin, get_usuario_actual

router = APIRouter(prefix="/productos", tags=["Productos"])


def _serializar(p: Producto) -> dict:
    """Serializa un producto con todos sus campos."""
    return {
        "id_producto":      p.id_producto,
        "id_categoria":     p.id_categoria,
        "nombre":           p.nombre,
        "precio":           float(p.precio),
        "disponible":       p.disponible,
        "descripcion":      p.descripcion,
        "emoji":            p.emoji or "🍣",
        "tag":              p.tag,
        "has_alga":         bool(p.has_alga),
        "has_style":        bool(p.has_style),
        "has_protein":      bool(p.has_protein),
        "has_sauce":        bool(p.has_sauce),
        "has_sauce_1only":  bool(p.has_sauce_1only),
        "has_sauce_2":      bool(p.has_sauce_2),
        "has_sauce_alitas": bool(p.has_sauce_alitas),
        "has_sushi_choice": bool(p.has_sushi_choice),
        "has_ice":          bool(p.has_ice),
        "is_extra_ing":     bool(p.is_extra_ing),
        "ingredientes":     p.ingredientes or [],
        "extras_producto":  p.extras_producto or [],
        "imagen_url":       p.imagen_url or None,
    }


@router.get("/")
def listar_productos(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Lista todos los productos del restaurante con todos sus campos."""
    productos = db.query(Producto).filter(
        Producto.id_restaurante == usuario.id_restaurante
    ).order_by(Producto.id_categoria, Producto.nombre).all()
    return [_serializar(p) for p in productos]


@router.get("/{id_producto}")
def obtener_producto(
    id_producto: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Obtiene un producto por ID."""
    p = db.query(Producto).filter(
        Producto.id_producto == id_producto,
        Producto.id_restaurante == usuario.id_restaurante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _serializar(p)


@router.post("/")
def crear_producto(
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Crea un nuevo producto con todos sus campos."""
    nuevo = Producto(
        id_restaurante  = usuario.id_restaurante,
        nombre          = body.get("nombre"),
        precio          = body.get("precio"),
        id_categoria    = body.get("id_categoria"),
        disponible      = body.get("disponible", True),
        descripcion     = body.get("descripcion"),
        emoji           = body.get("emoji", "🍣"),
        tag             = body.get("tag") or None,
        has_alga        = bool(body.get("has_alga", False)),
        has_style       = bool(body.get("has_style", False)),
        has_protein     = bool(body.get("has_protein", False)),
        has_sauce       = bool(body.get("has_sauce", False)),
        has_sauce_1only = bool(body.get("has_sauce_1only", False)),
        has_sauce_2     = bool(body.get("has_sauce_2", False)),
        has_sauce_alitas= bool(body.get("has_sauce_alitas", False)),
        has_sushi_choice= bool(body.get("has_sushi_choice", False)),
        has_ice         = bool(body.get("has_ice", False)),
        is_extra_ing    = bool(body.get("is_extra_ing", False)),
        ingredientes    = body.get("ingredientes", []),
        extras_producto = body.get("extras_producto", []),
        imagen_url      = body.get("imagen_url") or None,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"ok": True, "id_producto": nuevo.id_producto}


@router.put("/{id_producto}")
def editar_producto(
    id_producto: int,
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Edita un producto existente — todos los campos."""
    p = db.query(Producto).filter(
        Producto.id_producto == id_producto,
        Producto.id_restaurante == usuario.id_restaurante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    campos = [
        "nombre", "precio", "id_categoria", "disponible",
        "descripcion", "emoji", "tag", "imagen_url",
        "has_alga", "has_style", "has_protein",
        "has_sauce", "has_sauce_1only", "has_sauce_2", "has_sauce_alitas",
        "has_sushi_choice", "has_ice", "is_extra_ing",
        "ingredientes", "extras_producto",
    ]
    bool_campos = {
        "has_alga", "has_style", "has_protein", "has_sauce",
        "has_sauce_1only", "has_sauce_2", "has_sauce_alitas",
        "has_sushi_choice", "has_ice", "is_extra_ing", "disponible",
    }
    for campo in campos:
        if campo in body:
            valor = body[campo]
            if campo in bool_campos:
                valor = bool(valor)
            if campo == "tag" and valor == "":
                valor = None
            setattr(p, campo, valor)

    db.commit()
    return {"ok": True}


@router.patch("/{id_producto}/disponibilidad")
def cambiar_disponibilidad(
    id_producto: int,
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Marca un producto como disponible o agotado."""
    p = db.query(Producto).filter(
        Producto.id_producto == id_producto,
        Producto.id_restaurante == usuario.id_restaurante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    p.disponible = body.get("disponible", True)
    db.commit()
    return {"ok": True, "disponible": p.disponible}


@router.delete("/{id_producto}")
def eliminar_producto(
    id_producto: int,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Elimina un producto."""
    p = db.query(Producto).filter(
        Producto.id_producto == id_producto,
        Producto.id_restaurante == usuario.id_restaurante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(p)
    db.commit()
    return {"ok": True}