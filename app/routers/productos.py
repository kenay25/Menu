from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.producto import Producto
from app.routers.deps import requerir_admin, get_usuario_actual

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/")
def listar_productos(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_actual)
):
    """Lista todos los productos del restaurante."""
    productos = db.query(Producto).filter(
        Producto.id_restaurante == usuario.id_restaurante
    ).order_by(Producto.id_categoria, Producto.nombre).all()

    return [
        {
            "id_producto": p.id_producto,
            "nombre": p.nombre,
            "precio": float(p.precio),
            "id_categoria": p.id_categoria,
            "disponible": p.disponible,
        }
        for p in productos
    ]


@router.post("/")
def crear_producto(
    body: dict,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_admin)
):
    """Crea un nuevo producto."""
    nuevo = Producto(
        id_restaurante = usuario.id_restaurante,
        nombre         = body.get("nombre"),
        precio         = body.get("precio"),
        id_categoria   = body.get("id_categoria"),
        disponible     = body.get("disponible", True)
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
    """Edita un producto existente."""
    p = db.query(Producto).filter(
        Producto.id_producto == id_producto,
        Producto.id_restaurante == usuario.id_restaurante
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if "nombre"      in body: p.nombre      = body["nombre"]
    if "precio"      in body: p.precio      = body["precio"]
    if "id_categoria"in body: p.id_categoria= body["id_categoria"]
    if "disponible"  in body: p.disponible  = body["disponible"]

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