'use client';

import { useEffect } from 'react';

/**
 * Hook para bloquear/desbloquear el scroll del body
 * Útil para modales, menús móviles, etc.
 * 
 * @param isLocked - Si el scroll debe estar bloqueado
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * useScrollLock(isOpen);
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    if (isLocked) {
      // Guardar el valor actual del overflow
      const originalOverflow = document.body.style.overflow;
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar el valor original o 'unset' si estaba vacío
        document.body.style.overflow = originalOverflow || 'unset';
      };
    } else {
      // Asegurar que el scroll esté desbloqueado cuando isLocked es false
      document.body.style.overflow = 'unset';
    }
  }, [isLocked]);
}

