from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.core.security import hashear_password
from app.models.usuario import Usuario
from app.routers import auth, clientes, pedidos, admin, productos, historial
import os
import subprocess
import re
from datetime import datetime
from pathlib import Path
from apscheduler.schedulers.background import BackgroundScheduler

os.environ['TZ'] = 'America/Hermosillo'

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


@app.get("/config/pedidos-habilitados")
def estado_pedidos_publico():
    """Endpoint público para que el menú consulte si se aceptan pedidos."""
    from app.routers.admin import pedidos_habilitados
    return {"pedidos_habilitados": pedidos_habilitados}


# ─────────────────────────────────────────────────────────────
# Backups automáticos
# ─────────────────────────────────────────────────────────────

def parse_mysql_url(url: str) -> dict:
    """Extraer credenciales de la URL de MySQL."""
    pattern = r"mysql\+pymysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)"
    match = re.match(pattern, url)
    if not match:
        raise ValueError("DATABASE_URL inválida")
    return {
        "user": match.group(1),
        "password": match.group(2),
        "host": match.group(3),
        "port": match.group(4),
        "database": match.group(5)
    }


def ejecutar_backup():
    """Ejecutar backup de la base de datos."""
    try:
        db_info = parse_mysql_url(settings.DATABASE_URL)
    except ValueError as e:
        print(f"❌ Backup error: {e}")
        return

    Path(settings.BACKUP_DIR).mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"backup_{timestamp}.sql"
    backup_path = os.path.join(settings.BACKUP_DIR, backup_filename)

    cmd = [
        "mysqldump",
        f"-u{db_info['user']}",
        f"-p{db_info['password']}",
        f"-h{db_info['host']}",
        f"-P{db_info['port']}",
        "--single-transaction",
        "--quick",
        "--lock-tables=false",
        db_info['database']
    ]

    try:
        with open(backup_path, "w", encoding="utf-8") as f:
            subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE, check=True, text=True)
        tamaño = os.path.getsize(backup_path) / 1024
        print(f"✅ Backup creado: {backup_filename} ({tamaño:.2f} KB)")

        # Limpiar backups antiguos
        backups = sorted(
            [f for f in os.listdir(settings.BACKUP_DIR) if f.startswith("backup_") and f.endswith(".sql")],
            reverse=True
        )
        if len(backups) > settings.MAX_BACKUPS:
            for old in backups[settings.MAX_BACKUPS:]:
                os.remove(os.path.join(settings.BACKUP_DIR, old))
                print(f"🗑️ Eliminado: {old}")
    except FileNotFoundError:
        print("❌ 'mysqldump' no encontrado. Instala MySQL Server.")
    except Exception as e:
        print(f"❌ Error en backup: {e}")


scheduler = BackgroundScheduler()
scheduler.add_job(
    ejecutar_backup,
    "cron",
    hour=settings.BACKUP_HORA,
    minute=0,
    id="backup_automatico",
    replace_existing=True
)


@app.on_event("startup")
def iniciar_scheduler():
    """Iniciar el scheduler de backups automáticos."""
    scheduler.start()
    print(f"⏰ Backup automático programado a las {settings.BACKUP_HORA:02d}:00")