'use client';

import React, { useState, useEffect } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

type AlertProps = {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  showIcon?: boolean;
  className?: string;
};

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  showIcon = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto close alert after specified time
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Alert styles based on type
  const alertStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: '✓'
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: '✕'
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: '⚠'
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: 'ℹ'
    }
  };

  const { bg, border, text, icon } = alertStyles[type];

  return (
    <div
      className={`${bg} ${border} ${text} px-4 py-3 rounded relative border ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="py-1 mr-2">
            <span className="font-bold">{icon}</span>
          </div>
        )}

        <div className="flex-grow">
          <p className="block sm:inline">{message}</p>
        </div>

        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleClose}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className={`h-5 w-5 ${text}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
