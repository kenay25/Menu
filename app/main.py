from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.core.security import hashear_password
from app.models.usuario import Usuario

# Crear todas las tablas si no existen
Base.metadata.create_all(bind=engine)

# Inicializar la aplicación
app = FastAPI(
    title="La Esquina del Sushi — API",
    description="Backend del sistema de pedidos",
    version="1.0.0"
)

# Configurar CORS — permite que el menú HTML se conecte al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def crear_admin_inicial():
    """Crea el usuario admin si no existe al arrancar el servidor."""
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