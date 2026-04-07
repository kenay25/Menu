# La Esquina del Sushi - Contexto del Proyecto

## Visión General

Sistema de pedidos para el restaurante "La Esquina del Sushi" ubicado en Navojoa, Sonora, México.

**Ubicación:** Blvd. Sonora #21, Media Cuadra del Socum  
**Teléfonos:** 642-134-2959, 642-426-7244  
**WhatsApp:** 526622067409  
**Horario:** 5:30 - 11:30 pm (Descanso martes)

---

## Arquitectura Técnica

### Backend
- **Framework:** FastAPI 0.135.1
- **Base de datos:** MySQL (pymysql)
- **ORM:** SQLAlchemy 2.0
- **Autenticación:** JWT (python-jose)
- **Passwords:** bcrypt (passlib)
- **Validación:** Pydantic 2.12
- **Rate Limiting:** slowapi
- **Backups automáticos:** APScheduler + mysqldump
- **Timezone:** America/Hermosillo (UTC-7)

### Frontend
- **Archivos estáticos:** index.html (130KB), admin.html (228KB)
- **Estilos:** style.css (25KB)
- **Lógica:** script.js (97KB)
- **Hosting frontend:** Vercel (https://laesquinadelsushi.vercel.app)

### Deployment
- **Backend:** Render/Railway (uvicorn)
- **Frontend:** Vercel
- **Base de datos:** MySQL en la nube

---

## Estructura del Proyecto

```
Menu/
├── app/
│   ├── main.py           # Punto de entrada, CORS, rate limiting, backups
│   ├── database.py       # Conexión MySQL, SessionLocal, Base
│   ├── core/
│   │   ├── config.py     # Settings con pydantic-settings
│   │   └── security.py   # Hash passwords, JWT
│   ├── models/
│   │   ├── producto.py   # Producto, categorias
│   │   ├── pedido.py     # Pedido, DetallePedido
│   │   ├── cliente.py    # Cliente
│   │   ├── usuario.py    # Usuario
│   │   └── restaurante.py
│   ├── routers/
│   │   ├── auth.py       # /auth/login, /auth/me, /auth/registro
│   │   ├── pedidos.py    # CRUD pedidos
│   │   ├── clientes.py   # CRUD clientes
│   │   ├── productos.py  # CRUD productos
│   │   ├── admin.py      # Estadísticas, config, usuarios
│   │   ├── historial.py  # Historial por teléfono
│   │   └── deps.py       # Dependencias (get_usuario_actual, requerir_admin)
│   └── schemas/
│       ├── pedido.py     # Pydantic schemas para pedidos
│       ├── cliente.py    # Pydantic schemas para clientes
│       └── usuario.py    # Pydantic schemas para usuarios
├── backups/              # Backups automáticos de MySQL
├── img/                  # Imágenes del menú
├── index.html            # Frontend público del menú
├── admin.html            # Panel de administración
├── style.css             # Estilos
├── script.js             # Lógica frontend
├── Base.sql              # Schema de base de datos
├── backup_completo.sql   # Backup completo
├── fix_emojis_db.py      # Script para convertir tablas a utf8mb4
├── backup.py             # Script de backup
├── requirements.txt      # Dependencias Python
├── .env                  # Variables de entorno (no versionado)
├── .env.example          # Ejemplo de variables
├── Procfile              # Deploy en Render
└── .gitignore
```

---

## Base de Datos

### Tablas Principales

**restaurantes** - Información del restaurante
- id_restaurante, nombre, direccion, telefono, telefono2, whatsapp, horario, activo

**categorias** - Categorías del menú
- id_categoria, id_restaurante, nombre, orden, activo
- Categorías: Combos y Charolas (1), Sushis (2), Entradas (3), Especiales (4), Bebidas y Extras (5), Promociones (6)

**productos** - Productos del menú
- id_producto, id_categoria, id_restaurante, nombre, descripcion, precio, tag, tiene_proteina, tiene_salsa, tiene_alga, disponible
- Flags de personalización: has_alga, has_style, has_protein, has_sauce, has_sushi_choice, etc.
- JSON: ingredientes, extras_producto

**clientes** - Clientes registrados
- id_cliente, id_restaurante, nombre, telefono, direccion, total_pedidos, total_gastado, ultima_visita

**usuarios** - Usuarios del sistema
- id_usuario, id_restaurante, nombre, email, password_hash, rol (admin/cocina/caja), activo, ultimo_acceso

**pedidos** - Pedidos
- id_pedido, id_restaurante, id_cliente, nombre_cliente, telefono_cliente, tipo_entrega (sucursal/domicilio), direccion_entrega, colonia_entrega, costo_envio, notas, total, estado, fecha_pedido

**detalle_pedido** - Detalle de pedidos
- id_detalle, id_pedido, id_producto, nombre_producto, precio_unitario, cantidad, modificaciones (JSON), costo_extra, subtotal

### Vistas
- v_pedidos - Pedidos con información de cliente
- v_detalle_pedidos - Detalle de pedidos con modificaciones
- v_estadisticas_dia - Estadísticas diarias
- v_mejores_clientes - Top clientes
- v_productos_mas_vendidos - Productos más vendidos

### Índices
- pedidos: estado, fecha_pedido, id_cliente, telefono_cliente
- detalle_pedido: id_pedido, id_producto
- clientes: telefono
- productos: id_categoria, disponible

---

## API Endpoints

### Autenticación (`/auth`)
- `POST /auth/login` - Login con rate limit (5/min)
- `GET /auth/me` - Perfil del usuario autenticado
- `POST /auth/registro` - Registro de cliente con token automático

### Pedidos (`/pedidos`)
- `POST /pedidos/` - Crear pedido (auto-registra cliente)
- `GET /pedidos/` - Listar todos los pedidos
- `GET /pedidos/activos` - Pedidos activos (recibido/preparando/listo)
- `GET /pedidos/{id}` - Obtener pedido específico
- `PATCH /pedidos/{id}/estado` - Cambiar estado del pedido

### Clientes (`/clientes`)
- `GET /clientes/buscar/{telefono}` - Buscar por teléfono
- `GET /clientes/` - Listar todos los clientes
- `PUT /clientes/{id}` - Actualizar cliente

### Productos (`/productos`)
- `GET /productos/` - Listar todos los productos
- `GET /productos/{id}` - Obtener producto
- `POST /productos/` - Crear producto (admin)
- `PUT /productos/{id}` - Editar producto (admin)
- `PATCH /productos/{id}/disponibilidad` - Cambiar disponibilidad (admin)
- `DELETE /productos/{id}` - Eliminar producto (admin)

### Admin (`/admin`)
- `GET /admin/config/pedidos-habilitados` - Estado de pedidos
- `PATCH /admin/config/pedidos-habilitados` - Habilitar/deshabilitar pedidos
- `GET /admin/estadisticas/hoy` - Estadísticas del día
- `GET /admin/estadisticas/semana` - Últimos 7 días
- `GET /admin/estadisticas/mes` - Mes actual
- `GET /admin/estadisticas/horas-pico` - Horas pico
- `GET /admin/productos/mas-vendidos` - Top 10 productos
- `GET /admin/clientes/top` - Top 10 clientes
- `GET /admin/pedidos` - Listar pedidos con filtros
- `GET /admin/pedidos/{id}/detalle` - Detalle completo
- `PATCH /admin/pedidos/{id}/estado` - Cambiar estado
- `GET /admin/usuarios` - Listar usuarios
- `GET /admin/usuarios/{id}` - Obtener usuario
- `POST /admin/usuarios` - Crear usuario
- `PATCH /admin/usuarios/{id}` - Editar usuario
- `DELETE /admin/usuarios/{id}` - Eliminar usuario

### Historial (`/historial`)
- `GET /historial/telefono/{telefono}` - Historial por teléfono (público)
- `GET /historial/mi-historial` - Historial del usuario autenticado

---

## Modelos de Datos (Schemas)

### PedidoEntrada
```json
{
  "nombre_cliente": "string",
  "telefono_cliente": "string|null",
  "tipo_entrega": "sucursal|domicilio",
  "direccion_entrega": "string|null",
  "colonia_entrega": "string|null",
  "costo_envio": 0.0,
  "notas": "string|null",
  "total": 0.0,
  "productos": [
    {
      "id_producto": 1,
      "nombre_producto": "California",
      "precio_unitario": 95.0,
      "cantidad": 1,
      "modificaciones": {"proteinas": [], "salsas": [], "sin_ingredientes": []},
      "costo_extra": 0.0,
      "subtotal": 95.0
    }
  ]
}
```

### Modificaciones (JSON en detalle_pedido)
```json
{
  "alga": "con|sin|null",
  "proteinas": ["Pollo", "Res"],
  "salsas": ["BBQ", "Búfalo"],
  "sin_ingredientes": ["Pepino"],
  "extras_ingredientes": ["Ranch"],
  "extras_producto": []
}
```

---

## Seguridad

- **JWT:** Tokens con expiración de 7 días (10080 minutos)
- **Passwords:** Hash con bcrypt
- **Roles:** admin, cocina, caja
- **Rate Limiting:**
  - 30 requests/minuto por IP (general)
  - 5 requests/minuto por IP (login/registro)
- **CORS:** Solo https://laesquinadelsushi.vercel.app
- **HTTPS forzado** en producción

---

## Características del Menú

### Productos con Personalización
- **Proteína a elegir:** California, Aguacate, Bombazo, Mayito, Mix Roll, Tres Quesos
- **Con/Sin alga:** La mayoría de sushis
- **Salsas:** Boneless, Alitas, La Botanera, etc.
- **Estilo:** Natural o empanizado (Bolas)

### Promociones
- 2 Californias + Tostitampico - $220
- 2 Sonoras - $200
- 3 Bolas - $200
- 1 Boneless + 1 California - $150

### Extras
- Extra ingrediente: $15
- Extra queso gratinado: $25

---

## Variables de Entorno (.env)

```env
DATABASE_URL=mysql+pymysql://usuario:password@host:3306/database
SECRET_KEY=clave_secreta_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ADMIN_EMAIL=admin@laesquinadelsushi.com
ADMIN_PASSWORD=contraseña_segura
ADMIN_NOMBRE=Kenay
BACKUP_DIR=backups
MAX_BACKUPS=5
BACKUP_HORA=2
APP_ENV=production
CORS_ORIGINS=https://laesquinadelsushi.vercel.app
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_LOGIN_PER_MINUTE=5
```

---

## Backups Automáticos

- **Schedule:** Diario a las 2:00 AM (hora local)
- **Herramienta:** mysqldump
- **Limpieza:** Mantiene los últimos 5 backups
- **Formato:** backup_YYYYMMDD_HHMMSS.sql

---

## Zona Horaria

Todas las operaciones de fecha/hora usan **America/Hermosillo (UTC-7)**.

El backend convierte UTC → Hermosillo restando 7 horas en consultas de estadísticas.

---

## Estados del Pedido

1. `recibido` - Pedido recién creado
2. `preparando` - En preparación
3. `listo` - Listo para entrega
4. `entregado` - Completado
5. `cancelado` - Cancelado

---

## Git

- **Rama principal:** main
- **Últimos commits:**
  - refactor: simplify promo titles to package numbers
  - feat: update promo menu titles and implement custom protein pricing

---

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `app/main.py` | Configuración FastAPI, middleware CORS, HTTPS, scheduler backups |
| `app/database.py` | Engine MySQL, session factory, base declarativa |
| `app/core/config.py` | Settings con validación pydantic |
| `app/core/security.py` | Hash/verify passwords, crear/verificar JWT |
| `Base.sql` | Schema completo de la base de datos |
| `index.html` | Frontend público del menú |
| `admin.html` | Panel de administración |
| `script.js` | Lógica del frontend (fetch a API) |

---

## Dependencias Principales

```
fastapi==0.135.1
uvicorn==0.41.0
sqlalchemy==2.0.48
pymysql==1.1.2
pydantic==2.12.5
pydantic-settings==2.13.1
python-jose==3.5.0
passlib==1.7.4
bcrypt==4.0.1
slowapi==0.1.9
apscheduler==3.11.2
```

---

## Notas Importantes

1. **Emojis:** La base de datos usa utf8mb4 para soportar emojis
2. **Multi-restaurante:** El diseño soporta múltiples restaurantes (id_restaurante en todas las tablas)
3. **Cliente auto-registrado:** Al crear un pedido, si el teléfono no existe, se registra automáticamente
4. **Modificaciones JSON:** Las personalizaciones se guardan como JSON en detalle_pedido
5. **Backups:** Se eliminan automáticamente los antiguos manteniendo solo los últimos 5
