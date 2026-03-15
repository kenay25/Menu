import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtener todos los productos (requiere token del menú)
 */
export const getProductos = async (token) => {
  const res = await api.get('/productos/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener producto por ID
 */
export const getProducto = async (id, token) => {
  const res = await api.get(`/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Crear producto (solo admin)
 */
export const createProducto = async (producto, token) => {
  const res = await api.post('/productos/', producto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Actualizar producto (solo admin)
 */
export const updateProducto = async (id, producto, token) => {
  const res = await api.put(`/productos/${id}`, producto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Actualizar disponibilidad (solo admin)
 */
export const updateDisponibilidad = async (id, disponible, token) => {
  const res = await api.patch(
    `/productos/${id}/disponibilidad`,
    { disponible },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/**
 * Eliminar producto (solo admin)
 */
export const deleteProducto = async (id, token) => {
  const res = await api.delete(`/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener productos más vendidos
 */
export const getMasVendidos = async (token) => {
  const res = await api.get('/admin/productos/mas-vendidos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default api;
