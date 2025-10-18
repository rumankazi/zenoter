/**
 * useToast Hook
 * Manages toast notifications
 */

import { useState, useCallback, useRef } from 'react';
import type { ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  const error = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const info = useCallback(
    (message: string) => {
      showToast(message, 'info');
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
  };
};
