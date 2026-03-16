/* ═══════════════════════════════════════════════
   La Esquina del Sushi — Lógica y datos del menú
   ═══════════════════════════════════════════════ */

var WA = '526624580620';
var API_URL = 'https://web-production-97d4.up.railway.app';
var API_TOKEN = null;
var _pedidosAbiertos = true;

/* ── Datos globales ─────────────────────────── */
var PROTEINS = [
  { id: 'p_res', emoji: '&#x1F969;', name: 'Res' },
  { id: 'p_pollo', emoji: '&#x1F357;', name: 'Pollo' },
  { id: 'p_tocino', emoji: '&#x1F953;', name: 'Tocino' },
  { id: 'p_surimi', emoji: '&#x1F980;', name: 'Surimi' },
  { id: 'p_camaron', emoji: '&#x1F990;', name: 'Camarón' }
];

var SAUCES = [
  { id: 'sc1', name: 'BBQ' },
  { id: 'sc2', name: 'Búfalo' },
  { id: 'sc3', name: 'Mixto' },
  { id: 'sc4', name: 'BBQ Chipotle' },
  { id: 'sc5', name: 'Naranja Chipotle' },
  { id: 'sc6', name: 'Tamarindo' },
  { id: 'sc7', name: 'Mango Hot' },
  { id: 'sc8', name: 'Mango Habanero' },
  { id: 'sc9', name: 'Piña Hot' }
];

var EXTRA_INGS = [
  'Camarón', 'Pollo', 'Res', 'Tocino', 'Surimi',
  'Tampico', 'Soya', 'Anguila', 'Chipotle', 'Ranch'
];

/* ── Helper builders ────────────────────────── */
function ing(id, em, nm, nt, rm) {
  return { id: id, emoji: em, name: nm, note: nt, removable: rm };
}
function base() {
  return [
    ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true),
    ing('b2', '&#x1F952;', 'Pepino', 'Base', true),
    ing('b3', '&#x1F951;', 'Aguacate', 'Base', true)
  ];
}

/* ══════════════════════════════════════════════
   MENÚ — ordenado de MAYOR a MENOR precio
   dentro de cada sección
   ══════════════════════════════════════════════ */
var MENU = {

  /* ── COMBOS (de $650 a $120) ──────────────── */
  combos: [
    {
      id: 'c7', dbId: 1, emoji: '&#x1F371;', name: 'La Caja', price: 650, tag: 'new', hasSauce: true, hasSauce2: true,
      desc: '2 órdenes de boneles (salsa a elección c/u), O. papas sazonadas, 3 sushis, O. dedos queso philadelphia, tampico, chipotle, ranch, anguila, soya y siracha.',
      ingredients: [ing('b1', '&#x1F357;', 'Boneles x2', '2 órdenes — salsa individual', false), ing('b2', '&#x1F35F;', 'Papas sazonadas', '1 orden', false), ing('b3', '&#x1F363;', 'Sushis x3', 'California, Bombazo, Sonora', false), ing('b4', '&#x1F9C0;', 'Dedos de queso', '1 orden', false), ing('b5', '&#x1F41F;', 'Tampico', 'Incluido', true)], extras: []
    },

    {
      id: 'c6', dbId: 2, emoji: '&#x1F371;', name: 'La Cajita', price: 400, tag: null, hasSauce: true,
      desc: 'O. boneles, 03 sushis (bombazo, california y sonora), apio, zanahoria, aderezo, ranch, anguila, soya y siracha.',
      ingredients: [ing('b1', '&#x1F357;', 'Boneles', '1 orden', false), ing('b2', '&#x1F363;', 'California', 'Sushi', false), ing('b3', '&#x1F363;', 'Bombazo', 'Sushi', false), ing('b4', '&#x1F363;', 'Sonora', 'Sushi', false), ing('b5', '&#x1F955;', 'Apio y zanahoria', 'Al lado', true)], extras: []
    },

    {
      id: 'c8', dbId: 3, emoji: '&#x1F363;', name: 'Rosca', price: 350, tag: null,
      desc: 'Orden especial. Consultar disponibilidad.',
      ingredients: [ing('b1', '&#x1F363;', 'Rosca de sushi', 'Presentación especial', false)], extras: []
    },

    {
      id: 'c5', dbId: 4, emoji: '&#x1F371;', name: 'La Botanera', price: 350, tag: 'popular', hasSauce: true,
      desc: '01 alitas, 01 papas sazonadas, 01 boneles, 03 caribes, zanahoria, apio, aderezos y salsas.',
      ingredients: [ing('b1', '&#x1F357;', 'Alitas', '1 orden', false), ing('b2', '&#x1F35F;', 'Papas sazonadas', '1 orden', false), ing('b3', '&#x1F357;', 'Boneles', '1 orden', false), ing('b4', '&#x1F336;&#xFE0F;', '3 Caribes', 'Rellenos', true), ing('b5', '&#x1F955;', 'Zanahoria y apio', 'Al lado', true)], extras: []
    },

    {
      id: 'c4', dbId: 5, emoji: '&#x1F371;', name: 'Charola', price: 220, tag: 'popular', hasSauce: true,
      desc: '1/2 California, 1/2 boneless, 1/2 papas sazonadas, dedos de queso y tampico.',
      ingredients: [ing('b1', '&#x1F363;', '1/2 California', 'Sushi', false), ing('b2', '&#x1F357;', 'Boneless', 'Mitad', false), ing('b3', '&#x1F35F;', 'Papas sazonadas', 'Mitad', false), ing('b4', '&#x1F9C0;', 'Dedos de queso', 'Incluidos', true), ing('b5', '&#x1F41F;', 'Tampico', 'Incluido', true)], extras: []
    },

    {
      id: 'c3', dbId: 6, emoji: '&#x1F371;', name: 'Paquetellenes', price: 150, tag: null, hasSauce: true,
      desc: '1/2 sushi (bombazo, sonora o california), 1/2 boneless, 1/2 papas sazonadas.',
      ingredients: [ing('b1', '&#x1F363;', '1/2 sushi a elegir', 'Bombazo/Sonora/California', false), ing('b2', '&#x1F357;', 'Boneless', 'Mitad', false), ing('b3', '&#x1F35F;', 'Papas sazonadas', 'Mitad porción', false)], extras: []
    },

    {
      id: 'c2', dbId: 7, emoji: '&#x1F371;', name: 'Botix', price: 120, tag: null, hasSauce: true,
      desc: 'Mitad sushi (bombazo, sonora o california) mitad boneless. Salsa a elegir.',
      ingredients: [ing('b1', '&#x1F363;', '1/2 sushi a elegir', 'Bombazo/Sonora/California', false), ing('b2', '&#x1F357;', 'Boneless', 'Mitad', false)], extras: []
    }
  ],

  /* ── SUSHIS (de $220 a $80) ───────────────── */
  sushis: [
    {
      id: 's22', dbId: 8, emoji: '&#x1F363;', name: 'Borbon', price: 220, tag: 'popular', hasSauce: true, hasAlga: true,
      desc: 'Por dentro: surimi empanizado, pollo, res, tocino y camarón. Por fuera: queso gratinado con chile serrano. Boneles en salsa a elección.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F980;', 'Surimi empanizado', 'Relleno', true), ing('b6', '&#x1F357;', 'Pollo', 'Relleno', true), ing('b7', '&#x1F969;', 'Res', 'Relleno', true), ing('b8', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b9', '&#x1F990;', 'Camarón', 'Relleno', true), ing('b10', '&#x1F9C0;', 'Queso gratinado', 'Cubierta', false), ing('b11', '&#x1F336;&#xFE0F;', 'Chile serrano', 'Cubierta', true)], extras: []
    },

    {
      id: 's17', dbId: 9, emoji: '&#x1F363;', name: 'Monster', price: 165, tag: 'hot', hasAlga: true,
      desc: 'Por dentro: surimi empanizado, pollo, res, tocino y camarón. Por fuera: queso gratinado con chile serrano.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F980;', 'Surimi empanizado', 'Relleno', true), ing('b6', '&#x1F357;', 'Pollo', 'Relleno', true), ing('b7', '&#x1F969;', 'Res', 'Relleno', true), ing('b8', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b9', '&#x1F990;', 'Camarón', 'Relleno', true), ing('b10', '&#x1F9C0;', 'Queso gratinado', 'Cubierta', false), ing('b11', '&#x1F336;&#xFE0F;', 'Chile serrano', 'Cubierta', true)], extras: []
    },

    {
      id: 's18', dbId: 10, emoji: '&#x1F363;', name: 'Franco Roll', price: 165, tag: 'new', hasAlga: true,
      desc: 'Por dentro: philadelphia, pepino, camarón frito, carne asada, mozzarella. Por fuera: aderezo serrano, gratinado c/mozzarella, tocino y cebollín.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Relleno', true), ing('b2', '&#x1F952;', 'Pepino', 'Relleno', true), ing('b3', '&#x1F990;', 'Camarón frito', 'Relleno', false), ing('b4', '&#x1F969;', 'Carne asada', 'Relleno', false), ing('b5', '&#x1F9C0;', 'Mozzarella', 'Relleno y cubierta', true), ing('b7', '&#x1F336;&#xFE0F;', 'Aderezo serrano', 'Cubierta', true), ing('b8', '&#x1F953;', 'Tocino', 'Cubierta', true), ing('b9', '&#x1F331;', 'Cebollín', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Más mozzarella', note: '+$15', price: 15 }]
    },

    {
      id: 's19', dbId: 11, emoji: '&#x1F363;', name: 'La Chuyita', price: 165, tag: 'popular', hasAlga: true,
      desc: 'Por dentro: philadelphia, aguacate, pepino, tampico. Por fuera: camarón frito aderezado, tocino, gratinado con mozzarella, chipotle y cebollín.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Relleno', true), ing('b2', '&#x1F951;', 'Aguacate', 'Relleno', true), ing('b3', '&#x1F952;', 'Pepino', 'Relleno', true), ing('b4', '&#x1F41F;', 'Tampico', 'Relleno', true), ing('b6', '&#x1F990;', 'Camarón frito aderezado', 'Cubierta', false), ing('b7', '&#x1F953;', 'Tocino', 'Cubierta', true), ing('b8', '&#x1F9C0;', 'Mozzarella gratinada', 'Cubierta', true), ing('b9', '&#x1FAD9;', 'Chipotle', 'Cubierta', true), ing('b10', '&#x1F331;', 'Cebollín', 'Cubierta', true)], extras: []
    },

    {
      id: 's21', dbId: 12, emoji: '&#x1F363;', name: 'Mexicano 2', price: 165, tag: null, hasAlga: true,
      desc: 'Por dentro: relleno tampico. Por fuera: carne asada, aguacate, serrano y cebollín. Gratinado.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Cubierta', true), ing('b5', '&#x1F41F;', 'Tampico', 'Relleno', false), ing('b6', '&#x1F969;', 'Carne asada', 'Cubierta', false), ing('b7', '&#x1F336;&#xFE0F;', 'Serrano', 'Cubierta', true), ing('b8', '&#x1F331;', 'Cebollín', 'Cubierta', true), ing('b9', '&#x1F9C0;', 'Gratinado', 'Cubierta', false)], extras: [{ id: 'x1', emoji: '&#x1F953;', name: 'Tocino extra', note: '+$15', price: 15 }]
    },

    {
      id: 's_mayito', dbId: 13, emoji: '&#x1F371;', name: 'Mayito', price: 145, tag: 'popular', hasProtein: true, hasSauce: true,
      desc: 'Proteína a elegir. Arriba tampico con boneless bañados en salsa de elección.',
      ingredients: [ing('b1', '&#x1F363;', 'Sushi (prot. elegida)', 'Base', false), ing('b2', '&#x1F41F;', 'Tampico', 'Arriba', true), ing('b3', '&#x1F357;', 'Boneless', 'Con salsa', false)], extras: []
    },

    {
      id: 's13', dbId: 14, emoji: '&#x1F363;', name: 'Mix Roll', price: 145, tag: null, hasProtein: true, hasAlga: true,
      desc: 'Por dentro: proteína a elegir. Por fuera: mix de tocino y queso gratinado.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F953;', 'Tocino', 'Mix cubierta', true), ing('b6', '&#x1F9C0;', 'Queso gratinado', 'Mix cubierta', false)], extras: []
    },

    {
      id: 's14', dbId: 15, emoji: '&#x1F363;', name: 'Baked', price: 145, tag: 'hot', hasAlga: true,
      desc: 'Por dentro: relleno de pollo. Por fuera: mix tocino y camarón con queso gratinado.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F357;', 'Pollo', 'Relleno', false), ing('b6', '&#x1F953;', 'Tocino', 'Cubierta', true), ing('b7', '&#x1F990;', 'Camarón', 'Cubierta', true), ing('b8', '&#x1F9C0;', 'Queso gratinado', 'Cubierta', false)], extras: [{ id: 'x1', emoji: '&#x1F336;&#xFE0F;', name: 'Chile serrano', note: 'Gratis', price: 0 }]
    },

    {
      id: 's15', dbId: 16, emoji: '&#x1F363;', name: 'Fernanda', price: 145, tag: null, hasAlga: true,
      desc: 'Por dentro: pollo y res. Por fuera: mix de caribe y chile verde con camarón empanizado.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F357;', 'Pollo', 'Relleno', false), ing('b6', '&#x1F969;', 'Res', 'Relleno', true), ing('b7', '&#x1F336;&#xFE0F;', 'Caribe y chile verde', 'Cubierta', true), ing('b8', '&#x1F990;', 'Camarón empanizado', 'Cubierta', false)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's16', dbId: 17, emoji: '&#x1F363;', name: 'Hot', price: 145, tag: 'hot', hasAlga: true,
      desc: 'Por dentro: relleno de res. Por fuera: cubierto de queso gratinado picante con camarón y tocino.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F969;', 'Res', 'Relleno', false), ing('b6', '&#x1F9C0;', 'Queso gratinado picante', 'Cubierta', false), ing('b7', '&#x1F990;', 'Camarón', 'Cubierta', true), ing('b8', '&#x1F953;', 'Tocino', 'Cubierta', true)], extras: []
    },

    {
      id: 's20', dbId: 18, emoji: '&#x1F363;', name: 'Mexicano 1', price: 145, tag: null, hasAlga: true,
      desc: 'Por dentro: relleno tampico. Por fuera: carne asada, aguacate, serrano y cebollín. Bañado en aderezo.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Cubierta', true), ing('b5', '&#x1F41F;', 'Tampico', 'Relleno', false), ing('b6', '&#x1F969;', 'Carne asada', 'Cubierta', false), ing('b7', '&#x1F336;&#xFE0F;', 'Serrano', 'Cubierta', true), ing('b8', '&#x1F331;', 'Cebollín', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's5', dbId: 19, emoji: '&#x1F363;', name: 'Tres Quesos', price: 135, tag: null, hasProtein: true, hasAlga: true,
      desc: '01 proteína a elegir, cubierta de queso gratinado, manchego y cebollín.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F9C0;', 'Queso gratinado', 'Cubierta', false), ing('b6', '&#x1F9C0;', 'Manchego', 'Cubierta', true), ing('b7', '&#x1F331;', 'Cebollín', 'Cubierta', true)], extras: []
    },

    {
      id: 's11', dbId: 20, emoji: '&#x1F363;', name: 'Chipotle', price: 135, tag: null, hasAlga: true,
      desc: 'Por dentro: relleno de pollo. Por fuera: camarón capeado con chipotle y cebollín.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F357;', 'Pollo', 'Relleno', false), ing('b6', '&#x1F990;', 'Camarón capeado', 'Cubierta', false), ing('b7', '&#x1FAD9;', 'Chipotle', 'Cubierta', true), ing('b8', '&#x1F331;', 'Cebollín', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's12', dbId: 21, emoji: '&#x1F363;', name: 'Queen Roll', price: 135, tag: 'popular', hasAlga: true,
      desc: 'Por dentro: relleno de pollo y camarón. Por fuera: cubierto de queso gratinado y tampico.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F357;', 'Pollo', 'Relleno', false), ing('b6', '&#x1F990;', 'Camarón', 'Relleno', false), ing('b7', '&#x1F9C0;', 'Queso gratinado', 'Cubierta', false), ing('b8', '&#x1F41F;', 'Tampico', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F336;&#xFE0F;', name: 'Serrano', note: 'Gratis', price: 0 }]
    },

    {
      id: 's9', dbId: 22, emoji: '&#x1F363;', name: 'Cielo Mar y Tierra', price: 120, tag: null, hasAlga: true,
      desc: 'Relleno de camarón, pollo y res.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F990;', 'Camarón', 'Relleno', false), ing('b6', '&#x1F357;', 'Pollo', 'Relleno', true), ing('b7', '&#x1F969;', 'Res', 'Relleno', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's10', dbId: 23, emoji: '&#x1F363;', name: 'Antojo', price: 120, tag: null, hasAlga: true,
      desc: 'Por dentro: relleno res, tocino y camarón. Por fuera: queso philadelphia y serrano.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F969;', 'Res', 'Relleno', false), ing('b6', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b7', '&#x1F990;', 'Camarón', 'Relleno', true), ing('b8', '&#x1F336;&#xFE0F;', 'Serrano', 'Queso', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's2', dbId: 24, emoji: '&#x1F363;', name: 'Bombazo', price: 110, tag: 'popular', hasProtein: true, hasAlga: true,
      desc: 'Proteína a elegir, cubierto con tampico, salsa de anguila y ajonjolí.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F41F;', 'Tampico', 'Por fuera', true), ing('b6', '&#x1FAD9;', 'Anguila', 'Por fuera', true), ing('b7', '&#x26AB;', 'Ajonjolí', 'Por fuera', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's3', dbId: 25, emoji: '&#x1F363;', name: 'Sonora', price: 110, tag: null, hasAlga: true,
      desc: 'Relleno res y tocino. Queso philadelphia y chile verde.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F969;', 'Res', 'Relleno', false), ing('b6', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b7', '&#x1F336;&#xFE0F;', 'Chile verde', 'Queso', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's8', dbId: 26, emoji: '&#x1F363;', name: 'Daishi', price: 100, tag: null, hasAlga: true,
      desc: 'Relleno de tampico y tocino.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b5', '&#x1F41F;', 'Tampico', 'Relleno', false), ing('b6', '&#x1F953;', 'Tocino', 'Relleno', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }, { id: 'x2', emoji: '&#x1FAD9;', name: 'Anguila', note: '+$15', price: 15 }]
    },

    {
      id: 's6', dbId: 27, emoji: '&#x1F363;', name: 'Aguacate', price: 100, tag: null, hasProtein: true, hasAlga: true,
      desc: '01 proteína a elegir, cubierto de aguacate y ajonjolí.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Relleno y cubierta', false), ing('b5', '&#x26AB;', 'Ajonjolí', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's1', dbId: 28, emoji: '&#x1F363;', name: 'California', price: 95, tag: null, hasProtein: true, hasAlga: true,
      desc: '01 proteína a elegir: res, camarón, tocino, pollo o surimi.',
      ingredients: base(), extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }, { id: 'x2', emoji: '&#x1F41F;', name: 'Tampico por fuera', note: '+$15', price: 15 }]
    },

    {
      id: 's4', dbId: 29, emoji: '&#x1F363;', name: 'Especial', price: 115, tag: 'popular', hasAlga: true,
      desc: 'Relleno de surimi, cubierto de tampico, aguacate, anguila y ajonjolí.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Cubierta', true), ing('b5', '&#x1F980;', 'Surimi', 'Relleno', false), ing('b6', '&#x1F41F;', 'Tampico', 'Cubierta', true), ing('b7', '&#x1FAD9;', 'Anguila', 'Cubierta', true), ing('b8', '&#x26AB;', 'Ajonjolí', 'Cubierta', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 's7', dbId: 30, emoji: '&#x1F363;', name: 'Misil', price: 80, tag: null, hasAlga: false,
      desc: 'Por dentro: relleno de philadelphia, tampico, tocino y res. Por fuera: chile verde empanizado.',
      ingredients: [ing('b1', '&#x1F359;', 'Philadelphia', 'Relleno', true), ing('b2', '&#x1F41F;', 'Tampico', 'Relleno', true), ing('b3', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b4', '&#x1F969;', 'Res', 'Relleno', true), ing('b5', '&#x1F336;&#xFE0F;', 'Chile verde empanizado', 'Cubierta', false)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    }
  ],

  /* ── ENTRADAS (de $150 a $30) ─────────────── */
  entradas: [
    {
      id: 'en1', dbId: 31, emoji: '&#x1F9C6;', name: 'Tostiboneles', price: 150, tag: null, hasSauce: true,
      desc: 'Tostitos bañados en queso amarillo y boneles en salsa a elegir.',
      ingredients: [ing('b1', '&#x1F96B;', 'Tostitos', 'Base', false), ing('b2', '&#x1F9C0;', 'Queso amarillo', 'Bañados', false), ing('b3', '&#x1F357;', 'Boneles', 'Con salsa', false)], extras: []
    },

    {
      id: 'en7', dbId: 32, emoji: '&#x1F35F;', name: 'Papiboneles', price: 130, tag: 'new', hasSauce: true,
      desc: 'Cama de papa sazonada con boneles en salsa a elección, acompañados de queso amarillo preparado.',
      ingredients: [ing('b1', '&#x1F954;', 'Papa sazonada', 'Cama base', false), ing('b2', '&#x1F357;', 'Boneles', 'Con salsa', false), ing('b3', '&#x1F9C0;', 'Queso amarillo preparado', 'Encima', false)], extras: []
    },

    {
      id: 'en6', dbId: 33, emoji: '&#x26AB;', name: 'Boliblitz', price: 100, tag: 'popular',
      desc: '08 bolitas de tampico, philadelphia, anguila y cebollín.',
      ingredients: [ing('b1', '&#x1F41F;', 'Tampico', 'Relleno', false), ing('b2', '&#x1F9C0;', 'Philadelphia', 'Relleno', false), ing('b3', '&#x1FAD9;', 'Anguila', 'Salsa', true), ing('b4', '&#x1F331;', 'Cebollín', 'Decorado', true)], extras: [{ id: 'x1', emoji: '&#x26AB;', name: 'Ajonjolí', note: 'Gratis', price: 0 }]
    },

    {
      id: 'en2', dbId: 34, emoji: '&#x1F32E;', name: 'Tostitampico', price: 70, tag: null,
      desc: 'Tostitos, tampico y zanahoria, bañados en aderezo chipotle, anguila y ajonjolí.',
      ingredients: [ing('b1', '&#x1F96B;', 'Tostitos', 'Base', false), ing('b2', '&#x1F41F;', 'Tampico', 'Encima', false), ing('b3', '&#x1F955;', 'Zanahoria', 'Decorado', true), ing('b4', '&#x1FAD9;', 'Aderezo chipotle', 'Bañado', true), ing('b5', '&#x1FAD9;', 'Anguila', 'Bañado', true), ing('b6', '&#x26AB;', 'Ajonjolí', 'Encima', true)], extras: []
    },

    {
      id: 'en3', dbId: 35, emoji: '&#x1F9C0;', name: 'Dedos de Queso', price: 60, tag: 'popular',
      desc: 'Philadelphia, 05 unidades.',
      ingredients: [ing('b1', '&#x1F9C0;', 'Philadelphia', 'Relleno', false)], extras: [{ id: 'x1', emoji: '&#x1F336;&#xFE0F;', name: 'Serrano al lado', note: 'Gratis', price: 0 }]
    },

    {
      id: 'en4', dbId: 36, emoji: '&#x1F35F;', name: 'Papas Sazonadas', price: 50, tag: null,
      desc: 'Papas sazonadas al estilo La Esquina.',
      ingredients: [ing('b1', '&#x1F954;', 'Papas sazonadas', 'Al estilo', false)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso amarillo', note: '+$15', price: 15 }]
    },

    {
      id: 'en5', dbId: 37, emoji: '&#x1F336;&#xFE0F;', name: 'Chile Caribe Relleno', price: 30, tag: null,
      desc: 'Philadelphia, tocino, tampico y empanizado.',
      ingredients: [ing('b1', '&#x1F336;&#xFE0F;', 'Chile caribe', 'Base', false), ing('b2', '&#x1F9C0;', 'Philadelphia', 'Relleno', false), ing('b3', '&#x1F953;', 'Tocino', 'Relleno', true), ing('b4', '&#x1F41F;', 'Tampico', 'Relleno', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    }
  ],

  /* ── ESPECIALES (de $135 a $75) ───────────── */
  especiales: [
    {
      id: 'esp4', dbId: 38, emoji: '&#x1F35A;', name: 'Yakimeshi', price: 135, tag: null,
      desc: 'Arroz frito con pollo, res, tocino y camarón decorada con aguacate y tampico.',
      ingredients: [ing('b1', '&#x1F35A;', 'Arroz frito', 'Base', false), ing('b2', '&#x1F357;', 'Pollo', 'Mix', true), ing('b3', '&#x1F969;', 'Res', 'Mix', true), ing('b4', '&#x1F953;', 'Tocino', 'Mix', true), ing('b5', '&#x1F990;', 'Camarón', 'Mix', true), ing('b6', '&#x1F951;', 'Aguacate', 'Decorado', true), ing('b7', '&#x1F41F;', 'Tampico', 'Decorado', true)], extras: [{ id: 'x1', emoji: '&#x1F969;', name: 'Proteína extra', note: '+$15', price: 15 }]
    },

    {
      id: 'esp5', dbId: 39, emoji: '&#x1F35A;', name: 'Gohan', price: 135, tag: 'popular',
      desc: 'Plancha de arroz natural o empanizado, philadelphia, tampico, res, pollo, tocino, aguacate, camarón, serrano y cebollín.',
      ingredients: [ing('b1', '&#x1F35A;', 'Arroz (nat. o empanizado)', 'Base', false), ing('b2', '&#x1F9C0;', 'Philadelphia', 'Encima', true), ing('b3', '&#x1F41F;', 'Tampico', 'Encima', true), ing('b4', '&#x1F969;', 'Res', 'Mix prot.', true), ing('b5', '&#x1F357;', 'Pollo', 'Mix prot.', true), ing('b6', '&#x1F953;', 'Tocino', 'Mix prot.', true), ing('b7', '&#x1F990;', 'Camarón', 'Mix prot.', true), ing('b8', '&#x1F951;', 'Aguacate', 'Decorado', true), ing('b9', '&#x1F336;&#xFE0F;', 'Serrano', 'Decorado', true), ing('b10', '&#x1F331;', 'Cebollín', 'Decorado', true)], extras: [{ id: 'x1', emoji: '&#x1F969;', name: 'Proteína extra', note: '+$15', price: 15 }]
    },

    {
      id: 'esp1', dbId: 40, emoji: '&#x1F357;', name: 'Alitas', price: 120, tag: 'popular', hasSauce: true,
      desc: 'Picositas o salsa a elección.',
      ingredients: [ing('b1', '&#x1F357;', 'Alitas de pollo', 'Orden', false)], extras: []
    },

    {
      id: 'esp2', dbId: 41, emoji: '&#x1F357;', name: 'Boneless', price: 120, tag: 'popular', hasSauce: true,
      desc: 'Tiras de pollo empanizadas y bañadas en salsa a elección. Con apio, zanahoria y aderezo.',
      ingredients: [ing('b1', '&#x1F357;', 'Pollo empanizado', 'Tiras', false), ing('b2', '&#x1F96C;', 'Apio', 'Guarnición', true), ing('b3', '&#x1F955;', 'Zanahoria', 'Guarnición', true), ing('b4', '&#x1FAD9;', 'Aderezo', 'Al lado', true)], extras: []
    },

    {
      id: 'esp3', dbId: 42, emoji: '&#x1F357;', name: 'Boneless con Papas', price: 120, tag: null, hasSauce: true,
      desc: 'Boneless + papas sazonadas.',
      ingredients: [ing('b1', '&#x1F357;', 'Pollo empanizado', 'Tiras', false), ing('b2', '&#x1F35F;', 'Papas sazonadas', 'Incluidas', false), ing('b3', '&#x1F96C;', 'Apio', 'Guarnición', true), ing('b4', '&#x1F955;', 'Zanahoria', 'Guarnición', true)], extras: []
    },

    {
      id: 'esp8', dbId: 43, emoji: '&#x1F363;', name: 'Bolas — Mixta', price: 95, tag: null, hasProtein: true,
      desc: 'Bolas de sushi con mix de proteínas a elegir.',
      ingredients: [ing('b1', '&#x1F9C0;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b4', '&#x1F41F;', 'Tampico', 'Por fuera', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 'esp7', dbId: 44, emoji: '&#x1F363;', name: 'Bolas — Camarón', price: 85, tag: null,
      desc: 'Bolas de sushi con camarón.',
      ingredients: [ing('b1', '&#x1F9C0;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b4', '&#x1F990;', 'Camarón', 'Proteína', false), ing('b5', '&#x1F41F;', 'Tampico', 'Por fuera', true)], extras: [{ id: 'x1', emoji: '&#x1F9C0;', name: 'Queso gratinado', note: '+$25', price: 25 }]
    },

    {
      id: 'esp6', dbId: 45, emoji: '&#x1F363;', name: 'Bolas — Básica', price: 75, tag: null, hasProtein: true,
      desc: '01 proteína a elegir: res, camarón, tocino, pollo o surimi.',
      ingredients: [ing('b1', '&#x1F9C0;', 'Philadelphia', 'Base', true), ing('b2', '&#x1F952;', 'Pepino', 'Base', true), ing('b3', '&#x1F951;', 'Aguacate', 'Base', true), ing('b4', '&#x1F41F;', 'Tampico', 'Por fuera', true), ing('b5', '&#x1FAD9;', 'Anguila', 'Por fuera', true), ing('b6', '&#x26AB;', 'Ajonjolí', 'Por fuera', true)], extras: []
    }
  ],

  /* ── BEBIDAS (de $25 a $25) ───────────────── */
  bebidas: [
    {
      id: 'b1', dbId: 46, emoji: '&#x1F9CB;', name: 'Té 1 litro', price: 25, tag: null,
      desc: 'Té helado 1 litro.',
      ingredients: [ing('b1', '&#x1F9CB;', 'Té helado', '1 litro', false)], extras: [{ id: 'x1', emoji: '&#x1F34B;', name: 'Limón', note: 'Gratis', price: 0 }]
    },
    {
      id: 'b2', dbId: 47, emoji: '&#x1F964;', name: 'Coca-Cola 600ml', price: 25, tag: null,
      desc: 'Coca-Cola 600ml roja.',
      ingredients: [ing('b1', '&#x1F964;', 'Coca-Cola', '600ml', false)], extras: []
    },
    {
      id: 'ex1', dbId: 48, emoji: '&#x2795;', name: 'Extra — Ingrediente', price: 15, tag: null, isExtraIng: true,
      desc: 'Camarón, pollo, res, tocino, surimi, tampico, soya, anguila, chipotle o ranch. $15 c/u.',
      ingredients: [], extras: []
    },
    {
      id: 'ex2', dbId: 49, emoji: '&#x1F9C0;', name: 'Extra — Queso Gratinado', price: 25, tag: null,
      desc: 'Queso gratinado extra para cualquier platillo.',
      ingredients: [], extras: []
    }
  ]
};

/* ── PROMOCIONES ────────────────────────────── */
var PROMOS = [
  {
    id: 'promo4', dbId: 50, emoji: '&#x1F371;', num: 'Paquete 4', title: '1 Boneless + 1 California', price: 200, tag: 'popular', hasProtein: true, hasSauce: true,
    desc: '1 Boneless (BBQ, Búfalo o mixtos) + 1 California con ingrediente a elegir (pollo, tocino, res o surimi).',
    ingredients: [ing('b1', '&#x1F357;', 'Boneless', 'Con salsa', false), ing('b2', '&#x1F363;', 'California', 'Prot. a elegir', false)], extras: []
  },

  {
    id: 'promo1', dbId: 51, emoji: '&#x1F363;', num: 'Paquete 1', title: '2 Californias + Tostitampico', price: 220, tag: 'popular', hasProtein: true,
    desc: '2 Californias con ingrediente a elegir (pollo, tocino, res o surimi) + 1 Tostitampico.',
    ingredients: [ing('b1', '&#x1F363;', '2 Californias', 'Prot. a elegir', false), ing('b2', '&#x1F32E;', 'Tostitampico', 'Incluido', false)], extras: []
  },

  {
    id: 'promo2', dbId: 52, emoji: '&#x1F363;', num: 'Paquete 2', title: '2 Sonoras', price: 200, tag: null,
    desc: '2 Sonoras (res, tocino, philadelphia y chile rescoldado).',
    ingredients: [ing('b1', '&#x1F363;', '2 Sonoras', 'Incluidas', false)], extras: []
  },

  {
    id: 'promo3', dbId: 53, emoji: '&#x1F363;', num: 'Paquete 3', title: '3 Bolas', price: 200, tag: null, hasProtein: true,
    desc: '3 Bolas con ingrediente a elegir (pollo, res, tocino o surimi).',
    ingredients: [ing('b1', '&#x1F363;', '3 Bolas', 'Prot. a elegir', false), ing('b2', '&#x1F951;', 'Aguacate, pepino, philadelphia', 'Por fuera', true), ing('b3', '&#x1F41F;', 'Tampico, anguila, ajonjolí', 'Por fuera', true)], extras: []
  }
];

/* ══════════════════════════════════════════════
   ESTADO
   ══════════════════════════════════════════════ */
var orderInstances = [], instanceCounter = 0;
var currentItem = null, currentInstanceId = null, isNewInstance = false, currentMods = {};
var orderType = 'recoger';

function genId() { return 'inst_' + (++instanceCounter); }

/* ── Tipo de orden ──────────────────────────── */
function setOrderType(type) {
  orderType = type;
  document.getElementById('btn-recoger').className = 'order-type-btn' + (type === 'recoger' ? ' active' : '');
  document.getElementById('btn-envio').className = 'order-type-btn' + (type === 'envio' ? ' active' : '');
  document.getElementById('cf-phone-wrap').classList.toggle('cf-hidden', type !== 'envio');
  document.getElementById('cf-address-wrap').classList.toggle('cf-hidden', type !== 'envio');
}

/* ══════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════ */
function init() {
  // Pétalos de sakura
  cargarSesionGuardada();
  var s = document.getElementById('sakura');
  for (var i = 0; i < 16; i++) {
    var p = document.createElement('div');
    p.className = 'petal'; p.textContent = '🌸';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (3 + Math.random() * 4) + 's';
    p.style.animationDelay = (Math.random() * 5) + 's';
    p.style.fontSize = (12 + Math.random() * 10) + 'px';
    s.appendChild(p);
  }

  // Renderizar secciones
  renderGrid('combos', 'grid-combos');
  renderGrid('sushis', 'grid-sushis');
  renderGrid('entradas', 'grid-entradas');
  renderGrid('especiales', 'grid-especiales');
  renderGrid('bebidas', 'grid-bebidas');
  renderPromos();
  renderOrderSummary();
  updateBar();

  // Activar nav al hacer scroll
  initScrollSpy();

  // Verificar si pedidos están habilitados
  checkPedidosHabilitados();
  setInterval(checkPedidosHabilitados, 60000);
}

async function checkPedidosHabilitados() {
  try {
    var res = await fetch(API_URL + '/config/pedidos-habilitados');
    if (res.ok) {
      var data = await res.json();
      _pedidosAbiertos = data.pedidos_habilitados;
      var banner = document.getElementById('pedidos-cerrados-banner');
      if (banner) banner.style.display = _pedidosAbiertos ? 'none' : 'flex';
      var btnWa = document.querySelector('.btn-wa');
      if (btnWa) btnWa.style.opacity = _pedidosAbiertos ? '1' : '0.5';
    }
  } catch (e) { }
}

function cardHTML(item) {
  var tags = { popular: 'tag-popular', hot: 'tag-hot', 'new': 'tag-new' };
  var labels = { popular: '&#x2B50; Popular', hot: '&#x1F336;&#xFE0F; Hot', 'new': '&#x2728; Nuevo' };
  var th = item.tag ? '<span class="card-tag ' + tags[item.tag] + '">' + labels[item.tag] + '</span>' : '';
  return '<div class="menu-card" id="card-' + item.id + '" onclick="addNewInstance(\'' + item.id + '\')">'
    + '<span class="card-emoji">' + item.emoji + '</span>'
    + '<div class="card-name">' + item.name + '</div>'
    + '<div class="card-desc">' + item.desc + '</div>'
    + '<div class="card-footer"><span class="card-price">$' + item.price + '</span>' + th + '</div>'
    + '<div class="card-instances" id="instances-' + item.id + '"></div>'
    + '</div>';
}

function renderGrid(sec, gid) {
  var g = document.getElementById(gid);
  if (!g || !MENU[sec]) return;
  g.innerHTML = MENU[sec].map(cardHTML).join('');
}

function renderPromos() {
  var g = document.getElementById('grid-promos');
  if (!g) return;
  // Ordenar promos de mayor a menor precio
  var sorted = PROMOS.slice().sort(function (a, b) { return b.price - a.price; });
  var tags = { popular: 'tag-popular', hot: 'tag-hot', 'new': 'tag-new' };
  var labels = { popular: '&#x2B50; Popular', hot: '&#x1F336;&#xFE0F; Hot', 'new': '&#x2728; Nuevo' };
  g.innerHTML = sorted.map(function (p) {
    var th = p.tag ? '<span class="card-tag ' + tags[p.tag] + '">' + labels[p.tag] + '</span>' : '';
    return '<div class="promo-card" id="card-' + p.id + '" onclick="addNewInstance(\'' + p.id + '\')">'
      + '<div class="promo-num">' + p.num + '</div>'
      + '<div class="promo-title">' + p.emoji + ' ' + p.title + '</div>'
      + '<div class="card-desc">' + p.desc + '</div>'
      + '<div class="card-footer"><span class="promo-price">$' + p.price + ' <small>MXN</small></span>' + th + '</div>'
      + '<div class="card-instances" id="instances-' + p.id + '"></div>'
      + '</div>';
  }).join('');
}

/* ── Scroll spy para nav activo ─────────────── */
function initScrollSpy() {
  var sections = ['combos', 'sushis', 'entradas', 'especiales', 'bebidas', 'promos', 'pedido'];
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        sections.forEach(function (id) {
          var btn = document.querySelector('.nav-btn[href="#' + id + '"]');
          if (btn) btn.classList.toggle('active', id === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -75% 0px' });
  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/* ══════════════════════════════════════════════
   LOOKUP
   ══════════════════════════════════════════════ */
function findItem(id) {
  var pr = PROMOS.filter(function (x) { return x.id === id; });
  if (pr.length) return pr[0];
  var keys = Object.keys(MENU);
  for (var i = 0; i < keys.length; i++) {
    var f = MENU[keys[i]].filter(function (x) { return x.id === id; });
    if (f.length) return f[0];
  }
  return null;
}
function getItemInstances(id) { return orderInstances.filter(function (o) { return o.itemId === id; }); }

/* ── Card state ─────────────────────────────── */
function refreshCardState(itemId) {
  var card = document.getElementById('card-' + itemId);
  if (!card) return;
  var insts = getItemInstances(itemId);
  var container = document.getElementById('instances-' + itemId);
  if (!container) return;
  if (!insts.length) { card.classList.remove('selected'); container.innerHTML = ''; return; }
  card.classList.add('selected');
  container.innerHTML = insts.map(function (inst, idx) {
    var m = inst.mods, tags = [];
    if (m.alga) tags.push(m.alga === 'con' ? 'Con alga' : 'Sin alga');
    if (m.proteins && m.proteins.length) {
      var pnames = m.proteins.map(function (pid) {
        var pr = PROTEINS.filter(function (x) { return x.id === pid; })[0];
        return pr ? pr.name : '';
      }).filter(Boolean);
      if (pnames.length) tags.push(pnames.join('+'));
    }
    if (m.sauces && Object.keys(m.sauces).length)
      tags.push(SAUCES.filter(function (s) { return m.sauces[s.id]; }).map(function (s) { return s.name; }).join('/'));
    if (m.sauces2 && Object.keys(m.sauces2).length)
      tags.push('Orden2: ' + SAUCES.filter(function (s) { return m.sauces2[s.id]; }).map(function (s) { return s.name; }).join('/'));
    if (m.extraIngs && m.extraIngs.length) tags.push(m.extraIngs.join(', '));
    var label = tags.length ? tags.join(' · ') : ('Unidad ' + (idx + 1));
    return '<div class="inst-row" onclick="event.stopPropagation()">'
      + '<span class="inst-label" onclick="openModalEdit(\'' + inst.instanceId + '\',event)">✏️ ' + label + '</span>'
      + '<button class="inst-remove" onclick="removeInstance(\'' + inst.instanceId + '\',event)">−</button>'
      + '</div>';
  }).join('')
    + '<button class="inst-add-more" onclick="addNewInstance(\'' + itemId + '\',event)">+ Agregar otro igual</button>';
}

/* ══════════════════════════════════════════════
   AGREGAR / QUITAR
   ══════════════════════════════════════════════ */
function addNewInstance(itemId, e) {
  if (e) e.stopPropagation();
  var item = findItem(itemId); if (!item) return;
  var iid = genId();
  orderInstances.push({ instanceId: iid, itemId: itemId, item: item, mods: { removed: {}, extras: {}, sauces: {}, sauces2: {}, proteins: [], alga: null, extraIngs: [], slotMods: [] }, extraCost: 0 });
  isNewInstance = true;
  refreshCardState(itemId);
  openModalEdit(iid, null);
}
function removeInstance(iid, e) {
  if (e) e.stopPropagation();
  var inst = orderInstances.filter(function (o) { return o.instanceId === iid; })[0]; if (!inst) return;
  var itemId = inst.itemId;
  orderInstances = orderInstances.filter(function (o) { return o.instanceId !== iid; });
  refreshCardState(itemId); updateBar();
}

/* ══════════════════════════════════════════════
   MODAL DE PERSONALIZACIÓN
   ══════════════════════════════════════════════ */
function openModalEdit(iid, e) {
  if (e) e.stopPropagation();
  var inst = orderInstances.filter(function (o) { return o.instanceId === iid; })[0]; if (!inst) return;
  currentItem = inst.item; currentInstanceId = iid;
  var sv = inst.mods;
  currentMods = {
    removed: JSON.parse(JSON.stringify(sv.removed || {})),
    extras: JSON.parse(JSON.stringify(sv.extras || {})),
    sauces: JSON.parse(JSON.stringify(sv.sauces || {})),
    sauces2: JSON.parse(JSON.stringify(sv.sauces2 || {})),
    proteins: (sv.proteins || []).slice(),
    alga: sv.alga || null,
    extraIngs: (sv.extraIngs || []).slice()
  };
  var insts = getItemInstances(inst.itemId);
  var idx = insts.findIndex(function (o) { return o.instanceId === iid; }) + 1;
  document.getElementById('modal-title').textContent = inst.item.name;
  document.getElementById('modal-subtitle').textContent = 'Unidad ' + idx + ' de ' + insts.length + ' — Personaliza como quieras';
  buildModalBody(inst.item);
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildModalBody(item) {
  var fixed = (item.ingredients || []).filter(function (i) { return !i.removable; });
  var removable = (item.ingredients || []).filter(function (i) { return i.removable; });
  var extras = item.extras || [];
  var html = '';

  // Extra ingredient picker
  if (item.isExtraIng) {
    html += '<div class="extra-picker"><div class="extra-picker-title">➕ ¿Qué ingrediente(s) deseas? (elige uno o varios)</div><div class="extra-picker-grid">';
    EXTRA_INGS.forEach(function (nm) {
      html += '<div class="extra-chip' + (currentMods.extraIngs.indexOf(nm) >= 0 ? ' sel' : '') + '" onclick="togExtraIng(\'' + nm + '\')">' + nm + '</div>';
    });
    html += '</div><div class="sauce-note">$15 por ingrediente · Puedes elegir varios</div></div>';
  }

  // Alga
  if (item.hasAlga) {
    html += '<div class="alga-section"><div class="alga-section-title">🌿 ¿Con o sin alga?</div><div class="alga-grid">';
    html += '<div class="alga-btn' + (currentMods.alga === 'con' ? ' sel' : '') + '" id="alga-con" onclick="selAlga(\'con\')">🌿 Con alga</div>';
    html += '<div class="alga-btn' + (currentMods.alga === 'sin' ? ' sel' : '') + '" id="alga-sin" onclick="selAlga(\'sin\')">❌ Sin alga</div>';
    html += '</div></div>';
  }

  // Proteins
  if (item.hasProtein && !item.hasSushiChoice) {
    if (item.hasPromo) {
      // PROMOS: Sushi 1 y Sushi 2. Camarón siempre +$15 sin excepción.
      html += '<div class="protein-section">';
      ['Sushi 1','Sushi 2'].forEach(function(label, slot) {
        html += '<div class="protein-section-title" style="' + (slot>0?'margin-top:12px':'') + '">🍣 Proteína — ' + label + '</div><div class="protein-grid">';
        PROTEINS.forEach(function(p) {
          var sel = currentMods.proteins[slot] === p.id;
          html += '<div class="protein-btn' + (sel?' sel':'') + '" id="ps' + slot + '-' + p.id + '" onclick="selProtSlot(' + slot + ',\'' + p.id + '\')">'
            + '<span class="p-emoji">' + p.emoji + '</span>'
            + '<span class="p-name">' + p.name + '</span></div>';
        });
        html += '</div>';
      });
      html += '<div class="protein-note">Elige una proteína por cada sushi · 🦐 Camarón en ➕ Extras (+$15)</div></div>';
    } else {
      html += '<div class="protein-section"><div class="protein-section-title">🥩 Elige tu(s) proteína(s)</div><div class="protein-grid">';
      PROTEINS.forEach(function (p) {
        var cnt = currentMods.proteins.filter(function (x) { return x === p.id; }).length;
        var isSel = cnt > 0;
        html += '<div class="protein-btn' + (isSel ? ' sel' : '') + '" id="pb-' + p.id + '" onclick="togProt(\'' + p.id + '\')">'
          + '<span class="p-emoji">' + p.emoji + '</span>'
          + '<span class="p-name">' + p.name + '</span>'
          + (cnt > 1 ? '<span class="p-count">' + cnt + '</span>' : '')
          + '</div>';
      });
      html += '</div><div class="protein-note">Primera proteína incluida · Extras +$15 c/u</div></div>';
    }
  }

  // Sauce 1
  if (item.hasSauce) {
    html += '<div class="sauce-section"><div class="sauce-section-title">🫙 Salsa para los boneles (hasta 2)</div><div class="sauce-grid">';
    SAUCES.forEach(function (s) {
      html += '<div class="sauce-btn' + (currentMods.sauces[s.id] ? ' sel' : '') + '" id="sb-' + s.id + '" onclick="togSauce(\'' + s.id + '\',2,\'sauces\',\'sb-\')">' + s.name + '</div>';
    });
    html += '</div><div class="sauce-note">Puedes elegir hasta 2 salsas</div></div>';
  }

  // Sauce 2 (La Caja)
  if (item.hasSauce2) {
    html += '<div class="sauce-section"><div class="sauce-section-title">🫙 Salsa para la 2ª orden de boneles (hasta 2)</div><div class="sauce-grid">';
    SAUCES.forEach(function (s) {
      html += '<div class="sauce-btn' + (currentMods.sauces2[s.id] ? ' sel' : '') + '" id="sb2-' + s.id + '" onclick="togSauce(\'' + s.id + '\',2,\'sauces2\',\'sb2-\')">' + s.name + '</div>';
    });
    html += '</div><div class="sauce-note">Para la 2ª orden de boneles</div></div>';
  }

  // Fixed ingredients
  if (fixed.length) {
    html += '<div class="ing-section"><div class="ing-section-title">🔒 Ingredientes fijos</div><div class="ing-list">';
    fixed.forEach(function (i) {
      html += '<div class="ing-item"><div class="ing-left"><span class="ing-emoji">' + i.emoji + '</span>'
        + '<div><div class="ing-name">' + i.name + '</div><div class="ing-note">' + i.note + '</div></div></div>'
        + '<span style="font-size:11px;color:var(--muted)">Fijo</span></div>';
    });
    html += '</div></div>';
  }

  // Removable ingredients
  if (removable.length) {
    html += '<div class="ing-section"><div class="ing-section-title">✏️ Quitar ingredientes</div><div class="ing-list">';
    removable.forEach(function (i) {
      var rm = currentMods.removed[i.id];
      html += '<div class="ing-item' + (rm ? ' removed' : '') + '" id="ming-' + i.id + '">'
        + '<div class="ing-left"><span class="ing-emoji">' + i.emoji + '</span>'
        + '<div><div class="ing-name">' + i.name + '</div><div class="ing-note">' + i.note + '</div></div></div>'
        + '<button class="ing-toggle" onclick="togIng(\'' + i.id + '\')">' + (rm ? 'Volver a poner' : 'Quitar') + '</button></div>';
    });
    html += '</div></div>';
  }

  // Extras
  if (extras.length) {
    html += '<div class="ing-section"><div class="ing-section-title">➕ Agregar extras</div><div class="ing-list">';
    extras.forEach(function (ex) {
      var ad = currentMods.extras[ex.id];
      html += '<div class="ing-item' + (ad ? ' extra-added' : '') + '" id="mex-' + ex.id + '">'
        + '<div class="ing-left"><span class="ing-emoji">' + ex.emoji + '</span>'
        + '<div><div class="ing-name">' + ex.name + '</div><div class="ing-note">' + ex.note + '</div></div></div>'
        + '<button class="ing-toggle" onclick="togExtra(\'' + ex.id + '\')">' + (ad ? 'Quitar' : 'Agregar') + '</button></div>';
    });
    html += '</div></div>';
  }

  html += '<div class="modal-actions">'
    + '<button class="btn-modal-cancel" onclick="cancelModal()">Cancelar</button>'
    + '<button class="btn-modal-confirm" onclick="confirmMods()">✓ Listo</button>'
    + '</div>';

  document.getElementById('modal-body').innerHTML = html;
}

/* ══════════════════════════════════════════════
   INTERACCIONES DEL MODAL
   ══════════════════════════════════════════════ */
function togExtraIng(nm) {
  var idx = currentMods.extraIngs.indexOf(nm);
  if (idx >= 0) currentMods.extraIngs.splice(idx, 1); else currentMods.extraIngs.push(nm);
  document.querySelectorAll('.extra-chip').forEach(function (el) {
    el.className = 'extra-chip' + (currentMods.extraIngs.indexOf(el.textContent.trim()) >= 0 ? ' sel' : '');
  });
}
function selAlga(val) {
  currentMods.alga = currentMods.alga === val ? null : val;
  ['con', 'sin'].forEach(function (v) {
    var b = document.getElementById('alga-' + v);
    if (b) b.className = 'alga-btn' + (currentMods.alga === v ? ' sel' : '');
  });
}
function selProtSlot(slot, pid) {
  // Promos: slot 0=Sushi1, slot 1=Sushi2
  // Camarón siempre +$15 en promos
  while (currentMods.proteins.length <= slot) currentMods.proteins.push(null);
  currentMods.proteins[slot] = pid;
  // Calcular costo de camarones elegidos
  var camCount = currentMods.proteins.filter(function(p){ return p === 'p_camaron'; }).length;
  currentMods._promoCamaronCost = camCount * 15;
  // Actualizar botones in-place (no re-renderizar el modal entero)
  var allPids = PROTEINS.map(function(p){ return p.id; }).concat(['p_camaron']);
  [0,1].forEach(function(s) {
    allPids.forEach(function(pid2) {
      var b = document.getElementById('ps' + s + '-' + pid2);
      if (b) b.className = 'protein-btn' + (currentMods.proteins[s] === pid2 ? ' sel' : '');
    });
  });
}

function togProt(pid) {
  var idx = currentMods.proteins.indexOf(pid);
  if (idx >= 0) {
    currentMods.proteins.splice(idx, 1);
  } else {
    currentMods.proteins.push(pid);
  }
  // (costo calculado en confirmMods)
  PROTEINS.forEach(function (p) {
    var cnt = currentMods.proteins.filter(function (x) { return x === p.id; }).length;
    var b = document.getElementById('pb-' + p.id);
    if (!b) return;
    b.className = 'protein-btn' + (cnt > 0 ? ' sel' : '');
    var badge = b.querySelector('.p-count');
    if (cnt > 1) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'p-count'; b.appendChild(badge); }
      badge.textContent = cnt;
    } else if (badge) { badge.remove(); }
  });
  // Update camarón button too
  var camBtn = document.getElementById('pb-p_camaron');
  if (camBtn) {
    var cntCam = currentMods.proteins.filter(function(x){return x==='p_camaron';}).length;
    camBtn.className = 'protein-btn' + (cntCam > 0 ? ' sel' : '');
  }
}

function togSauce(sid, maxSauces, field, prefix) {
  var fn = field || 'sauces', pre = prefix || 'sb-';
  if (currentMods[fn][sid]) {
    delete currentMods[fn][sid];
  } else {
    if (Object.keys(currentMods[fn]).length >= maxSauces) { alert('Máximo ' + maxSauces + ' salsa(s).'); return; }
    currentMods[fn][sid] = true;
  }
  SAUCES.forEach(function (s) {
    var b = document.getElementById(pre + s.id);
    if (b) b.className = 'sauce-btn' + (currentMods[fn][s.id] ? ' sel' : '');
  });
}
function togIng(ingId) {
  if (currentMods.removed[ingId]) delete currentMods.removed[ingId]; else currentMods.removed[ingId] = true;
  var row = document.getElementById('ming-' + ingId), rm = !!currentMods.removed[ingId];
  row.className = 'ing-item' + (rm ? ' removed' : '');
  row.querySelector('.ing-toggle').textContent = rm ? 'Volver a poner' : 'Quitar';
}
function togExtra(exId) {
  if (currentMods.extras[exId]) delete currentMods.extras[exId]; else currentMods.extras[exId] = true;
  var row = document.getElementById('mex-' + exId), ad = !!currentMods.extras[exId];
  row.className = 'ing-item' + (ad ? ' extra-added' : '');
  row.querySelector('.ing-toggle').textContent = ad ? 'Quitar' : 'Agregar';
}
function confirmMods() {
  if (!currentInstanceId) return;
  var inst = orderInstances.filter(function (o) { return o.instanceId === currentInstanceId; })[0];
  if (!inst) return;

  // Validar slots de promos/combos
  if (inst.item.promoSlots && inst.item.promoSlots.length) {
    for (var _si = 0; _si < inst.item.promoSlots.length; _si++) {
      var _slot = inst.item.promoSlots[_si];
      var _sm = currentMods.slotMods && currentMods.slotMods[_si];
      // Validar que eligieron sushi si es picker
      if (_slot.isSushiPicker && (!_sm || !_sm.sushiName)) {
        alert('🍣 Por favor elige un sushi para "' + _slot.label + '"');
        return;
      }
      // Validar alga en slots que la tienen
      if (_slot.hasAlga && (!_sm || !_sm.alga)) {
        alert('🌿 Por favor indica en "' + _slot.label + '" si lo quieres con alga o sin alga');
        return;
      }
    }
  } else if (inst.item.hasAlga && !currentMods.alga) {
    alert('🌿 Por favor indica si lo quieres con alga o sin alga');
    return;
  }

  // Calcular costos extra
  var extraCost = 0;
  // 1. Proteínas extras en items normales: primera incluida, resto +$15 c/u
  if (!inst.item.promoSlots || !inst.item.promoSlots.length) {
    if (currentMods.proteins && currentMods.proteins.length > 1) {
      extraCost += (currentMods.proteins.length - 1) * 15;
    }
  }
  // 2. Camarón en slots de promos: siempre +$15
  if (currentMods.slotMods && currentMods.slotMods.length) {
    currentMods.slotMods.forEach(function(sm) {
      if (sm && sm.protein === 'p_camaron') extraCost += 15;
    });
  }
  // 3. Extras de slots (Queso gratinado, Tampico, etc.)
  if (currentMods.extras) {
    Object.keys(currentMods.extras).forEach(function(key) {
      var val = currentMods.extras[key];
      if (val && typeof val === 'number') extraCost += val;
    });
  }
  inst.extraCost = extraCost;
  inst.mods = JSON.stringify(currentMods);
  refreshCardState(inst.itemId);
  updateBar();
  closeModal();
}
function cancelModal() {
  if (isNewInstance && currentInstanceId) {
    var inst = orderInstances.filter(function (o) { return o.instanceId === currentInstanceId; })[0];
    if (inst) { var itemId = inst.itemId; orderInstances = orderInstances.filter(function (o) { return o.instanceId !== currentInstanceId; }); refreshCardState(itemId); updateBar(); }
  }
  isNewInstance = false; closeModal();
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  currentItem = null; currentInstanceId = null;
}
function closeModalOutside(e) { if (e.target === document.getElementById('modal-overlay')) cancelModal(); }

/* ══════════════════════════════════════════════
   MODAL DE DATOS DEL CLIENTE
   ══════════════════════════════════════════════ */
function sendWhatsApp() {
  if (!_pedidosAbiertos) { alert('🚫 Los pedidos están temporalmente cerrados. Intenta más tarde.'); return; }
  if (!orderInstances.length) { alert('¡Primero selecciona algo del menú! 🍣'); return; }
  document.getElementById('client-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setOrderType('recoger');
  setTimeout(function () { document.getElementById('cl-name').focus(); }, 150);
}
function closeClientModal() {
  document.getElementById('client-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function submitOrder() {
  var name = document.getElementById('cl-name').value.trim();
  if (!name) { alert('Por favor ingresa tu nombre 👤'); document.getElementById('cl-name').focus(); return; }
  if (orderType === 'envio') {
    var phone = document.getElementById('cl-phone').value.trim();
    var address = document.getElementById('cl-address').value.trim();
    if (!phone) { alert('Por favor ingresa tu teléfono 📱'); document.getElementById('cl-phone').focus(); return; }
    if (!address) { alert('Por favor ingresa la dirección de entrega 📍'); document.getElementById('cl-address').focus(); return; }
    closeClientModal();
    guardarPedidoBackend(name, phone, address).then(function () {
      doSendWhatsApp(name, phone, address);
    });
  } else {
    closeClientModal();
    guardarPedidoBackend(name, null, null).then(function () {
      doSendWhatsApp(name, null, null);
    });
  }
}
async function obtenerToken() {
  if (API_TOKEN) return API_TOKEN;
  try {
    var res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'menu@laesquinasushi.com', password: '!sushi2026' })
    });
    var data = await res.json();
    API_TOKEN = data.access_token;
    return API_TOKEN;
  } catch (e) {
    console.error('No se pudo conectar al backend', e);
    return null;
  }
}
async function guardarPedidoBackend(clientName, clientPhone, clientAddress) {
  try {
    var token = await obtenerToken();
    if (!token) return null;

    var notes = document.getElementById('order-notes').value;
    var total = orderInstances.reduce(function (s, o) { return s + (o.item.price + (o.extraCost || 0)); }, 0);
    var tipo = orderType === 'envio' ? 'domicilio' : 'sucursal';

    var productos = orderInstances.map(function (inst) {
      var m = inst.mods, item = inst.item, ec = inst.extraCost || 0;

      // Construir modificaciones en el formato del backend
      var mods = {};
      if (m.alga) mods.alga = m.alga;
      if (m.proteins && m.proteins.length) mods.proteinas = m.proteins;
      if (m.sauces) mods.salsas = Object.keys(m.sauces).filter(function (k) { return m.sauces[k]; });
      if (m.sauces2) mods.salsas2 = Object.keys(m.sauces2).filter(function (k) { return m.sauces2[k]; });
      if (m.removed) {
        mods.sin_ingredientes = Object.keys(m.removed)
          .filter(function (k) { return m.removed[k]; })
          .map(function (k) {
            var ing = (item.ingredients || []).filter(function (i) { return i.id === k; })[0];
            return ing ? ing.name : k;
          });
      }
      if (m.extraIngs && m.extraIngs.length) mods.extras_ingredientes = m.extraIngs;
      if (m.extras) mods.extras_producto = Object.keys(m.extras).filter(function (k) { return m.extras[k]; });

      return {
        id_producto: item.dbId || 0,
        nombre_producto: item.name,
        precio_unitario: item.price,
        cantidad: 1,
        modificaciones: mods,
        costo_extra: ec,
        subtotal: item.price + ec
      };
    });

    var payload = {
      nombre_cliente: clientName,
      telefono_cliente: clientPhone || null,
      tipo_entrega: tipo,
      direccion_entrega: clientAddress || null,
      notas: notes.trim() || null,
      total: total,
      productos: productos
    };

    var res = await fetch(API_URL + '/pedidos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      var data = await res.json();
      console.log('✅ Pedido guardado #' + data.id_pedido);
      return data.id_pedido;
    } else {
      console.error('Error al guardar pedido', await res.text());
      return null;
    }
  } catch (e) {
    console.error('Error de conexión', e);
    return null;
  }
}

/* ══════════════════════════════════════════════
   BARRA FLOTANTE Y RESUMEN
   ══════════════════════════════════════════════ */
function updateBar() {
  var total = orderInstances.reduce(function (s, o) { return s + (o.item.price + (o.extraCost || 0)); }, 0);
  var count = orderInstances.length;
  document.getElementById('bar-total').textContent = '$' + total;
  document.getElementById('bar-count').textContent = count + (count === 1 ? ' artículo' : ' artículos');
  renderOrderSummary();
}

function modsLabel(inst) {
  var m = inst.mods, item = inst.item, lines = '';
  if (m.extraIngs && m.extraIngs.length)
    lines += '<div class="oi-mod-added">➕ Ingrediente(s): ' + m.extraIngs.join(', ') + (m.extraIngs.length > 1 ? ' ($' + m.extraIngs.length * 15 + ')' : '') + '</div>';
  if (m.alga)
    lines += '<div class="oi-mod-added">🌿 Alga: ' + (m.alga === 'con' ? 'Con alga' : 'Sin alga') + '</div>';
  if (m.proteins && m.proteins.length) {
    var pnames = m.proteins.map(function (pid) { var pr = PROTEINS.filter(function (x) { return x.id === pid; })[0]; return pr ? pr.name : ''; }).filter(Boolean);
    lines += '<div class="oi-mod-added">🥩 Proteína(s): ' + pnames.join(', ') + (m.proteins.length > 1 ? ' (+$' + ((m.proteins.length - 1) * 15) + ')' : '') + '</div>';
  }
  if (m.sauces && Object.keys(m.sauces).length)
    lines += '<div class="oi-mod-added">🫙 Salsa: ' + SAUCES.filter(function (s) { return m.sauces[s.id]; }).map(function (s) { return s.name; }).join(', ') + '</div>';
  if (m.sauces2 && Object.keys(m.sauces2).length)
    lines += '<div class="oi-mod-added">🫙 Salsa 2ª orden: ' + SAUCES.filter(function (s) { return m.sauces2[s.id]; }).map(function (s) { return s.name; }).join(', ') + '</div>';
  var rm = (item.ingredients || []).filter(function (i) { return m.removed && m.removed[i.id]; });
  if (rm.length) lines += '<div class="oi-mod-removed">🚫 Sin: ' + rm.map(function (i) { return i.name; }).join(' · ') + '</div>';
  var ax = (item.extras || []).filter(function (ex) { return m.extras && m.extras[ex.id]; });
  if (ax.length) lines += '<div class="oi-mod-added">✅ Extra: ' + ax.map(function (ex) { return ex.name + (ex.price > 0 ? ' (+$' + ex.price + ')' : ' (gratis)'); }).join(' · ') + '</div>';
  return lines;
}

function renderOrderSummary() {
  var list = document.getElementById('order-list'); if (!list) return;
  if (!orderInstances.length) {
    list.innerHTML = '<div class="empty-state"><p>🛒</p><span>Aún no has seleccionado nada.<br>Explora el menú y elige tus favoritos.</span></div>';
    return;
  }
  list.innerHTML = orderInstances.map(function (inst, idx) {
    var lines = modsLabel(inst), price = inst.item.price + (inst.extraCost || 0);
    return '<div class="order-item">'
      + '<span class="oi-emoji">' + inst.item.emoji + '</span>'
      + '<div class="oi-info"><div class="oi-name">' + inst.item.name + ' <span style="font-size:11px;color:var(--muted)">#' + (idx + 1) + '</span></div>' + lines + '</div>'
      + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'
      + '<span class="oi-price">$' + price + '</span>'
      + '<button onclick="openModalEdit(\'' + inst.instanceId + '\',event)" style="font-size:11px;background:var(--dark);color:white;border:none;border-radius:7px;padding:4px 9px;cursor:pointer;">✏️ Editar</button>'
      + '<button onclick="removeInstance(\'' + inst.instanceId + '\',event)" style="font-size:11px;background:#FDE8E8;color:#C0392B;border:none;border-radius:7px;padding:4px 9px;cursor:pointer;">✕ Quitar</button>'
      + '</div></div>';
  }).join('');
}

/* ── Limpiar pedido ─────────────────────────── */
function clearOrder() {
  if (!orderInstances.length) return;
  if (!confirm('¿Deseas limpiar todo tu pedido?')) return;
  orderInstances = [];
  document.querySelectorAll('.menu-card.selected, .promo-card.selected').forEach(function (c) {
    c.classList.remove('selected');
    var ci = c.querySelector('.card-instances'); if (ci) ci.innerHTML = '';
  });
  updateBar();
}

/* ══════════════════════════════════════════════
   ENVÍO POR WHATSAPP
   ══════════════════════════════════════════════ */
function doSendWhatsApp(clientName, clientPhone, clientAddress) {
  var notes = document.getElementById('order-notes').value;
  var total = orderInstances.reduce(function (s, o) { return s + (o.item.price + (o.extraCost || 0)); }, 0);

  var msg = '🍣 *NUEVO PEDIDO — La Esquina del Sushi*\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n';
  msg += '👤 *Nombre:* ' + clientName + '\n';
  if (clientPhone) msg += '📱 *Teléfono:* ' + clientPhone + '\n';
  if (clientAddress) msg += '📍 *Dirección:* ' + clientAddress + '\n';
  msg += '📦 *Tipo:* ' + (orderType === 'envio' ? 'Envío a domicilio' : 'Recoge en sucursal') + '\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n\n';

  orderInstances.forEach(function (inst) {
    var m = inst.mods, item = inst.item, ec = inst.extraCost || 0;
    msg += '• ' + item.name + ' — $' + (item.price + ec) + '\n';
    if (m.extraIngs && m.extraIngs.length) msg += '   + Ingrediente(s): ' + m.extraIngs.join(', ') + '\n';
    if (m.alga) msg += '   Alga: ' + (m.alga === 'con' ? 'Con alga' : 'Sin alga') + '\n';
    if (m.proteins && m.proteins.length) {
      var pnames = m.proteins.map(function (pid) { var pr = PROTEINS.filter(function (x) { return x.id === pid; })[0]; return pr ? pr.name : ''; }).filter(Boolean);
      msg += '   Proteína(s): ' + pnames.join(', ') + (m.proteins.length > 1 ? ' (+$' + ((m.proteins.length - 1) * 15) + ')' : '') + '\n';
    }
    if (m.sauces && Object.keys(m.sauces).length)
      msg += '   Salsa: ' + SAUCES.filter(function (s) { return m.sauces[s.id]; }).map(function (s) { return s.name; }).join(', ') + '\n';
    if (m.sauces2 && Object.keys(m.sauces2).length)
      msg += '   Salsa 2ª orden boneles: ' + SAUCES.filter(function (s) { return m.sauces2[s.id]; }).map(function (s) { return s.name; }).join(', ') + '\n';
    var rm = (item.ingredients || []).filter(function (i) { return m.removed && m.removed[i.id]; });
    if (rm.length) msg += '   Sin: ' + rm.map(function (i) { return i.name; }).join(', ') + '\n';
    var ax = (item.extras || []).filter(function (ex) { return m.extras && m.extras[ex.id]; });
    if (ax.length) msg += '   Extra: ' + ax.map(function (ex) { return ex.name + (ex.price > 0 ? ' (+$' + ex.price + ')' : ''); }).join(', ') + '\n';
  });

  msg += '\n━━━━━━━━━━━━━━━━━━━━\n';
  msg += '💰 *TOTAL: $' + total + ' MXN*\n';
  if (notes.trim()) msg += '\n📝 Notas:\n' + notes.trim() + '\n';
  msg += '\n🌸 La Esquina del Sushi · Blvd. Sonora #21';

  window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
}
/* ══════════════════════════════════════════════
   AUTENTICACIÓN — LOGIN / REGISTRO / SESIÓN
   ══════════════════════════════════════════════ */

var sesionActual = null;

function abrirLoginModal() {
  document.getElementById('login-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab('login');
  setTimeout(function () { document.getElementById('login-email').focus(); }, 150);
}

function cerrarLoginModal() {
  document.getElementById('login-overlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-success').style.display = 'none';
}

function cerrarLoginModalOutside(e) {
  if (e.target === document.getElementById('login-overlay')) cerrarLoginModal();
}

function switchTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('tab-login').className = 'login-tab' + (isLogin ? ' active' : '');
  document.getElementById('tab-registro').className = 'login-tab' + (!isLogin ? ' active' : '');
  document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
  document.getElementById('form-registro').style.display = !isLogin ? 'block' : 'none';
  document.getElementById('btn-auth-submit').textContent = isLogin ? 'Entrar →' : 'Registrarse →';
  document.getElementById('btn-auth-submit').onclick = isLogin ? hacerLogin : hacerRegistro;
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('login-success').style.display = 'none';
}

async function hacerLogin() {
  var email = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value.trim();
  var errEl = document.getElementById('login-error');

  if (!email || !password) {
    errEl.textContent = 'Por favor llena todos los campos';
    errEl.style.display = 'block';
    return;
  }

  document.getElementById('btn-auth-submit').textContent = 'Entrando...';

  try {
    var res = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });

    var data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.detail || 'Email o contraseña incorrectos';
      errEl.style.display = 'block';
      document.getElementById('btn-auth-submit').textContent = 'Entrar →';
      return;
    }

    // Guardar sesión
    sesionActual = { token: data.access_token, usuario: data.usuario };
    localStorage.setItem('sushi_sesion', JSON.stringify(sesionActual));

    cerrarLoginModal();
    actualizarHeaderSesion();

    // Si es admin mostrar opción
    if (data.usuario.rol === 'admin') {
      if (confirm('👋 Bienvenido ' + data.usuario.nombre + '\n\n¿Quieres ir al Panel Admin?')) {
        window.location.href = 'admin.html';
      }
    } else {
      alert('👋 Bienvenido ' + data.usuario.nombre);
    }

  } catch (e) {
    errEl.textContent = 'Error de conexión, intenta de nuevo';
    errEl.style.display = 'block';
    document.getElementById('btn-auth-submit').textContent = 'Entrar →';
  }
}

async function hacerRegistro() {
  var nombre = document.getElementById('reg-nombre').value.trim();
  var email = document.getElementById('reg-email').value.trim();
  var password = document.getElementById('reg-password').value.trim();
  var telefono = document.getElementById('reg-telefono').value.trim();
  var errEl = document.getElementById('login-error');
  var okEl = document.getElementById('login-success');

  if (!nombre || !email || !password || !telefono) {
    errEl.textContent = 'Por favor llena todos los campos';
    errEl.style.display = 'block';
    return;
  }

  if (!nombre || !email || !password) {
    errEl.textContent = 'Por favor llena nombre, email y contraseña';
    errEl.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errEl.textContent = 'La contraseña debe tener al menos 6 caracteres';
    errEl.style.display = 'block';
    return;
  }

  document.getElementById('btn-auth-submit').textContent = 'Registrando...';

  try {
    var res = await fetch(API_URL + '/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, email: email, password: password, telefono: telefono })
    });

    var data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.detail || 'Error al registrarse';
      errEl.style.display = 'block';
      document.getElementById('btn-auth-submit').textContent = 'Registrarse →';
      return;
    }

    okEl.textContent = '✅ Cuenta creada. Iniciando sesión...';
    okEl.style.display = 'block';

    // Auto login después de registro
    setTimeout(function () {
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = password;
      switchTab('login');
      hacerLogin();
    }, 1000);

  } catch (e) {
    errEl.textContent = 'Error de conexión, intenta de nuevo';
    errEl.style.display = 'block';
    document.getElementById('btn-auth-submit').textContent = 'Registrarse →';
  }
}

function cerrarSesion() {
  sesionActual = null;
  localStorage.removeItem('sushi_sesion');
  actualizarHeaderSesion();
}

function actualizarHeaderSesion() {
  var authEl = document.getElementById('header-auth');
  if (!authEl) return;

  var btnHistorial = document.getElementById('btn-nav-historial');

  if (sesionActual) {
    var u = sesionActual.usuario;
    var html = '<div class="header-user">';
    html += '<span class="header-user-name">👋 ' + u.nombre + '</span>';
    if (u.rol === 'admin') {
      html += '<button class="btn-admin-panel" onclick="window.location.href=\'admin.html\'">⚙️ Panel Admin</button>';
    }
    html += '<button class="btn-historial-header" onclick="abrirHistorial()">📋 Mi historial</button>';
    html += '<button class="btn-logout" onclick="cerrarSesion()">Salir</button>';
    html += '</div>';
    authEl.innerHTML = html;
    if (btnHistorial) btnHistorial.style.display = 'inline-flex';
  } else {
    authEl.innerHTML = '<button class="btn-login-header" onclick="abrirLoginModal()">🔑 Iniciar sesión</button>';
    if (btnHistorial) btnHistorial.style.display = 'none';
  }
}

/* ══ HISTORIAL ══════════════════════════════════════════════ */
function abrirHistorial() {
  document.getElementById('historial-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('historial-contenido').style.display = 'none';
  document.getElementById('historial-buscar').style.display = 'none';
  document.getElementById('historial-loading').style.display = 'block';
  document.getElementById('historial-loading').textContent = 'Cargando...';

  if (sesionActual && sesionActual.usuario.telefono) {
    cargarHistorialSesion();
  } else if (sesionActual) {
    // tiene sesión pero sin teléfono registrado, mostrar buscador
    document.getElementById('historial-loading').style.display = 'none';
    document.getElementById('historial-buscar').style.display = 'block';
    document.getElementById('historial-subtitle').textContent = 'Busca por tu teléfono';
  } else {
    document.getElementById('historial-loading').style.display = 'none';
    document.getElementById('historial-buscar').style.display = 'block';
    document.getElementById('historial-subtitle').textContent = 'Busca tus pedidos anteriores';
  }
}

function cerrarHistorial() {
  document.getElementById('historial-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function cerrarHistorialOutside(e) {
  if (e.target === document.getElementById('historial-overlay')) cerrarHistorial();
}

async function cargarHistorialSesion() {
  try {
    var res = await fetch(API_URL + '/historial/mi-historial', {
      headers: { 'Authorization': 'Bearer ' + sesionActual.token }
    });
    var data = await res.json();
    (data.pedidos || []).forEach(function (p) {
      if (p.fecha && !p.fecha.endsWith('Z') && !p.fecha.includes('+'))
        p.fecha = p.fecha.replace(' ', 'T') + 'Z';
    });
    if (!res.ok) {
      mostrarHistorialError(data.detail || 'No se encontraron pedidos');
      return;
    }
    mostrarHistorialDatos(data);
  } catch (e) {
    mostrarHistorialError('Error de conexión');
  }
}

async function buscarHistorialTelefono() {
  var tel = document.getElementById('historial-tel').value.trim();
  var errEl = document.getElementById('historial-error');
  if (!tel || tel.length < 10) {
    errEl.textContent = 'Ingresa un teléfono válido (10 dígitos)';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  document.getElementById('historial-loading').style.display = 'block';
  document.getElementById('historial-loading').textContent = 'Buscando...';
  document.getElementById('historial-buscar').style.display = 'none';

  try {
    var res = await fetch(API_URL + '/historial/telefono/' + encodeURIComponent(tel));
    var data = await res.json();
    (data.pedidos || []).forEach(function (p) {
      if (p.fecha && !p.fecha.endsWith('Z') && !p.fecha.includes('+'))
        p.fecha = p.fecha.replace(' ', 'T') + 'Z';
    });
    if (!res.ok) {
      document.getElementById('historial-loading').style.display = 'none';
      document.getElementById('historial-buscar').style.display = 'block';
      errEl.textContent = data.detail || 'No encontramos pedidos con ese teléfono';
      errEl.style.display = 'block';
      return;
    }
    mostrarHistorialDatos(data);
  } catch (e) {
    document.getElementById('historial-loading').style.display = 'none';
    document.getElementById('historial-buscar').style.display = 'block';
    errEl.textContent = 'Error de conexión';
    errEl.style.display = 'block';
  }
}

function mostrarHistorialDatos(data) {
  document.getElementById('historial-loading').style.display = 'none';
  document.getElementById('historial-contenido').style.display = 'block';
  document.getElementById('hist-nombre').textContent = data.cliente.nombre;
  document.getElementById('hist-telefono').textContent = '📱 ' + data.cliente.telefono;
  document.getElementById('hist-total-gastado').textContent = '$' + parseFloat(data.cliente.total_gastado).toLocaleString('es-MX');
  document.getElementById('hist-total-pedidos').textContent = data.cliente.total_pedidos + ' pedidos en total';
  document.getElementById('historial-subtitle').textContent = data.pedidos.length + ' pedidos recientes';

  var ESTADO_LABEL = { pendiente: '🟡 Pendiente', preparando: '🔵 Preparando', listo: '🟢 Listo', entregado: '✅ Entregado', cancelado: '❌ Cancelado' };

  var html = data.pedidos.length === 0
    ? '<div style="text-align:center;padding:24px;color:#9E7080">Aún no tienes pedidos registrados</div>'
    : data.pedidos.map(function (p) {
      var fecha = new Date(p.fecha);
      var fechaStr = fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Hermosillo' });
      var horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Hermosillo' });

      var mods_nombres = { sc1: 'BBQ', sc2: 'Búfalo', sc3: 'Mixto', sc4: 'BBQ Chipotle', sc5: 'Naranja Chipotle', sc6: 'Tamarindo', sc7: 'Mango Hot', sc8: 'Mango Habanero', sc9: 'Piña Hot' };

      var productosHtml = p.productos.map(function (prod) {
        var modsText = '';
        if (prod.modificaciones) {
          try {
            var m = typeof prod.modificaciones === 'string' ? JSON.parse(prod.modificaciones) : prod.modificaciones;
            var lines = [];
            if (m.alga) lines.push(m.alga === 'con' ? '🌿 Con alga' : '🌿 Sin alga');
            if (m.salsas && m.salsas.length) lines.push('🫙 ' + m.salsas.map(function (s) { return mods_nombres[s] || s; }).join(', '));
            if (m.sin_ingredientes && m.sin_ingredientes.length) lines.push('🚫 Sin: ' + m.sin_ingredientes.join(', '));
            if (m.extras_producto && m.extras_producto.length) lines.push('➕ ' + m.extras_producto.join(', '));
            modsText = lines.length ? '<div style="font-size:11px;color:#2E7D32;margin-top:3px">' + lines.join(' · ') + '</div>' : '';
          } catch (e) { }
        }
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F9D0DC">'
          + '<div><span style="font-weight:600">' + prod.nombre + '</span> <span style="color:#9E7080;font-size:12px">x' + prod.cantidad + '</span>' + modsText + '</div>'
          + '<div style="font-weight:600;color:#E8547A">$' + parseFloat(prod.subtotal).toLocaleString('es-MX') + '</div>'
          + '</div>';
      }).join('');

      return '<div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 2px 8px rgba(232,84,122,0.08)">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">'
        + '<div><div style="font-weight:700;font-size:13px">' + fechaStr + ' · ' + horaStr + '</div>'
        + '<div style="font-size:12px;color:#9E7080">' + (p.tipo_entrega === 'domicilio' ? '🛵 Domicilio' : '🏪 Sucursal') + '</div></div>'
        + '<div style="text-align:right"><div style="font-size:13px">' + (ESTADO_LABEL[p.estado] || p.estado) + '</div>'
        + '<div style="font-weight:700;font-size:16px;color:#E8547A">$' + parseFloat(p.total).toLocaleString('es-MX') + '</div></div>'
        + '</div>'
        + productosHtml
        + (p.notas ? '<div style="font-size:12px;color:#9E7080;margin-top:8px">📝 ' + p.notas + '</div>' : '')
        + '</div>';
    }).join('');

  document.getElementById('historial-lista').innerHTML = html;
}

function mostrarHistorialError(msg) {
  document.getElementById('historial-loading').style.display = 'none';
  document.getElementById('historial-buscar').style.display = 'block';
  var errEl = document.getElementById('historial-error');
  errEl.textContent = msg;
  errEl.style.display = 'block';
}

/* ── Autocompletar cliente por teléfono ─────── */
async function buscarClientePorTelefono(telefono) {
  if (telefono.length < 10) return;
  if (!sesionActual) return;

  try {
    var res = await fetch(API_URL + '/clientes/buscar/' + telefono, {
      headers: { 'Authorization': 'Bearer ' + sesionActual.token }
    });

    if (res.ok) {
      var cliente = await res.json();
      var nameEl = document.getElementById('cl-name');
      var addrEl = document.getElementById('cl-address');
      if (nameEl && !nameEl.value) nameEl.value = cliente.nombre;
      if (addrEl && !addrEl.value) addrEl.value = cliente.direccion || '';
    }
  } catch (e) {
  }
}

/* ── Cargar sesión guardada al iniciar ──────── */
function cargarSesionGuardada() {
  try {
    var guardada = localStorage.getItem('sushi_sesion');
    if (guardada) {
      sesionActual = JSON.parse(guardada);
      actualizarHeaderSesion();
    }
  } catch (e) {
    localStorage.removeItem('sushi_sesion');
  }
}
/* ── Arranque ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);