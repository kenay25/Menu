import axios from 'axios';
import { API_URL, MENU_EMAIL, MENU_PASSWORD } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obtiene token del menú (para lectura de productos)
 */
export const getMenuToken = async () => {
  try {
    const res = await api.post('/auth/login', {
      email: MENU_EMAIL,
      password: MENU_PASSWORD,
    });
    return res.data.access_token;
  } catch (error) {
    console.error('Error getting menu token:', error);
    return null;
  }
};

/**
 * Login de cliente
 */
export const loginCliente = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

/**
 * Registro de cliente
 */
export const registroCliente = async (nombre, email, password, telefono) => {
  const res = await api.post('/auth/registro', {
    nombre,
    email,
    password,
    telefono,
  });
  return res.data;
};

/**
 * Login de admin
 */
export const loginAdmin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export default api;
