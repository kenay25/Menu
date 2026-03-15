// Constants for La Esquina del Sushi

export const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-97d4.up.railway.app';
export const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '526624580620';
export const MENU_EMAIL = import.meta.env.VITE_MENU_EMAIL || 'menu@laesquinasushi.com';
export const MENU_PASSWORD = import.meta.env.VITE_MENU_PASSWORD || '!sushi2026';
export const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD || 'dccpuq4r4';
export const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || 'sushi_menu';

export const PROTEINS = [
  { id: 'p_res',     emoji: '🥩', name: 'Res' },
  { id: 'p_pollo',   emoji: '🍗', name: 'Pollo' },
  { id: 'p_tocino',  emoji: '🥓', name: 'Tocino' },
  { id: 'p_surimi',  emoji: '🦐', name: 'Surimi' },
  { id: 'p_camaron', emoji: '🦐', name: 'Camarón' },
];

export const SAUCES = [
  { id: 'sc1', name: 'BBQ' },
  { id: 'sc2', name: 'Búfalo' },
  { id: 'sc3', name: 'Mixto' },
  { id: 'sc4', name: 'BBQ Chipotle' },
  { id: 'sc5', name: 'Naranja Chipotle' },
  { id: 'sc6', name: 'Tamarindo' },
  { id: 'sc7', name: 'Mango Hot' },
  { id: 'sc8', name: 'Mango Habanero' },
  { id: 'sc9', name: 'Piña Hot' },
];

export const EXTRA_INGS = [
  'Camarón','Pollo','Res','Tocino','Surimi',
  'Tampico','Soya','Anguila','Chipotle','Ranch',
];

export const CATEGORIAS = {
  1: 'Combos y Charolas',
  2: 'Sushis',
  3: 'Entradas',
  4: 'Especiales',
  5: 'Bebidas y Extras',
  6: 'Promociones',
};

// Mapeo campo backend → checkbox frontend
export const OPTS_MAP = {
  has_alga:        'alga',
  has_style:       'style',
  has_protein:     'protein',
  has_sauce:       'sauce',
  has_sauce_1only: 'sauce1only',
  has_sauce_2:     'sauce2',
  has_sauce_alitas:'sauceAlitas',
  has_sushi_choice:'sushiChoice',
  has_ice:         'ice',
  is_extra_ing:    'extraIng',
};

export const EMOJI_GROUPS = {
  'Sushi & Japonesa': ['🍣','🍱','🍜','🍙','🍘','🍥','🥟','🦐','🦑','🦀','🐟','🐡'],
  'Pollo & Carnes':   ['🍗','🍖','🥩','🍔','🌮','🌯','🥪','🥚','🍳','🥓'],
  'Vegetales':        ['🥦','🥕','🧅','🧄','🌽','🫑','🥑','🥒','🍅','🌿','🥬'],
  'Bebidas':          ['🥤','🧃','☕','🍵','🧋','🍶'],
  'Snacks & Otros':   ['🍟','🧀','🫙','🍞','🧆','🥙','🌶️','⭐','✨','🔥','🎁'],
};

export const ESTADOS_PEDIDO = {
  recibido:    { label: '🔵 Recibido',    color: 'blue' },
  preparando:  { label: '🟡 Preparando',  color: 'yellow' },
  listo:       { label: '🟢 Listo',       color: 'green' },
  entregado:   { label: '✅ Entregado',   color: 'gray' },
  cancelado:   { label: '❌ Cancelado',   color: 'red' },
};

export const ROLES_USUARIO = {
  admin:   'Administrador',
  caja:    'Caja',
  cocina:  'Cocina',
};
