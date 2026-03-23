# 🔒 Seguridad - La Esquina del Sushi

## ✅ Medidas de Seguridad Implementadas

### 1. CORS Restringido
**Qué hace:** Solo permite que tu frontend (`https://laesquinadelsushi.vercel.app`) consuma la API.

**Configuración:**
```python
CORS_ORIGINS=https://laesquinadelsushi.vercel.app
```

**Para agregar más dominios:**
```python
CORS_ORIGINS=https://laesquinadelsushi.vercel.app,https://otro-dominio.com
```

---

### 2. HTTPS Forzado
**Qué hace:** Redirige automáticamente todo tráfico HTTP a HTTPS en producción.

**Configuración:**
- `APP_ENV=production` → Activa el redirect HTTPS
- `APP_ENV=development` → Permite HTTP local

**Nota:** En producción, asegúrate de tener un certificado SSL válido (Let's Encrypt es gratis).

---

### 3. Rate Limiting
**Qué hace:** Limita el número de peticiones por IP para prevenir abuso y brute force.

**Límites:**
- **General:** 30 peticiones por minuto por IP
- **Login/Registro:** 5 intentos por minuto por IP

**Configuración:**
```python
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_LOGIN_PER_MINUTE=5
```

**Respuesta cuando se excede:**
```json
{
  "detail": "Rate limit exceeded. Try again in X seconds."
}
```

---

### 4. Contraseñas Hasheadas
**Qué hace:** Las contraseñas se guardan cifradas con bcrypt, nunca en texto plano.

**Implementación:** `app/core/security.py`

---

### 5. JWT con Expiración
**Qué hace:** Los tokens de sesión expiran después de 7 días por defecto.

**Configuración:**
```python
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 días
```

---

## 📋 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `app/main.py` | CORS, HTTPS middleware, Rate limiting |
| `app/core/config.py` | Variables de configuración de seguridad |
| `app/routers/auth.py` | Rate limiting en login/registro |
| `requirements.txt` | Agregados: `slowapi`, `limits` |
| `.env.example` | Plantilla de variables de entorno |

---

## 🚀 Despliegue Seguro

### 1. Configurar variables de entorno
```bash
# Copiar plantilla
cp .env.example .env

# Editar .env con tus credenciales reales
# ¡NUNCA subas .env a GitHub!
```

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3. Configurar APP_ENV
```bash
# Desarrollo
APP_ENV=development

# Producción (activa HTTPS forzado)
APP_ENV=production
```

### 4. Dominios permitidos
```bash
# Solo tu dominio de Vercel
CORS_ORIGINS=https://laesquinadelsushi.vercel.app

# Para desarrollo local también:
CORS_ORIGINS=https://laesquinadelsushi.vercel.app,http://localhost:8080
```

---

## ⚠️ Importante

1. **Nunca subas `.env` a Git** - Ya está en `.gitignore`
2. **Cambia las contraseñas de admin** - Usa credenciales seguras
3. **Usa HTTPS en producción** - El middleware lo fuerza automáticamente
4. **Monitorea los logs** - Revisa intentos fallidos de login

---

## 📊 Pruebas de Seguridad

### Probar Rate Limiting
```bash
# Ejecutar 10 peticiones rápidas a /auth/login
# La 6ª debería fallar con "Rate limit exceeded"
```

### Probar CORS
```bash
# Desde otro dominio, intentar hacer fetch a tu API
# Debería fallar con error de CORS
```

### Probar HTTPS
```bash
# En producción, acceder a http://tu-dominio.com
# Debería redirigir a https://tu-dominio.com
```

---

## 🔐 Checklist de Seguridad

- [x] CORS restringido a dominios específicos
- [x] HTTPS forzado en producción
- [x] Rate limiting en login/registro
- [x] Contraseñas hasheadas con bcrypt
- [x] JWT con expiración
- [x] Variables de entorno en `.env` (no en código)
- [x] `.env` en `.gitignore`
- [ ] Headers de seguridad (HSTS, X-Frame-Options)
- [ ] Validación de input en todos los endpoints
- [ ] Logging de intentos fallidos

---

**Última actualización:** Marzo 2026
**Versión:** 1.0.0
