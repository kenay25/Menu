from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, JSON
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"
    __table_args__ = {'mysql_charset': 'utf8mb4', 'mysql_collate': 'utf8mb4_unicode_ci'}

    id_producto     = Column(Integer,       primary_key=True, autoincrement=True)
    id_restaurante  = Column(Integer,       nullable=False)
    id_categoria    = Column(Integer,       nullable=True)
    nombre          = Column(String(100),   nullable=False)
    precio          = Column(Numeric(10,2), nullable=False)
    disponible      = Column(Boolean,       nullable=False, default=True)

    # Contenido y presentación
    descripcion     = Column(Text,          nullable=True)
    emoji           = Column(String(10),    nullable=True,  default='🍣')
    tag             = Column(String(20),    nullable=True)   # popular | hot | new | None

    # Opciones del modal de personalización
    has_alga        = Column(Boolean,       nullable=False, default=False)
    has_style       = Column(Boolean,       nullable=False, default=False)  # natural/empanizado
    has_protein     = Column(Boolean,       nullable=False, default=False)
    has_sauce       = Column(Boolean,       nullable=False, default=False)
    has_sauce_1only = Column(Boolean,       nullable=False, default=False)  # máx 1 salsa
    has_sauce_2     = Column(Boolean,       nullable=False, default=False)  # 2ª orden boneles
    has_sauce_alitas= Column(Boolean,       nullable=False, default=False)
    has_sushi_choice= Column(Boolean,       nullable=False, default=False)  # Bombazo/Cal/Sonora
    has_ice         = Column(Boolean,       nullable=False, default=False)
    is_extra_ing    = Column(Boolean,       nullable=False, default=False)

    # Ingredientes y extras como JSON
    # ingredientes: [{"id","emoji","name","note","removable"}]
    # extras_producto: [{"id","emoji","name","note","price"}]
    ingredientes    = Column(JSON,          nullable=True)
    extras_producto = Column(JSON,          nullable=True)

    # Imagen del platillo (URL de Cloudinary o ruta local /img/nombre.jpg)
    imagen_url      = Column(String(500),   nullable=True)