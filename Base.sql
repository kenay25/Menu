-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sushi_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Seleccionarla para trabajar en ella
USE sushi_db;

CREATE TABLE restaurantes (
  id_restaurante  INT           NOT NULL AUTO_INCREMENT,
  nombre          VARCHAR(100)  NOT NULL,
  direccion       VARCHAR(200)  NOT NULL,
  telefono        VARCHAR(20)   NOT NULL,
  telefono2       VARCHAR(20)       NULL,
  whatsapp        VARCHAR(20)       NULL,
  horario         VARCHAR(100)      NULL,  -- "5:30 - 11:30 pm"
  activo          TINYINT(1)    NOT NULL DEFAULT 1,
  fecha_creacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_restaurante)
);

-- Insertar La Esquina del Sushi
INSERT INTO restaurantes (nombre, direccion, telefono, telefono2, whatsapp, horario)
VALUES (
  'La Esquina del Sushi',
  'Blvd. Sonora #21, Media Cuadra del Socum',
  '642-134-2959',
  '642-426-7244',
  '526622067409',
  '5:30 - 11:30 pm · Descanso martes'
);

CREATE TABLE categorias (
  id_categoria    INT           NOT NULL AUTO_INCREMENT,
  id_restaurante  INT           NOT NULL,
  nombre          VARCHAR(50)   NOT NULL,  -- "Combos", "Sushis", "Entradas"...
  orden           INT           NOT NULL DEFAULT 0,  -- para controlar el orden en el menú
  activo          TINYINT(1)    NOT NULL DEFAULT 1,

  PRIMARY KEY (id_categoria),
  FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

-- Insertar las categorías del menú
INSERT INTO categorias (id_restaurante, nombre, orden) VALUES
  (1, 'Combos y Charolas', 1),
  (1, 'Sushis',            2),
  (1, 'Entradas',          3),
  (1, 'Especiales',        4),
  (1, 'Bebidas y Extras',  5),
  (1, 'Promociones',       6);
  
  CREATE TABLE productos (
  id_producto     INT           NOT NULL AUTO_INCREMENT,
  id_categoria    INT           NOT NULL,
  id_restaurante  INT           NOT NULL,
  nombre          VARCHAR(100)  NOT NULL,
  descripcion     TEXT              NULL,
  precio          DECIMAL(10,2) NOT NULL,
  tag             VARCHAR(20)       NULL,  -- 'popular', 'hot', 'new'
  tiene_proteina  TINYINT(1)    NOT NULL DEFAULT 0,
  tiene_salsa     TINYINT(1)    NOT NULL DEFAULT 0,
  tiene_alga      TINYINT(1)    NOT NULL DEFAULT 0,
  disponible      TINYINT(1)    NOT NULL DEFAULT 1,
  fecha_creacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_producto),
  FOREIGN KEY (id_categoria)   REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

CREATE TABLE clientes (
  id_cliente      INT           NOT NULL AUTO_INCREMENT,
  id_restaurante  INT           NOT NULL,
  nombre          VARCHAR(100)  NOT NULL,
  telefono        VARCHAR(20)   NOT NULL,
  direccion       TEXT              NULL,
  total_pedidos   INT           NOT NULL DEFAULT 0,
  total_gastado   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  ultima_visita   DATETIME          NULL,
  fecha_registro  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_cliente),
  UNIQUE KEY uq_telefono_restaurante (telefono, id_restaurante),
  FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

CREATE TABLE usuarios (
  id_usuario      INT           NOT NULL AUTO_INCREMENT,
  id_restaurante  INT           NOT NULL,
  nombre          VARCHAR(100)  NOT NULL,
  email           VARCHAR(100)  NOT NULL,
  password_hash   VARCHAR(255)  NOT NULL,  -- nunca guardamos contraseñas en texto plano
  rol             ENUM('admin','cocina','caja') NOT NULL DEFAULT 'caja',
  activo          TINYINT(1)    NOT NULL DEFAULT 1,
  ultimo_acceso   DATETIME          NULL,
  fecha_creacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_email (email),
  FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante)
);

-- Insertar admin inicial (la contraseña se cambia desde el sistema)
INSERT INTO usuarios (id_restaurante, nombre, email, password_hash, rol)
VALUES (1, 'Kenay', 'silvakenay5@gmail.com', 'Kirito$50', 'admin');

-- Usuario para la aplicación (el backend FastAPI usa este)
-- Solo puede leer, insertar y actualizar. Nunca borrar ni modificar estructura.
CREATE USER 'sushi_app'@'%' IDENTIFIED BY 'AppSushi2024!';

GRANT SELECT, INSERT, UPDATE ON sushi_db.* TO 'sushi_app'@'%';

-- Usuario solo lectura (para reportes o consultas externas)
CREATE USER 'sushi_reportes'@'localhost' IDENTIFIED BY 'Reportes2024!';

GRANT SELECT ON sushi_db.* TO 'sushi_reportes'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Ver todos los usuarios creados
SELECT user, host FROM mysql.user;

-- Ver los permisos de sushi_app
SHOW GRANTS FOR 'sushi_app'@'%';

CREATE TABLE pedidos (
  id_pedido          INT           NOT NULL AUTO_INCREMENT,
  id_restaurante     INT           NOT NULL,
  id_cliente         INT               NULL,  -- NULL si el cliente no está registrado aún
  nombre_cliente     VARCHAR(100)  NOT NULL,  -- siempre se guarda aunque no esté registrado
  telefono_cliente   VARCHAR(20)       NULL,
  tipo_entrega       ENUM('sucursal','domicilio') NOT NULL DEFAULT 'sucursal',
  direccion_entrega  TEXT              NULL,  -- solo si es domicilio
  notas              TEXT              NULL,
  total              DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado             ENUM('recibido','preparando','listo','entregado','cancelado') 
                     NOT NULL DEFAULT 'recibido',
  fecha_pedido       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP 
                                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id_pedido),
  FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante),
  FOREIGN KEY (id_cliente)     REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
  id_detalle       INT            NOT NULL AUTO_INCREMENT,
  id_pedido        INT            NOT NULL,
  id_producto      INT            NOT NULL,
  nombre_producto  VARCHAR(100)   NOT NULL,  -- se guarda el nombre por si el producto cambia después
  precio_unitario  DECIMAL(10,2)  NOT NULL,  -- precio al momento de pedir
  cantidad         INT            NOT NULL DEFAULT 1,
  modificaciones   JSON               NULL,  -- proteínas, salsas, sin ingredientes, extras
  costo_extra      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,  -- costo de modificaciones
  subtotal         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,  -- (precio_unitario + costo_extra) * cantidad

  PRIMARY KEY (id_detalle),
  FOREIGN KEY (id_pedido)   REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE VIEW v_pedidos AS
SELECT 
  p.id_pedido,
  p.nombre_cliente,
  p.telefono_cliente,
  p.tipo_entrega,
  p.direccion_entrega,
  p.estado,
  p.total,
  p.notas,
  p.fecha_pedido,
  p.fecha_actualizacion,
  COUNT(d.id_detalle)        AS total_productos,
  c.total_pedidos            AS pedidos_previos_cliente
FROM pedidos p
LEFT JOIN detalle_pedido d ON d.id_pedido   = p.id_pedido
LEFT JOIN clientes       c ON c.id_cliente  = p.id_cliente
GROUP BY 
  p.id_pedido, p.nombre_cliente, p.telefono_cliente,
  p.tipo_entrega, p.direccion_entrega, p.estado,
  p.total, p.notas, p.fecha_pedido, p.fecha_actualizacion,
  c.total_pedidos;
  
  CREATE VIEW v_detalle_pedidos AS
SELECT
  d.id_pedido,
  d.id_detalle,
  d.nombre_producto,
  d.cantidad,
  d.precio_unitario,
  d.costo_extra,
  d.subtotal,
  d.modificaciones,
  p.nombre_cliente,
  p.estado,
  p.fecha_pedido
FROM detalle_pedido d
JOIN pedidos p ON p.id_pedido = d.id_pedido;

CREATE VIEW v_estadisticas_dia AS
SELECT
  DATE(fecha_pedido)             AS fecha,
  COUNT(*)                       AS total_pedidos,
  SUM(total)                     AS ventas_totales,
  AVG(total)                     AS ticket_promedio,
  SUM(CASE WHEN estado = 'entregado' THEN 1 ELSE 0 END) AS entregados,
  SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
  SUM(CASE WHEN tipo_entrega = 'domicilio' THEN 1 ELSE 0 END) AS a_domicilio,
  SUM(CASE WHEN tipo_entrega = 'sucursal'  THEN 1 ELSE 0 END) AS en_sucursal
FROM pedidos
WHERE estado != 'cancelado'
GROUP BY DATE(fecha_pedido)
ORDER BY fecha DESC;

CREATE VIEW v_mejores_clientes AS
SELECT
  c.id_cliente,
  c.nombre,
  c.telefono,
  c.direccion,
  c.total_pedidos,
  c.total_gastado,
  c.ultima_visita,
  ROUND(c.total_gastado / NULLIF(c.total_pedidos, 0), 2) AS ticket_promedio
FROM clientes c
WHERE c.total_pedidos > 0
ORDER BY c.total_gastado DESC;

CREATE VIEW v_productos_mas_vendidos AS
SELECT
  d.id_producto,
  d.nombre_producto,
  cat.nombre                  AS categoria,
  SUM(d.cantidad)             AS veces_pedido,
  SUM(d.subtotal)             AS ingresos_generados,
  AVG(d.precio_unitario)      AS precio_promedio
FROM detalle_pedido d
JOIN productos  pro ON pro.id_producto  = d.id_producto
JOIN categorias cat ON cat.id_categoria = pro.id_categoria
GROUP BY d.id_producto, d.nombre_producto, cat.nombre
ORDER BY veces_pedido DESC;

-- ── Tabla pedidos ─────────────────────────────────────────
-- Buscar pedidos por estado (los que están en 'recibido' o 'preparando')
CREATE INDEX idx_pedidos_estado 
  ON pedidos(estado);

-- Buscar pedidos de hoy o por rango de fechas
CREATE INDEX idx_pedidos_fecha 
  ON pedidos(fecha_pedido);

-- Buscar todos los pedidos de un cliente específico
CREATE INDEX idx_pedidos_cliente 
  ON pedidos(id_cliente);

-- Buscar por teléfono cuando el cliente no está registrado
CREATE INDEX idx_pedidos_telefono 
  ON pedidos(telefono_cliente);

-- ── Tabla detalle_pedido ───────────────────────────────────
-- Traer todos los productos de un pedido
CREATE INDEX idx_detalle_pedido 
  ON detalle_pedido(id_pedido);

-- Ver cuántas veces se pidió un producto
CREATE INDEX idx_detalle_producto 
  ON detalle_pedido(id_producto);

-- ── Tabla clientes ─────────────────────────────────────────
-- Buscar cliente por teléfono para autocompletar
CREATE INDEX idx_clientes_telefono 
  ON clientes(telefono);

-- ── Tabla productos ────────────────────────────────────────
-- Filtrar productos por categoría
CREATE INDEX idx_productos_categoria 
  ON productos(id_categoria);

-- Traer solo productos disponibles
CREATE INDEX idx_productos_disponible 
  ON productos(disponible);
  
  SELECT 
  TABLE_NAME   AS tabla,
  INDEX_NAME   AS indice,
  COLUMN_NAME  AS columna
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'sushi_db'
  AND INDEX_NAME != 'PRIMARY'
ORDER BY TABLE_NAME, INDEX_NAME;

INSERT INTO productos (id_categoria, id_restaurante, nombre, descripcion, precio, tag, tiene_proteina, tiene_salsa, tiene_alga)
VALUES
-- Combos (id_categoria = 1)
(1, 1, 'La Caja',        '2 órdenes de boneles, papas, 3 sushis, dedos de queso, tampico y salsas.', 650.00, 'new',     0, 1, 0),
(1, 1, 'La Cajita',      'Boneles, 3 sushis, apio, zanahoria, aderezos y salsas.',                   400.00, NULL,      0, 1, 0),
(1, 1, 'Rosca',          'Orden especial. Consultar disponibilidad.',                                350.00, NULL,      0, 0, 0),
(1, 1, 'La Botanera',    'Alitas, papas, boneles, 3 caribes, zanahoria, apio y salsas.',             350.00, 'popular', 0, 1, 0),
(1, 1, 'Charola',        '1/2 California, boneless, papas, dedos de queso y tampico.',              220.00, 'popular', 0, 1, 0),
(1, 1, 'Paquetellenes',  '1/2 sushi, 1/2 boneless, 1/2 papas sazonadas.',                           150.00, NULL,      0, 1, 0),
(1, 1, 'Botix',          'Mitad sushi, mitad boneless. Salsa a elegir.',                             120.00, NULL,      0, 1, 0),

-- Sushis (id_categoria = 2)
(2, 1, 'Borbon',         'Monster + boneles en salsa a elección.',                                   220.00, 'popular', 0, 1, 1),
(2, 1, 'Monster',        'Surimi, pollo, res, tocino, camarón, gratinado y serrano.',                165.00, 'hot',     0, 0, 1),
(2, 1, 'Franco Roll',    'Camarón frito, carne asada, mozzarella, tocino y cebollín.',               165.00, 'new',     0, 0, 1),
(2, 1, 'La Chuyita',     'Camarón frito aderezado, tocino, mozzarella, chipotle y cebollín.',        165.00, 'popular', 0, 0, 1),
(2, 1, 'Mexicano 2',     'Tampico, carne asada, aguacate, serrano, cebollín. Gratinado.',            165.00, NULL,      0, 0, 1),
(2, 1, 'Mayito',         'Proteína a elegir. Tampico con boneless en salsa.',                        145.00, 'popular', 1, 1, 0),
(2, 1, 'Mix Roll',       'Proteína a elegir, mix de tocino y queso gratinado.',                      145.00, NULL,      1, 0, 1),
(2, 1, 'Baked',          'Pollo, mix tocino y camarón con queso gratinado.',                         145.00, 'hot',     0, 0, 1),
(2, 1, 'Fernanda',       'Pollo, res, mix caribe y chile verde con camarón empanizado.',             145.00, NULL,      0, 0, 1),
(2, 1, 'Hot',            'Res, queso gratinado picante, camarón y tocino.',                          145.00, 'hot',     0, 0, 1),
(2, 1, 'Mexicano 1',     'Tampico, carne asada, aguacate, serrano y cebollín.',                      145.00, NULL,      0, 0, 1),
(2, 1, 'Tres Quesos',    'Proteína a elegir, gratinado, manchego y cebollín.',                       135.00, NULL,      1, 0, 1),
(2, 1, 'Chipotle',       'Pollo, camarón capeado, chipotle y cebollín.',                             135.00, NULL,      0, 0, 1),
(2, 1, 'Queen Roll',     'Pollo, camarón, queso gratinado y tampico.',                               135.00, 'popular', 0, 0, 1),
(2, 1, 'Cielo Mar y Tierra', 'Camarón, pollo y res.',                                               120.00, NULL,      0, 0, 1),
(2, 1, 'Antojo',         'Res, tocino, camarón, philadelphia y serrano.',                            120.00, NULL,      0, 0, 1),
(2, 1, 'Bombazo',        'Proteína a elegir, tampico, anguila y ajonjolí.',                          110.00, 'popular', 1, 0, 1),
(2, 1, 'Sonora',         'Res, tocino, philadelphia y chile verde.',                                 110.00, NULL,      0, 0, 1),
(2, 1, 'Daishi',         'Tampico y tocino.',                                                        100.00, NULL,      0, 0, 1),
(2, 1, 'Aguacate',       'Proteína a elegir, aguacate y ajonjolí.',                                  100.00, NULL,      1, 0, 1),
(2, 1, 'Especial',       'Surimi, tampico, aguacate, anguila y ajonjolí.',                           115.00, 'popular', 0, 0, 1),
(2, 1, 'California',     '01 proteína a elegir.',                                                     95.00, NULL,      1, 0, 1),
(2, 1, 'Misil',          'Philadelphia, tampico, tocino, res y chile verde empanizado.',              80.00, NULL,      0, 0, 0),

-- Entradas (id_categoria = 3)
(3, 1, 'Tostiboneles',   'Tostitos con queso amarillo y boneles en salsa.',                          150.00, NULL,      0, 1, 0),
(3, 1, 'Papiboneles',    'Papa sazonada, boneles en salsa y queso amarillo.',                        130.00, 'new',     0, 1, 0),
(3, 1, 'Boliblitz',      '8 bolitas de tampico, philadelphia, anguila y cebollín.',                  100.00, 'popular', 0, 0, 0),
(3, 1, 'Tostitampico',   'Tostitos, tampico, zanahoria, chipotle, anguila y ajonjolí.',               70.00, NULL,      0, 0, 0),
(3, 1, 'Dedos de Queso', 'Philadelphia, 5 unidades.',                                                 60.00, 'popular', 0, 0, 0),
(3, 1, 'Papas Sazonadas','Papas sazonadas al estilo La Esquina.',                                     50.00, NULL,      0, 0, 0),
(3, 1, 'Chile Caribe Relleno', 'Philadelphia, tocino, tampico y empanizado.',                         30.00, NULL,      0, 0, 0),

-- Especiales (id_categoria = 4)
(4, 1, 'Yakimeshi',      'Arroz frito con pollo, res, tocino, camarón, aguacate y tampico.',         135.00, NULL,      0, 0, 0),
(4, 1, 'Gohan',          'Arroz, philadelphia, tampico, proteínas, aguacate, serrano y cebollín.',   135.00, 'popular', 0, 0, 0),
(4, 1, 'Alitas',         'Picositas o salsa a elección.',                                            120.00, 'popular', 0, 1, 0),
(4, 1, 'Boneless',       'Tiras de pollo empanizadas en salsa. Con apio, zanahoria y aderezo.',      120.00, 'popular', 0, 1, 0),
(4, 1, 'Boneless con Papas', 'Boneless más papas sazonadas.',                                        120.00, NULL,      0, 1, 0),
(4, 1, 'Bolas Mixta',    'Bolas de sushi con mix de proteínas.',                                      95.00, NULL,      1, 0, 0),
(4, 1, 'Bolas Camarón',  'Bolas de sushi con camarón.',                                               85.00, NULL,      0, 0, 0),
(4, 1, 'Bolas Básica',   'Proteína a elegir.',                                                         75.00, NULL,      1, 0, 0),

-- Bebidas (id_categoria = 5)
(5, 1, 'Té 1 litro',     'Té helado 1 litro.',                                                        25.00, NULL,      0, 0, 0),
(5, 1, 'Coca-Cola 600ml','Coca-Cola 600ml roja.',                                                      25.00, NULL,      0, 0, 0),
(5, 1, 'Extra Ingrediente', 'Camarón, pollo, res, tocino, surimi, tampico, soya, anguila, chipotle o ranch.', 15.00, NULL, 0, 0, 0),
(5, 1, 'Extra Queso Gratinado', 'Queso gratinado extra.',                                              25.00, NULL,      0, 0, 0),

-- Promociones (id_categoria = 6)
(6, 1, '2 Californias + Tostitampico', '2 Californias con proteína + 1 Tostitampico.',               220.00, 'popular', 1, 0, 0),
(6, 1, '2 Sonoras',      '2 Sonoras.',                                                               200.00, NULL,      0, 0, 0),
(6, 1, '3 Bolas',        '3 Bolas con proteína a elegir.',                                           200.00, NULL,      1, 0, 0),
(6, 1, '1 Boneless + 1 California', '1 Boneless con salsa + 1 California con proteína.',            150.00, 'popular', 1, 1, 0);

INSERT INTO clientes (id_restaurante, nombre, telefono, direccion)
VALUES (1, 'Juan Pérez', '642-100-2000', 'Calle Reforma #45, Col. Centro');

INSERT INTO pedidos (
  id_restaurante, id_cliente, nombre_cliente, telefono_cliente,
  tipo_entrega, direccion_entrega, notas, total, estado
)
VALUES (
  1, 1, 'Juan Pérez', '642-100-2000',
  'domicilio', 'Calle Reforma #45, Col. Centro',
  'Sin picante por favor',
  340.00, 'recibido'
);

INSERT INTO detalle_pedido (
  id_pedido, id_producto, nombre_producto,
  precio_unitario, cantidad, modificaciones, costo_extra, subtotal
)
VALUES (
  1, 1, 'Borbon',
  220.00, 1,
  '{
    "alga": "con",
    "proteinas": [],
    "salsas": ["BBQ", "Búfalo"],
    "sin_ingredientes": ["Pepino"],
    "extras_ingredientes": [],
    "extras_producto": []
  }',
  0.00, 220.00
);

INSERT INTO detalle_pedido (
  id_pedido, id_producto, nombre_producto,
  precio_unitario, cantidad, modificaciones, costo_extra, subtotal
)
VALUES (
  1, 2, 'Boneless',
  120.00, 1,
  '{
    "alga": null,
    "proteinas": [],
    "salsas": ["Mango Habanero"],
    "sin_ingredientes": [],
    "extras_ingredientes": ["Ranch"],
    "extras_producto": []
  }',
  15.00, 135.00
);

-- Ver el pedido completo
SELECT * FROM v_pedidos;

-- Ver el detalle con modificaciones
SELECT * FROM v_detalle_pedidos;

-- Estadísticas del día
SELECT * FROM v_estadisticas_dia;

SELECT id_producto, nombre, precio FROM productos ORDER BY id_producto;

--

-- Ver el pedido completo
SELECT * FROM v_pedidos;

-- Ver qué pidió exactamente con sus modificaciones
SELECT * FROM v_detalle_pedidos;

-- Estadísticas del día
SELECT * FROM v_estadisticas_dia;

-- Mejores clientes
SELECT * FROM v_mejores_clientes;

-- Productos más vendidos
SELECT * FROM v_productos_mas_vendidos;

SELECT p.id_producto, p.nombre, p.precio, c.nombre AS categoria
FROM productos p
JOIN categorias c ON c.id_categoria = p.id_categoria
ORDER BY c.id_categoria, p.precio DESC;

UPDATE usuarios 
SET password_hash = 'Kirito$50'
WHERE email = 'silvakenay5@gmail.com';