'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertVariant = 'filled' | 'outlined' | 'subtle';

type AlertProps = {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  showIcon?: boolean;
  className?: string;
  variant?: AlertVariant;
  action?: React.ReactNode;
};

const AlertRedesigned: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  showIcon = true,
  className = '',
  variant = 'subtle',
  action,
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

  // Alert styles based on type and variant
  const alertStyles = {
    success: {
      filled: {
        bg: 'bg-green-600',
        border: 'border-green-700',
        text: 'text-white',
        icon: SuccessIcon,
        closeButton: 'text-white/80 hover:text-white',
      },
      outlined: {
        bg: 'bg-white',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: SuccessIcon,
        closeButton: 'text-green-700/80 hover:text-green-700',
      },
      subtle: {
        bg: 'bg-green-50',
        border: 'border-green-100',
        text: 'text-green-800',
        icon: SuccessIcon,
        closeButton: 'text-green-800/80 hover:text-green-800',
      },
    },
    error: {
      filled: {
        bg: 'bg-red-600',
        border: 'border-red-700',
        text: 'text-white',
        icon: ErrorIcon,
        closeButton: 'text-white/80 hover:text-white',
      },
      outlined: {
        bg: 'bg-white',
        border: 'border-red-500',
        text: 'text-red-700',
        icon: ErrorIcon,
        closeButton: 'text-red-700/80 hover:text-red-700',
      },
      subtle: {
        bg: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-800',
        icon: ErrorIcon,
        closeButton: 'text-red-800/80 hover:text-red-800',
      },
    },
    warning: {
      filled: {
        bg: 'bg-amber-500',
        border: 'border-amber-600',
        text: 'text-white',
        icon: WarningIcon,
        closeButton: 'text-white/80 hover:text-white',
      },
      outlined: {
        bg: 'bg-white',
        border: 'border-amber-500',
        text: 'text-amber-700',
        icon: WarningIcon,
        closeButton: 'text-amber-700/80 hover:text-amber-700',
      },
      subtle: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        text: 'text-amber-800',
        icon: WarningIcon,
        closeButton: 'text-amber-800/80 hover:text-amber-800',
      },
    },
    info: {
      filled: {
        bg: 'bg-blue-600',
        border: 'border-blue-700',
        text: 'text-white',
        icon: InfoIcon,
        closeButton: 'text-white/80 hover:text-white',
      },
      outlined: {
        bg: 'bg-white',
        border: 'border-blue-500',
        text: 'text-blue-700',
        icon: InfoIcon,
        closeButton: 'text-blue-700/80 hover:text-blue-700',
      },
      subtle: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-800',
        icon: InfoIcon,
        closeButton: 'text-blue-800/80 hover:text-blue-800',
      },
    },
  };

  const { bg, border, text, icon: Icon, closeButton } = alertStyles[type][variant];

  // Animation variants
  const alertVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${bg} ${border} ${text} px-4 py-3 rounded-lg border shadow-sm ${className}`}
          role="alert"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={alertVariants}
        >
          <div className="flex items-start">
            {showIcon && (
              <div className="flex-shrink-0 mr-3">
                <Icon className="h-5 w-5" />
              </div>
            )}

            <div className="flex-grow">
              {title && (
                <h3 className="font-semibold text-base mb-1">{title}</h3>
              )}
              <div className="text-sm">{message}</div>
            </div>

            <div className="flex-shrink-0 ml-4 flex items-center space-x-3">
              {action && (
                <div>{action}</div>
              )}
              
              {onClose && (
                <button
                  type="button"
                  className={`${closeButton} focus:outline-none`}
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <svg
                    className="h-4 w-4"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Icon components
const SuccessIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export default AlertRedesigned;
