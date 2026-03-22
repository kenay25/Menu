"""
Script para backups automáticos de MySQL.
Uso: python backup.py
"""
import os
import subprocess
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import re

# Cargar variables de entorno
load_dotenv()

# Configuración
BACKUP_DIR = os.getenv("BACKUP_DIR", "backups")
MAX_BACKUPS = int(os.getenv("MAX_BACKUPS", 5))
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear carpeta de backups
Path(BACKUP_DIR).mkdir(exist_ok=True)


def parse_mysql_url(url: str) -> dict:
    """Extraer credenciales de la URL de MySQL."""
    # mysql+pymysql://user:pass@host:port/db
    pattern = r"mysql\+pymysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)"
    match = re.match(pattern, url)
    
    if not match:
        raise ValueError("DATABASE_URL inválida. Formato esperado: mysql+pymysql://user:pass@host:port/db")
    
    return {
        "user": match.group(1),
        "password": match.group(2),
        "host": match.group(3),
        "port": match.group(4),
        "database": match.group(5)
    }


def crear_backup() -> str:
    """Crear backup de la base de datos con mysqldump."""
    try:
        db_info = parse_mysql_url(DATABASE_URL)
    except ValueError as e:
        print(f"❌ Error: {e}")
        raise
    
    # Generar nombre del backup con timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"backup_{timestamp}.sql"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    
    # Comando mysqldump
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
            result = subprocess.run(
                cmd,
                stdout=f,
                stderr=subprocess.PIPE,
                check=True,
                text=True
            )
        
        if result.returncode == 0:
            tamaño = os.path.getsize(backup_path) / 1024  # KB
            print(f"✅ Backup creado: {backup_filename} ({tamaño:.2f} KB)")
            return backup_path
        else:
            raise Exception(f"mysqldump falló con código {result.returncode}")
    
    except FileNotFoundError:
        raise Exception(
            "❌ 'mysqldump' no encontrado. "
            "Instala MySQL Server o MySQL Workbench para tener la herramienta mysqldump."
        )
    except subprocess.CalledProcessError as e:
        raise Exception(f"❌ Error en mysqldump: {e.stderr}")


def limpiar_backups_antiguos():
    """Eliminar backups antiguos, manteniendo solo MAX_BACKUPS."""
    backups = sorted(
        [f for f in os.listdir(BACKUP_DIR) if f.startswith("backup_") and f.endswith(".sql")],
        reverse=True
    )
    
    if len(backups) > MAX_BACKUPS:
        for old_backup in backups[MAX_BACKUPS:]:
            os.remove(os.path.join(BACKUP_DIR, old_backup))
            print(f"🗑️ Eliminado backup antiguo: {old_backup}")
    
    restantes = min(len(backups), MAX_BACKUPS)
    print(f"📦 Backups mantenidos: {restantes}/{MAX_BACKUPS}")


def main():
    """Función principal."""
    print(f"🔄 Iniciando backup - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Directorio: {BACKUP_DIR}")
    print(f"🔢 Máximo backups: {MAX_BACKUPS}")
    print("-" * 50)
    
    try:
        crear_backup()
        limpiar_backups_antiguos()
        print("-" * 50)
        print("✅ Backup completado exitosamente")
    except Exception as e:
        print(f"❌ Error: {e}")
        raise


if __name__ == "__main__":
    main()
