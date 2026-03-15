import { useEffect } from 'react';
import useAdminStore from '../store/adminStore';
import { getPedidosHabilitados } from '../api/admin';

/**
 * Hook para verificar cada 30s si los pedidos están habilitados
 */
const usePedidosHabilitados = () => {
  const { pedidosHabilitados, setPedidosHabilitados } = useAdminStore();

  useEffect(() => {
    const checkPedidos = async () => {
      try {
        const data = await getPedidosHabilitados();
        setPedidosHabilitados(data.pedidos_habilitados);
      } catch (error) {
        console.error('Error checking pedidos habilitados:', error);
      }
    };

    // Check inicial
    checkPedidos();

    // Check cada 30 segundos
    const interval = setInterval(checkPedidos, 30000);

    return () => clearInterval(interval);
  }, [setPedidosHabilitados]);

  return pedidosHabilitados;
};

export default usePedidosHabilitados;
