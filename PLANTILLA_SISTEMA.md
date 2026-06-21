# Plantilla de Arquitectura — Sistema de Catálogo + Pedidos + Clientes

> Basado en el sistema de "La Esquina del Sushi". Generalizado para poder construir
> cualquier negocio con el mismo esqueleto: tienda de ropa, farmacia, taller, renta
> de equipo, etc. Lo único que cambia es el dominio de `productos` y sus flags de
> personalización.

---

## 1. Arquitectura general (capas)

```
app/
├── main.py              # Punto de entrada: instancia FastAPI, middlewares, routers, jobs
├── database.py          # Engine + SessionLocal + Base declarativa + get_db()
├── core/
│   ├── config.py        # Settings (pydantic-settings) leídas de .env
│   └── security.py      # Hash de passwords + JWT
├── models/               # SQLAlchemy ORM — 1 archivo por entidad de negocio
├── schemas/              # Pydantic — contratos de entrada/salida de la API
└── routers/               # Endpoints HTTP — 1 archivo por recurso + deps.py (auth)
```

**Regla de dependencia:** `routers` → usa `schemas` (validación) + `models` (DB) +
`core` (auth). `models` y `database` no dependen de nadie más. Esto evita imports
circulares y permite testear capas por separado.

---

## 2. El patrón "multi-tenant por columna"

Cada tabla de negocio lleva `id_<entidad_dueña>` (en el original `id_restaurante`).
Esta es la decisión más importante del diseño: **un solo backend sirve a N negocios**,
y cada query filtra por esa columna usando el id del usuario autenticado
(`usuario.id_restaurante`). Para una tienda de ropa sería `id_tienda`.

```python
# Patrón repetido en CADA endpoint que toca datos:
db.query(Producto).filter(Producto.id_tienda == usuario.id_tienda)
```

Si nunca vas a tener multi-tenant, puedes omitir esta columna — pero si hay alguna
chance de vender el sistema a más de un cliente, inclúyela desde el día 1 (es muy
caro agregarla después).

---

## 3. Las 6 entidades núcleo y su traducción a "tienda de ropa"

| Sushi (original) | Tienda de ropa | Propósito |
|---|---|---|
| `restaurantes` | `tiendas` | El "tenant" raíz |
| `categorias` | `categorias` (Playeras, Pantalones, Calzado...) | Agrupación del catálogo |
| `productos` (flags `has_protein`, `has_sauce`...) | `productos` (flags `has_talla`, `has_color`, `has_genero`...) | Catálogo con **personalización configurable vía booleanos + JSON** |
| `clientes` | `clientes` | CRM ligero: contacto + métricas acumuladas (`total_pedidos`, `total_gastado`) |
| `usuarios` (roles admin/cocina/caja) | `usuarios` (roles admin/vendedor/almacen) | Acceso al panel, no son clientes finales |
| `pedidos` + `detalle_pedido` | `pedidos` + `detalle_pedido` (con tallas/colores elegidos) | Transacción + líneas de detalle |

### El truco más reutilizable del proyecto

En vez de crear una tabla nueva por cada tipo de variante de producto, se usan
**columnas booleanas de "capacidad"** (`has_protein`, `has_sauce`, `has_alga`...) en
`productos`, y las opciones reales viven en una columna `JSON` (`ingredientes`,
`extras_producto`). Esto permite tener productos con personalización completamente
distinta sin rediseñar el esquema.

Ejemplo para ropa:

```python
class Producto(Base):
    __tablename__ = "productos"

    id_producto     = Column(Integer, primary_key=True, autoincrement=True)
    id_tienda       = Column(Integer, nullable=False)
    id_categoria    = Column(Integer, nullable=True)
    nombre          = Column(String(100), nullable=False)
    precio          = Column(Numeric(10, 2), nullable=False)
    disponible      = Column(Boolean, nullable=False, default=True)

    descripcion     = Column(Text, nullable=True)
    imagen_url      = Column(String(500), nullable=True)
    tag             = Column(String(20), nullable=True)   # nuevo | oferta | agotandose

    # Flags de personalización (capacidades del producto)
    has_talla       = Column(Boolean, nullable=False, default=True)
    has_color       = Column(Boolean, nullable=False, default=True)
    has_grabado     = Column(Boolean, nullable=False, default=False)  # ej. nombre personalizado

    # Variantes y extras como JSON
    # variantes: [{"talla":"M","color":"Negro","stock":12}]
    # extras_producto: [{"nombre":"Grabado","precio":50}]
    variantes       = Column(JSON, nullable=True)
    extras_producto = Column(JSON, nullable=True)
```

Y en el pedido, igual: `modificaciones` (JSON en `detalle_pedido`) guarda exactamente
qué eligió el cliente (talla, color, grabado) — igual que en el original se guardan
proteínas/salsas/sin-ingredientes.

```json
{
  "talla": "M",
  "color": "Negro",
  "grabado": "Kenay",
  "extras_seleccionados": ["Grabado"]
}
```

---

## 4. Capa de autenticación reutilizable casi 1:1

`core/security.py` + `routers/deps.py` son **agnósticos al dominio** — se pueden
copiar tal cual a cualquier proyecto nuevo:

- `hashear_password` / `verificar_password` (bcrypt)
- `crear_token` / `verificar_token` (JWT con expiración)
- `get_usuario_actual` (dependency que valida el Bearer token)
- `requerir_admin` / `requerir_<rol>_o_admin` (guards por rol, encadenables con `Depends`)

Este es el bloque más portable de todo el sistema.

---

## 5. `main.py` como "ensamblador"

No contiene lógica de negocio. Solo:

1. Crea tablas (`Base.metadata.create_all`)
2. Configura CORS (origen específico del frontend, nunca `*` en producción)
3. Middleware que fuerza HTTPS
4. Rate limiting (`slowapi`) — general y uno más estricto para login
5. Registra los routers (`app.include_router(...)`)
6. Job de arranque: crea un usuario admin si no existe (lee de `.env`)
7. Scheduler (`APScheduler`) para tareas periódicas — en el original, backups de
   MySQL a las 2am

Para la tienda de ropa, el mismo scheduler podría correr: alertas de stock bajo,
reportes diarios de ventas, limpieza de carritos abandonados, etc.

---

## 6. Convención de endpoints por recurso

Cada router sigue el mismo CRUD shape:

```
POST   /<recurso>/              crear (auto-registra entidades relacionadas si aplica)
GET    /<recurso>/               listar (filtrado por tenant)
GET    /<recurso>/<id>           detalle
PUT    /<recurso>/<id>           editar (admin)
PATCH  /<recurso>/<id>/<campo>   cambio puntual de estado (ej. disponibilidad, stock, estado de pedido)
DELETE /<recurso>/<id>           eliminar (admin)
```

Más un router `admin.py` aparte con estadísticas agregadas (ventas del
día/semana/mes, top productos, top clientes, horas pico) — separar "operación" de
"analítica" en routers distintos es buena práctica que conviene mantener.

---

## 7. Variables de entorno (`.env`) — plantilla reusable

```env
DATABASE_URL=mysql+pymysql://user:pass@host:3306/db
SECRET_KEY=clave_secreta_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ADMIN_EMAIL=admin@tutienda.com
ADMIN_PASSWORD=contraseña_segura
ADMIN_NOMBRE=Nombre
BACKUP_DIR=backups
MAX_BACKUPS=5
BACKUP_HORA=2
APP_ENV=production
CORS_ORIGINS=https://tu-frontend.vercel.app
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_LOGIN_PER_MINUTE=5
```

---

## 8. Frontend desacoplado

`index.html` + `script.js` + `style.css` son estáticos, consumen la API por fetch, y
se despliegan aparte (Vercel) del backend (Render/Railway). Esto significa que para
otro negocio se puede reusar el 100% del backend y solo rehacer el frontend, o
incluso mantener el mismo frontend cambiando textos/imágenes si la estructura del
catálogo es similar.

---

## Resumen del patrón replicable

```
Settings → Database → Models (flags booleanos + JSON para variantes)
  → Schemas (Pydantic) → Routers (CRUD + auth por rol)
  → main.py como ensamblador (CORS / rate-limit / scheduler)
```

Sirve para cualquier negocio con forma "catálogo + pedidos + clientes + roles de
staff". Lo único que cambia entre proyectos es el dominio de `productos` y sus flags
de personalización.
