# 🍣 La Esquina del Sushi - Menú Digital React

## ✅ Proyecto Completamente Funcional

Tu aplicación ha sido migrada exitosamente a React con una arquitectura moderna y escalable.

---

## 📁 Estructura del Proyecto

```
Menu/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.jsx              # Header con sakura + login/historial
│   │   ├── MainNav.jsx             # Navegación principal sticky
│   │   ├── MenuCard.jsx            # Cards de platillos
│   │   ├── PromoCard.jsx           # Cards de promociones
│   │   ├── ModalPersonalizacion.jsx # Modal de personalización
│   │   ├── ModalCliente.jsx        # Modal de datos de cliente
│   │   ├── ModalLogin.jsx          # Login/Registro de usuarios
│   │   ├── ModalHistorial.jsx      # Historial de pedidos
│   │   ├── OrderSummary.jsx        # Resumen del pedido
│   │   └── FloatBar.jsx            # Barra flotante inferior
│   ├── pages/
│   │   ├── MenuPage.jsx            # Página principal del menú
│   │   └── AdminPage.jsx           # Panel de administración
│   ├── data/
│   │   └── menuData.js             # Datos de 53 platillos + promos
│   ├── styles/
│   │   ├── index.css               # Estilos del menú
│   │   └── admin.css               # Estilos del admin
│   ├── main.jsx                    # Entry point
│   └── App.jsx
├── public/
│   └── vite.svg
├── index.html                      # Entry HTML
├── package.json
├── vite.config.js
├── README.md
└── ESTADO_FUNCIONALIDADES.md
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Menú Cliente (100% funcional)

| Funcionalidad | Estado |
|--------------|--------|
| 53 platillos en 6 categorías | ✅ |
| Combos | ✅ |
| Sushis | ✅ |
| Entradas | ✅ |
| Especiales | ✅ |
| Bebidas | ✅ |
| Promociones | ✅ |
| Personalización de platillos | ✅ |
| - Alga (con/sin) | ✅ |
| - Proteínas (múltiples, +$15 c/u) | ✅ |
| - 9 salsas (hasta 2) | ✅ |
| - Quitar ingredientes | ✅ |
| - Agregar ingredientes extra | ✅ |
| Carrito de compras | ✅ |
| Múltiples unidades por platillo | ✅ |
| Pedido por WhatsApp | ✅ |
| Login/Registro de clientes | ✅ |
| Historial de pedidos | ✅ |
| Búsqueda por teléfono | ✅ |
| Control pedidos abiertos/cerrados | ✅ |
| Sesión persistente | ✅ |
| Animación sakura | ✅ |
| Diseño responsive | ✅ |

### ⚠️ Panel Admin (Estructura lista, falta conectar API)

| Funcionalidad | Estado |
|--------------|--------|
| Login admin | ✅ |
| Dashboard | ⚠️ Placeholder |
| Toggle pedidos activos | ✅ |
| Gestión de pedidos | ⚠️ Pendiente |
| CRUD platillos | ⚠️ Pendiente |
| Estadísticas | ⚠️ Pendiente |
| Top clientes | ⚠️ Pendiente |
| Gestión usuarios | ⚠️ Pendiente |

---

## 🚀 Cómo Ejecutar

### Desarrollo
```bash
cd c:\Users\Kenay\Desktop\Menu\Menu
npm run dev
```

La aplicación se abrirá en **http://localhost:3000**

### Producción
```bash
npm run build
npm run preview
```

Los archivos de producción están en `dist/`

---

## 📱 Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Menú principal para clientes |
| `/admin` | Panel de administración |

---

## 🔌 Integración con Backend

### Endpoints Utilizados

```javascript
// Autenticación
POST /auth/login
POST /auth/registro

// Pedidos
POST /pedidos/
GET /config/pedidos-habilitados

// Historial
GET /historial/mi-historial
GET /historial/telefono/:telefono
```

### API Base
```
https://web-production-97d4.up.railway.app
```

---

## 💾 Datos del Menú

El archivo `src/data/menuData.js` contiene:

- **53 platillos** organizados en 6 categorías
- **4 promociones** especiales
- **5 proteínas** disponibles (Res, Pollo, Tocino, Surimi, Camarón)
- **9 salsas** disponibles
- **10 ingredientes extra** disponibles

---

## 🎨 Diseño

### Colores
```css
--pink:       #E8547A
--pink-light: #F9D0DC
--pink-deep:  #C23060
--cream:      #FFF8F9
--dark:       #1A0A10
--white:      #FFFFFF
--muted:      #9E7080
```

### Fuentes
- **Títulos:** Noto Serif JP
- **Cuerpo:** DM Sans

### Responsive
- ✅ Mobile (< 500px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

---

## 📊 Estado del Pedido por WhatsApp

El mensaje enviado incluye:

```
🍣 *NUEVO PEDIDO — La Esquina del Sushi*
━━━━━━━━━━━━━━━━━━━━
👤 *Nombre:* [Nombre]
📱 *Teléfono:* [Teléfono]
📍 *Dirección:* [Dirección]
📦 *Tipo:* Envío a domicilio / Recoge en sucursal
━━━━━━━━━━━━━━━━━━━━

• [Platillo] — $[Precio]
   + Ingrediente(s): [Lista]
   Alga: Con/Sin alga
   Proteína(s): [Lista]
   Salsa: [Lista]
   Sin: [Ingredientes removidos]
   Extra: [Extras agregados]

━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL: $[Total] MXN*
📝 Notas: [Notas]
🌸 La Esquina del Sushi · Blvd. Sonora #21
```

---

## 🔐 Autenticación

### Cliente
- Registro con: nombre, email, teléfono, contraseña
- Login con email y contraseña
- Sesión persistente en localStorage
- Historial asociado al teléfono

### Admin
- Login separado
- Redirect automático al panel
- Token JWT para API calls

---

## 📈 Próximos Pasos (Opcional)

### Para completar el Admin:
1. Instalar `recharts` para gráficas
2. Implementar CRUD de platillos
3. Conectar endpoints de estadísticas
4. Implementar gestión de pedidos en tiempo real

### Para producción:
1. Configurar variables de entorno en `.env`
2. Subir build (`dist/`) a hosting
3. Configurar dominio
4. Habilitar HTTPS

---

## 📞 Soporte

Para cualquier duda o mejora adicional, el código está completamente documentado y estructurado para facilitar su mantenimiento.

---

**Hecho con ❤️ para La Esquina del Sushi**
