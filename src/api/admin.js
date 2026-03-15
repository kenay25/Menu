import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Estadísticas de hoy
 */
export const getEstadisticasHoy = async (fecha, token) => {
  const res = await api.get('/admin/estadisticas/hoy', {
    params: { fecha },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Estadísticas de la semana
 */
export const getEstadisticasSemana = async (fecha, token) => {
  const res = await api.get('/admin/estadisticas/semana', {
    params: { fecha },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Estadísticas del mes
 */
export const getEstadisticasMes = async (fecha, token) => {
  const res = await api.get('/admin/estadisticas/mes', {
    params: { fecha },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Horas pico
 */
export const getHorasPico = async (fecha, token) => {
  const res = await api.get('/admin/estadisticas/horas-pico', {
    params: { fecha },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Productos más vendidos
 */
export const getMasVendidos = async (token) => {
  const res = await api.get('/admin/productos/mas-vendidos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Top clientes
 */
export const getTopClientes = async (periodo, fecha, token) => {
  const res = await api.get('/admin/clientes/top', {
    params: { periodo, fecha },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener usuarios
 */
export const getUsuarios = async (token) => {
  const res = await api.get('/admin/usuarios', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener usuario por ID
 */
export const getUsuario = async (id, token) => {
  const res = await api.get(`/admin/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Crear usuario
 */
export const createUsuario = async (usuario, token) => {
  const res = await api.post('/admin/usuarios', usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Actualizar usuario
 */
export const updateUsuario = async (id, usuario, token) => {
  const res = await api.patch(`/admin/usuarios/${id}`, usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Eliminar usuario
 */
export const deleteUsuario = async (id, token) => {
  const res = await api.delete(`/admin/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener configuración de pedidos habilitados
 */
export const getPedidosHabilitados = async () => {
  const res = await api.get('/admin/config/pedidos-habilitados');
  return res.data;
};

/**
 * Actualizar configuración de pedidos habilitados
 */
export const updatePedidosHabilitados = async (habilitados, token) => {
  const res = await api.patch(
    '/admin/config/pedidos-habilitados',
    { habilitados },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default api;
