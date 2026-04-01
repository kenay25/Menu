# Fix para Emojis - Problema de codificación UTF-8

## Problema
Los emojis se guardan en la base de datos pero se muestran como `` (caracteres corruptos) en el menú.

## Causa
La base de datos MySQL no está configurada con `utf8mb4`, que es el charset necesario para almacenar emojis (caracteres Unicode de 4 bytes).

## Solución Aplicada

### 1. Código actualizado
Se modificaron los siguientes archivos:

- **`app/database.py`**: Ahora agrega automáticamente `?charset=utf8mb4` a la URL de la base de datos
- **`app/models/*.py`**: Se agregó `__table_args__` con charset utf8mb4 a todos los modelos

### 2. Pasos que debes seguir

#### Opción A: Si estás en producción (servidor remoto)

1. **Actualiza tu `.env`** en el servidor:
   ```
   DATABASE_URL=mysql+pymysql://usuario:password@host:3306/database?charset=utf8mb4
   ```

2. **Ejecuta el script de conversión**:
   ```bash
   # Conéctate al servidor y ejecuta:
   python fix_emojis_db.py
   ```

3. **Reinicia el servidor**:
   ```bash
   # Dependiendo de tu hosting:
   # Render/Heroku: El reinicio es automático al hacer push
   # VPS propio: systemctl restart tu-servicio
   ```

#### Opción B: Si estás en desarrollo local

1. **Ejecuta el script SQL directamente en MySQL**:
   ```sql
   -- Abre tu cliente MySQL y ejecuta:
   source fix_emojis.sql;
   ```

2. **O ejecuta el script de Python**:
   ```bash
   python fix_emojis_db.py
   ```

3. **Reinicia el servidor de desarrollo**:
   ```bash
   # Detén el servidor actual (Ctrl+C) y vuelve a iniciar:
   uvicorn app.main:app --reload
   ```

### 3. Verificación

Después de aplicar el fix:

1. Abre el menú en tu celular o computadora
2. Edita un producto y agrega un emoji 🍣🍜🍤
3. Guarda los cambios
4. El emoji debería verse correctamente ahora

## Archivos creados para el fix

- `fix_emojis.sql` - Script SQL para convertir la base de datos
- `fix_emojis_db.py` - Script Python para convertir la base de datos

## Notas importantes

⚠️ **IMPORTANTE**: El cambio de charset NO afecta los datos existentes, solo permite guardar nuevos caracteres (emojis) correctamente.

⚠️ **Backup**: Antes de ejecutar el script, haz un backup de tu base de datos:
```bash
mysqldump -u usuario -p database > backup_antes_fix.sql
```

## ¿Por qué funcionaba en otras computadoras?

Es probable que otras computadoras tengan:
- Una versión más reciente de MySQL/MariaDB con utf8mb4 por defecto
- Una configuración regional (locale) diferente
- Un cliente MySQL que fuerza UTF-8 automáticamente

## Soporte

Si después de aplicar el fix los emojis siguen sin verse:

1. Verifica que la URL de la base de datos incluya `?charset=utf8mb4`
2. Ejecuta este query en tu base de datos:
   ```sql
   SHOW VARIABLES LIKE 'character_set%';
   ```
3. Deberías ver `utf8mb4` en todos los valores relacionados a character_set
