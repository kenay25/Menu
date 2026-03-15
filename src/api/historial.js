import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtener historial del cliente logueado
 */
export const getMiHistorial = async (token) => {
  const res = await api.get('/historial/mi-historial', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Buscar historial por teléfono (público)
 */
export const getHistorialPorTelefono = async (telefono) => {
  const res = await api.get(`/historial/telefono/${telefono}`);
  return res.data;
};

export default api;
