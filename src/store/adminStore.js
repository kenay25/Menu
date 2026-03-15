import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Admin Store - Maneja la sesión del admin y configuración
 */
const useAdminStore = create(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      pedidosHabilitados: true,
      pedidosHoyFiltro: null,
      
      // Iniciar sesión admin
      login: (token, usuario) => {
        set({ token, usuario });
      },
      
      // Cerrar sesión
      logout: () => {
        set({ token: null, usuario: null });
      },
      
      // Actualizar toggle de pedidos
      setPedidosHabilitados: (habilitados) => {
        set({ pedidosHabilitados: habilitados });
      },
      
      // Actualizar filtro de pedidos
      setPedidosHoyFiltro: (filtro) => {
        set({ pedidosHoyFiltro: filtro });
      },
      
      // Verificar si es admin
      isAdmin: () => {
        return get().usuario?.rol === 'admin';
      },
      
      // Obtener token
      getToken: () => {
        return get().token || null;
      },
    }),
    {
      name: 'sushi_admin', // localStorage key
    }
  )
);

export default useAdminStore;
