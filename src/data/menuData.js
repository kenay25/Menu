/* ═══════════════════════════════════════════════
   La Esquina del Sushi — Datos del menú
   ═══════════════════════════════════════════════ */

export const WA = '526624580620';
export const API_URL = 'https://web-production-97d4.up.railway.app';
export const API_TOKEN = null;

export const PROTEINS = [
  { id: 'p_res', emoji: '&#x1F969;', name: 'Res' },
  { id: 'p_pollo', emoji: '&#x1F357;', name: 'Pollo' },
  { id: 'p_tocino', emoji: '&#x1F953;', name: 'Tocino' },
  { id: 'p_surimi', emoji: '&#x1F980;', name: 'Surimi' },
  { id: 'p_camaron', emoji: '&#x1F990;', name: 'Camarón' }
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
  { id: 'sc9', name: 'Piña Hot' }
];

export const EXTRA_INGS = [
  'Camarón', 'Pollo', 'Res', 'Tocino', 'Surimi',
  'Tampico', 'Soya', 'Anguila', 'Chipotle', 'Ranch'
];

/* ── Helper builders ────────────────────────── */
function ing(id, em, nm, nt, rm) {
  return { id, emoji: em, name: nm, note: nt, removable: rm };
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
   ══════════════════════════════════════════════ */
export const MENU = {

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

  bebidas: [
    { id: 'b1', dbId: 46, emoji: '&#x1F9CB;', name: 'Té 1 litro', price: 25, tag: null, desc: 'Té helado 1 litro.', ingredients: [ing('b1', '&#x1F9CB;', 'Té helado', '1 litro', false)], extras: [{ id: 'x1', emoji: '&#x1F34B;', name: 'Limón', note: 'Gratis', price: 0 }] },
    { id: 'b2', dbId: 47, emoji: '&#x1F964;', name: 'Coca-Cola 600ml', price: 25, tag: null, desc: 'Coca-Cola 600ml roja.', ingredients: [], extras: [] },
    { id: 'ex1', dbId: 48, emoji: '&#x2795;', name: 'Extra — Ingrediente', price: 15, tag: null, isExtraIng: true, desc: 'Camarón, pollo, res, tocino, surimi, tampico, soya, anguila, chipotle o ranch. $15 c/u.', ingredients: [], extras: [] },
    { id: 'ex2', dbId: 49, emoji: '&#x1F9C0;', name: 'Extra — Queso Gratinado', price: 25, tag: null, desc: 'Queso gratinado extra para cualquier platillo.', ingredients: [], extras: [] }
  ]
};

/* ══════════════════════════════════════════════
   PROMOS
   ══════════════════════════════════════════════ */
export const PROMOS = [
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
