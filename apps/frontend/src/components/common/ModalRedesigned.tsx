'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  footer?: React.ReactNode;
  hideBackdrop?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  preventScroll?: boolean;
  showOverlay?: boolean;
};

const ModalRedesigned: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  footer,
  hideBackdrop = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  preventScroll = true,
  showOverlay = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle outside click
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOutsideClick &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, preventScroll]);
  
  // Modal size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };
  
  // Modal position variants
  const positionVariants = {
    center: {
      hidden: { opacity: 0, scale: 0.95, y: 0 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }
      },
      exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    },
    top: {
      hidden: { opacity: 0, y: -50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }
      },
      exit: { opacity: 0, y: -50, transition: { duration: 0.2 } }
    },
    right: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }
      },
      exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
    },
    bottom: {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }
      },
      exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
    },
    left: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }
      },
      exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
    }
  };
  
  // Position classes
  const positionClasses = {
    center: 'flex items-center justify-center',
    top: 'flex items-start justify-center pt-16',
    right: 'flex items-center justify-end',
    bottom: 'flex items-end justify-center pb-16',
    left: 'flex items-center justify-start',
  };
  
  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          {!hideBackdrop && showOverlay && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
            />
          )}
          
          {/* Modal container */}
          <div 
            className={`fixed inset-0 ${positionClasses[position]} p-4 overflow-y-auto`}
            onClick={handleOutsideClick}
          >
            {/* Modal content */}
            <motion.div
              ref={modalRef}
              className={`${sizeClasses[size]} w-full bg-white dark:bg-neutral-800 rounded-xl shadow-xl overflow-hidden relative ${className}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={positionVariants[position]}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Modal header */}
              {(title || showCloseButton) && (
                <div className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between ${headerClassName}`}>
                  {title && (
                    <h3 
                      id="modal-title" 
                      className="text-lg font-medium text-neutral-900 dark:text-white"
                    >
                      {title}
                    </h3>
                  )}
                  
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Modal body */}
              <div className={`px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto ${bodyClassName}`}>
                {children}
              </div>
              
              {/* Modal footer */}
              {footer && (
                <div className={`px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 ${footerClassName}`}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalRedesigned;
