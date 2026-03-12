from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.core.security import hashear_password
from app.models.usuario import Usuario
from app.routers import auth, clientes, pedidos, admin, productos, historial

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="La Esquina del Sushi — API",
    description="Backend del sistema de pedidos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(pedidos.router)
app.include_router(admin.router)
app.include_router(productos.router)
app.include_router(historial.router)

@app.on_event("startup")
def crear_admin_inicial():
    db = SessionLocal()
    try:
        admin = db.query(Usuario).filter(Usuario.email == settings.ADMIN_EMAIL).first()
        if not admin:
            nuevo_admin = Usuario(
                id_restaurante=1,
                nombre=settings.ADMIN_NOMBRE,
                email=settings.ADMIN_EMAIL,
                password_hash=hashear_password(settings.ADMIN_PASSWORD),
                rol="admin"
            )
            db.add(nuevo_admin)
            db.commit()
            print(f"✅ Admin creado: {settings.ADMIN_EMAIL}")
        else:
            print(f"✅ Admin ya existe: {settings.ADMIN_EMAIL}")
    finally:
        db.close()


@app.get("/")
def raiz():
    return {
        "sistema": "La Esquina del Sushi",
        "version": "1.0.0",
        "estado": "activo"
    }


@app.get("/health")
def health():
    return {"status": "ok"}