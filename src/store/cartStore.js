import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart Store - Maneja el carrito de pedidos
 * Cada instancia es única (mismo platillo puede estar múltiples veces con diferentes mods)
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      instances: [], // Array de instancias de pedido
      
      // Agregar nueva instancia, retorna instanceId
      addInstance: (item) => {
        const instanceId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newInstance = {
          instanceId,
          itemId: item.id,
          item: { ...item },
          mods: {
            removed: {},
            extras: {},
            sauces: {},
            sauces2: {},
            saucesAlitas: {},
            proteins: [],
            alga: null,
            style: null,
            sushiChoice: null,
            ice: null,
            extraIngs: [],
          },
          extraCost: 0,
        };
        
        set((state) => ({
          instances: [...state.instances, newInstance],
        }));
        
        return instanceId;
      },
      
      // Actualizar instancia existente
      updateInstance: (instanceId, mods, extraCost) => {
        set((state) => ({
          instances: state.instances.map((inst) =>
            inst.instanceId === instanceId
              ? { ...inst, mods: { ...inst.mods, ...mods }, extraCost }
              : inst
          ),
        }));
      },
      
      // Remover instancia
      removeInstance: (instanceId) => {
        set((state) => ({
          instances: state.instances.filter((inst) => inst.instanceId !== instanceId),
        }));
      },
      
      // Limpiar carrito
      clearCart: () => {
        set({ instances: [] });
      },
      
      // Obtener instancias de un item
      getItemInstances: (itemId) => {
        return get().instances.filter((inst) => inst.itemId === itemId);
      },
      
      // Obtener instancia por ID
      getInstance: (instanceId) => {
        return get().instances.find((inst) => inst.instanceId === instanceId);
      },
      
      // Obtener total
      getTotal: () => {
        return get().instances.reduce((s, o) => s + o.item.price + (o.extraCost || 0), 0);
      },
      
      // Obtener cantidad de artículos
      getCount: () => {
        return get().instances.length;
      },
    }),
    {
      name: 'sushi_cart', // localStorage key
    }
  )
);

export default useCartStore;
