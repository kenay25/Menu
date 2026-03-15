import { useEffect, useRef } from 'react';

/**
 * Hook para auto-refresh de datos cada N segundos
 * Se pausa si hay un elemento interactivo abierto (select, modal, etc.)
 */
const useAutoRefresh = (callback, interval = 30000, shouldPause = false) => {
  const savedCallback = useRef(callback);
  const intervalRef = useRef(null);

  // Record the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (shouldPause) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    // Initial call
    tick();

    // Set up interval
    intervalRef.current = setInterval(tick, interval);

    // Clean up
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, shouldPause]);
};

export default useAutoRefresh;
