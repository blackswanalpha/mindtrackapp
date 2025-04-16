'use client';

import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string, duration = 5000) => {
    const id = Date.now();
    
    // Add toast to state
    setToasts(prev => [...prev, { id, type, message, duration }]);
    
    // Remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
    
    return id;
  };
  
  const hideToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return {
    toasts,
    showToast,
    hideToast
  };
};
