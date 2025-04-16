'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ToastProps = {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: (id: number) => void;
  duration?: number;
};

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  message, 
  onClose, 
  duration = 5000 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300); // Allow time for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };
  
  return (
    <div 
      className={`
        ${getTypeStyles()}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        fixed bottom-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg border-l-4 shadow-md
        transition-all duration-300 ease-in-out max-w-xs
      `}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        <span className="text-xl">{getIcon()}</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-gray-200 hover:text-gray-900"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
