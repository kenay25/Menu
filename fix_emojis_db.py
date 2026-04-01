#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para convertir todas las tablas y columnas a utf8mb4
Esto permite guardar emojis correctamente en MySQL.

Uso: python fix_emojis_db.py
"""

import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Error: DATABASE_URL no está configurada en el .env")
    sys.exit(1)

# Importar SQLAlchemy
from sqlalchemy import create_engine, text

# Crear engine con charset utf8mb4
if "?" not in DATABASE_URL:
    DATABASE_URL += "?charset=utf8mb4"
elif "charset" not in DATABASE_URL.lower():
    DATABASE_URL += "&charset=utf8mb4"

print(f"🔗 Conectando a: {DATABASE_URL.replace(os.getenv('ADMIN_PASSWORD', ''), '***')}")

engine = create_engine(DATABASE_URL)

# Lista de tablas y columnas a convertir
queries = [
    # Cambiar charset de la base de datos
    "ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    
    # Tablas principales
    "ALTER TABLE productos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE categorias CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE instancias CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE ingredientes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE pedidos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE detalle_pedido CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE clientes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE restaurantes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE usuarios CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    
    # Columnas específicas que pueden contener emojis
    "ALTER TABLE productos MODIFY nombre VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE productos MODIFY descripcion TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE productos MODIFY emoji VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE productos MODIFY tag VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE categorias MODIFY nombre VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE instancias MODIFY nombre VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE ingredientes MODIFY nombre VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE clientes MODIFY nombre VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE clientes MODIFY direccion VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE restaurantes MODIFY nombre VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE restaurantes MODIFY direccion VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE restaurantes MODIFY horario VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE usuarios MODIFY nombre VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE pedidos MODIFY nombre_cliente VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE pedidos MODIFY notas TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    "ALTER TABLE detalle_pedido MODIFY nombre_producto VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
]

print("🔧 Convirtiendo tablas a utf8mb4...\n")

with engine.connect() as conn:
    for query in queries:
        try:
            conn.execute(text(query))
            conn.commit()
            print(f"✅ {query[:70]}...")
        except Exception as e:
            print(f"⚠️  Error en: {query[:50]}... - {str(e)[:50]}")

print("\n✅ Conversión completada!")
print("\n⚠️  IMPORTANTE: Reinicia el servidor para aplicar los cambios.")
print("   Además, actualiza tu DATABASE_URL en el .env agregando: ?charset=utf8mb4")
