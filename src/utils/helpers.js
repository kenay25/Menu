// Utility functions for La Esquina del Sushi

/**
 * Obtiene la fecha actual en zona horaria Hermosillo (UTC-7)
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const hoyHermosillo = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Hermosillo' }));
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

/**
 * Convierte fecha string de la API a Date object en zona Hermosillo
 * @param {string} fechaStr - Fecha en formato 'YYYY-MM-DD' o 'YYYY-MM-DD HH:mm:ss'
 * @returns {Date}
 */
export const parseMySQLDate = (fechaStr) => {
  if (!fechaStr) return new Date(0);
  let f = fechaStr;
  if (!f.endsWith('Z') && !f.includes('+') && !f.match(/-\d{2}:\d{2}$/)) {
    f = f.replace(' ', 'T') + '-07:00';
  }
  return new Date(f);
};

/**
 * Renderiza fecha para gráficas (backend devuelve string UTC 'YYYY-MM-DD')
 * @param {string} fechaStr 
 * @returns {string}
 */
export const chartDate = (fechaStr) => {
  return new Date(fechaStr + 'T07:00:00Z').toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Hermosillo'
  });
};

/**
 * Renderiza hora de pedido en tabla admin
 * @param {string} fechaPedido 
 * @returns {string}
 */
export const pedidoHora = (fechaPedido) => {
  return new Date(fechaPedido + 'Z').toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Hermosillo'
  });
};

/**
 * Renderiza fecha completa de pedido
 * @param {string} fechaPedido 
 * @returns {string}
 */
export const pedidoFecha = (fechaPedido) => {
  return new Date(fechaPedido + 'Z').toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Hermosillo'
  });
};

/**
 * Formatea número como moneda MXN
 * @param {number} amount 
 * @returns {string}
 */
export const formatMXN = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calcula costo extra de modificaciones
 * @param {Object} mods - Objeto de modificaciones
 * @param {Object} item - Item del menú con extras
 * @returns {number}
 */
export const calcExtraCost = (mods, item) => {
  let cost = 0;
  
  // Proteínas adicionales (la primera es gratis)
  if (mods.proteins && mods.proteins.length > 1) {
    cost += (mods.proteins.length - 1) * 15;
  }
  
  // Ingredientes extra ($15 c/u)
  if (mods.extraIngs && mods.extraIngs.length) {
    cost += mods.extraIngs.length * 15;
  }
  
  // Extras del platillo (precio propio)
  if (mods.extras) {
    Object.keys(mods.extras).forEach(extId => {
      if (mods.extras[extId]) {
        const ext = (item.extras || []).find(e => e.id === extId);
        if (ext) cost += ext.price;
      }
    });
  }
  
  return cost;
};

/**
 * Construye mensaje de WhatsApp para pedido
 */
export const buildWhatsAppMessage = (instances, clientName, clientPhone, clientAddress, orderType, notes) => {
  const total = instances.reduce((s, o) => s + o.item.price + (o.extraCost || 0), 0);
  let msg = '🍣 *NUEVO PEDIDO — La Esquina del Sushi*\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n';
  msg += `👤 *Nombre:* ${clientName}\n`;
  if (clientPhone) msg += `📱 *Teléfono:* ${clientPhone}\n`;
  if (clientAddress) msg += `📍 *Dirección:* ${clientAddress}\n`;
  msg += `📦 *Tipo:* ${orderType === 'envio' ? 'Envío a domicilio' : 'Recoge en sucursal'}\n`;
  msg += '━━━━━━━━━━━━━━━━━━━━\n\n';

  instances.forEach(inst => {
    const { mods, item } = inst;
    const ec = inst.extraCost || 0;
    msg += `• ${item.name} — $${item.price + ec}\n`;
    if (mods.extraIngs?.length) msg += `   + Ingrediente(s): ${mods.extraIngs.join(', ')}\n`;
    if (mods.alga) msg += `   Alga: ${mods.alga === 'con' ? 'Con alga' : 'Sin alga'}\n`;
    if (mods.style) msg += `   Estilo: ${mods.style === 'empanizado' ? 'Empanizado' : 'Natural'}\n`;
    if (mods.proteins?.length) {
      const names = mods.proteins.map(pid => {
        const p = window.PROTEINS?.find(pr => pr.id === pid);
        return p ? p.name : pid;
      }).filter(Boolean);
      msg += `   Proteína(s): ${names.join(', ')}${mods.proteins.length > 1 ? ` (+$${(mods.proteins.length - 1) * 15})` : ''}\n`;
    }
    const salsasOn = Object.keys(mods.sauces || {}).filter(k => mods.sauces[k]);
    if (salsasOn.length) {
      const names = salsasOn.map(id => {
        const s = window.SAUCES?.find(sauce => sauce.id === id);
        return s ? s.name : id;
      });
      msg += `   Salsa: ${names.join(', ')}\n`;
    }
    const salsas2On = Object.keys(mods.sauces2 || {}).filter(k => mods.sauces2[k]);
    if (salsas2On.length) {
      const names = salsas2On.map(id => {
        const s = window.SAUCES?.find(sauce => sauce.id === id);
        return s ? s.name : id;
      });
      msg += `   Salsa 2ª orden: ${names.join(', ')}\n`;
    }
    const removidos = (item.ingredients || []).filter(i => mods.removed?.[i.id]);
    if (removidos.length) msg += `   Sin: ${removidos.map(i => i.name).join(', ')}\n`;
    const extrasOn = (item.extras || []).filter(e => mods.extras?.[e.id]);
    if (extrasOn.length) msg += `   Extra: ${extrasOn.map(e => e.name + (e.price > 0 ? ` (+$${e.price})` : '')).join(', ')}\n`;
  });

  msg += '\n━━━━━━━━━━━━━━━━━━━━\n';
  msg += `💰 *TOTAL: $${total} MXN*\n`;
  if (notes?.trim()) msg += `\n📝 Notas:\n${notes.trim()}\n`;
  msg += '\n🌸 La Esquina del Sushi · Blvd. Sonora #21';
  
  return msg;
};

/**
 * Construye payload para POST /pedidos/
 */
export const buildPedidoPayload = (instances, clientName, clientPhone, clientAddress, orderType, notes) => {
  const total = instances.reduce((s, o) => s + o.item.price + (o.extraCost || 0), 0);
  
  const productos = instances.map(inst => {
    const { mods, item } = inst;
    const ec = inst.extraCost || 0;
    const m = {};
    
    if (mods.alga)             m.alga = mods.alga;
    if (mods.style)            m.estilo = mods.style;
    if (mods.sushiChoice)      m.sushi_elegido = mods.sushiChoice;
    if (mods.ice)              m.hielo = mods.ice;
    if (mods.proteins?.length) m.proteinas = mods.proteins;
    
    const salsas = Object.keys(mods.sauces || {}).filter(k => mods.sauces[k]);
    if (salsas.length)         m.salsas = salsas;
    
    const salsas2 = Object.keys(mods.sauces2 || {}).filter(k => mods.sauces2[k]);
    if (salsas2.length)        m.salsas2 = salsas2;
    
    const sinIngs = (item.ingredients || [])
      .filter(i => mods.removed?.[i.id])
      .map(i => i.name);
    if (sinIngs.length)        m.sin_ingredientes = sinIngs;
    
    if (mods.extraIngs?.length) m.extras_ingredientes = mods.extraIngs;
    
    const extIds = Object.keys(mods.extras || {}).filter(k => mods.extras[k]);
    if (extIds.length)         m.extras_producto = extIds;
    
    return {
      id_producto: item.dbId || item.id_producto || 0,
      nombre_producto: item.name || item.nombre,
      precio_unitario: item.price || item.precio,
      cantidad: 1,
      modificaciones: Object.keys(m).length ? m : null,
      costo_extra: ec,
      subtotal: (item.price || item.precio) + ec,
    };
  });
  
  return {
    nombre_cliente: clientName,
    telefono_cliente: clientPhone || null,
    tipo_entrega: orderType === 'envio' ? 'domicilio' : 'sucursal',
    direccion_entrega: clientAddress || null,
    notas: notes?.trim() || null,
    total,
    productos,
  };
};

/**
 * Sube imagen a Cloudinary
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', 'sushi_menu');
  
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  if (!res.ok) throw new Error('Error al subir imagen');
  
  const data = await res.json();
  return data.secure_url;
};

// Import constants for use in functions
import { CLOUDINARY_CLOUD, CLOUDINARY_PRESET } from './constants';
