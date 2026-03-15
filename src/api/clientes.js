import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Buscar cliente por teléfono
 */
export const buscarCliente = async (telefono, token) => {
  const res = await api.get(`/clientes/buscar/${telefono}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Actualizar dirección del cliente
 */
export const actualizarDireccion = async (direccion, token) => {
  const res = await api.patch(
    '/clientes/actualizar-direccion',
    { direccion },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default api;
