import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Crear pedido (usa token del menú)
 */
export const createPedido = async (pedido, token) => {
  const res = await api.post('/pedidos/', pedido, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Listar pedidos (admin)
 */
export const getPedidos = async (fecha, estado, limite, token) => {
  const params = {};
  if (fecha) params.fecha = fecha;
  if (estado) params.estado = estado;
  if (limite) params.limite = limite;
  
  const res = await api.get('/admin/pedidos', {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener detalle de pedido
 */
export const getPedidoDetalle = async (id, token) => {
  const res = await api.get(`/admin/pedidos/${id}/detalle`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Actualizar estado de pedido
 */
export const updatePedidoEstado = async (id, estado, token) => {
  const res = await api.patch(
    `/admin/pedidos/${id}/estado`,
    { estado },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default api;
