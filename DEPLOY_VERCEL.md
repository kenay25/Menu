# 🚀 Guía de Despliegue en Vercel

## Problema de Página en Blanco

Si tu página se ve en blanco en Vercel, sigue estos pasos:

---

## ✅ Solución 1: Configurar vercel.json (YA CREADO)

El archivo `vercel.json` ya está configurado para manejar React Router:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esto asegura que todas las rutas redirijan a `index.html` para que React Router maneje la navegación.

---

## ✅ Solución 2: Verificar Build Settings en Vercel

### En el Dashboard de Vercel:

1. Ve a tu proyecto
2. **Settings** → **Build & Development Settings**
3. Configura:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## ✅ Solución 3: Variables de Entorno

Asegúrate de que las variables de entorno estén configuradas en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
VITE_API_URL=https://web-production-97d4.up.railway.app
VITE_MENU_EMAIL=menu@laesquinasushi.com
VITE_MENU_PASSWORD=!sushi2026
VITE_CLOUDINARY_CLOUD=dccpuq4r4
VITE_CLOUDINARY_PRESET=sushi_menu
VITE_WA_NUMBER=526624580620
```

3. **Importante**: Después de agregar las variables, debes hacer un **nuevo deploy** para que surtan efecto.

---

## ✅ Solución 4: Pasos para Deploy Correcto

### Opción A: Conectar GitHub (Recomendado)

1. En Vercel, haz clic en **"Add New Project"**
2. Selecciona **"Import Git Repository"**
3. Elige tu repositorio de GitHub
4. Vercel detectará automáticamente Vite
5. Configura las variables de entorno (ver Solución 3)
6. Haz clic en **"Deploy"**

### Opción B: Deploy con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (desde la carpeta del proyecto)
cd c:\Users\Kenay\Desktop\Menu\Menu
vercel

# Deploy a producción
vercel --prod
```

---

## ✅ Solución 5: Verificar Consola del Navegador

Si aún ves la página en blanco:

1. Abre las **DevTools** (F12)
2. Ve a la pestaña **Console**
3. Busca errores como:
   - `Failed to load resource` - Las rutas de los assets están mal
   - `process is not defined` - Problema con variables de entorno
   - `Network Error` - La API no es accesible

---

## ✅ Solución 6: Base Path Incorrecto

Si los assets no cargan, el problema puede ser el `base` en `vite.config.js`:

```javascript
export default defineConfig({
  base: '/',  // ✅ Correcto para Vercel
  // ...
})
```

---

## 🔍 Debugging Checklist

- [ ] El archivo `vercel.json` está en la raíz del proyecto
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] El build command es `npm run build`
- [ ] El output directory es `dist`
- [ ] El framework preset es `Vite`
- [ ] No hay errores en la consola del navegador
- [ ] Los archivos en `dist/` se generaron correctamente

---

## 🚨 Errores Comunes

### Error: "process is not defined"
**Solución**: Asegúrate de usar `import.meta.env.VITE_*` en lugar de `process.env`

### Error: "Failed to load resource - 404"
**Solución**: Verifica que `vercel.json` tenga los rewrites configurados

### Error: Página en blanco después del deploy
**Solución**: 
1. Verifica la consola del navegador (F12)
2. Asegúrate de que las variables de entorno estén configuradas
3. Haz un redeploy después de agregar las variables

---

## 📱 Verificar Después del Deploy

1. ✅ La página carga sin errores
2. ✅ Los estilos se ven correctamente
3. ✅ El menú muestra los platillos
4. ✅ El carrito funciona
5. ✅ El login funciona
6. ✅ El historial carga
7. ✅ El envío a WhatsApp funciona
8. ✅ El panel admin es accesible en `/admin`

---

## 🔗 Enlaces Útiles

- [Vercel + Vite Guide](https://vercel.com/docs/frameworks/vite)
- [React Router on Vercel](https://vercel.com/guides/using-react-router-with-vercel)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🆘 Soporte

Si después de seguir esta guía aún tienes problemas:

1. Revisa los **Deployment Logs** en Vercel
2. Abre las **DevTools** y revisa la consola
3. Verifica que el build local funcione: `npm run build && npm run preview`
4. Comprueba que la API de Railway esté accesible
