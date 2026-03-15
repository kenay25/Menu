# La Esquina del Sushi — Menú Digital

Aplicación React moderna para el menú digital de La Esquina del Sushi.

## Estructura del Proyecto

```
Menu/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── Header.jsx
│   │   ├── MainNav.jsx
│   │   ├── MenuCard.jsx
│   │   ├── PromoCard.jsx
│   │   ├── ModalPersonalizacion.jsx
│   │   ├── ModalCliente.jsx
│   │   ├── OrderSummary.jsx
│   │   └── FloatBar.jsx
│   ├── pages/               # Páginas principales
│   │   ├── MenuPage.jsx     # Página del menú para clientes
│   │   └── AdminPage.jsx    # Panel de administración
│   ├── data/                # Datos del menú
│   │   └── menuData.js
│   ├── styles/              # Estilos CSS
│   │   ├── index.css        # Estilos del menú
│   │   └── admin.css        # Estilos del admin
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── vite.svg
├── index.html
├── admin.html
├── package.json
└── vite.config.js
```

## Desarrollo

### Instalar dependencias

```bash
npm install
```

### Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

### Build para producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

### Vista previa de producción

```bash
npm run preview
```

## Rutas

- `/` — Menú principal para clientes
- `/admin` — Panel de administración

## Características

- 🍣 Menú digital interactivo
- 🛒 Carrito de compras
- ✏️ Personalización de platillos (proteínas, salsas, ingredientes)
- 📱 Diseño responsive
- 🌸 Animación de pétalos de sakura
- 📦 Panel de administración
- 📊 Estadísticas y reportes
- 🚫 Control de pedidos abiertos/cerrados
- 📲 Envío de pedidos por WhatsApp

## Tecnologías

- **React 19** — Framework UI
- **Vite** — Build tool
- **React Router** — Navegación
- **CSS3** — Estilos personalizados
