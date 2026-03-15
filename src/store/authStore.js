import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store - Maneja la sesión del cliente
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      sesion: null, // { token, usuario }

      // Iniciar sesión
      login: (token, usuario) => {
        set({ sesion: { token, usuario } });
      },

      // Cerrar sesión
      logout: () => {
        set({ sesion: null });
      },

      // Actualizar datos del usuario
      updateUser: (usuario) => {
        set((state) => ({
          sesion: state.sesion ? { ...state.sesion, usuario } : null,
        }));
      },

      // Verificar si está logueado
      isAuthenticated: () => {
        return !!get().sesion;
      },

      // Obtener token
      getToken: () => {
        return get().sesion?.token || null;
      },

      // Obtener usuario
      getUser: () => {
        return get().sesion?.usuario || null;
      },
    }),
    {
      name: 'sushi_sesion', // localStorage key
    }
  )
);

export default useAuthStore;
